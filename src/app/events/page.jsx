"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Events() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

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

  // Fetch events from API - maintenant sans filtre dans l'URL
  useEffect(() => {
    fetchEvents();
  }, []); // Supprimé activeFilter des dépendances

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events");
      const data = await response.json();

      console.log("API Response:", data);

      if (data.success && data.data) {
        setEvents(data.data.events || []);
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

  // Handle event registration
  const handleEventRegistration = async (formData) => {
    try {
      setRegistrationLoading(true);
      const response = await fetch(
        `https://assback.vercel.app/api/events/${selectedEvent.id}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setRegistrationSuccess(true);
        fetchEvents();
      } else {
        alert("Erreur: " + data.message);
      }
    } catch (error) {
      alert("Erreur lors de l'inscription");
    } finally {
      setRegistrationLoading(false);
    }
  };

  // Filtrer les événements côté frontend
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const today = new Date();

    switch (activeFilter) {
      case "all":
        return true;
      case "upcoming":
        return eventDate > today;
      case "past":
        return eventDate < today;
      case "congress":
      case "workshop":
      case "training":
      case "exhibition":
      case "networking":
      case "visit":
        return event.type === activeFilter;
      default:
        return true;
    }
  });

  const openRegistrationModal = (event) => {
    setSelectedEvent(event);
    setShowRegistrationModal(true);
    setRegistrationSuccess(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date à confirmer";
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      company: e.target.company.value,
      isMember: e.target.membership.value,
      notes: e.target.notes?.value || "",
    };

    await handleEventRegistration(formData);
  };

  // Générer une clé unique pour chaque événement
  const getEventKey = (event, index) => {
    return event.id ? `event-${event.id}` : `event-${index}-${Date.now()}`;
  };

  return (
    <div>
      <Head>
        <title>Événements - Association de Cosmétologie</title>
        <meta
          name="description"
          content="Découvrez tous les événements organisés par l'Association de Cosmétologie : congrès, ateliers, formations et networking"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="min-h-screen bg-blue-50 py-12">
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
                key={`filter-${filter.key}`} // Clé unique pour chaque filtre
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-full transition-colors ${
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
              {filteredEvents.map((event, index) => (
                <div
                  key={getEventKey(event, index)} // Clé unique pour chaque événement
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  {/* Event image */}
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500">Image {event.title}</span>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-2">
                          {event.type === "congress" && "Congrès"}
                          {event.type === "workshop" && "Atelier"}
                          {event.type === "training" && "Formation"}
                          {event.type === "exhibition" && "Salon"}
                          {event.type === "networking" && "Networking"}
                          {event.type === "visit" && "Visite"}
                          {!event.type && "Événement"}
                        </span>
                        <h3 className="text-xl font-semibold text-blue-800 mb-1">
                          {event.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {formatDate(event.date)}
                        </div>
                        {event.endDate && (
                          <div className="text-sm text-gray-500">
                            au {formatDate(event.endDate)}
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{event.description}</p>

                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">📍</span>
                        {event.location || "Lieu à confirmer"}
                      </div>
                      <div className="text-right">
                        {event.nonMemberPrice === 0 ? (
                          <span className="text-green-600 font-semibold">
                            Gratuit
                          </span>
                        ) : (
                          <>
                            <div className="text-gray-500 line-through text-sm">
                              {event.nonMemberPrice} €
                            </div>
                            <div className="text-blue-800 font-semibold">
                              {event.memberPrice} € membres
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {event.maxAttendees && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Places disponibles:</span>
                          <span>
                            {event.maxAttendees - (event.currentAttendees || 0)}{" "}
                            / {event.maxAttendees}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${
                                ((event.currentAttendees || 0) /
                                  event.maxAttendees) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => openRegistrationModal(event)}
                        disabled={
                          event.status === "past" ||
                          (event.maxAttendees &&
                            (event.currentAttendees || 0) >= event.maxAttendees)
                        }
                        className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {event.status === "past"
                          ? "Voir le replay"
                          : event.maxAttendees &&
                            (event.currentAttendees || 0) >= event.maxAttendees
                          ? "Complet"
                          : "S'inscrire"}
                      </button>
                      <button className="px-4 py-2 border border-blue-800 text-blue-800 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium">
                        Détails
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal d'inscription */}
          {showRegistrationModal && selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                {registrationSuccess ? (
                  <div className="text-center">
                    <div className="text-green-500 text-4xl mb-4">✓</div>
                    <h3 className="text-xl font-semibold text-green-800 mb-4">
                      Inscription confirmée !
                    </h3>
                    <p className="text-gray-700 mb-6">
                      Votre inscription à <strong>{selectedEvent.title}</strong>{" "}
                      a été enregistrée avec succès. Un email de confirmation
                      vous a été envoyé.
                    </p>
                    <button
                      onClick={() => setShowRegistrationModal(false)}
                      className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700"
                    >
                      Fermer
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold text-blue-800 mb-4">
                      Inscription à {selectedEvent.title}
                    </h3>

                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Date et lieu :</h4>
                      <p className="text-gray-700">
                        {formatDate(selectedEvent.date)}{" "}
                        {selectedEvent.endDate &&
                          `au ${formatDate(selectedEvent.endDate)}`}
                      </p>
                      <p className="text-gray-700">
                        {selectedEvent.location || "Lieu à confirmer"}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium mb-2">Tarifs :</h4>
                      <div className="flex justify-between items-center mb-2">
                        <span>Non-membre :</span>
                        <span className="font-semibold">
                          {selectedEvent.price || 0}€
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-blue-800">
                        <span>Membre de l'association :</span>
                        <span className="font-semibold">
                          {selectedEvent.memberPrice || 0}€
                        </span>
                      </div>
                      <a
                        href="/membership"
                        className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                      >
                        Devenir membre pour bénéficier du tarif réduit
                      </a>
                    </div>

                    <form
                      onSubmit={handleRegistrationSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom complet *
                        </label>
                        <input
                          key={`name-${selectedEvent.id}`}
                          name="name"
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          key={`email-${selectedEvent.id}`}
                          name="email"
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Entreprise
                        </label>
                        <input
                          key={`company-${selectedEvent.id}`}
                          name="company"
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Êtes-vous membre ?
                        </label>
                        <select
                          key={`membership-${selectedEvent.id}`}
                          name="membership"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="no">Non, pas encore membre</option>
                          <option value="yes">Oui, je suis membre</option>
                        </select>
                      </div>

                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setShowRegistrationModal(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          disabled={registrationLoading}
                          className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                        >
                          {registrationLoading
                            ? "Inscription..."
                            : "Finaliser l'inscription"}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
