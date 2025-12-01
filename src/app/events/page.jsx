"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";

export default function Events() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const router = useRouter();

  // Filtres disponibles
  const filters = [
    { key: "all", label: "Tous les événements" },
    { key: "upcoming", label: "Événements à venir" },
    { key: "past", label: "Événements passés" },
    { key: "congress", label: "Congrès" },
    { key: "workshop", label: "Ateliers" },
    { key: "training", label: "Formations" },
    { key: "exhibition", label: "Salons" },
    { key: "networking", label: "Networking" },
    { key: "visit", label: "Visites" },
  ];

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

      if (result.success && result.data && (result.data.userId || result.data._id)) {
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

  // Fetch events from API
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      // Essayer de récupérer le profil utilisateur
      const userId = await fetchUserProfile();

      const response = await fetch("/api/events");
      const data = await response.json();

      if (data.success && data.data) {
        // CORRECTION: data.data peut être un tableau ou un objet avec une propriété events
        const eventsArray = Array.isArray(data.data) ? data.data : (data.data.events || []);
        
        // Ajouter le statut à chaque événement
        const eventsWithStatus = eventsArray.map(event => {
          // Vérifier si l'utilisateur est dans participants
          const isRegistered = userId ? 
            (event.participants?.some(p => 
              (typeof p === 'object' ? p.userId || p._id : p) === userId
            ) || false) : false;
          
          return {
            ...event,
            status: isRegistered ? "registered" : "available"
          };
        });
        
        setEvents(eventsWithStatus);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour vérifier si un événement est à venir
  const isUpcomingEvent = (event) => {
    if (!event.startDate) return false;
    try {
      const eventDate = new Date(event.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Ignorer l'heure pour comparer seulement les dates
      return eventDate >= today;
    } catch (error) {
      return false;
    }
  };

  // Fonction pour vérifier si un événement est passé
  const isPastEvent = (event) => {
    if (!event.startDate) return false;
    try {
      const eventDate = new Date(event.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate < today;
    } catch (error) {
      return false;
    }
  };

  // Filtrer les événements côté frontend
  const filteredEvents = events.filter((event) => {
    switch (activeFilter) {
      case "all":
        return true;
      case "upcoming":
        return isUpcomingEvent(event);
      case "past":
        return isPastEvent(event);
      case "congress":
      case "workshop":
      case "training":
      case "exhibition":
      case "networking":
      case "visit":
        // CORRECTION: Normaliser la catégorie pour la comparaison
        const eventCategory = (event.category || "").toLowerCase();
        const filterCategory = activeFilter.toLowerCase();
        return eventCategory.includes(filterCategory) || 
               filterCategory.includes(eventCategory);
      default:
        return true;
    }
  });

  const getEventStatus = (status) => {
    switch (status) {
      case "registered":
        return { text: "Inscrit", color: "bg-green-100 text-green-800" };
      case "available":
        return { text: "Disponible", color: "bg-blue-100 text-blue-800" };
      default:
        return { text: "Disponible", color: "bg-blue-100 text-blue-800" };
    }
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

      // S'assurer que nous avons l'ID utilisateur
      let userId = currentUserId;
      if (!userId) {
        userId = await fetchUserProfile();
      }

      if (!userId) {
        throw new Error("Impossible de récupérer l'ID utilisateur");
      }

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
        // Mettre à jour le statut de l'événement localement
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
        `📅 Date de début: ${formatDate(event.startDate)}\n` +
        (event.endDate ? `📅 Date de fin: ${formatDate(event.endDate)}\n` : '') +
        `⏰ Heure: ${formatTime(event.startDate)}\n` +
        `📍 Lieu: ${event.location || "Lieu à confirmer"}\n` +
        (event.isOnline ? `🌐 Événement en ligne\n` : '') +
        (event.isMemberOnly ? `🔒 Réservé aux membres seulement\n` : '') +
        `👥 Participants: ${participantsCount}/${maxParticipants}\n` +
        `💰 Prix membre: ${event.memberPrice || 0}DA\n` +
        `💰 Prix non-membre: ${event.nonMemberPrice || 0}DA\n` +
        `📋 Catégorie: ${formatCategory(event.category)}\n` +
        `${
          isConnected
            ? isRegistered
              ? "✅ Vous êtes inscrit à cet événement"
              : "❌ Vous n'êtes pas inscrit - Statut: Disponible"
            : "🔐 Connectez-vous pour vous inscrire - Statut: Disponible"
        }`
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date à confirmer";
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
    if (!dateString) return "Heure à confirmer";
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

  const formatCategory = (category) => {
    if (!category) return "Non spécifiée";
    const categoryMap = {
      'congress': 'Congrès',
      'workshop': 'Atelier',
      'training': 'Formation',
      'exhibition': 'Salon/Exposition',
      'networking': 'Networking',
      'visit': 'Visite',
      'Conference': 'Conférence',
      'Seminar': 'Séminaire',
      'Social': 'Événement Social',
      'Other': 'Autre'
    };
    return categoryMap[category] || category;
  };

  // Obtenir le texte du bouton en fonction du statut
  const getButtonText = (event) => {
    if (isPastEvent(event)) {
      return "Voir le replay";
    }
    if (event.status === "registered") {
      return "Inscrit";
    }
    if (event.maxParticipants && (event.participants?.length || 0) >= event.maxParticipants) {
      return "Complet";
    }
    return "S'inscrire";
  };

  // Vérifier si le bouton doit être désactivé
  const isButtonDisabled = (event) => {
    return isPastEvent(event) || 
           event.status === "registered" || 
           (event.maxParticipants && (event.participants?.length || 0) >= event.maxParticipants) ||
           registeringEvent === event._id ||
           (event.isMemberOnly && !currentUserId); // Ajout: vérifier si réservé aux membres
  };

  // Générer une clé unique pour chaque événement
  const getEventKey = (event, index) => {
    return event._id ? `event-${event._id}` : `event-${index}-${Date.now()}`;
  };

  // Fonction pour rafraîchir la liste des événements
  const refreshEvents = () => {
    fetchEvents();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Événements - La Fédération Algérienne des Pharmaciens</title>
        <meta
          name="description"
          content="Découvrez tous les événements organisés par l'Association de Cosmétologie : congrès, ateliers, formations et networking"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-blue-800 mb-4">
            Événements
          </h1>
          <p className="text-lg text-center text-gray-700 max-w-3xl mx-auto mb-12">
            Découvrez notre programme d'événements : congrès, ateliers
            pratiques, formations et sessions de networking, conçus pour tous
            les professionnels du secteur pharmaceutique.
          </p>

          {/* Filtres */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filters.map((filter) => (
              <button
                key={`filter-${filter.key}`}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-full transition-colors text-sm md:text-base ${
                  activeFilter === filter.key
                    ? "bg-blue-800 text-white"
                    : "bg-white text-blue-800 hover:bg-blue-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des événements...</p>
            </div>
          )}

          {/* Aucun événement */}
          {!loading && filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Aucun événement trouvé
              </h3>
              <p className="text-gray-600">
                {activeFilter === "all"
                  ? "Aucun événement n'est programmé pour le moment."
                  : `Aucun événement trouvé pour le filtre "${
                      filters.find((f) => f.key === activeFilter)?.label
                    }".`}
              </p>
            </div>
          )}

          {/* Liste des événements */}
          {!loading && filteredEvents.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {filteredEvents.map((event, index) => {
                const status = getEventStatus(event.status);
                const isRegistering = registeringEvent === event._id;
                const buttonText = getButtonText(event);
                const isDisabled = isButtonDisabled(event);
                const participantsCount = event.participants?.length || 0;
                const maxParticipants = event.maxParticipants || "Illimité";

                return (
                  <div
                    key={getEventKey(event, index)}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    {/* Event image */}
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      {event.imgUrl ? (
                        <img
                          src={event.imgUrl}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-500 flex flex-col items-center">
                          <span className="text-4xl mb-2">📅</span>
                          <span className="text-sm">Image non disponible</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {formatCategory(event.category)}
                            </span>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              {status.text}
                            </span>
                          </div>
                          <h3 className="text-xl font-semibold text-blue-800 mb-1 line-clamp-1">
                            {event.title}
                          </h3>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            {formatDate(event.startDate)}
                          </div>
                          {event.endDate && event.endDate !== event.startDate && (
                            <div className="text-sm text-gray-500">
                              au {formatDate(event.endDate)}
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">{event.description}</p>

                      {/* Badges pour événement spécial */}
                      <div className="flex gap-2 mb-4">
                        {event.isOnline && (
                          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                            🌐 En ligne
                          </span>
                        )}
                        {event.isMemberOnly && (
                          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                            🔒 Membres seulement
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📍</span>
                          <span className="truncate max-w-[150px]">
                            {event.location || "Lieu à confirmer"}
                          </span>
                        </div>
                        <div className="text-right">
                          {event.nonMemberPrice === 0 && event.memberPrice === 0 ? (
                            <span className="text-green-600 font-semibold">
                              Gratuit
                            </span>
                          ) : (
                            <>
                              <div className="text-blue-800 font-semibold">
                                {event.memberPrice || 0} DA 
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => isPastEvent(event) ? handleViewDetails(event) : handleRegister(event)}
                          disabled={isDisabled}
                          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center min-w-[120px] ${
                            isPastEvent(event)
                              ? "bg-gray-600 text-white hover:bg-gray-700"
                              : event.status === "registered"
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-blue-800 text-white hover:bg-blue-700"
                          } transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed`}
                        >
                          {isRegistering ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                              Inscription...
                            </>
                          ) : (
                            <>
                              {event.status === "registered" && (
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                              {buttonText}
                            </>
                          )}
                        </button>
                        <button 
                          onClick={() => handleViewDetails(event)}
                          className="px-4 py-2 border border-blue-800 text-blue-800 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium"
                        >
                          Détails
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bouton pour rafraîchir */}
          <div className="text-center">
            <button
              onClick={refreshEvents}
              className="px-6 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
            >
              🔄 Rafraîchir la liste
            </button>
          </div>
        </div>
      </main>

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

      <Footer />
    </div>
  );
}