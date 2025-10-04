'use client';

import { useState, useCallback } from 'react';

export default function EventCreationModal({ onClose, onEventCreated }) {
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
  
  const [eventLoading, setEventLoading] = useState(false);
  const [eventMessage, setEventMessage] = useState('');

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setEventForm(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setEventForm(prev => ({
        ...prev,
        [name]: value === '' ? '' : parseFloat(value)
      }));
    } else {
      setEventForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setEventLoading(true);
    setEventMessage('');

    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Token d\'authentification manquant. Veuillez vous reconnecter.');
      }

      if (!eventForm.title || !eventForm.description || !eventForm.startDate || !eventForm.endDate || !eventForm.location) {
        throw new Error('Veuillez remplir tous les champs obligatoires.');
      }

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

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(eventData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la création de l\'événement');
      }

      if (result.success) {
        setEventMessage('✅ Événement créé avec succès !');
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
        
        onEventCreated();
        
        setTimeout(() => {
          onClose();
          setEventMessage('');
        }, 2000);
      } else {
        throw new Error(result.message || 'Erreur lors de la création de l\'événement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setEventMessage(`❌ ${error.message}`);
    } finally {
      setEventLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-blue-800">Créer un nouvel événement</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          {eventMessage && (
            <div className={`p-4 rounded-md mb-6 ${
              eventMessage.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {eventMessage}
            </div>
          )}

          <form onSubmit={handleCreateEvent} className="space-y-6">
            {/* Titre et Lieu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre de l'événement *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={eventForm.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Congrès International de Cosmétologie 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lieu *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={eventForm.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Centre de Congrès de Paris"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                required
                value={eventForm.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description détaillée de l'événement..."
              />
            </div>

            {/* Dates de début et fin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début *
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  required
                  value={eventForm.startDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin *
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  required
                  value={eventForm.endDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Participants et date limite */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre maximum de participants
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  min="0"
                  value={eventForm.maxParticipants}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date limite d'inscription
                </label>
                <input
                  type="datetime-local"
                  name="registrationDeadline"
                  value={eventForm.registrationDeadline}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Prix membre et non-membre */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix membre (€)
                </label>
                <input
                  type="number"
                  name="memberPrice"
                  step="0.01"
                  min="0"
                  value={eventForm.memberPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix non-membre (€)
                </label>
                <input
                  type="number"
                  name="nonMemberPrice"
                  step="0.01"
                  min="0"
                  value={eventForm.nonMemberPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isOnline"
                  checked={eventForm.isOnline}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Événement en ligne</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isMemberOnly"
                  checked={eventForm.isMemberOnly}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Réservé aux membres</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="registrationRequired"
                  checked={eventForm.registrationRequired}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Inscription requise</label>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                disabled={eventLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={eventLoading}
                className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {eventLoading ? 'Création en cours...' : 'Créer l\'événement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}