// pages/register/failed.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function PaymentFailed() {
  const router = useRouter();
  const { mdOrder, errorCode, errorMessage } = router.query;
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    // Call the confirmation API to get detailed failure information
    const confirmPaymentStatus = async () => {
      try {
        setLoading(true);
        
        // Build API URL with query parameters
        let apiUrl = '/api/confirmation';
        const params = new URLSearchParams();
        
        if (mdOrder) {
          params.append('mdOrder', mdOrder);
        }
        
        if (params.toString()) {
          apiUrl = `${apiUrl}?${params.toString()}`;
        }
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }
        
        const data = await response.json();
        setStatus(data);
        
        // Log the detailed status for debugging
        console.log('Payment failure details:', data);
        
      } catch (err) {
        console.error('Error fetching payment status:', err);
        setApiError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Only call API if we have a transaction reference
    if (mdOrder) {
      confirmPaymentStatus();
    } else {
      setLoading(false);
    }
  }, [mdOrder]);

  // Function to get specific failure reason based on error code
  const getFailureReason = () => {
    if (errorMessage) return errorMessage;
    
    if (status?.errorCode) {
      switch(status.errorCode) {
        case '1':
          return 'Transaction refusée par la banque';
        case '2':
          return 'Carte expirée';
        case '3':
          return 'Carte invalide';
        case '4':
          return 'Fonds insuffisants';
        case '5':
          return 'Limite de sécurité dépassée';
        case '6':
          return 'Transaction annulée par l\'utilisateur';
        case '7':
          return 'Problème technique avec le processeur de paiement';
        default:
          return 'Erreur de paiement non spécifiée';
      }
    }
    
    if (errorCode) {
      return `Code d'erreur: ${errorCode}`;
    }
    
    return 'Raison non spécifiée';
  };

  // Function to get additional details from API response
  const getAdditionalInfo = () => {
    if (!status) return null;
    
    const info = [];
    
    if (status.orderNumber) {
      info.push(`Référence transaction: ${status.orderNumber}`);
    }
    
    if (status.actionCodeDescription) {
      info.push(`Description: ${status.actionCodeDescription}`);
    }
    
    return info.length > 0 ? info : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
      <Head>
        <title>Paiement échoué - La Fédération Algérienne des Pharmaciens</title>
      </Head>

      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        {loading ? (
          <div className="py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Vérification du statut de paiement...</p>
          </div>
        ) : (
          <>
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Paiement échoué</h1>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Votre tentative de paiement n'a pas abouti. Votre inscription n'a pas été finalisée.
              </p>
              
              {/* Display specific error message if available */}
              {(errorMessage || status?.errorCode || errorCode) && (
                <div className="bg-red-50 p-4 rounded-lg mb-4 text-center border border-red-100">
                  <p className="font-semibold text-red-800 mb-1">Raison du rejet :</p>
                  <p className="text-red-600 text-sm">{getFailureReason()}</p>
                  
                  {/* Display additional info from API */}
                  {getAdditionalInfo() && (
                    <div className="mt-2 pt-2 border-t border-red-100">
                      {getAdditionalInfo().map((info, index) => (
                        <p key={index} className="text-red-500 text-xs">{info}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-sm text-gray-500">
                Aucun montant n'a été débité de votre compte.
              </p>
            </div>

            {/* Display API error if it occurred */}
            {apiError && (
              <div className="bg-yellow-50 p-3 rounded-lg mb-4 text-center border border-yellow-100">
                <p className="text-yellow-800 text-sm">
                  Note: Nous n'avons pas pu récupérer les détails complets de l'erreur.
                </p>
              </div>
            )}

            <div className="bg-red-50 p-4 rounded-lg mb-6 text-left border border-red-100">
              <h3 className="font-semibold text-red-800 mb-2">Raisons possibles :</h3>
              <ul className="text-sm text-red-600 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Fonds insuffisants sur votre carte</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Problème de connexion avec votre banque</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Carte expirée ou informations incorrectes</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Limite de sécurité dépassée</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Protection anti-fraude activée</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="text-sm text-gray-500">
                <p>Vous pouvez réessayer votre inscription avec un autre moyen de paiement.</p>
              </div>
              
              <div className="space-y-3">
                <Link
                  href="/register"
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors block font-medium"
                >
                  Réessayer l'inscription
                </Link>
                
                <div className="flex gap-3">
                  <Link
                    href="/contact"
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-sm"
                  >
                    Contacter le support
                  </Link>
                  <Link
                    href="/"
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-sm"
                  >
                    Retour à l'accueil
                  </Link>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Besoin d'aide ? Contactez-nous à 
                  <a href="mailto:support@fap.dz" className="text-blue-600 hover:underline ml-1">
                    support@fap.dz
                  </a>
                </p>
                
                {/* Transaction reference for support */}
                {mdOrder && (
                  <p className="text-xs text-gray-400 mt-2">
                    Référence de transaction : <span className="font-mono">{mdOrder}</span>
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}