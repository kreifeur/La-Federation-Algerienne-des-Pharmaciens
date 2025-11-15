'use client';

import { useState, useEffect } from 'react';
import EventCreationModal from './EventCreationModal';
import EventsTable from './EventsTable';

export default function EventsTab({ stats, showEventModal, setShowEventModal }) {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventMessage, setEventMessage] = useState('');

  // Charger les événements
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch('/api/events', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des événements');
      }

      const result = await response.json();
      
      if (result.success) {
        setEvents(result.data.events || []);
      } else {
        throw new Error(result.message || 'Erreur lors du chargement des événements');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setEventMessage(`❌ ${error.message}`);
      // Fallback data with image support
      setEvents([
        {
          _id: '1',
          title: 'Congrès International de Cosmétologie 2024',
          description: 'Le plus grand rassemblement de professionnels de la cosmétique',
          startDate: '2024-03-15T09:00:00Z',
          endDate: '2024-03-17T18:00:00Z',
          location: 'Centre de Congrès de Paris',
          isOnline: false,
          isMemberOnly: false,
          maxParticipants: 500,
          registrationRequired: true,
          registrationDeadline: '2024-03-10T23:59:00Z',
          memberPrice: 250,
          nonMemberPrice: 450,
          status: 'published',
          participantsCount: 347,
          imageUrl: '/images/event1.jpg',
          participants: []
        },
        {
          _id: '2',
          title: 'Atelier Formulation Naturelle',
          description: 'Apprenez à créer des produits cosmétiques naturels',
          startDate: '2024-04-10T14:00:00Z',
          endDate: '2024-04-10T17:00:00Z',
          location: 'Lyon',
          isOnline: false,
          isMemberOnly: true,
          maxParticipants: 30,
          registrationRequired: true,
          registrationDeadline: '2024-04-05T23:59:00Z',
          memberPrice: 50,
          nonMemberPrice: 80,
          status: 'published',
          participantsCount: 25,
          imageUrl: '/images/event2.jpg',
          participants: []
        }
      ]);
    } finally {
      setEventsLoading(false);
    }
  };

  const handleUpdateEvent = async (eventId, newImage = null) => {
    try {
      setEventMessage('');
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        throw new Error('Token d\'authentification manquant');
      }

      const eventToUpdate = events.find(event => event._id === eventId);
      if (!eventToUpdate) {
        throw new Error('Événement non trouvé');
      }

      const formData = new FormData();
      
      // Append all event fields
      Object.keys(eventToUpdate).forEach(key => {
        if (key !== '_id' && key !== 'imageUrl' && key !== 'participants' && key !== '__v') {
          const value = eventToUpdate[key];
          if (value !== null && value !== undefined) {
            formData.append(key, value.toString());
          }
        }
      });

      // Append new image if provided
      if (newImage) {
        formData.append('image', newImage);
      }

      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la mise à jour de l\'événement');
      }

      if (result.success) {
        setEventMessage('✅ Événement mis à jour avec succès !');
        fetchEvents(); // Refresh the events list
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setEventMessage('');
        }, 3000);
      } else {
        throw new Error(result.message || 'Erreur lors de la mise à jour de l\'événement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setEventMessage(`❌ ${error.message}`);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.')) {
      return;
    }

    try {
      setEventMessage('');
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la suppression de l\'événement');
      }

      if (result.success) {
        setEventMessage('✅ Événement supprimé avec succès !');
        fetchEvents(); // Refresh the events list
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setEventMessage('');
        }, 3000);
      } else {
        throw new Error(result.message || 'Erreur lors de la suppression de l\'événement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setEventMessage(`❌ ${error.message}`);
    }
  };

  const handleToggleEventStatus = async (eventId, currentStatus) => {
    try {
      setEventMessage('');
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        throw new Error('Token d\'authentification manquant');
      }

      const newStatus = currentStatus === 'published' ? 'draft' : 'published';

      const response = await fetch(`/api/events/${eventId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors du changement de statut');
      }

      if (result.success) {
        setEventMessage(`✅ Événement ${newStatus === 'published' ? 'publié' : 'désactivé'} avec succès !`);
        fetchEvents(); // Refresh the events list
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setEventMessage('');
        }, 3000);
      } else {
        throw new Error(result.message || 'Erreur lors du changement de statut');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setEventMessage(`❌ ${error.message}`);
    }
  };

  // Calculate statistics
  const upcomingEvents = events.filter(event => new Date(event.startDate) > new Date());
  const totalParticipants = events.reduce((sum, event) => sum + (event.participantsCount || 0), 0);
  const averageParticipants = events.length > 0 ? Math.round(totalParticipants / events.length) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Gestion des Événements</h2>
          <button
            onClick={() => setShowEventModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Créer un événement</span>
          </button>
        </div>

        {eventMessage && (
          <div
            className={`p-4 rounded-md mb-6 ${
              eventMessage.includes('✅')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            <div className="flex items-center">
              {eventMessage.includes('✅') ? (
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 text-sm">Événements Totaux</h3>
            <p className="text-2xl font-bold text-blue-600">{events.length}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-800 text-sm">À venir</h3>
            <p className="text-2xl font-bold text-green-600">{upcomingEvents.length}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-medium text-yellow-800 text-sm">Participants totaux</h3>
            <p className="text-2xl font-bold text-yellow-600">{totalParticipants}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-medium text-purple-800 text-sm">Moyenne participants</h3>
            <p className="text-2xl font-bold text-purple-600">{averageParticipants}</p>
          </div>
        </div>
      </div>

      <EventsTable 
        events={events} 
        loading={eventsLoading} 
        onRefresh={fetchEvents}
        onUpdateEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
        onToggleEventStatus={handleToggleEventStatus}
      />

      {showEventModal && (
        <EventCreationModal 
          onClose={() => setShowEventModal(false)}
          onEventCreated={() => {
            fetchEvents();
            setShowEventModal(false);
          }}
        />
      )}
    </div>
  );
}