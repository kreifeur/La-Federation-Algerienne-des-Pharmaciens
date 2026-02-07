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
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    acceptTerms: false,
  });

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

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
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

      // Charger les infos utilisateur depuis localStorage ou API
      loadUserInfo();

      setLoading(false);
    } catch (error) {
      console.error("Erreur de chargement:", error);
      setError("Erreur de chargement des données");
      setLoading(false);
    }
  };

  const loadUserInfo = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) return;

      const response = await fetch("/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setUserInfo(result.data);
        }
      }
    } catch (error) {
      console.error("Erreur profil:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "À confirmer";
    try {
      const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
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
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
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

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Vous devez accepter les conditions générales";
    }
    if (!recaptchaToken) {
      newErrors.recaptcha = "Veuillez compléter le CAPTCHA";
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
    if (!validateStep2()) {
      return;
    }

    if (!sslVerified) {
      alert(
        "Veuillez utiliser une connexion sécurisée (HTTPS) pour procéder au paiement",
      );
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        throw new Error("Vous devez être connecté");
      }

      // Pour cash, on enregistre directement l'inscription
      // Pour online, on enregistre après le paiement (via callback)
      const registrationData = {
        userId: paymentData.userId,
        amount: paymentData.amount,
        paymentMethod: selectedPaymentMethod,
        paymentStatus:
          selectedPaymentMethod === "cash" ? "pending" : "pending_payment",
        transactionId: `TXN-${Date.now()}`,
        recaptchaToken: recaptchaToken,
        acceptTerms: formData.acceptTerms,
      };

      if (selectedPaymentMethod === "cash") {
        // Pour le cash, enregistrer l'inscription immédiatement
        const registerResponse = await fetch(
          `/api/events/${paymentData.eventId}/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(registrationData),
          },
        );

        const registerResult = await registerResponse.json();

        if (!registerResult.success) {
          throw new Error(registerResult.message || "Erreur d'inscription");
        }

        setSuccess(true);
        localStorage.removeItem("pendingPayment");
      } else {
        // Pour le paiement en ligne, préparer la requête de paiement
        const paymentRequest = {
          amount: paymentData.amount,
          eventId: paymentData.eventId,
          userId: paymentData.userId,
          transactionId: registrationData.transactionId,
          returnUrl: `${window.location.origin}/payment/success`,
          cancelUrl: `${window.location.origin}/payment/cancel`,
          acceptTerms: formData.acceptTerms,
        };

        // Enregistrer les données temporaires
        localStorage.setItem(
          "tempRegistration",
          JSON.stringify({
            ...registrationData,
            eventId: paymentData.eventId,
          }),
        );

        const res = await axios.post("/api/pay", paymentRequest);

        if (res.data.formUrl) {
          window.location.href = res.data.formUrl;
        } else {
          throw new Error("URL de paiement non disponible");
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
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            Aucun paiement en attente
          </h2>
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
        <title>
          Inscription Confirmée - Fédération Algérienne des Pharmaciens
        </title>
      </Head>
      <Header />
      <main className="py-16 px-6">
        <div className="container mx-auto max-w-md">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-green-500 text-6xl mb-6">✅</div>
            <h2 className="text-2xl font-bold text-blue-800 mb-6">
              {selectedPaymentMethod === "cash"
                ? "Demande d'inscription enregistrée !"
                : "Paiement en cours de traitement !"}
            </h2>

            <div className="mb-8">
              <h3 className="font-semibold text-blue-800 mb-4">
                Détails de l'inscription :
              </h3>
              <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Événement :</span>{" "}
                  {paymentData.eventTitle}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Montant :</span>{" "}
                  {paymentData.amount} DA
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Date :</span>{" "}
                  {formatDate(paymentData.eventDate)}
                </p>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Heure :</span>{" "}
                  {formatTime(paymentData.eventDate)}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Mode de paiement :</span>
                  {selectedPaymentMethod === "cash"
                    ? " Paiement par cash"
                    : " Paiement en ligne"}
                </p>
              </div>
            </div>

            {selectedPaymentMethod === "cash" ? (
              <div className="bg-blue-50 p-4 rounded-lg mb-8">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Instructions pour le paiement en espèces :
                </h3>
                <ul className="text-left list-disc list-inside text-gray-700 space-y-2">
                  <li>Votre demande d'inscription a été enregistrée</li>
                  <li>Vous recevrez un email de confirmation</li>
                  <li>
                    Présentez-vous à l'événement avec pièce d'identité et
                    montant en espèces
                  </li>
                  <li>Votre inscription sera validée sur place</li>
                </ul>
              </div>
            ) : (
              <div className="bg-blue-50 p-4 rounded-lg mb-8">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Instructions pour le paiement en ligne :
                </h3>
                <ul className="text-left list-disc list-inside text-gray-700 space-y-2">
                  <li>Votre paiement est en cours de traitement</li>
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

  const ErrorAlert = () =>
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
    );

  // Rendu principal
  if (loading) return <LoadingScreen />;
  if (!paymentData) return <NoPaymentScreen />;
  if (success) return <SuccessScreen />;

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Paiement - Fédération Algérienne des Pharmaciens</title>
        <meta
          name="description"
          content="Finalisez votre inscription à l'événement"
        />
      </Head>

      <Header />

      <main className="py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-blue-800 mb-3">
              Finaliser l'inscription
            </h1>
            <p className="text-gray-700">
              Choisissez comment vous souhaitez payer pour confirmer votre
              participation
            </p>
          </div>

          {/* SSL Security Badge */}
          <div className="text-center mb-4">
            {sslVerified ? (
              <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-lg text-xs font-semibold">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Connexion sécurisée
              </div>
            ) : (
              <div className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-lg text-xs font-semibold">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                Utilisez HTTPS
              </div>
            )}
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div
                className={`flex flex-col items-center ${currentStep >= 1 ? "text-blue-800" : "text-gray-400"}`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${currentStep >= 1 ? "bg-blue-800 text-white" : "bg-gray-200"}`}
                >
                  1
                </div>
                <span className="mt-1 text-xs font-medium">Paiement</span>
              </div>
              <div
                className={`h-1 flex-1 mx-2 ${currentStep >= 2 ? "bg-blue-800" : "bg-gray-200"}`}
              ></div>
              <div
                className={`flex flex-col items-center ${currentStep >= 2 ? "text-blue-800" : "text-gray-400"}`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${currentStep >= 2 ? "bg-blue-800 text-white" : "bg-gray-200"}`}
                >
                  2
                </div>
                <span className="mt-1 text-xs font-medium">Confirmation</span>
              </div>
            </div>
          </div>

          <ErrorAlert />

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {currentStep === 1 ? (
              <>
                {/* Event Summary */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-blue-800 mb-4 text-center">
                    Votre inscription
                  </h2>

                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-gray-800 mb-1">
                        {paymentData.eventTitle}
                      </h3>
                      <p className="text-sm text-gray-700">
                        {formatDate(paymentData.eventDate)} •{" "}
                        {formatTime(paymentData.eventDate)}
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Paiement en attente
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Lieu :</span>
                        <span className="font-medium">
                          {paymentData.eventLocation || "À confirmer"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Type :</span>
                        <span className="font-medium">
                          {paymentData.isOnlineEvent
                            ? "En ligne"
                            : "Présentiel"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Tarif :</span>
                        <span className="font-medium">
                          {paymentData.priceType === "member"
                            ? "Membre"
                            : "Non-membre"}
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-gray-700 mb-1 text-sm">
                        Montant à payer :
                      </p>
                      <div className="text-2xl font-bold text-blue-800">
                        {paymentData.amount} DA
                      </div>
                      {paymentData.priceType === "member" &&
                        paymentData.nonMemberPrice >
                          paymentData.memberPrice && (
                          <p className="text-green-600 text-sm mt-1">
                            ⭐ Économie de{" "}
                            {paymentData.nonMemberPrice -
                              paymentData.memberPrice}{" "}
                            DA
                          </p>
                        )}
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3 text-center">
                    Mode de paiement
                  </h3>

                  <div className="space-y-3">
                    <div
                      className={`border p-3 cursor-pointer rounded-md transition-all ${
                        selectedPaymentMethod === "cash"
                          ? "border-blue-800 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedPaymentMethod("cash")}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                            selectedPaymentMethod === "cash"
                              ? "border-blue-800 bg-blue-800"
                              : "border-gray-400"
                          }`}
                        >
                          {selectedPaymentMethod === "cash" && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="font-medium">Paiement par cash</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 ml-7">
                        Payez en espèces le jour de l'événement
                      </p>
                    </div>

                    <div
                      className={`border p-3 cursor-pointer rounded-md transition-all ${
                        selectedPaymentMethod === "online"
                          ? "border-blue-800 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedPaymentMethod("online")}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                            selectedPaymentMethod === "online"
                              ? "border-blue-800 bg-blue-800"
                              : "border-gray-400"
                          }`}
                        >
                          {selectedPaymentMethod === "online" && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="font-medium">Paiement en ligne</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 ml-7">
                        CIB / EDAHABIA via SATIM
                      </p>
                    </div>
                  </div>

                  {errors.paymentMethod && (
                    <p className="text-red-500 text-xs mt-2 text-center">
                      {errors.paymentMethod}
                    </p>
                  )}
                </div>

                {/* Information */}
                <div className="mb-6 space-y-3">
                  <div className="flex items-start">
                    <span className="text-lg mr-2">📋</span>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        Confirmation requise
                      </p>
                      <p className="text-xs text-gray-600">
                        Inscription confirmée après paiement
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-lg mr-2">⏰</span>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        Délai de traitement
                      </p>
                      <p className="text-xs text-gray-600">
                        24-48h pour les virements
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-lg mr-2">📧</span>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        Email de confirmation
                      </p>
                      <p className="text-xs text-gray-600">
                        Instructions envoyées par email
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-4 border-t">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Continuer
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Confirmation Header */}
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-blue-800 mb-2">
                    Confirmer l'inscription
                  </h2>
                  <p className="text-sm text-gray-700">
                    Vérifiez les détails avant de procéder
                  </p>
                </div>

                {/* Order Summary */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-800 mb-3 text-center text-sm">
                    Récapitulatif
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <div>
                        <span className="text-sm font-medium">
                          Événement :{" "}
                        </span>
                        <span className="text-blue-800 font-semibold text-sm">
                          {paymentData.eventTitle}
                        </span>
                      </div>
                      <span className="font-semibold text-sm">
                        {paymentData.amount} DA
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b text-sm">
                      <span>Date</span>
                      <span className="font-medium">
                        {formatDate(paymentData.eventDate)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b text-sm">
                      <span>Heure</span>
                      <span className="font-medium">
                        {formatTime(paymentData.eventDate)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b text-sm">
                      <span>Paiement</span>
                      <span className="font-medium">
                        {selectedPaymentMethod === "cash" ? "Cash" : "En ligne"}
                      </span>
                    </div>

                    <div className="pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm">
                          Total à payer
                        </span>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-800">
                            {paymentData.amount} DA
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {selectedPaymentMethod === "cash"
                              ? "À régler sur place"
                              : "Paiement sécurisé"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="mb-6">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      required
                    />
                    <label
                      htmlFor="acceptTerms"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      J'accepte les{" "}
                      <a
                        href="/conditions-generales"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        conditions générales
                      </a>{" "}
                      et la{" "}
                      <a
                        href="/politique-confidentialite"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        politique de confidentialité
                      </a>{" "}
                      *
                    </label>
                  </div>
                  {errors.acceptTerms && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.acceptTerms}
                    </p>
                  )}
                </div>

                {/* ReCAPTCHA */}
                <div className="mb-6">
                  <div className="text-center mb-3">
                    <p className="text-xs text-gray-600">
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
                      size="normal"
                    />
                  </div>
                  {errors.recaptcha && (
                    <p className="text-red-500 text-xs mt-2 text-center">
                      {errors.recaptcha}
                    </p>
                  )}
                </div>

                {/* Payment Gateway Info */}
                {selectedPaymentMethod === "online" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-center justify-center">
                    <img
                      src="/satim_logo.jpg"
                      alt="SATIM Payment Gateway"
                      className="h-10 mr-3"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />

                    <div className="mb-2 text-center">
                      <p className="font-semibold text-gray-800 text-sm">
                        Paiement sécurisé SATIM
                      </p>
                      <p className="text-xs text-gray-600">
                        CIB / EDAHABIA / Cartes
                      </p>
                      <p className="text-xs text-gray-600 text-center">
                        Redirection vers la plateforme sécurisée
                      </p>
                    </div>
                  </div>
                )}

                {/* Payment Button */}
                <div className="mb-6 text-center">
                  <button
                    onClick={handleSubmit}
                    disabled={
                      processing || !recaptchaToken || !formData.acceptTerms
                    }
                    className={`relative inline-flex items-center justify-center px-4 py-3 rounded-md font-medium w-full ${
                      processing || !recaptchaToken || !formData.acceptTerms
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : selectedPaymentMethod === "cash"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-blue-800 text-white hover:bg-blue-700"
                    }`}
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        <span className="text-sm">Traitement...</span>
                      </>
                    ) : selectedPaymentMethod === "cash" ? (
                      <>
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm">
                          Confirmer (paiement cash)
                        </span>
                      </>
                    ) : (
                      <>
                        
                        <img
                            src="/cib_logo.png"
                            alt="CIB"
                            className="h-8 ml-4"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = "none";
                            }}/>
                        <span className="text-sm ml-2">Payer maintenant</span>
                      </>
                    )}
                  </button>

                  {selectedPaymentMethod === "online" && !processing && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-green-600 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium text-green-800 text-xs mr-1">
                          SATIM :
                        </span>
                        <a
                          href="tel:3020"
                          className="text-green-700 font-bold text-sm hover:text-green-800"
                        >
                          30 20
                        </a>
                      </div>
                      <p className="text-xs text-green-700 text-center mt-1">
                        Assistance 24h/24
                      </p>
                    </div>
                  )}
                </div>

                {/* Back Button */}
                <div className="flex justify-center">
                  <button
                    onClick={prevStep}
                    disabled={processing}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
                  >
                    Retour
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Support */}
          <div className="mt-8 text-center">
            <h3 className="font-semibold text-gray-800 text-sm mb-1">
              Besoin d'aide ?
            </h3>
            <p className="text-gray-700 text-xs mb-3">
              Contactez notre équipe pour toute question
            </p>
            <div className="text-blue-800 font-medium text-sm">
              <p>support@federation-pharmaciens.dz</p>
              <p className="text-gray-600 text-xs">+213 XX XX XX XX</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
