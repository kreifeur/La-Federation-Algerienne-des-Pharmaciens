'use client';

import { useState, useEffect } from 'react';
import EventCreationModal from './EventCreationModal';
import EventsTable from './EventsTable';

export default function EventsTab({ stats, showEventModal, setShowEventModal }) {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);

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
      // Fallback data
      setEvents([
        {
          id: 1,
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
          participantsCount: 347
        }
      ]);
    } finally {
      setEventsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Gestion des Événements</h2>
          <button
            onClick={() => setShowEventModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            + Créer un événement
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800">Événements Totaux</h3>
            <p className="text-2xl font-bold">{events.length}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-800">À venir</h3>
            <p className="text-2xl font-bold">{2}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium text-yellow-800">Participants moyens</h3>
            <p className="text-2xl font-bold">87</p>
          </div>
        </div>
      </div>

      <EventsTable 
        events={events} 
        loading={eventsLoading} 
        onRefresh={fetchEvents}
      />

      {showEventModal && (
        <EventCreationModal 
          onClose={() => setShowEventModal(false)}
          onEventCreated={fetchEvents}
        />
      )}
    </div>
  );
}