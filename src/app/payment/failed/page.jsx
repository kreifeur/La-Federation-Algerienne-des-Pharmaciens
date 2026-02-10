// app/payment/failed/page.js
"use client";
import { useEffect, useState, Suspense } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mdOrder, setMdOrder] = useState(null);

  useEffect(() => {
    // Get mdOrder from URL query parameters
    const mdOrderParam = searchParams.get("mdOrder");

    if (mdOrderParam) {
      setMdOrder(mdOrderParam);
      checkPaymentStatus(mdOrderParam);
    } else {
      setError("Aucun identifiant de transaction trouvé");
      setLoading(false);
    }
  }, [searchParams]);

  const checkPaymentStatus = async (transactionId) => {
    try {
      setLoading(true);
      // Pass mdOrder to the API endpoint
      const response = await fetch(
        `/api/confirmation?mdOrder=${transactionId}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStatus(data);

      // Log the response for debugging
      console.log("Payment status response:", data);
    } catch (err) {
      console.error("Error checking payment status:", err);
      setError(err.message || "Erreur lors de la vérification du paiement");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to translate error codes to human-readable messages
  const getFailureReason = (errorCode) => {
    const errorMap = {
      1: "Transaction refusée par la banque",
      2: "Carte expirée",
      3: "Carte invalide",
      4: "Fonds insuffisants",
      5: "Limite de sécurité dépassée",
      6: "Transaction annulée par l'utilisateur",
      7: "Problème technique avec le processeur de paiement",
      8: "Carte perdue ou volée",
      9: "Transaction suspecte",
      10: "Délai de réponse dépassé",
      11: "Autorisation refusée",
      12: "Compte invalide",
      13: "Montant invalide",
      14: "Devise invalide",
      15: "Configuration marchand invalide",
      20: "Risque de fraude détecté",
      21: "Contrôle 3D Secure échoué",
      22: "Carte non autorisée pour ce type de transaction",
      23: "Nombre de tentatives dépassé",
      24: "Restriction géographique",
      25: "Contrat marchand suspendu",
      99: "Erreur technique",
    };

    return errorMap[errorCode] || `Erreur de paiement (code: ${errorCode})`;
  };

  const getFailureDescription = (errorCode) => {
    const descriptionMap = {
      1: "Votre banque a refusé la transaction. Contactez votre banque pour plus d'informations.",
      2: "Votre carte de crédit/débit est expirée. Veuillez utiliser une autre carte.",
      3: "Les informations de votre carte sont incorrectes. Vérifiez le numéro, la date d'expiration et le CVV.",
      4: "Le solde de votre compte est insuffisant pour effectuer cette transaction.",
      5: "Vous avez atteint la limite de sécurité de votre carte. Contactez votre banque.",
      6: "Vous avez annulé la transaction pendant le processus de paiement.",
      7: "Un problème technique est survenu avec notre système de paiement.",
      9: "La transaction a été bloquée pour des raisons de sécurité.",
      20: "La transaction a été identifiée comme potentiellement frauduleuse.",
      21: "La vérification 3D Secure a échoué. Contactez votre banque.",
      99: "Une erreur technique est survenue. Veuillez réessayer plus tard.",
    };

    return (
      descriptionMap[errorCode] ||
      "Une erreur inconnue est survenue. Veuillez réessayer ou contacter notre support."
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Head>
        <title>
          Paiement échoué - La Fédération Algérienne des Pharmaciens
        </title>
      </Head>

      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        {loading ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Vérification du paiement...</p>
          </div>
        ) : error ? (
          <>
            <div className="text-center">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Erreur de vérification
              </h1>
              <p className="text-gray-600 mb-6">
                Une erreur est survenue lors de la vérification de votre
                paiement.
              </p>
              <p className="text-sm text-red-500 mb-6">{error}</p>
              {mdOrder && (
                <div className="bg-gray-50 p-4 rounded mb-6">
                  <p className="text-sm text-gray-600">
                    Référence transaction :{" "}
                    <span className="font-mono">{mdOrder}</span>
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <Link
                  href="/membership"
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors block font-medium text-center"
                >
                  Réessayer l'inscription
                </Link>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/contact"
                    className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-sm text-center"
                  >
                    Contactez-nous
                  </Link>
                  <Link
                    href="/"
                    className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-sm text-center"
                  >
                    Accueil
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-red-500 text-5xl mb-4">✗</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Paiement échoué
              </h1>
              <p className="text-gray-600">
                Votre tentative de paiement n'a pas abouti.
              </p>
            </div>

            <div className="mb-6">
              {/* Display transaction details if available */}
              {mdOrder && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Référence de transaction :
                  </p>
                  <p className="font-mono text-gray-800 text-sm">{mdOrder}</p>
                </div>
              )}

              {/* Display specific error message from API */}
              {(status?.ErrorCode && status.ErrorCode !== "0") ||
              (status?.errorCode && status.errorCode !== "0") ? (
                <div className="bg-red-50 p-4 rounded-lg mb-4 border border-red-200">
                  <p className="font-semibold text-red-800 mb-1">
                    {getFailureReason(status.ErrorCode || status.errorCode)}
                  </p>
                  <p className="text-red-600 text-sm mt-2">
                    {getFailureDescription(
                      status.ErrorCode || status.errorCode,
                    )}
                  </p>
                  {(status.ErrorCode || status.errorCode) && (
                    <p className="text-xs text-red-700 mt-2">
                      Code d'erreur : {status.ErrorCode || status.errorCode}
                    </p>
                  )}
                  {status.ErrorMessage && (
                    <p className="text-xs text-red-700">
                      Message : {status.ErrorMessage}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-red-50 p-4 rounded-lg mb-4 border border-red-200">
                  <p className="font-semibold text-red-800 mb-1">
                    Transaction refusée
                  </p>
                  <p className="text-red-600 text-sm">
                    Votre paiement n'a pas pu être traité. Veuillez vérifier vos
                    informations et réessayer.
                  </p>
                </div>
              )}

              <div className="text-center">
                <p className="text-sm text-green-600 font-medium mb-2">
                  ✅ Aucun montant n'a été débité de votre compte.
                </p>
                <p className="text-xs text-gray-500">
                  Vous pouvez réessayer avec le même moyen de paiement ou en
                  choisir un autre.
                </p>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg mb-6 border border-red-100">
              <h3 className="font-semibold text-red-800 mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                Conseils pour réussir votre prochain paiement :
              </h3>
              <ul className="text-sm text-red-600 space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Vérifiez le solde de votre compte bancaire</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Assurez-vous que votre carte n'est pas expirée</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Vérifiez les codes de sécurité (CVV/CVC)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Contactez votre banque si votre carte est bloquée</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Essayez avec une autre carte ou via EDAHABIA</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                  Assistance immédiate
                </h4>
                <p className="text-sm text-blue-600 mb-2">
                  Si vous pensez qu'il s'agit d'une erreur ou si vous avez
                  besoin d'aide :
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href="tel:3020"
                    className="text-center bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex-1"
                  >
                    <div className="flex items-center justify-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      SATIM : 30 20
                    </div>
                  </a>
                  <a
                    href="mailto:support@federation-pharmaciens.dz"
                    className="text-center border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition-colors text-sm flex-1"
                  >
                    Par email
                  </a>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/membership"
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors block font-medium text-center"
                >
                  Réessayer l'inscription
                </Link>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/contact"
                    className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-sm text-center"
                  >
                    Contactez-nous
                  </Link>
                  <Link
                    href="/"
                    className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors text-sm text-center"
                  >
                    Accueil
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                Conservez la référence de transaction{" "}
                <span className="font-mono text-gray-700">
                  {mdOrder || "N/A"}
                </span>{" "}
                si vous contactez le support.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentFailed() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}