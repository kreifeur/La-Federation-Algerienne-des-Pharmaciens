// app/register/success/page.js
"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function RegisterSuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mdOrder, setMdOrder] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [eventId, setEventId] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const invoiceRef = useRef(null);
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
    const eventIdParam = searchParams.get("eventId");
    const userIdParam = searchParams.get("userId");
    
    if (mdOrderParam) {
      setMdOrder(mdOrderParam);
      if (eventIdParam) setEventId(eventIdParam);
      if (userIdParam) setUserId(userIdParam);
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
        
        // Récupérer l'email de l'utilisateur
        await fetchUserEmail(transactionId);
        
        // Enregistrer l'utilisateur à l'événement après paiement réussi
        await registerUserToEvent();
        
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

  const fetchUserEmail = async (transactionId) => {
    try {
      const response = await fetch(`/api/get-user-email?mdOrder=${transactionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.email) {
          setUserEmail(data.email);
        }
        if (data.userId && !userId) {
          setUserId(data.userId);
        }
      }
    } catch (error) {
      console.error("Error fetching user email:", error);
    }
  };

  const registerUserToEvent = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const pendingPayment = localStorage.getItem("pendingPayment");
      
      // Récupérer les informations de paiement en attente
      let pendingData = null;
      if (pendingPayment) {
        try {
          pendingData = JSON.parse(pendingPayment);
        } catch (e) {
          console.error("Error parsing pendingPayment:", e);
        }
      }
      
      // Utiliser les IDs des paramètres URL ou du localStorage
      const finalEventId = eventId || pendingData?.eventId;
      const finalUserId = userId || pendingData?.userId;
      
      if (!finalEventId || !finalUserId) {
        console.error("Missing eventId or userId for registration");
        return;
      }
      
      const response = await fetch(`/api/events/${finalEventId}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ 
          userId: finalUserId,
          transactionId: mdOrder,
          paymentStatus: "completed",
          paymentDate: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de l'inscription à l'événement");
      }
      
      const registrationData = await response.json();
      console.log("User registered to event successfully:", registrationData);
      
      // Optionnel: supprimer les données de paiement en attente après inscription réussie
      localStorage.removeItem("pendingPayment");
      
    } catch (error) {
      console.error("Error registering user to event:", error);
      // Ne pas bloquer l'interface utilisateur en cas d'erreur d'inscription
      // Mais afficher un avertissement
      console.warn("Registration to event failed but payment was successful. Please contact support.");
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

  // Generate invoice HTML
  const generateInvoiceHTML = () => {
    const data = getInvoiceData();
    
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
            background: white;
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
          }
        </style>
      </head>
      <body>
        <div class="invoice-container" id="invoice-container">
          <div class="invoice-header">
            <div class="header-top">
              <div class="logo">
                <h1>FÉDÉRATION ALGÉRIENNE DE PHARMACIE</h1>
                <p>Membre fondateur de l'Union Maghrébine de Pharmacie</p>
              </div>
              <div class="invoice-badge">
                <div class="badge-title">Facture N°</div>
                <div class="badge-number">${data.invoiceNumber}</div>
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
                <p>${data.fullDate}</p>
                <p style="margin-top: 12px;"><strong>Échéance:</strong> Payé le ${data.now}</p>
              </div>
            </div>
          </div>
          
          <div class="invoice-body">
            <div class="transaction-details">
              <h2 class="section-title">Détails de la transaction</h2>
              
              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">Référence transaction</span>
                  <span class="detail-value mono">${data.mdOrder}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Numéro d'autorisation</span>
                  <span class="detail-value mono">${data.approvalCode}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Numéro de commande</span>
                  <span class="detail-value mono">${data.orderNumber}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Mode de paiement</span>
                  <span class="detail-value">CIB/EDAHABIA</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Date de transaction</span>
                  <span class="detail-value">${data.now}</span>
                </div>
              </div>
            </div>
            
            <h2 class="section-title">Récapitulatif des montants</h2>
            
            <div class="amount-table">
              <div class="amount-row">
                <span class="amount-label">Cotisation annuelle</span>
                <span class="amount-value">${data.amount} DZD</span>
              </div>
              <div class="amount-row">
                <span class="amount-label">Frais de dossier</span>
                <span class="amount-value">0 DZD</span>
              </div>
              <div class="amount-row total">
                <span class="amount-label">Total TTC</span>
                <span class="amount-value">${data.amount} DZD</span>
              </div>
            </div>
            
            <div class="footer">
              <p>Merci de votre confiance ! Votre adhésion a bien été enregistrée.</p>
              <p>Pour toute question concernant cette facture : support@federation-pharmaciens.dz</p>
              <p style="margin-top: 12px;">Document généré automatiquement - fait foi de reçu</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Generate PDF from invoice HTML (returns PDF blob URL)
  const generatePDFBlob = async () => {
    try {
      // Create a temporary div to render the invoice
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.innerHTML = generateInvoiceHTML();
      document.body.appendChild(tempDiv);
      
      const invoiceElement = tempDiv.querySelector('#invoice-container');
      
      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Generate canvas from the invoice element
      const canvas = await html2canvas(invoiceElement, {
        scale: 3,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 190; // mm
      const pageHeight = 277; // mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 0, imgWidth, imgHeight);
      
      // Add new page if content exceeds one page
      if (imgHeight > pageHeight) {
        let heightLeft = imgHeight - pageHeight;
        let position = -pageHeight;
        
        while (heightLeft > 0) {
          position = position - pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }
      
      // Clean up
      document.body.removeChild(tempDiv);
      
      return pdf;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  // Generate PDF and open in print dialog
  const handlePrintReceipt = async () => {
    setGeneratingPDF(true);
    
    try {
      const pdf = await generatePDFBlob();
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Open PDF in a new window
      const printWindow = window.open(pdfUrl, '_blank');
      
      if (!printWindow) {
        alert("Veuillez autoriser les fenêtres pop-up pour imprimer la facture.");
        return;
      }
      
      // Wait for PDF to load then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
      
      // Revoke the URL after a delay to clean up
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

  // Convert blob to base64
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Send email with invoice
  const sendEmailWithInvoice = async () => {
    if (!userEmail) {
      alert("Veuillez entrer votre adresse email");
      return;
    }

    setEmailSending(true);
    
    try {
      // Generate PDF using the shared function
      const pdf = await generatePDFBlob();
      const pdfBlob = pdf.output('blob');
      const pdfBase64 = await blobToBase64(pdfBlob);
      
      const data = getInvoiceData();
      
      // Send email with PDF attachment
      const response = await fetch("/api/send-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          subject: "Facture d'adhésion - Fédération Algérienne de Pharmacie",
          transactionId: data.mdOrder,
          invoiceNumber: data.invoiceNumber,
          amount: data.amount,
          date: data.fullDate,
          pdfAttachment: pdfBase64,
          pdfFilename: `facture-fap-${data.mdOrder}-${data.now}.pdf`
        }),
      });

      if (response.ok) {
        alert("Facture envoyée avec succès par email !");
        setShowEmailModal(false);
      } else {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de l'envoi de l'email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Erreur lors de l'envoi de l'email. Veuillez réessayer.");
    } finally {
      setEmailSending(false);
    }
  };

  const handleEmailReceipt = () => {
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
                  disabled={emailSending}
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
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={sendEmailWithInvoice}
                disabled={emailSending}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {emailSending ? "Envoi en cours..." : "Envoyer"}
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

      {/* Hidden receipt for reference */}
      <div ref={invoiceRef} className="hidden"></div>
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