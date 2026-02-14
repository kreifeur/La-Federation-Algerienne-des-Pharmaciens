"use client";

import { useState, useCallback, useEffect } from "react";

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
    category: "", // This will store category ID for the select
  });

  const [eventLoading, setEventLoading] = useState(false);
  const [eventMessage, setEventMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Category states
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: ""
  });
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showCategoriesList, setShowCategoriesList] = useState(false); // New state to show/hide categories list

  // Configuration Cloudinary
  const CLOUDINARY_CLOUD_NAME = "dlr034bds";
  const CLOUDINARY_UPLOAD_PRESET = "FAPKREIFEUR";

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch("/api/categories");
      
      if (response.ok) {
        const result = await response.json();
        
        // Extract categories from nested structure
        if (result.success && result.data && result.data.categories) {
          setCategories(result.data.categories);
        } else if (result.categories) {
          // Alternative structure
          setCategories(result.categories);
        } else if (Array.isArray(result)) {
          // If response is directly an array
          setCategories(result);
        } else {
          setCategories([]);
        }
      } else {
        setCategories([]);
      }
    } catch (error) {
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

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

  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to delete a category
  const handleDeleteCategory = async (categoryId) => {
    try {
      setDeletingCategoryId(categoryId);
      const authToken = localStorage.getItem("authToken");
      
      if (!authToken) {
        throw new Error("Token d'authentification manquant.");
      }

      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la suppression de la catégorie");
      }

      // Refresh categories list
      await fetchCategories();
      
      // If the deleted category was selected in the form, clear the selection
      if (eventForm.category === categoryId) {
        setEventForm(prev => ({
          ...prev,
          category: ""
        }));
      }
      
      setEventMessage("✅ Catégorie supprimée avec succès !");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setEventMessage("");
      }, 3000);
      
    } catch (error) {
      setEventMessage(`❌ ${error.message}`);
    } finally {
      setDeletingCategoryId(null);
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
    }
  };

  // Function to confirm category deletion
  const confirmDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  // Function to cancel category deletion
  const cancelDeleteCategory = () => {
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);
  };

  // Toggle categories list visibility
  const toggleCategoriesList = () => {
    setShowCategoriesList(!showCategoriesList);
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      setEventMessage("❌ Veuillez entrer un nom pour la catégorie");
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        throw new Error("Token d'authentification manquant.");
      }

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: newCategory.name,
          description: "description category"
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la création de la catégorie");
      }

      // Refresh categories list
      await fetchCategories();
      
      // Set the new category as selected - store the CATEGORY NAME
      let newCategoryName = "";
      if (result.data && result.data.category) {
        newCategoryName = result.data.category.name;
      } else if (result.category) {
        newCategoryName = result.category.name;
      } else if (result.name) {
        newCategoryName = result.name;
      } else {
        newCategoryName = newCategory.name;
      }

      // Find the category ID for the newly created category
      const createdCategory = categories.find(cat => cat.name === newCategoryName) || 
                              categories.find(cat => cat._id === (result.data?.category?._id || result.category?._id));
      
      if (createdCategory) {
        setEventForm(prev => ({
          ...prev,
          category: createdCategory._id // Store ID for the select
        }));
      } else {
        // If we can't find it, just store the name as a fallback
        setEventForm(prev => ({
          ...prev,
          category: newCategoryName
        }));
      }
      
      // Reset new category form
      setNewCategory({
        name: "",
      });
      setShowAddCategory(false);
      
      setEventMessage("✅ Catégorie créée avec succès !");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setEventMessage("");
      }, 3000);
      
    } catch (error) {
      setEventMessage(`❌ ${error.message}`);
    }
  };

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setEventMessage("❌ L'image ne doit pas dépasser 5MB");
        return;
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setEventMessage("❌ Veuillez sélectionner un fichier image valide (JPG, PNG, GIF, WebP)");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      setSelectedImage(file);
      setEventMessage("");
    }
  }, []);

  const removeImage = useCallback(() => {
    setSelectedImage(null);
    setImagePreview(null);
  }, []);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);
    
    setUploadProgress(30);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    
    setUploadProgress(70);
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || "Erreur lors de l'upload de l'image");
    }
    
    setUploadProgress(100);
    return result.secure_url;
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setEventLoading(true);
    setEventMessage("");
    setUploadProgress(0);

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
        !eventForm.location ||
        !eventForm.category
      ) {
        throw new Error("Veuillez remplir tous les champs obligatoires (*).");
      }

      // Validation des dates
      const startDate = new Date(eventForm.startDate);
      const endDate = new Date(eventForm.endDate);
      if (startDate >= endDate) {
        throw new Error("La date de fin doit être postérieure à la date de début.");
      }

      let imgUrl = null;
      
      // Uploader l'image vers Cloudinary si elle existe
      if (selectedImage) {
        try {
          setEventMessage("Upload de l'image ...");
          imgUrl = await uploadImageToCloudinary(selectedImage);
          setEventMessage("✅ Image uploadée avec succè !");
        } catch (uploadError) {
          throw new Error("Échec de l'upload de l'image: " + uploadError.message);
        }
      }

      // Préparer les données pour l'API au format JSON
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
        imgUrl: imgUrl,
      };

      // Ajouter la date limite d'inscription si elle est définie
      if (eventForm.registrationDeadline) {
        eventData.registrationDeadline = new Date(eventForm.registrationDeadline).toISOString();
      }

      // Handle category field - FIND CATEGORY NAME FROM ID
      let categoryName = "";
      
      // Try to find the category in our categories list
      const selectedCategory = categories.find(cat => 
        cat._id === eventForm.category || 
        cat.id === eventForm.category
      );
      
      if (selectedCategory) {
        // If we found the category object, use its name
        categoryName = selectedCategory.name;
      } else {
        // If eventForm.category is already a category name (fallback case)
        categoryName = eventForm.category;
      }
      
      // Add category name to event data
      eventData.category = categoryName;

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();

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
          category: "",
        });
        setSelectedImage(null);
        setImagePreview(null);
        setUploadProgress(0);

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
      setEventMessage(`❌ ${error.message}`);
    } finally {
      setEventLoading(false);
      setUploadProgress(0);
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
                eventMessage.includes("✅") || eventMessage.includes("📤")
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : eventMessage.includes("❌")
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{eventMessage}</span>
                {uploadProgress > 0 && (
                  <span className="text-sm font-medium">{uploadProgress}%</span>
                )}
              </div>
              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleCreateEvent} className="space-y-6">
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
                    disabled={eventLoading}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-blue-400 transition-colors">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-1 text-sm text-gray-600">
                    Cliquez pour télécharger une image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, GIF, WebP jusqu'à 5MB
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                className="hidden"
                id="event-image-upload"
                disabled={eventLoading}
              />
              <label
                htmlFor="event-image-upload"
                className={`block w-full mt-2 px-4 py-2 rounded-md text-center transition-colors ${
                  eventLoading
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
                }`}
              >
                {eventLoading ? "Chargement..." : "Télécharger une image"}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  placeholder="Congrès International de Cosmétologie 2024"
                  disabled={eventLoading}
                />
              </div>
              
              {/* Category Section */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Catégorie *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(!showAddCategory)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                    disabled={eventLoading}
                  >
                    {showAddCategory ? "← Retour" : "+ Ajouter une catégorie"}
                  </button>
                </div>
                
                {!showAddCategory ? (
                  <div>
                    <select
                      name="category"
                      required
                      value={eventForm.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                      disabled={eventLoading || loadingCategories}
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {loadingCategories ? (
                        <option value="" disabled>Chargement des catégories...</option>
                      ) : categories.length === 0 ? (
                        <option value="" disabled>Aucune catégorie disponible</option>
                      ) : (
                        categories.map((category) => (
                          <option key={category._id || category.id} value={category._id || category.id}>
                            {category.name}
                          </option>
                        ))
                      )}
                    </select>
                    
                    {/* Show/Hide categories button */}
                    {!loadingCategories && categories.length > 0 && (
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={toggleCategoriesList}
                          className="flex items-center text-sm text-gray-600 hover:text-blue-800"
                        >
                          <svg 
                            className={`w-4 h-4 mr-1 transition-transform ${showCategoriesList ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          {showCategoriesList ? "Masquer les catégories" : "Gérer les catégories"}
                        </button>
                        
                        {/* Categories list with delete buttons (hidden by default) */}
                        {showCategoriesList && (
                          <div className="mt-2 border border-gray-200 rounded-md p-3 bg-gray-50">
                            <div className="text-sm font-medium text-gray-700 mb-2">
                              Liste des catégories ({categories.length})
                            </div>
                            <div className="max-h-40 overflow-y-auto">
                              {categories.map((category) => (
                                <div 
                                  key={category._id || category.id} 
                                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded"
                                >
                                  <div className="flex items-center">
                                    <span className={`text-sm ${eventForm.category === category._id ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                                      {category.name}
                                      {eventForm.category === category._id && " (sélectionnée)"}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => confirmDeleteCategory(category)}
                                    disabled={deletingCategoryId === category._id || eventLoading}
                                    className="text-red-500 hover:text-red-700 text-sm p-1"
                                    title="Supprimer cette catégorie"
                                  >
                                    {deletingCategoryId === category._id ? (
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500"></div>
                                    ) : (
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    )}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 border border-gray-300 rounded-md p-3 bg-gray-50">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom de la catégorie *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newCategory.name}
                        onChange={handleNewCategoryChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nom de la nouvelle catégorie"
                        disabled={eventLoading}
                      />
                    </div>
                  
                    <button
                      type="button"
                      onClick={handleCreateCategory}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={eventLoading || !newCategory.name.trim()}
                    >
                      Créer la catégorie
                    </button>
                  </div>
                )}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                placeholder="Description détaillée de l'événement..."
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                placeholder="Centre de Congrès de Paris"
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
                  value={eventForm.endDate}
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
                  value={eventForm.maxParticipants}
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
                  value={eventForm.registrationDeadline}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  disabled={eventLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix (DA)
                </label>
                <input
                  type="number"
                  name="memberPrice"
                  step="0.01"
                  min="0"
                  value={eventForm.memberPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  placeholder="0.00"
                  disabled={eventLoading}
                />
              </div>
             {/*  <div>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  placeholder="0.00"
                  disabled={eventLoading}
                />
              </div> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/*  <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isOnline"
                  checked={eventForm.isOnline}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  disabled={eventLoading}
                />
                <label className="ml-2 text-sm text-gray-700">
                  Événement en ligne
                </label>
              </div> */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isMemberOnly"
                  checked={eventForm.isMemberOnly}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  disabled={eventLoading}
                />
                <label className="ml-2 text-sm text-gray-700">
                  Réservé aux membres
                </label>
              </div>
              {/* <div className="flex items-center">
                <input
                  type="checkbox"
                  name="registrationRequired"
                  checked={eventForm.registrationRequired}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                  disabled={eventLoading}
                />
                <label className="ml-2 text-sm text-gray-700">
                  Inscription requise
                </label>
              </div> */}
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Confirmer la suppression
              </h3>
              <p className="text-gray-700 mb-4">
                Êtes-vous sûr de vouloir supprimer la catégorie{" "}
                <strong>{categoryToDelete.name}</strong> ?
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Cette action est irréversible. Les événements utilisant cette catégorie pourront être affectés.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={cancelDeleteCategory}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                  disabled={deletingCategoryId === categoryToDelete._id}
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDeleteCategory(categoryToDelete._id)}
                  disabled={deletingCategoryId === categoryToDelete._id}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:bg-red-400 flex items-center"
                >
                  {deletingCategoryId === categoryToDelete._id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Suppression...
                    </>
                  ) : (
                    "Supprimer"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}