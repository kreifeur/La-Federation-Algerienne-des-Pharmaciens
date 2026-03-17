// app/register/success/page.js
"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

  // Fonction pour obtenir le contenu complet du reçu avec les mêmes styles que la page
  const getReceiptContent = () => {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        {/* En-tête du reçu */}
        <div className="text-center border-b-2 border-blue-800 pb-4 mb-4">
          <h1 className="text-xl font-bold text-blue-800">
            Fédération Algérienne de Pharmacie
          </h1>
          <h2 className="text-lg text-gray-700 mt-1">Reçu de paiement</h2>
          <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold mt-2">
            ✓ Paiement confirmé avec succès
          </div>
        </div>

        {/* Détails de la transaction */}
        <div className="space-y-3">
          {mdOrder && (
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">
                Référence transaction :
              </span>
              <span className="font-mono text-gray-800">{mdOrder}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-600">
              Numéro de commande :
            </span>
            <span className="font-mono text-gray-800">
              {status?.orderNumber || "N/A"}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-600">
              Numéro d'autorisation :
            </span>
            <span className="font-mono text-gray-800">
              {status?.approvalCode || "N/A"}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-600">
              Date de la transaction :
            </span>
            <span className="text-gray-800">{now}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-600">Montant hello :</span>
            <span className="font-bold text-blue-800">
            {status.depositAmount} DZD
              
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="font-medium text-gray-600">
              Mode de paiement :
            </span>
            <span className="text-gray-800">CIB/EDAHABIA</span>
          </div>
          {status?.params?.payid && (
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="font-medium text-gray-600">
                ID de paiement :
              </span>
              <span className="font-mono text-gray-800">
                {status.params.payid}
              </span>
            </div>
          )}
        </div>

        {/* Message de confirmation */}
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-green-700 text-sm">
            {status?.params?.respCode_desc ||
              "Votre paiement a été traité avec succès."}
          </p>
          {status?.ErrorCode && status.ErrorCode === "0" && (
            <p className="text-green-600 text-xs mt-1">
              Code de confirmation : {status.ErrorCode}
            </p>
          )}
        </div>

        {/* Pied de page */}
        <div className="mt-4 pt-4 border-t border-gray-200 text-center text-gray-500 text-xs">
          <p>Merci de votre confiance !</p>
          <p className="mt-1">support@federation-pharmaciens.dz</p>
          <p className="mt-1">
            Document généré le : {new Date().toLocaleString("fr-FR")}
          </p>
          {mdOrder && <p className="mt-1 font-mono">Réf: {mdOrder}</p>}
        </div>
      </div>
    );
  };

  const handlePrintReceipt = () => {
    if (!receiptRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Veuillez autoriser les fenêtres pop-up pour imprimer le reçu.");
      return;
    }

    // Utiliser le même contenu que le reçu affiché
    const receiptContent = receiptRef.current.innerHTML;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reçu de paiement - Fédération Algérienne de Pharmacie</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { margin: 0; padding: 20px; background: white; }
          @media print {
            body { padding: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        ${receiptContent}
        <div class="text-center mt-4 no-print">
          <button onclick="window.print()" class="bg-blue-800 text-white px-4 py-2 rounded">
            Imprimer
          </button>
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleEmailReceipt = () => {
    if (!receiptRef.current) return;

    const receiptContent = receiptRef.current.innerHTML;

    // Ici, vous feriez un appel API pour envoyer l'email
    // Pour l'instant, on ouvre un aperçu
    const emailWindow = window.open("", "_blank");
    if (emailWindow) {
      emailWindow.document.write(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Aperçu email - Reçu de paiement</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { background: #f3f4f6; padding: 20px; font-family: Arial, sans-serif; }
            .email-container { max-width: 600px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="email-container">
            ${receiptContent}
            <div class="text-center mt-4 text-gray-500 text-sm">
              <p>Cet email serait envoyé à votre adresse avec le reçu en pièce jointe.</p>
            </div>
          </div>
        </body>
        </html>
      `);
      emailWindow.document.close();
    }

    // Exemple d'appel API pour envoyer l'email
    // fetch('/api/send-receipt-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     mdOrder,
    //     receiptHtml: receiptContent,
    //     email: userEmail // À récupérer depuis le state ou le contexte
    //   })
    // });
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;

    try {
      setLoading(true);

      // Utiliser le MÊME élément que pour l'impression
      const element = receiptRef.current;

      // Générer le PDF
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: false,
        useCORS: true,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        imgWidth,
        imgHeight,
        undefined,
        "FAST",
      );

      pdf.save(`reçu-paiement-${mdOrder || "transaction"}-${now}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Erreur lors de la génération du PDF. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Head>
        <title>Paiement réussi - La Fédération Algérienne de Pharmacie</title>
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
              {status?.ErrorCode === "1" || status?.errorCode === "1"
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
                Réessayer le paiement
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
                {status?.params?.respCode_desc || "paiement réussi !"}
              </h1>
              <p className="text-gray-600">
                a Fédération Algérienne de Pharmacie
              </p>
              {/* <p className="text-gray-600">
                Un email de confirmation a été envoyé à votre adresse.
              </p> */}
            </div>

            {/* Section reçu - MÊME CONTENU pour l'affichage, l'impression, l'email et le PDF */}
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-blue-800">
                  Reçu de paiement
                </h3>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Payé
                </span>
              </div>

              {/* Ce div contient le reçu qui sera utilisé pour l'impression, l'email et le PDF */}
              <div ref={receiptRef}>{getReceiptContent()}</div>

              {/* Boutons d'action */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
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
                  onClick={handleDownloadPDF}
                  disabled={loading}
                  className="bg-orange-800 text-white py-3 px-4 rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  {loading ? "Génération..." : "Télécharger PDF"}
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
              {(status?.ErrorCode === "0" || status?.errorCode === "0") && (
                <p className="text-xs text-green-700 mt-1">
                  Code de confirmation : {status.ErrorCode || status.errorCode}
                </p>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-8 text-left">
              <h3 className="font-semibold text-blue-800 mb-2">
                Prochaines étapes :
              </h3>
              <ul className="text-sm text-blue-600 space-y-1">
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-md">
            <div className="py-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement...</p>
            </div>
          </div>
        </div>
      }
    >
      <RegisterSuccessContent />
    </Suspense>
  );
}
