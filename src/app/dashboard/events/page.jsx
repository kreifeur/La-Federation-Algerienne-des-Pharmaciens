// app/dashboard/events/page.jsx
'use client';

import { useState } from 'react';

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const events = {
    upcoming: [
      {
        id: 1,
        title: "Congrès Annuel de Cosmétologie",
        date: "2023-09-15",
        location: "Paris, France",
        type: "congress",
        status: "registered",
        description: "Le plus grand rassemblement de professionnels de la cosmétologie en France."
      },
      {
        id: 2,
        title: "Atelier Formulation Naturelle",
        date: "2023-10-05",
        location: "Lyon, France",
        type: "workshop",
        status: "pending",
        description: "Apprenez à formuler des produits cosmétiques avec des ingrédients naturels."
      }
    ],
    past: [
      {
        id: 3,
        title: "Webinaire Réglementation",
        date: "2023-05-12",
        location: "En ligne",
        type: "webinar",
        status: "completed",
        description: "Tout savoir sur les nouvelles réglementations cosmétiques en 2023."
      }
    ]
  };

  const getEventStatus = (status) => {
    switch (status) {
      case 'registered': return { text: 'Inscrit', color: 'bg-green-100 text-green-800' };
      case 'pending': return { text: 'En attente', color: 'bg-yellow-100 text-yellow-800' };
      case 'completed': return { text: 'Terminé', color: 'bg-gray-100 text-gray-800' };
      default: return { text: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'congress': return '🎤';
      case 'workshop': return '🔬';
      case 'webinar': return '💻';
      default: return '📅';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Événements</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Voir tous les événements
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-4 px-6 text-center font-medium text-sm ${
                activeTab === 'upcoming'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              À venir
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`py-4 px-6 text-center font-medium text-sm ${
                activeTab === 'past'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Passés
            </button>
          </nav>
        </div>

        <div className="p-6">
          {events[activeTab].length === 0 ? (
            <p className="text-gray-600 text-center py-8">Aucun événement {activeTab === 'upcoming' ? 'à venir' : 'passé'}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events[activeTab].map((event) => {
                const status = getEventStatus(event.status);
                return (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-2xl">{getEventTypeIcon(event.type)}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                    {activeTab === 'upcoming' && event.status === 'registered' && (
                      <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
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