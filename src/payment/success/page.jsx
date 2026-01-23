// app/payment/success/page.js
"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const orderNumber = searchParams.get("orderNumber");
    
    if (orderId) {
      verifyPayment(orderId, orderNumber);
    }
  }, [searchParams]);

  const verifyPayment = async (orderId, orderNumber) => {
    try {
      const response = await fetch(`/api/payment/verify?orderId=${orderId}&orderNumber=${orderNumber}`);
      const data = await response.json();
      setPaymentData(data);
      setLoading(false);
    } catch (error) {
      console.error("Verification error:", error);
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // This would call your API to generate PDF
    alert("PDF download feature would be implemented here");
  };

  const handleEmailReceipt = () => {
    // This would call your API to email receipt
    alert("Email receipt feature would be implemented here");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-4">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Paiement Réussi - Fédération Algérienne des Pharmaciens</title>
        <meta name="description" content="Paiement confirmé avec succès" />
      </Head>
      <Header />
      <main className="min-h-screen bg-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h1 className="text-3xl font-bold text-blue-800 mb-2">
                Paiement Réussi !
              </h1>
              <p className="text-gray-600">
                Votre adhésion a été confirmée avec succès.
              </p>
            </div>

            <div className="border-2 border-green-500 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
                Reçu de Paiement
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Numéro de transaction:</span>
                  <span className="font-bold">{paymentData?.orderId || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Numéro de commande:</span>
                  <span>{paymentData?.orderNumber || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Numéro d'autorisation:</span>
                  <span>{paymentData?.approvalCode || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Mode de paiement:</span>
                  <span className="flex items-center">
                    {paymentData?.paymentSystem || "CIB/EDAHABIA"}
                    <img 
                      src="/satim-logo.png" 
                      alt="SATIM" 
                      className="h-6 ml-2"
                    />
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Date et heure:</span>
                  <span>{paymentData?.date || new Date().toLocaleString('fr-FR')}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Statut:</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    {paymentData?.respCode_desc || paymentData?.actionCodeDescription || "PAYMENT_SUCCESS"}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Montant:</span>
                  <span className="text-2xl font-bold text-blue-800">
                    {paymentData?.amount ? (paymentData.amount / 100).toFixed(2) : "0.00"} DZD
                  </span>
                </div>
              </div>

              {/* SATIM Green Number */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center">
                  <span className="text-blue-800 font-semibold mr-2">
                    Service client SATIM:
                  </span>
                  <a href="tel:3020" className="text-green-600 font-bold text-xl">
                    3020
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={handlePrint}
                  className="bg-blue-800 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Imprimer
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Télécharger PDF
                </button>
                <button
                  onClick={handleEmailReceipt}
                  className="bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-400 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Envoyer par email
                </button>
              </div>
            </div>

            <div className="text-center">
              <a
                href="/members/dashboard"
                className="inline-block bg-blue-800 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Accéder à mon espace membre
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}