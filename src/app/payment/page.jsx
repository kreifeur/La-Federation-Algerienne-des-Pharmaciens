"use client";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

export default function PaymentPage() {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [sslVerified, setSslVerified] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  const recaptchaRef = useRef(null);

  useEffect(() => {
    loadPaymentData();
    
    // Check if page is loaded with HTTPS
    if (window.location.protocol === "https:") {
      setSslVerified(true);
    }
  }, []);

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const loadPaymentData = () => {
    try {
      const storedPayment = localStorage.getItem("pendingPayment");
      
      if (!storedPayment) {
        router.push("/events");
        return;
      }

      const parsedPayment = JSON.parse(storedPayment);
      setPaymentData(parsedPayment);
      setLoading(false);
    } catch (error) {
      console.error("Erreur de chargement:", error);
      setError("Erreur de chargement des données");
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "À confirmer";
    try {
      const options = { 
        weekday: 'long',
        day: "numeric", 
        month: "long", 
        year: "numeric" 
      };
      return new Date(dateString).toLocaleDateString("fr-FR", options);
    } catch (error) {
      return "Date invalide";
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "À confirmer";
    try {
      const options = { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'UTC'
      };
      return new Date(dateString).toLocaleTimeString("fr-FR", options);
    } catch (error) {
      return "Heure invalide";
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!selectedPaymentMethod) {
      newErrors.paymentMethod = "Veuillez sélectionner un mode de paiement";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handlePayment = async () => {
    if (!recaptchaToken) {
      alert("Veuillez compléter le CAPTCHA pour continuer");
      recaptchaRef.current?.reset();
      return;
    }

    if (!sslVerified) {
      alert("Veuillez utiliser une connexion sécurisée (HTTPS) pour procéder au paiement");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        throw new Error("Vous devez être connecté");
      }

      const registrationData = {
        eventId: paymentData.eventId,
        userId: paymentData.userId,
        amount: paymentData.amount,
        paymentMethod: selectedPaymentMethod,
        paymentStatus: selectedPaymentMethod === "cash" ? "pending" : "processing",
        transactionId: `TXN-${Date.now()}`,
        recaptchaToken: recaptchaToken,
      };

      const registerResponse = await fetch("/api/events/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(registrationData),
      });

      const registerResult = await registerResponse.json();

      if (!registerResult.success) {
        throw new Error(registerResult.message || "Erreur d'inscription");
      }

      if (selectedPaymentMethod === "cash") {
        setSuccess(true);
        localStorage.removeItem("pendingPayment");
      } else {
        try {
          const paymentRequest = {
            amount: paymentData.amount,
            eventId: paymentData.eventId,
            userId: paymentData.userId,
            transactionId: registrationData.transactionId,
          };

          const res = await axios.post("/api/pay/event", paymentRequest);
          
          if (res.data.formUrl) {
            localStorage.setItem("lastRegistration", JSON.stringify({
              ...registrationData,
              registrationId: registerResult.registrationId
            }));
            
            window.location.href = res.data.formUrl;
          } else {
            throw new Error("URL de paiement non disponible");
          }
        } catch (err) {
          console.error("Payment redirection error:", err);
          setError("Erreur lors de la redirection vers le paiement en ligne");
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError(`Erreur: ${error.message}`);
      recaptchaRef.current?.reset();
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handlePayment();
  };

  const handleCancel = () => {
    localStorage.removeItem("pendingPayment");
    router.push("/events");
  };

  // Composants
  const LoadingScreen = () => (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-16 px-6">
        <div className="container mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-800 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Chargement...</p>
        </div>
      </main>
      <Footer />
    </div>
  );

  const NoPaymentScreen = () => (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-16 px-6">
        <div className="container mx-auto max-w-md text-center">
          <div className="text-red-500 text-6xl mb-6">❌</div>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Aucun paiement en attente</h2>
          <p className="text-gray-700 mb-8">
            Vous n'avez pas d'événement en attente de paiement.
          </p>
          <Link 
            href="/events" 
            className="px-8 py-3 bg-yellow-500 text-blue-900 rounded-md hover:bg-yellow-400 transition-colors font-medium text-lg"
          >
            Retour aux événements
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );

  const SuccessScreen = () => (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Inscription Confirmée - Fédération Algérienne des Pharmaciens</title>
      </Head>
      <Header />
      <main className="py-16 px-6">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-green-500 text-6xl mb-6">✅</div>
            <h2 className="text-2xl font-bold text-blue-800 mb-6">
              {selectedPaymentMethod === "cash" 
                ? "Demande d'inscription enregistrée !" 
                : "Paiement en cours de traitement !"}
            </h2>
            
            <div className="mb-8">
              <h3 className="font-semibold text-blue-800 mb-4">Détails de l'inscription :</h3>
              <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Événement :</span> {paymentData.eventTitle}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Montant :</span> {paymentData.amount} DA
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Date :</span> {formatDate(paymentData.eventDate)}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Heure :</span> {formatTime(paymentData.eventDate)}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Mode de paiement :</span> 
                  {selectedPaymentMethod === "cash" ? " Paiement par cash" : " Paiement en ligne"}
                </p>
              </div>
            </div>

            {selectedPaymentMethod === "cash" ? (
              <div className="bg-blue-50 p-4 rounded-lg mb-8">
                <h3 className="font-semibold text-blue-800 mb-2">Instructions pour le paiement en espèces :</h3>
                <ul className="text-left list-disc list-inside text-gray-700 space-y-2">
                  <li>Votre demande d'inscription a été enregistrée</li>
                  <li>Vous recevrez un email de confirmation</li>
                  <li>Présentez-vous à l'événement avec pièce d'identité et montant en espèces</li>
                  <li>Votre inscription sera validée sur place</li>
                </ul>
              </div>
            ) : (
              <div className="bg-blue-50 p-4 rounded-lg mb-8">
                <h3 className="font-semibold text-blue-800 mb-2">Instructions pour le paiement en ligne :</h3>
                <ul className="text-left list-disc list-inside text-gray-700 space-y-2">
                  <li>Votre paiement est en cours de traitement</li>
                  <li>Vous serez redirigé vers la plateforme de paiement</li>
                  <li>Vous recevrez un email de confirmation</li>
                  <li>Présentez-vous à l'événement avec votre confirmation</li>
                </ul>
              </div>
            )}

            <p className="text-gray-700 mb-8">
              Un email de confirmation a été envoyé à votre adresse email.
            </p>

            <div className="space-y-4">
              <button
                onClick={() => router.push("/events")}
                className="w-full px-8 py-3 bg-yellow-500 text-blue-900 rounded-md hover:bg-yellow-400 transition-colors font-medium text-lg"
              >
                Retour aux événements
              </button>
              <Link
                href="/profile"
                className="block w-full px-8 py-3 border border-blue-800 text-blue-800 rounded-md hover:bg-blue-50 transition-colors font-medium text-lg text-center"
              >
                Voir mes inscriptions
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

  const ErrorAlert = () => (
    error && (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
        <div className="flex items-center">
          <div className="text-red-500 text-xl mr-3">⚠️</div>
          <div>
            <p className="text-red-700 font-medium">Erreur</p>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    )
  );

  // Rendu principal
  if (loading) return <LoadingScreen />;
  if (!paymentData) return <NoPaymentScreen />;
  if (success) return <SuccessScreen />;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Head>
        <title>Paiement - Fédération Algérienne des Pharmaciens</title>
        <meta name="description" content="Finalisez votre inscription à l'événement" />
      </Head>

      <Header />

      <main className="py-12 px-6 sm:w-[50%]">
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-blue-800 mb-4">
              Finaliser l'inscription
            </h1>
            <p className="text-lg text-gray-700">
              Choisissez comment vous souhaitez payer pour confirmer votre participation
            </p>
          </div>

          {/* SSL Security Badge */}
          <div className="text-center mb-6">
            {sslVerified ? (
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Connexion sécurisée
              </div>
            ) : (
              <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-lg text-sm font-semibold">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Veuillez utiliser HTTPS pour une connexion sécurisée
              </div>
            )}
          </div>

          {/* Progress Steps */}
          <div className="max-w-md mx-auto mb-12">
            <div className="flex justify-between items-center">
              <div className={`flex flex-col items-center ${currentStep >= 1 ? "text-blue-800" : "text-gray-400"}`}>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-blue-800 text-white" : "bg-gray-200"}`}>
                  1
                </div>
                <span className="mt-2 text-sm font-medium">Mode de paiement</span>
              </div>
              <div className={`h-1 flex-1 mx-2 ${currentStep >= 2 ? "bg-blue-800" : "bg-gray-200"}`}></div>
              <div className={`flex flex-col items-center ${currentStep >= 2 ? "text-blue-800" : "text-gray-400"}`}>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-blue-800 text-white" : "bg-gray-200"}`}>
                  2
                </div>
                <span className="mt-2 text-sm font-medium">Confirmation</span>
              </div>
            </div>
          </div>

          <ErrorAlert />

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-md p-8">
            {currentStep === 1 ? (
              <>
                {/* Event Summary */}
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-blue-800 mb-6 text-center">Votre inscription</h2>
                  
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-medium text-gray-800 mb-2">{paymentData.eventTitle}</h3>
                      <p className="text-gray-700">
                        {formatDate(paymentData.eventDate)} • {formatTime(paymentData.eventDate)}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <span className="px-4 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        Paiement en attente
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Lieu :</span>
                        <span className="font-medium">{paymentData.eventLocation || "À confirmer"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Type :</span>
                        <span className="font-medium">{paymentData.isOnlineEvent ? "En ligne" : "Présentiel"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Tarif :</span>
                        <span className="font-medium">{paymentData.priceType === "member" ? "Membre" : "Non-membre"}</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6 text-center">
                      <p className="text-gray-700 mb-2">Montant à payer :</p>
                      <div className="text-3xl font-bold text-blue-800">
                        {paymentData.amount} DA
                      </div>
                      {paymentData.priceType === "member" && paymentData.nonMemberPrice > paymentData.memberPrice && (
                        <p className="text-green-600 mt-2">
                          ⭐ Économie de {paymentData.nonMemberPrice - paymentData.memberPrice} DA
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 text-center">Sélectionnez votre mode de paiement</h3>
                  
                  <div className="space-y-4">
                    <div
                      className={`border p-4 cursor-pointer rounded-md transition-all ${
                        selectedPaymentMethod === "cash"
                          ? "border-blue-800 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedPaymentMethod("cash")}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                            selectedPaymentMethod === "cash"
                              ? "border-blue-800 bg-blue-800"
                              : "border-gray-400"
                          }`}
                        >
                          {selectedPaymentMethod === "cash" && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="font-medium">Paiement par cash</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 ml-8">
                        Payez en espèces le jour de l'événement
                      </p>
                    </div>

                    <div
                      className={`border p-4 cursor-pointer rounded-md transition-all ${
                        selectedPaymentMethod === "online"
                          ? "border-blue-800 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedPaymentMethod("online")}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                            selectedPaymentMethod === "online"
                              ? "border-blue-800 bg-blue-800"
                              : "border-gray-400"
                          }`}
                        >
                          {selectedPaymentMethod === "online" && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="font-medium">Paiement en ligne par CIB/DHAHABIA</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 ml-8">
                        Paiement sécurisé via la plateforme SATIM
                      </p>
                    </div>
                  </div>

                  {errors.paymentMethod && (
                    <p className="text-red-500 text-sm mt-2 text-center">{errors.paymentMethod}</p>
                  )}
                </div>

                {/* Information */}
                <div className="mb-8 space-y-4">
                  <div className="flex items-start">
                    <span className="text-xl mr-3">📋</span>
                    <div>
                      <p className="font-medium text-gray-800">Confirmation requise</p>
                      <p className="text-sm text-gray-600">Votre inscription sera confirmée après réception du paiement</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-xl mr-3">⏰</span>
                    <div>
                      <p className="font-medium text-gray-800">Délai de traitement</p>
                      <p className="text-sm text-gray-600">Le traitement peut prendre 24-48h pour les virements et chèques</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-xl mr-3">📧</span>
                    <div>
                      <p className="font-medium text-gray-800">Email de confirmation</p>
                      <p className="text-sm text-gray-600">Vous recevrez un email avec les instructions</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-6 border-t">
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-6 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Continuer vers la confirmation
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Confirmation Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-blue-800 mb-3">Confirmer votre inscription</h2>
                  <p className="text-gray-700">Vérifiez les détails ci-dessous avant de procéder</p>
                </div>

                {/* Order Summary */}
                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-blue-800 mb-4 text-center">Récapitulatif de votre commande</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b">
                      <div>
                        <span className="font-medium">Événement : </span>
                        <span className="text-blue-800 font-semibold">
                          {paymentData.eventTitle}
                        </span>
                      </div>
                      <span className="font-semibold">
                        {paymentData.amount} DA
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b">
                      <span>Date</span>
                      <span className="font-medium">
                        {formatDate(paymentData.eventDate)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b">
                      <span>Heure</span>
                      <span className="font-medium">
                        {formatTime(paymentData.eventDate)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-3 border-b">
                      <span>Mode de paiement</span>
                      <span className="font-medium">
                        {selectedPaymentMethod === "cash" ? "Paiement par cash" : "Paiement en ligne"}
                      </span>
                    </div>

                    <div className="pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">
                          Montant total à payer
                        </span>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-blue-800">
                            {paymentData.amount} DA
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {selectedPaymentMethod === "cash"
                              ? "À régler le jour de l'événement"
                              : "Paiement sécurisé via SATIM"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <div className="mb-8 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3 text-center">
                    Conditions générales
                  </h3>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p><strong>Article 1 - Conditions d'inscription</strong></p>
                    <p>Votre inscription est confirmée uniquement après réception du paiement complet.</p>
                    
                    <p><strong>Article 2 - Annulation et remboursement</strong></p>
                    <p>Les annulations sont acceptées jusqu'à 7 jours avant l'événement.</p>
                  </div>
                </div>

                {/* ReCAPTCHA */}
                <div className="mb-8">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600">
                      Vérification de sécurité requise
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={
                        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
                        "6LcVVlQsAAAAAAzjUdbl4n2fYmCTUsfPLKeppt_U"
                      }
                      onChange={handleRecaptchaChange}
                    />
                  </div>
                </div>

                {/* Payment Gateway Info */}
                {selectedPaymentMethod === "online" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="mb-3 text-center">
                      <p className="font-semibold text-gray-800">Paiement sécurisé via SATIM</p>
                      <p className="text-sm text-gray-600">
                        CIB / EDAHABIA / Cartes internationales
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      En cliquant sur le bouton ci-dessous, vous serez redirigé vers la plateforme sécurisée de SATIM.
                    </p>
                  </div>
                )}

                {/* Payment Button */}
                <div className="mb-8 text-center">
                  <button
                    onClick={handleSubmit}
                    disabled={processing || !recaptchaToken}
                    className={`relative inline-flex items-center justify-center px-6 py-4 rounded-lg font-semibold text-lg w-full ${processing || !recaptchaToken 
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                      : selectedPaymentMethod === "cash" 
                        ? "bg-green-600 text-white hover:bg-green-700" 
                        : "bg-blue-800 text-white hover:bg-blue-700"
                    }`}
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Traitement en cours...
                      </>
                    ) : selectedPaymentMethod === "cash" ? (
                      <>
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Confirmer l'inscription (paiement par cash)</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Procéder au paiement sécurisé</span>
                      </>
                    )}
                  </button>

                  {selectedPaymentMethod === "online" && !processing && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium text-green-800 mr-2">Service client SATIM :</span>
                        <a href="tel:3020" className="text-green-700 font-bold text-xl hover:text-green-800">
                          30 20
                        </a>
                      </div>
                      <p className="text-sm text-green-700 text-center mt-2">
                        Assistance disponible 24h/24, 7j/7
                      </p>
                    </div>
                  )}
                </div>

                {/* Back Button */}
                <div className="flex justify-center">
                  <button
                    onClick={prevStep}
                    disabled={processing}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Retour au choix de paiement
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Support */}
          <div className="mt-12 text-center">
            <h3 className="font-semibold text-gray-800 mb-2">Besoin d'aide ?</h3>
            <p className="text-gray-700 mb-4">
              Contactez notre équipe pour toute question sur le paiement
            </p>
            <div className="text-blue-800 font-medium">
              <p>support@federation-pharmaciens.dz</p>
              <p className="text-gray-600">+213 XX XX XX XX</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}