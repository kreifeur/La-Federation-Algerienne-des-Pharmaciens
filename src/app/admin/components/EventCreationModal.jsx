"use client";

import { useState, useCallback } from "react";

export default function EventCreationModal({ onClose, onEventCreated }) {
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
    image: null,
  });

  const [eventLoading, setEventLoading] = useState(false);
  const [eventMessage, setEventMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setEventForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "number") {
      setEventForm((prev) => ({
        ...prev,
        [name]: value === "" ? "" : parseFloat(value),
      }));
    } else {
      setEventForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (max 1MB for Firestore)
      if (file.size > 1 * 1024 * 1024) {
        setEventMessage("❌ L'image ne doit pas dépasser 1MB pour le stockage Firestore");
        return;
      }
      
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        setEventMessage("❌ Veuillez sélectionner un fichier image valide (JPG, PNG, GIF)");
        return;
      }
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      setEventForm((prev) => ({
        ...prev,
        image: file,
      }));
      setEventMessage(""); // Clear any previous error messages
    }
  }, []);

  const removeImage = useCallback(() => {
    setEventForm((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setEventLoading(true);
    setEventMessage("");

    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        throw new Error(
          "Token d'authentification manquant. Veuillez vous reconnecter."
        );
      }

      // Validation des champs obligatoires
      if (
        !eventForm.title ||
        !eventForm.description ||
        !eventForm.startDate ||
        !eventForm.endDate ||
        !eventForm.location
      ) {
        throw new Error("Veuillez remplir tous les champs obligatoires.");
      }

      // Validation des dates
      const startDate = new Date(eventForm.startDate);
      const endDate = new Date(eventForm.endDate);
      
      if (startDate >= endDate) {
        throw new Error("La date de fin doit être postérieure à la date de début.");
      }

      // Préparer les données pour l'API
      const eventData = {
        title: eventForm.title,
        description: eventForm.description,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        location: eventForm.location,
        isOnline: eventForm.isOnline,
        isMemberOnly: eventForm.isMemberOnly,
        maxParticipants: eventForm.maxParticipants ? parseInt(eventForm.maxParticipants) : 0,
        registrationRequired: eventForm.registrationRequired,
        memberPrice: eventForm.memberPrice ? parseFloat(eventForm.memberPrice) : 0,
        nonMemberPrice: eventForm.nonMemberPrice ? parseFloat(eventForm.nonMemberPrice) : 0,
      };

      // Ajouter la date limite d'inscription si elle est définie
      if (eventForm.registrationDeadline) {
        eventData.registrationDeadline = new Date(eventForm.registrationDeadline).toISOString();
      }

      console.log("Données envoyées à l'API:", eventData);

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();

      console.log("Réponse de l'API:", result);

      if (!response.ok) {
        throw new Error(
          result.message || `Erreur ${response.status} lors de la création de l'événement`
        );
      }

      if (result.success) {
        setEventMessage("✅ Événement créé avec succès !");
        
        // Reset form
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
          image: null,
        });
        setImagePreview(null);

        // Appeler le callback pour rafraîchir la liste des événements
        if (onEventCreated) {
          onEventCreated();
        }

        // Fermer le modal après 2 secondes
        setTimeout(() => {
          onClose();
          setEventMessage("");
        }, 2000);
      } else {
        throw new Error(
          result.message || "Erreur lors de la création de l'événement"
        );
      }
    } catch (error) {
      console.error("Erreur détaillée:", error);
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
            <h3 className="text-xl font-semibold text-blue-800">
              Créer un nouvel événement
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
              disabled={eventLoading}
            >
              ✕
            </button>
          </div>

          {eventMessage && (
            <div
              className={`p-4 rounded-md mb-6 ${
                eventMessage.includes("✅")
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {eventMessage}
            </div>
          )}

          <form onSubmit={handleCreateEvent} className="space-y-6">
            {/* Image Upload - Temporairement désactivé */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image de l'événement (Optionnel)
              </label>
              
              {imagePreview ? (
                <div className="relative mb-3">
                  <img
                    src={imagePreview}
                    alt="Aperçu de l'événement"
                    className="w-full h-48 object-cover rounded-md border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-1 text-sm text-gray-600">
                    Fonctionnalité image bientôt disponible
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    L'upload d'image sera ajouté dans une prochaine mise à jour
                  </p>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="event-image-upload"
                disabled
              />
              <label
                htmlFor="event-image-upload"
                className="block w-full mt-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-md cursor-not-allowed text-center transition-colors"
              >
                Upload d'image temporairement désactivé
              </label>
            </div>

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
                  disabled={eventLoading}
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
                  disabled={eventLoading}
                />
              </div>
            </div>

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
                disabled={eventLoading}
              />
            </div>

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
                  disabled={eventLoading}
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
                  disabled={eventLoading}
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
                  placeholder="0 pour illimité"
                  disabled={eventLoading}
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
                  disabled={eventLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix membre (DA)
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
                  disabled={eventLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix non-membre (DA)
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
                  disabled={eventLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isOnline"
                  checked={eventForm.isOnline}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={eventLoading}
                />
                <label className="ml-2 text-sm text-gray-700">
                  Événement en ligne
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isMemberOnly"
                  checked={eventForm.isMemberOnly}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={eventLoading}
                />
                <label className="ml-2 text-sm text-gray-700">
                  Réservé aux membres
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="registrationRequired"
                  checked={eventForm.registrationRequired}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={eventLoading}
                />
                <label className="ml-2 text-sm text-gray-700">
                  Inscription requise
                </label>
              </div>
            </div>

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
                className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {eventLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{eventLoading ? "Création en cours..." : "Créer l'événement"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}