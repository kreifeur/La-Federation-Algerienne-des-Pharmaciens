// pages/register/failed.js
import Head from 'next/head';
import Link from 'next/link';

export default function PaymentFailed() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
      <Head>
        <title>Paiement échoué - La Fédération Algérienne des Pharmaciens</title>
      </Head>

      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-red-500 text-5xl mb-4">✗</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Paiement échoué</h1>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Votre tentative de paiement n'a pas abouti. Votre inscription n'a pas été finalisée.
          </p>
          <p className="text-sm text-gray-500">
            Aucun montant n'a été débité de votre compte.
          </p>
        </div>

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
          </div>
        </div>
      </div>
    </div>
  );
}