"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import jsPDF from 'jspdf';

function RegisterSuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mdOrder, setMdOrder] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [loginToken, setLoginToken] = useState(null);
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
    // Get admin token on component mount
    getAdminToken();
  }, [searchParams]);

  // Get admin authentication token
  const getAdminToken = async () => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "brahimadmin@gmail.com",
          password: "passe123"
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const token = data.data?.token || data.token || data.access_token;
        if (token) {
          setLoginToken(token);
          console.log("Admin token obtained successfully");
        } else {
          console.error("Token not found in response", data);
        }
      } else {
        console.error("Failed to get admin token");
      }
    } catch (error) {
      console.error("Error getting admin token:", error);
    }
  };

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

  // Get invoice data
  const getInvoiceData = () => {
    const invoiceNumber = `INV-${mdOrder || '0000'}-${now}`;
    return {
      invoiceNumber,
      mdOrder: mdOrder || 'N/A',
      approvalCode: status?.approvalCode || 'N/A',
      orderNumber: status?.OrderNumber || 'N/A',
      amount: status?.depositAmount || '0',
      fullDate,
      now
    };
  };

  // Generate text-based PDF (much smaller file size)
  const generatePDFBlob = async () => {
    const data = getInvoiceData();
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });
    
    // Header
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(11, 59, 92);
    pdf.text('FÉDÉRATION ALGÉRIENNE DE PHARMACIE', 20, 25);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Excellence, Engagement, Santé', 20, 32);
    
    // Invoice title and number
     pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(11, 59, 92);
    pdf.text(`Numéro Facture : ${data.invoiceNumber}`, 20, 10);
    
    // Paid status
    pdf.setFontSize(10);
    pdf.setTextColor(0, 150, 0);
    pdf.text('PAYÉ', 20, 45);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(9);
    
    // Company details
    pdf.setFont('helvetica', 'bold');
    pdf.text('Émetteur:', 20, 65);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Fédération Algérienne de Pharmacie', 20, 72);
    pdf.text('Chez pharma invest, Centre commercial ElQods', 20, 79);
    pdf.text('16000 Alger, Algérie', 20, 86);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text("Date d'émission:", 130, 65);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.fullDate, 130, 72);
    pdf.text(`Payé le ${data.now}`, 130, 79);
    
    // Separator
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, 95, 190, 95);
    
    // Transaction details
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(11, 59, 92);
    pdf.text('Détails de la transaction', 20, 110);
    
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    
    let yPos = 125;
    const lineHeight = 8;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Référence transaction:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.mdOrder, 70, yPos);
    yPos += lineHeight;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text("Numéro d'autorisation:", 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.approvalCode, 70, yPos);
    yPos += lineHeight;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Numéro de commande:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.orderNumber, 70, yPos);
    yPos += lineHeight;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Mode de paiement:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text('CIB/EDAHABIA', 70, yPos);
    yPos += lineHeight;
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Date de transaction:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.now, 70, yPos);
    yPos += lineHeight + 5;
    
    // Amounts section
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(11, 59, 92);
    pdf.text('Récapitulatif des montants', 20, yPos);
    yPos += 12;
    
    // Draw amount box
    pdf.setDrawColor(200, 200, 200);
    pdf.setFillColor(248, 250, 252);
    pdf.rect(20, yPos - 5, 170, 40, 'F');
    pdf.rect(20, yPos - 5, 170, 40, 'D');
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text('Cotisation annuelle:', 30, yPos + 8);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${data.amount / 100} DZD`, 160, yPos + 8, { align: 'right' });
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(11, 59, 92);
    pdf.text('Total TTC:', 30, yPos + 25);
    pdf.text(`${data.amount / 100} DZD`, 160, yPos + 25, { align: 'right' });
    
    yPos += 50;
    
    // Footer with green number
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Merci de votre confiance ! Votre adhésion a bien été enregistrée.', 20, yPos);
    yPos += 6;
    
    // Green number added here
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(11, 59, 92);
    pdf.text('Service Client SATIM - Numéro Vert : 3020', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    yPos += 6;
    
    pdf.text('Pour toute question : support@federation-pharmaciens.dz', 20, yPos);
    yPos += 6;
    pdf.text('Document généré automatiquement - fait foi de reçu', 20, yPos);
    
    return pdf;
  };

  // Generate PDF and open in print dialog
  const handlePrintReceipt = async () => {
    setGeneratingPDF(true);
    
    try {
      const pdf = await generatePDFBlob();
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      const printWindow = window.open(pdfUrl, '_blank');
      
      if (!printWindow) {
        alert("Veuillez autoriser les fenêtres pop-up pour imprimer la facture.");
        return;
      }
      
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
      
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 10000);
      
    } catch (error) {
      console.error("Error printing PDF:", error);
      alert("Erreur lors de la génération du PDF pour l'impression. Veuillez réessayer.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Generate and download PDF
  const handleDownloadReceipt = async () => {
    setGeneratingPDF(true);
    
    try {
      const pdf = await generatePDFBlob();
      const data = getInvoiceData();
      pdf.save(`facture-fap-${data.mdOrder}-${data.now}.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Erreur lors de la génération du PDF. Veuillez réessayer.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Send email with invoice attachment
  const sendEmailWithInvoice = async () => {
    if (!userEmail) {
      alert("Veuillez entrer votre adresse email");
      return;
    }

    if (!loginToken) {
      alert("Erreur d'authentification. Veuillez rafraîchir la page.");
      return;
    }

    setEmailSending(true);
    
    try {
      const pdf = await generatePDFBlob();
      const pdfBlob = pdf.output('blob');
      
      // Check file size (should be under 1MB)
      if (pdfBlob.size > 2 * 1024 * 1024) {
        console.warn(`PDF size is ${(pdfBlob.size / 1024 / 1024).toFixed(2)}MB`);
      }
      
      const data = getInvoiceData();
      const pdfFile = new File([pdfBlob], `facture-fap-${data.mdOrder}-${data.now}.pdf`, { type: 'application/pdf' });
      
      const formData = new FormData();
      formData.append("to", userEmail);
      formData.append("subject", "Facture d'adhésion - Fédération Algérienne de Pharmacie");
      formData.append("body", `Bonjour,

Nous vous remercions pour votre adhésion à la Fédération Algérienne de Pharmacie.

Voici les détails de votre transaction :
- Montant: ${data.amount /100} DZD
- Référence: ${data.mdOrder}
- Date: ${data.fullDate}

Veuillez trouver ci-joint votre facture détaillée au format PDF.

Prochaines étapes :
1. Accédez à votre espace membre pour compléter votre profil
2. Découvrez les événements et formations à venir
3. Téléchargez votre carte de membre numérique

Pour toute assistance, contactez notre numéro vert : 30 20 30

Cordialement,
Fédération Algérienne de Pharmacie`);
      
      formData.append("attachment", pdfFile);
      
      const response = await fetch('https://fapharmacie.dz/email-service/send', {
      method: 'POST',
      headers: {
        'X-API-Key': 'a3f8c2e1b4d7e9f0123456789abcdef0a1b2c3d4e5f6789012345678abcdef01'
        // Remove Content-Type header - let browser handle it
      },
      body: formData,
    });

      const result = await response.json();
      
      if (response.ok) {
        alert("Facture envoyée avec succès par email !");
        setShowEmailModal(false);
        setUserEmail("");
      } else {
        throw new Error(result.message || result.error || "Erreur lors de l'envoi de l'email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      if (error.message.includes("size") || error.message.includes("large")) {
        alert("Le fichier PDF est trop volumineux pour être envoyé par email. Veuillez utiliser l'option de téléchargement.");
      } else {
        alert("Erreur lors de l'envoi de l'email. Veuillez réessayer.");
      }
    } finally {
      setEmailSending(false);
    }
  };

  const handleEmailReceipt = () => {
    if (!loginToken) {
      alert("Veuillez patienter, authentification en cours...");
      return;
    }
    setShowEmailModal(true);
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
                  <p className="text-blue-100">{status?.params?.respCode_desc || "Paiement confirmé avec succès"}</p>
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
                    <span className="text-2xl font-bold text-blue-900">{status?.depositAmount / 100 || '0'} DZD</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Mode de paiement</p>
                      <p className="font-medium">CIB/EDAHABIA</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Date de transaction</p>
                      <p className="font-medium">{fullDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Numéro d'autorisation</p>
                      <p className="font-mono text-sm">{status?.approvalCode || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Numéro de commande</p>
                      <p className="font-mono text-sm">{status?.OrderNumber || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <button
                  onClick={handlePrintReceipt}
                  disabled={generatingPDF}
                  className="bg-white border-2 border-blue-900 text-blue-900 py-3 px-4 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  {generatingPDF ? "Préparation..." : "Imprimer la facture"}
                </button>

                <button
                  onClick={handleEmailReceipt}
                  disabled={emailSending || !loginToken}
                  className="bg-white border-2 border-green-600 text-green-600 py-3 px-4 rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {emailSending ? "Envoi en cours..." : "Envoyer par email"}
                </button>

                <button
                  onClick={handleDownloadReceipt}
                  disabled={generatingPDF}
                  className="bg-white border-2 border-orange-600 text-orange-600 py-3 px-4 rounded-xl hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {generatingPDF ? "Génération..." : "Télécharger la facture (PDF)"}
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
                <p>Pour toute assistance : support@federation-pharmaciens.dz</p>
                <p className="mt-1">Numéro Vert : 30 20 30</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Envoyer la facture par email</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Adresse email
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={emailSending}
                autoFocus
              />
              <p className="text-xs text-slate-500 mt-1">
                Entrez votre adresse email pour recevoir la facture en PDF
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={sendEmailWithInvoice}
                disabled={emailSending}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {emailSending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Envoi en cours...
                  </span>
                ) : "Envoyer"}
              </button>
              <button
                onClick={() => setShowEmailModal(false)}
                disabled={emailSending}
                className="flex-1 bg-slate-200 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
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