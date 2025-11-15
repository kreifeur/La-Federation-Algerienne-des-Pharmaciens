"use client";

import { useState, useCallback } from "react";
import EventEditForm from "./EventEditForm";

export default function EventsTable({ events, loading, onRefresh }) {
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventMessage, setEventMessage] = useState("");
  const [eventLoading, setEventLoading] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    isOnline: false,
    isMemberOnly: false,
    maxParticipants: "",
    registrationRequired: true,
    registrationDeadline: "",
    memberPrice: "",
    nonMemberPrice: "",
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (now < startDate) {
      return { status: "upcoming", label: "À venir", color: "bg-blue-100 text-blue-800" };
    } else if (now >= startDate && now <= endDate) {
      return { status: "ongoing", label: "En cours", color: "bg-green-100 text-green-800" };
    } else {
      return { status: "completed", label: "Terminé", color: "bg-gray-100 text-gray-800" };
    }
  };

  const handleEditEvent = useCallback((event) => {
    setEditingEvent(event._id);
    setEventForm({
      title: event.title,
      description: event.description,
      startDate: event.startDate ? event.startDate.slice(0, 16) : "",
      endDate: event.endDate ? event.endDate.slice(0, 16) : "",
      location: event.location,
      isOnline: event.isOnline,
      isMemberOnly: event.isMemberOnly,
      maxParticipants: event.maxParticipants || "",
      registrationRequired: event.registrationRequired,
      registrationDeadline: event.registrationDeadline
        ? event.registrationDeadline.slice(0, 16)
        : "",
      memberPrice: event.memberPrice || "",
      nonMemberPrice: event.nonMemberPrice || "",
    });
    setEventMessage("");
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingEvent(null);
    setEventForm({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      isOnline: false,
      isMemberOnly: false,
      maxParticipants: "",
      registrationRequired: true,
      registrationDeadline: "",
      memberPrice: "",
      nonMemberPrice: "",
    });
    setEventMessage("");
  }, []);

  const handleUpdateEvent = async (eventId) => {
    setEventLoading(true);
    setEventMessage("");

    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("Token d'authentification manquant");
      }

      // Validation des données
      if (
        !eventForm.title ||
        !eventForm.description ||
        !eventForm.startDate ||
        !eventForm.endDate ||
        !eventForm.location
      ) {
        throw new Error("Veuillez remplir tous les champs obligatoires.");
      }

      // Préparer les données pour l'API
      const eventData = {
        title: eventForm.title,
        description: eventForm.description,
        startDate: new Date(eventForm.startDate).toISOString(),
        endDate: new Date(eventForm.endDate).toISOString(),
        location: eventForm.location,
        isOnline: eventForm.isOnline,
        isMemberOnly: eventForm.isMemberOnly,
        maxParticipants: eventForm.maxParticipants
          ? parseInt(eventForm.maxParticipants)
          : 0,
        registrationRequired: eventForm.registrationRequired,
        registrationDeadline: eventForm.registrationDeadline
          ? new Date(eventForm.registrationDeadline).toISOString()
          : null,
        memberPrice: eventForm.memberPrice
          ? parseFloat(eventForm.memberPrice)
          : 0,
        nonMemberPrice: eventForm.nonMemberPrice
          ? parseFloat(eventForm.nonMemberPrice)
          : 0,
      };

      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Erreur lors de la mise à jour de l'événement"
        );
      }

      if (result.success) {
        setEventMessage("✅ Événement mis à jour avec succès !");
        onRefresh();
        setTimeout(() => {
          setEditingEvent(null);
          setEventMessage("");
        }, 2000);
      } else {
        throw new Error(
          result.message || "Erreur lors de la mise à jour de l'événement"
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      setEventMessage(`❌ ${error.message}`);
    } finally {
      setEventLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("Token d'authentification manquant");
      }

      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Erreur lors de la suppression de l'événement"
        );
      }

      if (result.success) {
        setEventMessage("✅ Événement supprimé avec succès !");
        onRefresh();
        setTimeout(() => setEventMessage(""), 2000);
      } else {
        throw new Error(
          result.message || "Erreur lors de la suppression de l'événement"
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      setEventMessage(`❌ ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Tous les Événements
          </h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des événements...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">
          Tous les Événements
        </h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Actualiser</span>
        </button>
      </div>

      <div className="p-6">
        {eventMessage && !editingEvent && (
          <div
            className={`p-4 rounded-md mb-4 ${
              eventMessage.includes("✅")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <div className="flex items-center">
              {eventMessage.includes("✅") ? (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span>{eventMessage}</span>
            </div>
          </div>
        )}

        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-600 text-lg mb-2">Aucun événement trouvé</p>
            <p className="text-gray-500 text-sm">
              Créez votre premier événement pour commencer
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Événement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lieu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => {
                  const eventStatus = getEventStatus(event);
                  return (
                    <tr key={event._id} className="hover:bg-gray-50">
                      {editingEvent === event._id ? (
                        <td colSpan="6">
                          <EventEditForm
                            event={event}
                            eventForm={eventForm}
                            setEventForm={setEventForm}
                            eventMessage={eventMessage}
                            eventLoading={eventLoading}
                            onCancel={handleCancelEdit}
                            onUpdate={handleUpdateEvent}
                          />
                        </td>
                      ) : (
                        <>
                          <td className="px-6 py-4">
                            <div className="flex items-start space-x-3">
                              {event.imageUrl && (
                                <img
                                  src={event.imageUrl}
                                  alt={event.title}
                                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {event.title}
                                </div>
                                <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                                  {event.description}
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {event.isOnline && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                      En ligne
                                    </span>
                                  )}
                                  {event.isMemberOnly && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                      Membres seulement
                                    </span>
                                  )}
                                  {!event.registrationRequired && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                      Libre d'accès
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="space-y-1">
                              <div className="font-medium">Début:</div>
                              <div>{formatDate(event.startDate)}</div>
                              <div className="font-medium mt-2">Fin:</div>
                              <div>{formatDate(event.endDate)}</div>
                              {event.registrationDeadline && (
                                <>
                                  <div className="font-medium mt-2">Inscription:</div>
                                  <div className="text-gray-500">
                                    {formatDate(event.registrationDeadline)}
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {event.location}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="space-y-1">
                              <div>
                                {event.participantsCount || 0} /{" "}
                                {event.maxParticipants || "∞"}
                              </div>
                              <div className="text-xs text-gray-500">
                                Membre: {event.memberPrice || 0}DA
                              </div>
                              <div className="text-xs text-gray-500">
                                Non-membre: {event.nonMemberPrice || 0}DA
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${eventStatus.color}`}>
                              {eventStatus.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex flex-col space-y-2">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditEvent(event)}
                                  className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  <span>Modifier</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(event._id)}
                                  className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  <span>Supprimer</span>
                                </button>
                              </div>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}