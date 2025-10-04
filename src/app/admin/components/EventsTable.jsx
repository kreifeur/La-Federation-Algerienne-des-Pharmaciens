'use client';

import { useState, useCallback } from 'react';
import EventEditForm from './EventEditForm';

export default function EventsTable({ events, loading, onRefresh }) {
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventMessage, setEventMessage] = useState('');
  const [eventLoading, setEventLoading] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    isOnline: false,
    isMemberOnly: false,
    maxParticipants: '',
    registrationRequired: true,
    registrationDeadline: '',
    memberPrice: '',
    nonMemberPrice: ''
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEditEvent = useCallback((event) => {
    setEditingEvent(event._id);
    setEventForm({
      title: event.title,
      description: event.description,
      startDate: event.startDate ? event.startDate.slice(0, 16) : '',
      endDate: event.endDate ? event.endDate.slice(0, 16) : '',
      location: event.location,
      isOnline: event.isOnline,
      isMemberOnly: event.isMemberOnly,
      maxParticipants: event.maxParticipants || '',
      registrationRequired: event.registrationRequired,
      registrationDeadline: event.registrationDeadline ? event.registrationDeadline.slice(0, 16) : '',
      memberPrice: event.memberPrice || '',
      nonMemberPrice: event.nonMemberPrice || ''
    });
    setEventMessage('');
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      location: '',
      isOnline: false,
      isMemberOnly: false,
      maxParticipants: '',
      registrationRequired: true,
      registrationDeadline: '',
      memberPrice: '',
      nonMemberPrice: ''
    });
    setEventMessage('');
  }, []);

  const handleUpdateEvent = async (eventId) => {
    setEventLoading(true);
    setEventMessage('');

    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Token d\'authentification manquant');
      }

      // Validation des données
      if (!eventForm.title || !eventForm.description || !eventForm.startDate || !eventForm.endDate || !eventForm.location) {
        throw new Error('Veuillez remplir tous les champs obligatoires.');
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
        maxParticipants: eventForm.maxParticipants ? parseInt(eventForm.maxParticipants) : 0,
        registrationRequired: eventForm.registrationRequired,
        registrationDeadline: eventForm.registrationDeadline 
          ? new Date(eventForm.registrationDeadline).toISOString()
          : null,
        memberPrice: eventForm.memberPrice ? parseFloat(eventForm.memberPrice) : 0,
        nonMemberPrice: eventForm.nonMemberPrice ? parseFloat(eventForm.nonMemberPrice) : 0
      };

      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(eventData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la mise à jour de l\'événement');
      }

      if (result.success) {
        setEventMessage('✅ Événement mis à jour avec succès !');
        onRefresh();
        setTimeout(() => {
          setEditingEvent(null);
          setEventMessage('');
        }, 2000);
      } else {
        throw new Error(result.message || 'Erreur lors de la mise à jour de l\'événement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setEventMessage(`❌ ${error.message}`);
    } finally {
      setEventLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la suppression de l\'événement');
      }

      if (result.success) {
        setEventMessage('✅ Événement supprimé avec succès !');
        onRefresh();
        setTimeout(() => setEventMessage(''), 2000);
      } else {
        throw new Error(result.message || 'Erreur lors de la suppression de l\'événement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setEventMessage(`❌ ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Tous les Événements</h2>
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
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Tous les Événements</h2>
      </div>
      
      <div className="p-6">
        {eventMessage && !editingEvent && (
          <div className={`p-4 rounded-md mb-4 ${
            eventMessage.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {eventMessage}
          </div>
        )}

        {events.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Aucun événement trouvé.</p>
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
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {event.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {event.description}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
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
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>Début: {formatDate(event.startDate)}</div>
                          <div>Fin: {formatDate(event.endDate)}</div>
                          {event.registrationDeadline && (
                            <div className="text-gray-500 text-xs">
                              Inscription: {formatDate(event.registrationDeadline)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {event.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{event.participantsCount || 0} / {event.maxParticipants || '∞'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>Membre: {event.memberPrice || 0}€</div>
                          <div>Non-membre: {event.nonMemberPrice || 0}€</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditEvent(event)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}