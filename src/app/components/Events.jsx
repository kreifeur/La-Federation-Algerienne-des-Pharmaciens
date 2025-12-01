// components/Events.js
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
  const router = useRouter();

  // Fonction pour récupérer le profil utilisateur
  const fetchUserProfile = async () => {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        console.log("Utilisateur non connecté");
        return null; // Pas d'erreur, juste pas connecté
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
        // Utiliser userId depuis les données du profil
        const userId = result.data.userId || result.data._id;
        setCurrentUserId(userId);
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

      // Essayer de récupérer le profil utilisateur (peut retourner null si non connecté)
      const userId = await fetchUserProfile();

      const response = await fetch("/api/events", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des événements");
      }

      const result = await response.json();

      if (result.success) {
        // Séparer les événements en "à venir"
        const now = new Date();
        const upcomingEvents = [];

        result.data.events.forEach((event) => {
          const eventDate = new Date(event.startDate);

          if (eventDate >= now) {
            // Si l'utilisateur est connecté, vérifier s'il est inscrit
            // Sinon, le statut est toujours "available"
            const isRegistered = userId
              ? event.participants?.includes(userId)
              : false;

            upcomingEvents.push({
              ...event,
              status: isRegistered ? "registered" : "available", // Toujours "available" si pas connecté
              type: getEventTypeFromData(event),
            });
          }
        });

        // Prendre seulement les 3 premiers événements à venir pour l'affichage
        setEvents(upcomingEvents.slice(0, 3));
      } else {
        throw new Error(
          result.message || "Erreur lors du chargement des événements"
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError(error.message);
      // Données de démonstration en cas d'erreur
      const demoEvents = [
        {
          _id: "1",
          title: "Congrès Annuel de Cosmétologie",
          startDate: "2024-09-15T09:00:00Z",
          location: "Paris, France",
          type: "congress",
          status: "available", // Toujours "available" pour les démos
          description:
            "Le plus grand rassemblement de professionnels de la cosmétologie en France.",
          isOnline: false,
          isMemberOnly: false,
          participants: [],
          memberPrice: 0,
          nonMemberPrice: 5000,
          maxParticipants: 200,
        },
        {
          _id: "2",
          title: "Atelier Formulation Naturelle",
          startDate: "2024-10-05T14:00:00Z",
          location: "Lyon, France",
          type: "workshop",
          status: "available", // Toujours "available" pour les démos
          description:
            "Apprenez à formuler des produits cosmétiques avec des ingrédients naturels.",
          isOnline: false,
          isMemberOnly: true,
          participants: [],
          memberPrice: 0,
          nonMemberPrice: 3000,
          maxParticipants: 50,
        },
        {
          _id: "3",
          title: "Salon des Innovations Cosmétiques",
          startDate: "2024-11-20T10:00:00Z",
          location: "Marseille, France",
          type: "exhibition",
          status: "available", // Toujours "available" pour les démos
          description:
            "Découvrez les dernières innovations produits et technologies lors de ce salon professionnel.",
          isOnline: false,
          isMemberOnly: false,
          participants: [],
          memberPrice: 0,
          nonMemberPrice: 2000,
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
    return "congress"; // défaut
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
        return { text: "Disponible", color: "bg-blue-100 text-blue-800" }; // Par défaut "Disponible"
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

  const handleRegister = async (eventId) => {
    try {
      setRegisteringEvent(eventId);

      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        setSelectedEvent(events.find((event) => event._id === eventId));
        setShowLoginAlert(true);
        return;
      }

      // S'assurer que nous avons l'ID utilisateur
      let userId = currentUserId;
      if (!userId) {
        userId = await fetchUserProfile();
      }

      if (!userId) {
        throw new Error("Impossible de récupérer l'ID utilisateur");
      }

      console.log("Inscription à l'événement:", eventId);
      console.log("User ID:", userId);

      const response = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const result = await response.json();
      console.log("Réponse de l'API:", result);

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de l'inscription");
      }

      if (result.success) {
        // Mettre à jour le statut de l'événement localement
        setEvents((prev) =>
          prev.map((event) =>
            event._id === eventId
              ? {
                  ...event,
                  status: "registered", // Change le statut à "registered"
                  participants: [...(event.participants || []), userId],
                }
              : event
          )
        );

        alert(
          "✅ Inscription réussie ! Vous êtes maintenant inscrit à cet événement."
        );
      } else {
        throw new Error(result.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert(`❌ Erreur: ${error.message}`);
    } finally {
      setRegisteringEvent(null);
    }
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

    alert(
      `Détails de l'événement:\n\n` +
        `📌 ${event.title}\n\n` +
        `📝 ${event.description || "Aucune description"}\n\n` +
        `📅 Date: ${formatDateTime(event.startDate)}\n` +
        `📍 Lieu: ${event.location}\n` +
        `👥 Participants: ${participantsCount}/${maxParticipants}\n` +
        `💰 Prix membre: ${event.memberPrice || 0}DA\n` +
        `💰 Prix non-membre: ${event.nonMemberPrice || 0}DA\n` +
        `${
          event.isOnline ? "💻 Événement en ligne" : "🏢 Événement présentiel"
        }\n` +
        `${
          event.isMemberOnly ? "🔒 Réservé aux membres" : "🔓 Ouvert à tous"
        }\n` +
        `${
          isConnected
            ? isRegistered
              ? "✅ Vous êtes inscrit à cet événement"
              : "❌ Vous n'êtes pas inscrit - Statut: Disponible"
            : "🔐 Connectez-vous pour vous inscrire - Statut: Disponible"
        }`
    );
  };

  // Vérifier si l'utilisateur est déjà inscrit à un événement
  const isUserRegistered = (event) => {
    return event.status === "registered";
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
                const status = getEventStatus(event.status); // Utilise directement event.status
                const isRegistering = registeringEvent === event._id;
                const participantsCount = event.participants?.length || 0;
                const maxParticipants = event.maxParticipants || "Illimité";
                const isConnected = currentUserId !== null;

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
                        <div className="text-4xl">
                          {/* {getEventTypeIcon(event.type)} */}
                          <div className="text-gray-600">Image événement</div>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        {/*  <div className="text-2xl">
                          {getEventTypeIcon(event.type)}
                        </div> */}
                        <div className="flex flex-col items-end space-y-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                          >
                            {status.text}{" "}
                            {/* Affiche "Disponible" si pas connecté */}
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
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-blue-800">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {event.description || "Description non disponible"}
                      </p>

                      {/* Informations sur les participants */}
                      {/*  <div className="flex items-center text-sm text-gray-500 mb-2">
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span>
                          {participantsCount}/{maxParticipants} participants
                        </span>
                      </div> */}

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
                        <div className="text-right">
                          {event.nonMemberPrice === 0 ? (
                            <span className="text-green-600 font-semibold">
                              Gratuit
                            </span>
                          ) : (
                            <>
                              {/* <div className="text-gray-500 line-through text-sm">
                                {event.nonMemberPrice} DA
                              </div> */}
                              <div className="text-blue-800 font-semibold">
                                {event.memberPrice} DA membres
                              </div>
                            </>
                          )}
                        </div>
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
                            onClick={() => handleRegister(event._id)}
                            disabled={isRegistering}
                            className="flex-1 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-sm flex items-center justify-center"
                          >
                            {isRegistering ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                Inscription...
                              </>
                            ) : (
                              "S'inscrire"
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
