'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const CATEGORIES = [
  { value: 'logos', label: 'Logos' },
  { value: 'events', label: 'Événements' },
  { value: 'workshops', label: 'Ateliers' },
  { value: 'conferences', label: 'Conférences' },
  { value: 'team', label: 'Équipe' },
  { value: 'projects', label: 'Projets' },
  { value: 'partners', label: 'Partenaires' },
  { value: 'other', label: 'Autre' },
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Brouillon' },
  { value: 'published', label: 'Publié' },
  { value: 'archived', label: 'Archivé' },
];

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default function GalleryItemModal({ 
  onClose, 
  onItemCreated,
  editingItem = null 
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'logos',
    tags: [],
    isFeatured: false,
    status: 'draft',
    file: null,
  });
  
  const [tagInput, setTagInput] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);
  const tagInputRef = useRef(null);
  const modalRef = useRef(null);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Focus trap for accessibility
  useEffect(() => {
    if (modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  }, []);

  // Reset form when modal opens
  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || '',
        description: editingItem.description || '',
        category: editingItem.category || 'logos',
        tags: editingItem.tags || [],
        isFeatured: editingItem.isFeatured || false,
        status: editingItem.status || 'draft',
        file: null,
      });
      setPreviewImage(editingItem.imageUrl || null);
    } else {
      // Reset form for new item
      resetForm();
    }
  }, [editingItem]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle drag and drop events
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  // Handle file validation and processing
  const handleFile = (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ 
        ...prev, 
        file: 'Format de fichier non supporté. Utilisez JPG, PNG, GIF, WebP ou SVG.' 
      }));
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setErrors(prev => ({ 
        ...prev, 
        file: `Le fichier est trop volumineux. Taille maximale: ${formatFileSize(maxSize)}.` 
      }));
      return;
    }

    setFormData(prev => ({ ...prev, file }));
    setErrors(prev => ({ ...prev, file: '' }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle file selection via input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  // Handle tag input
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    
    if (tag && !formData.tags.includes(tag)) {
      if (formData.tags.length >= 10) {
        setErrors(prev => ({ ...prev, tags: 'Maximum 10 tags autorisés' }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
      setErrors(prev => ({ ...prev, tags: '' }));
      
      // Focus back on tag input
      if (tagInputRef.current) {
        setTimeout(() => tagInputRef.current.focus(), 0);
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
    setErrors(prev => ({ ...prev, tags: '' }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Le titre ne peut pas dépasser 100 caractères';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    } else if (formData.description.length > 500) {
      newErrors.description = 'La description ne peut pas dépasser 500 caractères';
    }

    if (!editingItem && !formData.file) {
      newErrors.file = 'Une image est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get image dimensions if we have a file
      let dimensions = '800x600';
      if (formData.file) {
        const img = new Image();
        const url = URL.createObjectURL(formData.file);
        dimensions = await new Promise((resolve) => {
          img.onload = () => {
            resolve(`${img.width}x${img.height}`);
            URL.revokeObjectURL(url);
          };
          img.src = url;
        });
      } else if (editingItem?.dimensions) {
        dimensions = editingItem.dimensions;
      }

      // Prepare the gallery item data
      const galleryItem = {
        _id: editingItem?._id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        isFeatured: formData.isFeatured,
        status: formData.status,
        imageUrl: previewImage || editingItem?.imageUrl || '/images/placeholder.jpg',
        fileName: formData.file?.name || editingItem?.fileName || 'image.jpg',
        fileSize: formData.file 
          ? formatFileSize(formData.file.size)
          : editingItem?.fileSize || '0 KB',
        dimensions,
        uploadDate: editingItem?.uploadDate || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        uploadedBy: editingItem?.uploadedBy || 'Utilisateur',
        viewCount: editingItem?.viewCount || 0,
      };

      // Call the callback with the new item
      onItemCreated(galleryItem);

    } catch (error) {
      console.error('Erreur lors de la création de l\'élément:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: 'Une erreur est survenue. Veuillez réessayer.' 
      }));
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      category: 'logos',
      tags: [],
      isFeatured: false,
      status: 'draft',
      file: null,
    });
    setTagInput('');
    setPreviewImage(null);
    setErrors({});
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Prevent click on modal content from closing modal
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={handleModalClick}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 id="modal-title" className="text-xl font-semibold text-gray-800">
              {editingItem ? 'Modifier l\'élément' : 'Ajouter un nouvel élément'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-500 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Fermer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* General Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md" role="alert">
                <p className="text-red-700 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Titre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Titre de l'image"
                    maxLength={100}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.title ? (
                      <p className="text-sm text-red-600">{errors.title}</p>
                    ) : (
                      <div className="text-xs text-gray-500">
                        {formData.title.length}/100 caractères
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Description de l'image"
                    maxLength={500}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.description ? (
                      <p className="text-sm text-red-600">{errors.description}</p>
                    ) : (
                      <div className="text-xs text-gray-500">
                        {formData.description.length}/500 caractères
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tag-input" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags {formData.tags.length > 0 && `(${formData.tags.length}/10)`}
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                          aria-label={`Supprimer le tag ${tag}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  {errors.tags && (
                    <p className="mt-1 text-sm text-red-600">{errors.tags}</p>
                  )}
                  <div className="flex gap-2">
                    <input
                      ref={tagInputRef}
                      id="tag-input"
                      type="text"
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyDown={handleTagInputKeyDown}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ajouter un tag (pressez Entrée ou ,)"
                      maxLength={20}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!tagInput.trim()}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>

                {/* Status & Featured */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                      Statut
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {STATUS_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <label htmlFor="isFeatured" className="ml-3 text-sm font-medium text-gray-700">
                      Mettre en vedette
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CATEGORIES.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="space-y-4">
                    {/* File Input with Drag & Drop */}
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                        isDragging 
                          ? 'border-blue-400 bg-blue-50' 
                          : errors.file 
                            ? 'border-red-300' 
                            : 'border-gray-300 hover:border-blue-400'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                        id="file-upload"
                      />
                      <div className="space-y-3">
                        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          {isDragging ? (
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {isDragging ? 'Déposez l\'image ici' : 'Cliquez ou glissez-déposez pour télécharger'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG, GIF, WebP ou SVG (max. 10MB)
                          </p>
                        </div>
                      </div>
                    </div>

                    {errors.file && (
                      <p className="text-sm text-red-600">{errors.file}</p>
                    )}

                    {/* File Info */}
                    {formData.file && (
                      <div className="p-3 bg-blue-50 rounded-md">
                        <p className="text-sm font-medium text-blue-800">
                          Fichier sélectionné:
                        </p>
                        <p className="text-sm text-blue-700">
                          {formData.file.name} ({formatFileSize(formData.file.size)})
                        </p>
                      </div>
                    )}

                    {/* Preview */}
                    {(previewImage || editingItem?.imageUrl) && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Aperçu
                        </p>
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={previewImage || editingItem.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.src = '/images/placeholder.jpg';
                            }}
                          />
                          {editingItem && !previewImage && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10">
                              <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                                Image existante
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Specifications for editing */}
                {editingItem && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700">
                      Spécifications de l'image
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-gray-500">Taille fichier</p>
                        <p className="font-medium">{editingItem.fileSize}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-gray-500">Dimensions</p>
                        <p className="font-medium">{editingItem.dimensions}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-gray-500">Téléchargé le</p>
                        <p className="font-medium">
                          {new Date(editingItem.uploadDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-gray-500">Vues</p>
                        <p className="font-medium">{editingItem.viewCount?.toLocaleString() || 0}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>{editingItem ? 'Modification...' : 'Création...'}</span>
                  </>
                ) : (
                  <span>{editingItem ? 'Modifier l\'élément' : 'Ajouter l\'élément'}</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}