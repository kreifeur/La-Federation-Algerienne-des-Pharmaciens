// components/Events.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const router = useRouter();

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/events");
        const data = await response.json();

        console.log("Events API Response:", data);

        if (data.success && data.data) {
          // Prendre seulement les 3 premiers événements pour l'affichage
          const upcomingEvents = data.data.events
            ? data.data.events.slice(0, 3)
            : [];
          setEvents(upcomingEvents);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Erreur lors du chargement des événements");
        // Fallback aux événements statiques en cas d'erreur
        setEvents([
          {
            id: 1,
            title: "Congrès Annuel de Cosmétologie",
            date: "2023-09-15",
            description:
              "Notre événement phare réunissant les experts du secteur pour échanger sur les dernières innovations.",
            image: "/placeholder-event1.jpg",
            type: "congress",
          },
          {
            id: 2,
            title: "Atelier : Cosmétiques naturels",
            date: "2023-10-05",
            description:
              "Formation pratique sur la formulation et la production de cosmétiques naturels et bio.",
            image: "/placeholder-event2.jpg",
            type: "workshop",
          },
          {
            id: 3,
            title: "Salon des Innovations Cosmétiques",
            date: "2023-11-20",
            description:
              "Découvrez les dernières innovations produits et technologies lors de ce salon professionnel.",
            image: "/placeholder-event3.jpg",
            type: "exhibition",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Date à confirmer";
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const getEventTypeLabel = (type) => {
    const types = {
      congress: "Congrès",
      workshop: "Atelier",
      training: "Formation",
      exhibition: "Salon",
      networking: "Networking",
      visit: "Visite",
    };
    return types[type] || "Événement";
  };

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

  const register = async (event, auth) => {
    console.log("from register");
    console.log(event);
    console.log(auth);
  };

  const openRegistrationModal = async (event) => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      router.push("/login");
    }

    const response = await fetch(`/api/events/${event._id}/register`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
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
              {events.map((event) => (
                <div
                  key={event.id || event._id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500">Image événement</span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-yellow-600 font-medium text-sm">
                        {formatDate(event.date)}
                      </span>
                      {event.type && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {getEventTypeLabel(event.type)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-blue-800">
                      {event.title}
                    </h3>
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    <div className="flex justify-between items-center">
                      {event.location && (
                        <span className="text-sm text-gray-600">
                          📍 {event.location}
                        </span>
                      )}
                      <div className="text-right">
                        {event.nonMemberPrice === 0 ? (
                          <span className="text-green-600 font-semibold">
                            Gratuit
                          </span>
                        ) : (
                          <>
                            <div className="text-gray-500 line-through text-sm">
                              {event.nonMemberPrice} DA
                            </div>
                            <div className="text-blue-800 font-semibold">
                              {event.memberPrice} DA membres
                            </div>
                          </>
                        )}
                      </div>
                    </div>

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
                  Votre inscription à <strong>{selectedEvent.title}</strong> a
                  été enregistrée avec succès. Un email de confirmation vous a
                  été envoyé.
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
                      {selectedEvent.price || 0}DA
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-blue-800">
                    <span>Membre de l'association :</span>
                    <span className="font-semibold">
                      {selectedEvent.memberPrice || 0}DA
                    </span>
                  </div>
                  <a
                    href="/membership"
                    className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                  >
                    Devenir membre pour bénéficier du tarif réduit
                  </a>
                </div>

                <form onSubmit={handleRegistrationSubmit} className="space-y-4">
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
    </section>
  );
};

export default Events;
