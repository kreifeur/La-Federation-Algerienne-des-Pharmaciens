'use client';

import { useCallback } from 'react';

export default function EventEditForm({ 
  event, 
  eventForm, 
  setEventForm, 
  eventMessage, 
  eventLoading,
  onCancel, 
  onUpdate 
}) {
  
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
  }, [setEventForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(event.id);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border-2 border-blue-200 mt-4">
      <h4 className="text-lg font-semibold text-blue-800 mb-4">Modifier l'événement</h4>
      
      {eventMessage && (
        <div className={`p-3 rounded-md mb-4 ${
          eventMessage.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {eventMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
            <input
              type="text"
              name="title"
              required
              value={eventForm.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Titre de l'événement"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lieu *</label>
            <input
              type="text"
              name="location"
              required
              value={eventForm.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Lieu de l'événement"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            name="description"
            required
            value={eventForm.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description de l'événement"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin *</label>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
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

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            disabled={eventLoading}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={eventLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {eventLoading ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
        </div>
      </form>
    </div>
  );
}