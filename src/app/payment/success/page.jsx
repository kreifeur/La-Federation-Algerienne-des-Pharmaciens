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
  const fullDate = new Date().toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    const mdOrderParam = searchParams.get("orderId");
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
      const response = await fetch(
        `/api/confirmation?mdOrder=${transactionId}`
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
          data.ErrorMessage || data.errorMessage || "Le paiement a échoué"
        );
      }
    } catch (err) {
      console.error("Error confirming payment:", err);
      setError(err.message || "Erreur lors de la confirmation du paiement");
    } finally {
      setLoading(false);
    }
  };

  const generateInvoiceHTML = (forPrint = false) => {
    const invoiceNumber = `INV-${mdOrder || '0000'}-${now}`;
    
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Facture - Fédération Algérienne de Pharmacie</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            background: #f8fafc;
            color: #1e293b;
            line-height: 1.5;
            padding: 40px 20px;
          }
          
          .invoice-container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          
          .invoice-header {
            background: linear-gradient(135deg, #0b3b5c 0%, #1e4a6f 100%);
            color: white;
            padding: 40px;
          }
          
          .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }
          
          .logo h1 {
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          
          .logo p {
            font-size: 14px;
            opacity: 0.9;
          }
          
          .invoice-badge {
            background: rgba(255, 255, 255, 0.2);
            padding: 12px 24px;
            border-radius: 40px;
            text-align: center;
          }
          
          .invoice-badge .badge-title {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            opacity: 0.8;
          }
          
          .invoice-badge .badge-number {
            font-size: 20px;
            font-weight: 700;
            margin-top: 4px;
          }
          
          .status-paid {
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 40px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .company-details {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .detail-block h3 {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
            opacity: 0.8;
          }
          
          .detail-block p {
            margin-bottom: 4px;
            font-size: 14px;
          }
          
          .invoice-body {
            padding: 40px;
          }
          
          .transaction-details {
            margin-bottom: 40px;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #0b3b5c;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e2e8f0;
          }
          
          .details-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
          }
          
          .detail-item {
            display: flex;
            flex-direction: column;
          }
          
          .detail-label {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          
          .detail-value {
            font-size: 16px;
            font-weight: 600;
            color: #1e293b;
          }
          
          .detail-value.mono {
            font-family: 'Courier New', monospace;
            font-size: 14px;
          }
          
          .amount-table {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 30px;
          }
          
          .amount-row {
            display: flex;
            justify-content: space-between;
            padding: 15px 20px;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .amount-row:last-child {
            border-bottom: none;
          }
          
          .amount-row.total {
            background: #f8fafc;
            font-weight: 700;
            font-size: 18px;
            color: #0b3b5c;
          }
          
          .amount-label {
            color: #475569;
          }
          
          .amount-value {
            font-weight: 600;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 13px;
          }
          
          .footer p {
            margin-bottom: 4px;
          }
          
          @media print {
            body {
              background: white;
              padding: 0;
            }
            
            .invoice-container {
              box-shadow: none;
              border-radius: 0;
            }
            
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div class="header-top">
              <div class="logo">
                <h1>FÉDÉRATION ALGÉRIENNE DE PHARMACIE</h1>
                <p>Membre fondateur de l'Union Maghrébine de Pharmacie</p>
              </div>
              <div class="invoice-badge">
                <div class="badge-title">Facture N°</div>
                <div class="badge-number">${invoiceNumber}</div>
              </div>
            </div>
            
            <div class="status-paid">✓ PAYÉ</div>
            
            <div class="company-details">
              <div class="detail-block">
                <h3>Émetteur</h3>
                <p>Fédération Algérienne de Pharmacie</p>
                <p>12 Rue des Pharmaciens</p>
                <p>16000 Alger, Algérie</p>
                <p>NIF: 123456789012345</p>
              </div>
              <div class="detail-block">
                <h3>Date d'émission</h3>
                <p>${fullDate}</p>
                <p style="margin-top: 12px;"><strong>Échéance:</strong> Payé le ${now}</p>
              </div>
            </div>
          </div>
          
          <div class="invoice-body">
            <div class="transaction-details">
              <h2 class="section-title">Détails de la transaction</h2>
              
              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">Référence transaction</span>
                  <span class="detail-value mono">${mdOrder || 'N/A'}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Numéro de commande</span>
                  <span class="detail-value mono">${status?.orderNumber || 'N/A'}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Numéro d'autorisation</span>
                  <span class="detail-value mono">${status?.approvalCode || 'N/A'}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">ID de paiement</span>
                  <span class="detail-value mono">${status?.params?.payid || 'N/A'}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Mode de paiement</span>
                  <span class="detail-value">CIB/EDAHABIA</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Date de transaction</span>
                  <span class="detail-value">${now}</span>
                </div>
              </div>
            </div>
            
            <h2 class="section-title">Récapitulatif des montants</h2>
            
            <div class="amount-table">
              <div class="amount-row">
                <span class="amount-label">Cotisation annuelle</span>
                <span class="amount-value">${status?.depositAmount || '0'} DZD</span>
              </div>
              <div class="amount-row">
                <span class="amount-label">Frais de dossier</span>
                <span class="amount-value">0 DZD</span>
              </div>
              <div class="amount-row total">
                <span class="amount-label">Total TTC</span>
                <span class="amount-value">${status?.depositAmount || '0'} DZD</span>
              </div>
            </div>
            
            <div class="footer">
              <p>Merci de votre confiance ! Votre adhésion a bien été enregistrée.</p>
              <p>Pour toute question concernant cette facture : support@federation-pharmaciens.dz</p>
              <p style="margin-top: 12px;">Document généré automatiquement - fait foi de reçu</p>
            </div>
          </div>
        </div>
        
        ${forPrint ? '<script>window.onload = function() { window.print(); setTimeout(function() { window.close(); }, 1000); };</script>' : ''}
      </body>
      </html>
    `;
  };

  const handlePrintReceipt = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Veuillez autoriser les fenêtres pop-up pour imprimer la facture.");
      return;
    }

    printWindow.document.write(generateInvoiceHTML(true));
    printWindow.document.close();
  };

  const handleEmailReceipt = () => {
    alert("Fonctionnalité d'envoi par email à implémenter");
  };

  const handleDownloadReceipt = () => {
    const invoiceHTML = generateInvoiceHTML(false);
    const blob = new Blob([invoiceHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `facture-fap-${mdOrder || 'transaction'}-${now}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Head>
        <title>Inscription réussie - Fédération Algérienne de Pharmacie</title>
      </Head>

      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-900 border-t-transparent mx-auto mb-6"></div>
            <p className="text-slate-600 text-lg">Confirmation du paiement en cours...</p>
            <p className="text-sm text-slate-500 mt-2">Veuillez patienter</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="bg-red-100 text-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              {status?.ErrorCode === "1" ? "Paiement refusé" : "Erreur de confirmation"}
            </h1>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              {error || "Une erreur est survenue lors de la confirmation de votre paiement."}
            </p>
            {mdOrder && (
              <div className="bg-slate-50 p-4 rounded-xl mb-8">
                <p className="text-sm text-slate-600">
                  Référence transaction : <span className="font-mono font-medium">{mdOrder}</span>
                </p>
              </div>
            )}
            <div className="space-y-3 max-w-sm mx-auto">
              <Link
                href="/membership"
                className="w-full bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-700 transition-colors block text-center font-medium"
              >
                Réessayer l'inscription
              </Link>
              <Link
                href="/"
                className="w-full border-2 border-slate-200 text-slate-700 py-3 px-6 rounded-xl hover:bg-slate-50 transition-colors block text-center font-medium"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-12 text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Félicitations !</h1>
                  <p className="text-blue-100">{status.params.respCode_desc}</p>
                </div>

              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-white/20">
                <div>
                  <p className="text-sm text-blue-200 mb-1">Date d'inscription</p>
                  <p className="font-medium">{fullDate}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-200 mb-1">Référence</p>
                  <p className="font-mono font-medium">{mdOrder}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="bg-slate-50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Détails du paiement</h2>
                  <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium">
                    Paiement confirmé
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-200">
                    <span className="text-slate-600">Montant total</span>
                    <span className="text-2xl font-bold text-blue-900">{status?.depositAmount || '0'} DZD</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Mode de paiement</p>
                      <p className="font-medium">CIB/EDAHABIA</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Date de transaction</p>
                      <p className="font-medium">{now}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Numéro d'autorisation</p>
                      <p className="font-mono text-sm">{status?.approvalCode || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">ID de paiement</p>
                      <p className="font-mono text-sm">{status?.params?.payid || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <button
                  onClick={handlePrintReceipt}
                  className="bg-white border-2 border-blue-900 text-blue-900 py-3 px-4 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Imprimer la facture
                </button>

                <button
                  onClick={handleEmailReceipt}
                  className="bg-white border-2 border-green-600 text-green-600 py-3 px-4 rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Envoyer par email
                </button>

                <button
                  onClick={handleDownloadReceipt}
                  className="bg-white border-2 border-orange-600 text-orange-600 py-3 px-4 rounded-xl hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Télécharger la facture
                </button>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Prochaines étapes
                </h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-800 rounded-full"></span>
                    Accédez à votre espace membre pour compléter votre profil
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-800 rounded-full"></span>
                    Découvrez les événements et formations à venir
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-800 rounded-full"></span>
                    Téléchargez votre carte de membre numérique
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <Link
                  href="/login"
                  className="w-full bg-blue-900 text-white py-3 px-6 rounded-xl hover:bg-blue-800 transition-colors block text-center font-medium"
                >
                  Accéder à mon espace membre
                </Link>
                <Link
                  href="/"
                  className="w-full border-2 border-slate-200 text-slate-700 py-3 px-6 rounded-xl hover:bg-slate-50 transition-colors block text-center font-medium"
                >
                  Retour à l'accueil
                </Link>
              </div>

              <div className="mt-6 text-center text-sm text-slate-500">
                <p>Une copie de cette facture vous a été envoyée par email.</p>
                <p className="mt-1">Pour toute assistance : support@federation-pharmaciens.dz</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Hidden receipt for reference (kept for compatibility) */}
      <div ref={receiptRef} className="hidden"></div>
    </div>
  );
}

export default function RegisterSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-900 border-t-transparent mx-auto mb-6"></div>
            <p className="text-slate-600 text-lg">Chargement...</p>
          </div>
        </div>
      </div>
    }>
      <RegisterSuccessContent />
    </Suspense>
  );
}