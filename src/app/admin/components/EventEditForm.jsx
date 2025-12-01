/* "use client";

import { useCallback, useState, useEffect } from "react";

export default function EventEditForm({
  event,
  eventForm,
  setEventForm,
  eventMessage,
  eventLoading,
  onCancel,
  onUpdate,
}) {
  const [imagePreview, setImagePreview] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);

  // Initialiser l'image preview quand l'événement change
  useEffect(() => {
    if (event?.imgUrl) {
      setImagePreview(event.imgUrl);
    } else {
      setImagePreview(null);
    }
  }, [event]);

  // Options pour les catégories
  useEffect(() => {
    setCategoryOptions([
      { value: "", label: "Sélectionner une catégorie" },
      { value: "Workshop", label: "Workshop" },
      { value: "Conference", label: "Conférence" },
      { value: "Seminar", label: "Séminaire" },
      { value: "Networking", label: "Networking" },
      { value: "Training", label: "Formation" },
      { value: "Social", label: "Événement Social" },
      { value: "congress", label: "Congrès" },
      { value: "exhibition", label: "Salon/Exposition" },
      { value: "visit", label: "Visite" },
      { value: "Other", label: "Autre" },
    ]);
  }, []);

  const handleInputChange = useCallback(
    (e) => {
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
    },
    [setEventForm]
  );

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("❌ L'image ne doit pas dépasser 5MB");
        return;
      }
      
      // Vérifier le type de fichier
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert("❌ Veuillez sélectionner un fichier image valide (JPG, PNG, GIF, WebP)");
        return;
      }
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      setNewImage(file);
    }
  }, []);

  const removeImage = useCallback(() => {
    setNewImage(null);
    setImagePreview(null);
    // Set a flag to indicate image should be removed
    setEventForm((prev) => ({
      ...prev,
      removeImage: true,
    }));
  }, [setEventForm]);

  const restoreOriginalImage = useCallback(() => {
    setNewImage(null);
    setImagePreview(event?.imgUrl || null);
    setEventForm((prev) => ({
      ...prev,
      removeImage: false,
    }));
  }, [event?.imgUrl, setEventForm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(event._id, newImage);
  };

  // Formater la date pour l'input datetime-local
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      // Ajouter le décalage timezone
      const timezoneOffset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - timezoneOffset);
      return localDate.toISOString().slice(0, 16);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border-2 border-blue-200 mt-4">
      <h4 className="text-lg font-semibold text-blue-800 mb-4">
        Modifier l'événement
      </h4>

      {eventMessage && (
        <div
          className={`p-3 rounded-md mb-4 ${
            eventMessage.includes("✅") || eventMessage.includes("succès")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {eventMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image de l'événement
          </label>
          
          {imagePreview ? (
            <div className="relative mb-3">
              <img
                src={imagePreview}
                alt="Aperçu de l'événement"
                className="w-full h-48 object-cover rounded-md border border-gray-300"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  type="button"
                  onClick={removeImage}
                  className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Supprimer l'image"
                  disabled={eventLoading}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {newImage && (
                  <button
                    type="button"
                    onClick={restoreOriginalImage}
                    className="bg-gray-500 text-white rounded-full p-1 hover:bg-gray-600 transition-colors"
                    title="Restaurer l'image originale"
                    disabled={eventLoading}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {newImage ? "Nouvelle image sélectionnée" : "Image actuelle"}
              </p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-gray-400 transition-colors">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-1 text-sm text-gray-600">
                Cliquez pour télécharger une image
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF, WebP jusqu'à 5MB
              </p>
            </div>
          )}
          
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
            className="hidden"
            id="event-edit-image-upload"
            disabled={eventLoading}
          />
          <label
            htmlFor="event-edit-image-upload"
            className={`block w-full mt-2 px-4 py-2 rounded-md text-center transition-colors cursor-pointer ${
              eventLoading
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            {imagePreview ? "Changer l'image" : "Choisir une image"}
          </label>
          
          {event?.imgUrl && !imagePreview && (
            <p className="text-xs text-orange-600 mt-1 text-center">
              ⚠️ L'image actuelle sera supprimée si vous n'en sélectionnez pas une nouvelle
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre *
            </label>
            <input
              type="text"
              name="title"
              required
              value={eventForm.title || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              placeholder="Titre de l'événement"
              disabled={eventLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie *
            </label>
            <select
              name="category"
              required
              value={eventForm.category || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              disabled={eventLoading}
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            required
            value={eventForm.description || ""}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            placeholder="Description de l'événement"
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
            value={eventForm.location || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            placeholder="Lieu de l'événement"
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
              value={formatDateForInput(eventForm.startDate) || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
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
              value={formatDateForInput(eventForm.endDate) || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
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
              value={eventForm.maxParticipants || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
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
              value={formatDateForInput(eventForm.registrationDeadline) || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
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
              value={eventForm.memberPrice || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
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
              value={eventForm.nonMemberPrice || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              placeholder="0.00"
              disabled={eventLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isOnline"
              checked={eventForm.isOnline || false}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
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
              checked={eventForm.isMemberOnly || false}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
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
              checked={eventForm.registrationRequired || false}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
              disabled={eventLoading}
            />
            <label className="ml-2 text-sm text-gray-700">
              Inscription requise
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
            disabled={eventLoading}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={eventLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {eventLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{eventLoading ? "Mise à jour..." : "Mettre à jour"}</span>
          </button>
        </div>
      </form>
    </div>
  );
} */