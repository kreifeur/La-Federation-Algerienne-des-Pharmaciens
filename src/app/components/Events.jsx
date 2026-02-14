"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userInfo, setUserInfo] = useState(null); // Nouveau état pour les infos utilisateur
  const router = useRouter();

  // Fonction pour récupérer le profil utilisateur
  const fetchUserProfile = async () => {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        console.log("Utilisateur non connecté");
        return null;
      }

      const response = await fetch("/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        console.log("Erreur de profil, utilisateur probablement non connecté");
        return null;
      }

      const result = await response.json();

      if (result.success && result.data && result.data._id) {
        const userId = result.data.userId || result.data._id;
        setCurrentUserId(userId);
        setUserInfo(result.data); // Sauvegarder les infos utilisateur
        console.log("Utilisateur connecté, ID:", userId);
        return userId;
      }
      console.log("Profil incomplet, utilisateur non connecté");
      return null;
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
      return null;
    }
  };

  // Fonction pour récupérer les événements
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = await fetchUserProfile();

      const response = await fetch("/api/events", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des événements");
      }

      const result = await response.json();

      if (result.success) {
        const now = new Date();
        const upcomingEvents = [];

        result.data.events.forEach((event) => {
          const eventDate = new Date(event.startDate);

          if (eventDate >= now) {
            const isRegistered = userId
              ? event.participants?.includes(userId)
              : false;

            upcomingEvents.push({
              ...event,
              status: isRegistered ? "registered" : "available",
              type: getEventTypeFromData(event),
            });
          }
        });

        setEvents(upcomingEvents.slice(0, 3));
      } else {
        throw new Error(
          result.message || "Erreur lors du chargement des événements"
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError(error.message);
      const demoEvents = [
        {
          _id: "1",
          title: "Congrès Annuel de Cosmétologie",
          startDate: "2024-09-15T09:00:00Z",
          location: "Paris, France",
          type: "congress",
          status: "available",
          description:
            "Le plus grand rassemblement de professionnels de la cosmétologie en France.",
          isOnline: false,
          isMemberOnly: false,
          participants: [],
          memberPrice: 2000,
          nonMemberPrice: 5000,
          maxParticipants: 200,
        },
        {
          _id: "2",
          title: "Atelier Formulation Naturelle",
          startDate: "2024-10-05T14:00:00Z",
          location: "Lyon, France",
          type: "workshop",
          status: "available",
          description:
            "Apprenez à formuler des produits cosmétiques avec des ingrédients naturels.",
          isOnline: false,
          isMemberOnly: true,
          participants: [],
          memberPrice: 1000,
          nonMemberPrice: 3000,
          maxParticipants: 50,
        },
        {
          _id: "3",
          title: "Salon des Innovations Cosmétiques",
          startDate: "2024-11-20T10:00:00Z",
          location: "Marseille, France",
          type: "exhibition",
          status: "available",
          description:
            "Découvrez les dernières innovations produits et technologies lors de ce salon professionnel.",
          isOnline: false,
          isMemberOnly: false,
          participants: [],
          memberPrice: 0,
          nonMemberPrice: 0,
          maxParticipants: 100,
        },
      ];
      setEvents(demoEvents);
    } finally {
      setLoading(false);
    }
  };

  // Déterminer le type d'événement basé sur les données
  const getEventTypeFromData = (event) => {
    if (event.isOnline) return "webinar";
    if (
      event.title?.toLowerCase().includes("congrès") ||
      event.title?.toLowerCase().includes("congres")
    )
      return "congress";
    if (
      event.title?.toLowerCase().includes("atelier") ||
      event.title?.toLowerCase().includes("workshop")
    )
      return "workshop";
    if (event.title?.toLowerCase().includes("formation")) return "workshop";
    return "congress";
  };

  // Charger les événements au montage du composant
  useEffect(() => {
    fetchEvents();
  }, []);

  const getEventStatus = (status) => {
    switch (status) {
      case "registered":
        return { text: "Inscrit", color: "bg-green-100 text-green-800" };
      case "available":
        return { text: "Disponible", color: "bg-blue-100 text-blue-800" };
      case "pending":
        return { text: "En attente", color: "bg-yellow-100 text-yellow-800" };
      case "completed":
        return { text: "Terminé", color: "bg-gray-100 text-gray-800" };
      default:
        return { text: "Disponible", color: "bg-blue-100 text-blue-800" };
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case "congress":
        return "🎤";
      case "workshop":
        return "🔬";
      case "webinar":
        return "💻";
      default:
        return "📅";
    }
  };

  const formatEventDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRegister = async (event) => {
    try {
      setRegisteringEvent(event._id);

      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        setSelectedEvent(event);
        setShowLoginAlert(true);
        return;
      }

      let userId = currentUserId;
      if (!userId) {
        userId = await fetchUserProfile();
      }

      if (!userId) {
        throw new Error("Impossible de récupérer l'ID utilisateur");
      }

      // Vérifier si l'événement est gratuit
      const isFreeEvent = (event.memberPrice === 0 && event.nonMemberPrice === 0);
      
      if (isFreeEvent) {
        // Pour les événements gratuits, procéder à l'inscription directe
        const response = await fetch(`/api/events/${event._id}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ userId }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Erreur lors de l'inscription");
        }

        if (result.success) {
          setEvents((prev) =>
            prev.map((ev) =>
              ev._id === event._id
                ? {
                    ...ev,
                    status: "registered",
                    participants: [...(ev.participants || []), { userId }],
                  }
                : ev
            )
          );

          alert("✅ Inscription réussie ! Vous êtes maintenant inscrit à cet événement.");
        } else {
          throw new Error(result.message || "Erreur lors de l'inscription");
        }
      } else {
        // Pour les événements payants, rediriger vers la page de paiement
        redirectToPaymentPage(event);
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert(`❌ Erreur: ${error.message}`);
    } finally {
      setRegisteringEvent(null);
    }
  };

  const redirectToPaymentPage = (event) => {
    // Préparer les données de l'événement pour la page de paiement
    const paymentData = {
      eventId: event._id,
      eventTitle: event.title,
      eventDate: event.startDate,
      eventLocation: event.location,
      
      // Déterminer le prix en fonction du statut de membre
      amount: userInfo?.isMember ? event.memberPrice : event.nonMemberPrice,
      priceType: userInfo?.isMember ? "member" : "non-member",
      memberPrice: event.memberPrice,
      nonMemberPrice: event.nonMemberPrice,
      
      userId: currentUserId,
      userName: userInfo?.fullName || userInfo?.email,
      userEmail: userInfo?.email,
      
      // Autres informations utiles
      isOnlineEvent: event.isOnline,
      maxParticipants: event.maxParticipants,
      currentParticipants: event.participants?.length || 0,
    };

    // Stocker les données temporairement dans localStorage
    localStorage.setItem("pendingPayment", JSON.stringify(paymentData));
    
    // Rediriger vers la page de paiement
    router.push("/payment");
  };

  const handleLoginRedirect = () => {
    setShowLoginAlert(false);
    router.push("/login");
  };

  const handleViewDetails = (event) => {
    const isRegistered = event.status === "registered";
    const isConnected = currentUserId !== null;
    const participantsCount = event.participants?.length || 0;
    const maxParticipants = event.maxParticipants || "Illimité";

    // Vérifier si l'événement est gratuit ou payant
    const isFreeEvent = (event.memberPrice === 0 && event.nonMemberPrice === 0);
    const priceInfo = isFreeEvent ? "Gratuit" : 
      `Prix: ${event.memberPrice || 0}DA`;

    alert(
      `Détails de l'événement:\n\n` +
        `📌 ${event.title}\n\n` +
        `📝 ${event.description || "Aucune description"}\n\n` +
        `📅 Date de début: ${formatDateTime(event.startDate)}\n` +
        `📍 Lieu: ${event.location}\n` +
        (event.isOnline ? `🌐 Événement en ligne\n` : '') +
        (event.isMemberOnly ? `🔒 Réservé aux membres seulement\n` : '') +
        `👥 Participants: ${participantsCount}/${maxParticipants}\n` +
        `💰 ${priceInfo}\n` +
        `${
          isConnected
            ? isRegistered
              ? "✅ Vous êtes inscrit à cet événement"
              : isFreeEvent
                ? "❌ Vous n'êtes pas inscrit - Statut: Disponible (Gratuit)"
                : "❌ Vous n'êtes pas inscrit - Statut: Disponible (Payant)"
            : "🔐 Connectez-vous pour vous inscrire"
        }`
    );
  };

  // Vérifier si l'utilisateur est déjà inscrit à un événement
  const isUserRegistered = (event) => {
    return event.status === "registered";
  };

  // Afficher le prix selon le statut de l'utilisateur
  const displayPrice = (event) => {
    const isFreeEvent = (event.memberPrice === 0 && event.nonMemberPrice === 0);
    
    if (isFreeEvent) {
      return (
        <span className="text-green-600 font-semibold">
          Gratuit
        </span>
      );
    } else {
      const userPrice = userInfo?.isMember ? event.memberPrice : event.nonMemberPrice;
      const otherPrice = userInfo?.isMember ? event.nonMemberPrice : event.memberPrice;
      
      return (
        <div className="text-right">
          <div className="text-blue-800 font-semibold">
            {userPrice || 0} DA / membre
          </div>
         {/*  <div className="text-sm text-gray-500">
            {otherPrice || 0} DA {userInfo?.isMember ? "(Non-membre)" : "(Membre)"}
          </div> */}
        </div>
      );
    }
  };

  // Déterminer le texte du bouton
  const getButtonText = (event) => {
    if (event.status === "registered") {
      return "Inscrit";
    }
    if (event.maxParticipants && (event.participants?.length || 0) >= event.maxParticipants) {
      return "Complet";
    }
    
    // Afficher "Payer" pour les événements payants
    const isFreeEvent = (event.memberPrice === 0 && event.nonMemberPrice === 0);
    return isFreeEvent ? "S'inscrire" : "S'inscrire & Payer";
  };

  if (loading) {
    return (
      <section id="events" className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">
            Événements à venir
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg overflow-hidden shadow-md"
              >
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-3 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && events.length === 0) {
    return (
      <section id="events" className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">
            Événements à venir
          </h2>
          <div className="text-center text-gray-600">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="py-16 px-6 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">
          Événements à venir
        </h2>

        {events.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>Aucun événement programmé pour le moment.</p>
            <p className="mt-2">
              Revenez bientôt pour découvrir nos prochains événements.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.map((event) => {
                const isRegistered = isUserRegistered(event);
                const status = getEventStatus(event.status);
                const isRegistering = registeringEvent === event._id;
                const participantsCount = event.participants?.length || 0;
                const maxParticipants = event.maxParticipants || "Illimité";
                const isConnected = currentUserId !== null;
                const isFreeEvent = (event.memberPrice === 0 && event.nonMemberPrice === 0);
                const buttonText = getButtonText(event);

                return (
                  <div
                    key={event._id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      {event.imgUrl ? (
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url(${event.imgUrl})`,
                          }}
                        ></div>
                      ) : (
                        <div className="text-gray-600 flex flex-col items-center">
                          <span className="text-4xl mb-2">📅</span>
                          <span className="text-sm">Image événement</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex flex-col items-end space-y-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                          >
                            {status.text}
                          </span>
                          {event.isMemberOnly && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Membres
                            </span>
                          )}
                          {event.isOnline && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              En ligne
                            </span>
                          )}
                          {!isFreeEvent && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                              💰 Payant
                            </span>
                          )}
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-blue-800">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {event.description || "Description non disponible"}
                      </p>

                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <svg
                          className="w-4 h-4 mr-1 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="truncate">
                          {formatEventDate(event.startDate)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <svg
                          className="w-4 h-4 mr-1 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="truncate">{event.location}</span>
                      </div>

                      <div className="flex justify-between items-center mb-4">
                        <div className="text-left">
                          {/* <div className="text-sm text-gray-500 mb-1">
                            Participants: {participantsCount}/{maxParticipants}
                          </div> */}
                        </div>
                        {displayPrice(event)}
                      </div>

                      <div className="flex space-x-2">
                        {isRegistered ? (
                          <button
                            className="flex-1 py-2 bg-green-600 text-white rounded-md text-sm flex items-center justify-center"
                            disabled
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Inscrit
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRegister(event)}
                            disabled={isRegistering || (event.maxParticipants && participantsCount >= event.maxParticipants)}
                            className="flex-1 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm flex items-center justify-center"
                          >
                            {isRegistering ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                Inscription...
                              </>
                            ) : (
                              buttonText
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleViewDetails(event)}
                          className="px-3 py-2 border border-blue-800 text-blue-800 rounded-md hover:bg-blue-50 text-sm"
                        >
                          Détails
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/events"
                className="px-6 py-3 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Voir tous les événements
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Popup d'alerte connexion requise */}
      {showLoginAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="text-yellow-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                Connexion requise
              </h3>
              <p className="text-gray-700 mb-6">
                Vous devez être connecté pour vous inscrire à{" "}
                <strong>{selectedEvent?.title}</strong>.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowLoginAlert(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleLoginRedirect}
                  className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Se connecter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Events;