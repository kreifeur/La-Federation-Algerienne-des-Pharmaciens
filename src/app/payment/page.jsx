"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PaymentPage() {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Méthodes de paiement disponibles
  const paymentMethods = [
    { id: "cash", name: "Paiement Cash", icon: "💵", description: "Payer en espèces sur place" },
    { id: "bank_transfer", name: "CIB ou DHAHABIA", icon: "🏦", description: "Transfert bancaire" },
  ];

  // Récupérer les données de paiement
  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = () => {
    try {
      const storedPayment = localStorage.getItem("pendingPayment");
      
      if (!storedPayment) {
        router.push("/events");
        return;
      }

      const parsedPayment = JSON.parse(storedPayment);
      setPaymentData(parsedPayment);

      // Charger les infos utilisateur
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
        headers: { Authorization: `Bearer ${authToken}` },
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

  const processPayment = async (method) => {
    try {
      setProcessing(true);
      setError(null);

      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        throw new Error("Vous devez être connecté");
      }

      // Simuler le traitement
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Enregistrer la méthode de paiement
      const paymentDetails = {
        eventId: paymentData.eventId,
        userId: paymentData.userId,
        amount: paymentData.amount,
        paymentMethod: method,
        paymentStatus: "pending",
        transactionId: `TXN-${Date.now()}`,
      };

      // Sauvegarder dans l'historique
      /* savePaymentHistory(paymentDetails); */

      // Inscrire l'utilisateur
      await registerToEvent();

      // Confirmer le succès
      setSuccess(true);
      localStorage.removeItem("pendingPayment");

      // Redirection automatique
      setTimeout(() => {
        router.push("/events");
      }, 4000);

    } catch (error) {
      console.error("Erreur de paiement:", error);
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };

 /*  const savePaymentHistory = async (details) => {
    try {
      const authToken = localStorage.getItem("authToken");
      
      const response = await fetch("/api/payments/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(details),
      });

      if (!response.ok) {
        console.log("Historique non sauvegardé");
      }
    } catch (error) {
      console.error("Erreur historique:", error);
    }
  }; */

  const registerToEvent = async () => {
    /* try {
      const authToken = localStorage.getItem("authToken");
      
      const response = await fetch(`/api/events/${paymentData.eventId}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ 
          userId: paymentData.userId,
          paymentMethod: "pending_payment"
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur d'inscription");
      }
    } catch (error) {
      throw error;
    } */
  };

  const handleCancel = () => {
    localStorage.removeItem("pendingPayment");
    router.push("/events");
  };

  // Composants
  const LoadingScreen = () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Chargement...</p>
        </div>
      </main>
      <Footer />
    </div>
  );

  const NoPaymentScreen = () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Aucun paiement en attente</h2>
          <p className="text-gray-600 mb-6">Vous n'avez pas d'événement en attente de paiement.</p>
          <Link href="/events" className="px-6 py-3 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors">
            Retour aux événements
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );

  const SuccessScreen = () => (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Paiement Réussi - Fédération Algérienne des Pharmaciens</title>
      </Head>
      <Header />
      <main className="flex-grow bg-blue-50 flex items-center justify-center py-12">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-8 text-center">
          <div className="text-green-500 text-8xl mb-6">✅</div>
          <h2 className="text-3xl font-bold text-green-600 mb-4">Inscription Confirmée !</h2>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-800 mb-3">Détails de l'inscription :</h3>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">Événement :</span> {paymentData.eventTitle}
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">Montant :</span> {paymentData.amount} DA
            </p>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">Date :</span> {formatDate(paymentData.eventDate)}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Lieu :</span> {paymentData.eventLocation || "À confirmer"}
            </p>
          </div>

          <p className="text-gray-600 mb-8">
            Conservez votre numéro de transaction pour référence.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => router.push("/events")}
              className="w-full px-6 py-3 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Retour aux événements
            </button>
            <Link
              href="/profile"
              className="block w-full px-6 py-3 border border-blue-800 text-blue-800 rounded-md hover:bg-blue-50 transition-colors font-medium"
            >
              Voir mes inscriptions
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );

  const EventSummary = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-blue-800 mb-6 pb-4 border-b">
        Récapitulatif
      </h2>
      
      <div className="space-y-6">
        {/* Titre et date */}
        <div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">{paymentData.eventTitle}</h3>
          <p className="text-gray-600">
            {formatDate(paymentData.eventDate)} • {formatTime(paymentData.eventDate)}
          </p>
        </div>

        {/* Statut */}
        <div className="flex justify-between items-center py-3 border-t border-b">
          <span className="text-gray-700">Statut :</span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            Paiement en attente
          </span>
        </div>

        {/* Détails */}
        <div className="space-y-4">
          <DetailItem label="Lieu" value={paymentData.eventLocation || "À confirmer"} />
          <DetailItem label="Type" value={paymentData.isOnlineEvent ? "En ligne" : "Présentiel"} />
          <DetailItem 
            label="Tarif" 
            value={paymentData.priceType === "member" ? "Membre" : "Non-membre"} 
          />
          <DetailItem 
            label="Places" 
            value={`${paymentData.currentParticipants}/${paymentData.maxParticipants || "Illimité"}`} 
          />
        </div>

        {/* Prix */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Montant à payer :</span>
            <span className="text-2xl font-bold text-blue-800">
              {paymentData.amount} DA
            </span>
          </div>
          
          {paymentData.priceType === "member" && paymentData.nonMemberPrice > paymentData.memberPrice && (
            <p className="text-green-600 text-sm mt-2">
              ⭐ Économie de {paymentData.nonMemberPrice - paymentData.memberPrice} DA
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const PaymentMethodsSection = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-blue-800 mb-6 pb-4 border-b">
        Choisir le paiement
      </h2>

      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-blue-800 font-medium mb-2">Instructions :</p>
          <p className="text-gray-700 text-sm">
            1. Choisissez votre méthode de paiement<br/>
            2. Conservez votre numéro de confirmation<br/>
            3. Présentez-vous à l'événement avec votre confirmation
          </p>
        </div>

        {/* Méthodes de paiement */}
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => processPayment(method.id)}
              disabled={processing}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-4">{method.icon}</span>
                <div className="text-left">
                  <div className="font-medium text-gray-800">{method.name}</div>
                  <div className="text-sm text-gray-600">{method.description}</div>
                </div>
              </div>
              <div className="text-blue-600 font-medium">→</div>
            </button>
          ))}
        </div>

        {/* Informations importantes */}
        <div className="border-t pt-6 space-y-4">
          <InfoItem 
            icon="📋"
            title="Confirmation requise"
            text="Votre inscription sera confirmée après réception du paiement"
          />
          <InfoItem 
            icon="⏰"
            title="Délai de traitement"
            text="Le traitement peut prendre 24-48h pour les virements et chèques"
          />
          <InfoItem 
            icon="📧"
            title="Email de confirmation"
            text="Vous recevrez un email avec les instructions"
          />
        </div>

        {/* Actions */}
        <div className="space-y-4 pt-4">
          {processing && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-800 mr-3"></div>
              <span className="text-gray-700">Traitement en cours...</span>
            </div>
          )}

          <button
            onClick={handleCancel}
            disabled={processing}
            className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Annuler l'inscription
          </button>

          <p className="text-xs text-gray-500 text-center">
            En procédant, vous acceptez nos{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">conditions</Link>
            {' '}et notre{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">politique de confidentialité</Link>
          </p>
        </div>
      </div>
    </div>
  );

  // Composants utilitaires
  const DetailItem = ({ label, value }) => (
    <div className="flex justify-between">
      <span className="text-gray-700">{label} :</span>
      <span className="font-medium">{value}</span>
    </div>
  );

  const InfoItem = ({ icon, title, text }) => (
    <div className="flex items-start">
      <span className="text-xl mr-3">{icon}</span>
      <div>
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-600">{text}</p>
      </div>
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
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Paiement - Fédération Algérienne des Pharmaciens</title>
        <meta name="description" content="Finalisez votre inscription à l'événement" />
      </Head>

      <Header />

      <main className="flex-grow bg-blue-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* En-tête */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-blue-800 mb-4">
              Finaliser l'inscription
            </h1>
            <p className="text-lg text-gray-700">
              Choisissez comment vous souhaitez payer pour confirmer votre participation
            </p>
          </div>

          <ErrorAlert />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EventSummary />
            <PaymentMethodsSection />
          </div>

          {/* Section d'assistance */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Besoin d'aide ?</h3>
                <p className="text-gray-600 text-sm">
                  Contactez notre équipe pour toute question sur le paiement
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-blue-800">support@federation-pharmaciens.dz</p>
                <p className="text-gray-600 text-sm">+213 XX XX XX XX</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}