// app/register/success/page.js
"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function RegisterSuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mdOrder, setMdOrder] = useState(null);
  const receiptRef = useRef(null);
  const now = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");

  useEffect(() => {
    // Get mdOrder from URL query parameters
    const mdOrderParam = searchParams.get("mdOrder");

    if (mdOrderParam) {
      setMdOrder(mdOrderParam);
      confirmPayment(mdOrderParam);
    } else {
      setError("Aucun identifiant de transaction trouvé");
      setLoading(false);
    }
  }, [searchParams]);

  const confirmPayment = async (transactionId) => {
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

      if (data.ErrorCode === "0" || data.errorCode === "0") {
        console.log("Payment confirmed:", data);
      } else {
        console.error("Payment failed:", data);
        setError(
          data.ErrorMessage || data.errorMessage || "Le paiement a échoué",
        );
      }
    } catch (err) {
      console.error("Error confirming payment:", err);
      setError(err.message || "Erreur lors de la confirmation du paiement");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    if (!receiptRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Veuillez autoriser les fenêtres pop-up pour imprimer le reçu.");
      return;
    }

    const receiptContent = receiptRef.current.innerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reçu de paiement - Fédération Algérienne des Pharmaciens</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .receipt-header {
            text-align: center;
            border-bottom: 2px solid #1e40af;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .receipt-header h1 {
            color: #1e40af;
            margin: 10px 0;
            font-size: 24px;
          }
          .receipt-header h2 {
            color: #333;
            margin: 5px 0;
            font-size: 18px;
          }
          .receipt-details {
            margin: 30px 0;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px dashed #ddd;
          }
          .detail-label {
            font-weight: bold;
            color: #555;
          }
          .detail-value {
            color: #333;
          }
          .success-badge {
            background-color: #d1fae5;
            color: #065f46;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
          }
          .print-button {
            display: none;
          }
          @media print {
            body {
              padding: 0;
            }
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-header">
          <h1>Fédération Algérienne des Pharmaciens</h1>
          <h2>Reçu de paiement</h2>
          <div class="success-badge">
            ✓ Paiement confirmé avec succès
          </div>
        </div>
        ${receiptContent}
        <div class="footer">
          <p>Merci de votre confiance !</p>
          <p>Pour toute question, contactez-nous à : support@federation-pharmaciens.dz</p>
          <p>Document généré le : ${new Date().toLocaleString("fr-FR")}</p>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 1000);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleEmailReceipt = () => {
    alert("Fonctionnalité d'envoi par email à implémenter");
    // À implémenter : API call pour envoyer le reçu par email
  };

  const handleDownloadReceipt = () => {
    if (!receiptRef.current) return;

    const receiptContent = receiptRef.current.innerHTML;
    const fullReceipt = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reçu de paiement - Fédération Algérienne des Pharmaciens</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .receipt-header {
            text-align: center;
            border-bottom: 2px solid #1e40af;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .receipt-header h1 {
            color: #1e40af;
            margin: 10px 0;
            font-size: 24px;
          }
          .receipt-header h2 {
            color: #333;
            margin: 5px 0;
            font-size: 18px;
          }
          .success-badge {
            background-color: #d1fae5;
            color: #065f46;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="receipt-header">
          <h1>Fédération Algérienne des Pharmaciens</h1>
          <h2>Reçu de paiement</h2>
          <div class="success-badge">
            ✓ Paiement confirmé avec succès
          </div>
        </div>
        ${receiptContent}
        <div class="footer">
          <p>Merci de votre confiance !</p>
          <p>Pour toute question, contactez-nous à : support@federation-pharmaciens.dz</p>
          <p>Document généré le : ${new Date().toLocaleString("fr-FR")}</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([fullReceipt], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reçu-paiement-${mdOrder || "transaction"}-${now}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Head>
        <title>
          Inscription réussie - La Fédération Algérienne des Pharmaciens
        </title>
      </Head>

      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md">
        {loading ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Confirmation du paiement en cours...
            </p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {status?.ErrorCode === "1"
                ? "Paiement refusé"
                : "Erreur de confirmation"}
            </h1>
            <p className="text-gray-600 mb-6">
              {error ||
                "Une erreur est survenue lors de la confirmation de votre paiement."}
            </p>
            {status?.ErrorMessage && (
              <p className="text-sm text-red-500 mb-6">{status.ErrorMessage}</p>
            )}
            {mdOrder && (
              <div className="bg-gray-50 p-4 rounded mb-6">
                <p className="text-sm text-gray-600">
                  Référence transaction :{" "}
                  <span className="font-mono">{mdOrder}</span>
                </p>
              </div>
            )}
            <div className="space-y-3 mt-8">
              <Link
                href="/membership"
                className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 transition-colors block text-center"
              >
                Réessayer l'inscription
              </Link>
              <Link
                href="/"
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors block text-center"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {status?.params?.respCode_desc || "Inscription réussie !"}
              </h1>
              <p className="text-gray-600">
                Bienvenue dans La Fédération Algérienne des Pharmaciens.
              </p>
              <p className="text-gray-600">
                Un email de confirmation a été envoyé à votre adresse.
              </p>
            </div>

            {/* Section reçu - visible uniquement pour l'impression */}
            <div ref={receiptRef} className="hidden print:block">
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">
                  Détails de la transaction
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Statut :</span>
                    <span className="font-bold text-green-600">Confirmé</span>
                  </div>
                  {mdOrder && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Référence transaction (mdOrder) :
                      </span>
                      <span className="font-mono">{mdOrder}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Numéro de commande :
                    </span>
                    <span className="font-mono">
                      {status?.orderNumber || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Numéro d'autorisation :
                    </span>
                    <span className="font-mono">
                      {status?.approvalCode || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Date de la transaction :
                    </span>
                    <span>{now}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Montant :</span>
                    <span className="font-bold">
                      {status?.amount || "0"} {status?.currency || "DZD"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Mode de paiement :
                    </span>
                    <span>CIB/EDAHABIA</span>
                  </div>
                  {status?.params?.payid && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        ID de paiement :
                      </span>
                      <span className="font-mono">{status.params.payid}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section reçu visible sur la page */}
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-blue-800">
                  Reçu de paiement
                </h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Payé
                </span>
              </div>

              <div className="space-y-3 mb-6">
                {mdOrder && (
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Référence transaction :
                    </span>
                    <span className="font-mono text-gray-800">{mdOrder}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Numéro de commande :
                  </span>
                  <span className="font-mono text-gray-800">
                    {status?.orderNumber || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Numéro d'autorisation :
                  </span>
                  <span className="font-mono text-gray-800">
                    {status?.approvalCode || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Date de la transaction :
                  </span>
                  <span className="text-gray-800">{now}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Montant :</span>
                  <span className="font-bold text-blue-800">
                    {status?.amount || "0"} {status?.currency || "DZD"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">
                    Mode de paiement :
                  </span>
                  <span className="text-gray-800">CIB/EDAHABIA</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={handlePrintReceipt}
                  className="bg-blue-800 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  Imprimer
                </button>

                <button
                  onClick={handleEmailReceipt}
                  className="bg-green-800 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Envoyer
                </button>

                <button
                  onClick={handleDownloadReceipt}
                  className="bg-orange-800 text-white py-3 px-4 rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Télécharger
                </button>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-green-800 mb-2">
                Paiement confirmé avec succès !
              </h3>
              <p className="text-sm text-green-600">
                {status?.params?.respCode_desc ||
                  "Votre paiement a été traité avec succès."}
              </p>
              {status?.ErrorCode && (
                <p className="text-xs text-green-700 mt-1">
                  Code de confirmation : {status.ErrorCode}
                </p>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-8 text-left">
              <h3 className="font-semibold text-blue-800 mb-2">
                Prochaines étapes :
              </h3>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Vérifiez votre email pour confirmer votre compte</li>
                <li>• Accédez à votre espace membre</li>
                <li>• Découvrez les événements à venir</li>
                <li>• Explorez les ressources exclusives</li>
              </ul>
            </div>

            <div className="space-y-3 mt-8">
              <Link
                href="/login"
                className="w-full bg-blue-800 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors block text-center"
              >
                Se connecter à mon espace
              </Link>
              <Link
                href="/"
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors block text-center"
              >
                Retour à l'accueil
              </Link>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Conservez ce reçu pour vos archives.</p>
              <p>Pour toute assistance : support@federation-pharmaciens.dz</p>
              {mdOrder && (
                <p className="mt-2 text-xs">
                  Référence : <span className="font-mono">{mdOrder}</span>
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function RegisterSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md">
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    }>
      <RegisterSuccessContent />
    </Suspense>
  );
}