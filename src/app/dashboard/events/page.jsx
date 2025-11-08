// app/dashboard/events/page.jsx
"use client";

import { useState, useEffect } from "react";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [events, setEvents] = useState({
    upcoming: [],
    past: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fonction pour récupérer le profil utilisateur
  const fetchUserProfile = async () => {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await fetch("/api/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement du profil");
      }

      const result = await response.json();

      if (result.success && result.data && result.data._id) {
        setCurrentUserId(result.data.userId);
        return result.data.userId;
      } else {
        throw new Error("Impossible de récupérer l'ID utilisateur");
      }
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
      throw error;
    }
  };

  // Fonction pour récupérer les événements
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("Token d'authentification manquant");
      }

      // Récupérer d'abord le profil utilisateur pour obtenir l'ID
      const userId = await fetchUserProfile();

      const response = await fetch("/api/events", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des événements");
      }

      const result = await response.json();

      if (result.success) {
        // Séparer les événements en "à venir" et "passés"
        const now = new Date();
        const upcomingEvents = [];
        const pastEvents = [];

        result.data.events.forEach((event) => {
          const eventDate = new Date(event.startDate);
          const isRegistered = event.participants?.includes(userId);

          if (eventDate >= now) {
            upcomingEvents.push({
              ...event,
              status: isRegistered ? "registered" : "available",
              type: getEventTypeFromData(event),
            });
          } else {
            pastEvents.push({
              ...event,
              status: "completed",
              type: getEventTypeFromData(event),
            });
          }
        });

        setEvents({
          upcoming: upcomingEvents,
          past: pastEvents,
        });
      } else {
        throw new Error(
          result.message || "Erreur lors du chargement des événements"
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError(error.message);
      // Données de démonstration en cas d'erreur
      setEvents({
        upcoming: [
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
          },
        ],
        past: [
          {
            _id: "3",
            title: "Webinaire Réglementation",
            startDate: "2024-05-12T10:00:00Z",
            location: "En ligne",
            type: "webinar",
            status: "completed",
            description:
              "Tout savoir sur les nouvelles réglementations cosmétiques en 2024.",
            isOnline: true,
            isMemberOnly: false,
            participants: [],
          },
        ],
      });
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
        return { text: status, color: "bg-gray-100 text-gray-800" };
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleRegister = async (eventId) => {
    try {
      setRegisteringEvent(eventId);

      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("Token d'authentification manquant");
      }

      // S'assurer que nous avons l'ID utilisateur
      let userId = currentUserId;
      if (!userId) {
        userId = await fetchUserProfile();
      }

      console.log("Inscription à l'événement:", eventId);
      console.log("User ID:", userId);
      console.log("Token:", authToken);

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
        setEvents((prev) => ({
          ...prev,
          upcoming: prev.upcoming.map((event) =>
            event._id === eventId
              ? {
                  ...event,
                  status: "registered",
                  participants: [...(event.participants || []), userId],
                }
              : event
          ),
        }));

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

  const handleViewDetails = (event) => {
    const isRegistered = isUserRegistered(event);
    const participantsCount = event.participants?.length || 0;
    const maxParticipants = event.maxParticipants || "Illimité";

    alert(
      `Détails de l'événement:\n\n` +
        `📌 ${event.title}\n\n` +
        `📝 ${event.description || "Aucune description"}\n\n` +
        `📅 Date: ${formatEventDate(event.startDate)}\n` +
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
          isRegistered
            ? "✅ Vous êtes inscrit à cet événement"
            : "❌ Vous n'êtes pas inscrit"
        }`
    );
  };

  // Vérifier si l'utilisateur est déjà inscrit à un événement
  const isUserRegistered = (event) => {
    if (!currentUserId) return false;
    return event.participants?.includes(currentUserId);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Événements</h1>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des événements...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Événements</h1>
          <p className="text-gray-600 mt-1">
            Découvrez tous nos événements et formations
          </p>
        </div>
        <button
          onClick={fetchEvents}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Actualiser</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex items-center">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`py-4 px-6 text-center font-medium text-sm ${
                activeTab === "upcoming"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              À venir ({events.upcoming.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`py-4 px-6 text-center font-medium text-sm ${
                activeTab === "past"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Passés ({events.past.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {events[activeTab].length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-gray-600 text-lg mb-2">
                Aucun événement {activeTab === "upcoming" ? "à venir" : "passé"}
              </p>
              <p className="text-gray-500 text-sm">
                {activeTab === "upcoming"
                  ? "Revenez plus tard pour découvrir nos prochains événements"
                  : "Aucun événement passé pour le moment"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events[activeTab].map((event) => {
                const isRegistered = isUserRegistered(event);
                const status = getEventStatus(
                  isRegistered ? "registered" : event.status
                );
                const isRegistering = registeringEvent === event._id;
                const participantsCount = event.participants?.length || 0;
                const maxParticipants = event.maxParticipants || "Illimité";

                return (
                  <div
                    key={event._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-2xl">
                        {getEventTypeIcon(event.type)}
                      </div>
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
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {event.description || "Description non disponible"}
                    </p>

                    {/* Informations sur les participants */}
                    <div className="flex items-center text-sm text-gray-500 mb-2">
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
                    </div>

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

                    {activeTab === "upcoming" && (
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
                            className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-sm flex items-center justify-center"
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
                          className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                        >
                          Détails
                        </button>
                      </div>
                    )}

                    {activeTab === "past" && (
                      <button
                        onClick={() => handleViewDetails(event)}
                        className="w-full py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                      >
                        Voir les détails
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
