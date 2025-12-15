'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import GalleryItemModal from './GalleryItemModal';
import GalleryTable from './GalleryTable';

export default function GalleryTab({ stats, showGalleryModal, setShowGalleryModal }) {
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryMessage, setGalleryMessage] = useState({ type: '', text: '' });

  // Memoized mock data
  const mockGalleryItems = useMemo(() => [
    {
      _id: '1',
      title: 'Logo de l\'Association',
      description: 'Logo officiel de notre association',
      category: 'logos',
      imageUrl: '/images/logo.jpg',
      fileName: 'logo-association.jpg',
      fileSize: '250 KB',
      dimensions: '800x800',
      isFeatured: true,
      status: 'published',
      uploadDate: '2024-01-15T10:30:00Z',
      uploadedBy: 'Admin',
      tags: ['logo', 'officiel', 'association'],
      viewCount: 1245
    },
    {
      _id: '2',
      title: 'Événement de Lancement',
      description: 'Photos du dernier événement de lancement',
      category: 'events',
      imageUrl: '/images/event-launch.jpg',
      fileName: 'lancement-2024.jpg',
      fileSize: '1.2 MB',
      dimensions: '1920x1080',
      isFeatured: true,
      status: 'published',
      uploadDate: '2024-02-20T14:45:00Z',
      uploadedBy: 'Admin',
      tags: ['événement', 'lancement', 'réunion'],
      viewCount: 876
    },
    {
      _id: '3',
      title: 'Atelier de Formation',
      description: 'Session de formation pour les membres',
      category: 'workshops',
      imageUrl: '/images/workshop.jpg',
      fileName: 'atelier-formation.jpg',
      fileSize: '980 KB',
      dimensions: '1600x1200',
      isFeatured: false,
      status: 'published',
      uploadDate: '2024-02-28T09:15:00Z',
      uploadedBy: 'Modérateur',
      tags: ['formation', 'atelier', 'membres'],
      viewCount: 543
    },
    {
      _id: '4',
      title: 'Conférence Annuelle',
      description: 'Keynote speaker lors de la conférence',
      category: 'conferences',
      imageUrl: '/images/conference.jpg',
      fileName: 'conference-2024.jpg',
      fileSize: '1.5 MB',
      dimensions: '2048x1365',
      isFeatured: true,
      status: 'draft',
      uploadDate: '2024-03-05T16:20:00Z',
      uploadedBy: 'Admin',
      tags: ['conférence', 'keynote', 'annuelle'],
      viewCount: 321
    }
  ], []);

  // Load gallery items from localStorage or use mock data
  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Memoized statistics calculation
  const galleryStats = useMemo(() => {
    return {
      totalItems: galleryItems.length,
      publishedItems: galleryItems.filter(item => item.status === 'published').length,
      featuredItems: galleryItems.filter(item => item.isFeatured).length,
      totalViews: galleryItems.reduce((sum, item) => sum + (item.viewCount || 0), 0),
    };
  }, [galleryItems]);

  // Utility function to show messages
  const showMessage = useCallback((type, text, duration = 3000) => {
    setGalleryMessage({ type, text });
    if (duration > 0) {
      setTimeout(() => {
        setGalleryMessage({ type: '', text: '' });
      }, duration);
    }
  }, []);

  // Fetch gallery items - using localStorage for persistence
  const fetchGalleryItems = useCallback(async () => {
    setGalleryLoading(true);
    
    try {
      // Try to load from localStorage first
      const savedGalleryItems = localStorage.getItem('galleryItems');
      
      if (savedGalleryItems) {
        const parsedItems = JSON.parse(savedGalleryItems);
        setGalleryItems(parsedItems);
        if (parsedItems.length === 0) {
          showMessage('info', 'Aucun élément dans la galerie pour le moment');
        }
      } else {
        // Use mock data if nothing in localStorage
        setGalleryItems(mockGalleryItems);
        // Save mock data to localStorage for future use
        localStorage.setItem('galleryItems', JSON.stringify(mockGalleryItems));
        showMessage('warning', 'Données de démonstration chargées. Les modifications seront sauvegardées localement.');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la galerie:', error);
      setGalleryItems(mockGalleryItems);
      showMessage('error', 'Erreur lors du chargement. Données de démonstration utilisées.');
    } finally {
      setGalleryLoading(false);
    }
  }, [mockGalleryItems, showMessage]);

  // Save gallery items to localStorage
  const saveGalleryItems = useCallback((items) => {
    try {
      localStorage.setItem('galleryItems', JSON.stringify(items));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
      showMessage('error', 'Erreur lors de la sauvegarde des données');
    }
  }, [showMessage]);

  // Handle update gallery item
  const handleUpdateGalleryItem = useCallback(async (itemId, updates, newImage = null) => {
    const itemToUpdate = galleryItems.find(item => item._id === itemId);
    if (!itemToUpdate) {
      showMessage('error', 'Élément non trouvé');
      return;
    }

    // Store original data for rollback
    const originalItem = { ...itemToUpdate };
    
    // Optimistic update
    const updatedItems = galleryItems.map(item => 
      item._id === itemId 
        ? { 
            ...item, 
            ...updates, 
            ...(newImage ? {
              fileName: newImage.name,
              fileSize: `${(newImage.size / 1024).toFixed(0)} KB`,
              imageUrl: URL.createObjectURL(newImage),
              updatedAt: new Date().toISOString()
            } : {}),
            updatedAt: new Date().toISOString() 
          }
        : item
    );

    setGalleryItems(updatedItems);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Save to localStorage
      saveGalleryItems(updatedItems);
      
      showMessage('success', '✅ Élément mis à jour avec succès !');
    } catch (error) {
      // Rollback on error
      setGalleryItems(prev => 
        prev.map(item => item._id === itemId ? originalItem : item)
      );
      showMessage('error', '❌ Erreur lors de la mise à jour');
    }
  }, [galleryItems, saveGalleryItems, showMessage]);

  // Handle delete gallery item
  const handleDeleteGalleryItem = useCallback(async (itemId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.')) {
      return;
    }

    // Store item for rollback
    const itemToDelete = galleryItems.find(item => item._id === itemId);
    
    // Optimistic update
    const updatedItems = galleryItems.filter(item => item._id !== itemId);
    setGalleryItems(updatedItems);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Save to localStorage
      saveGalleryItems(updatedItems);
      
      showMessage('success', '✅ Élément supprimé avec succès !');
    } catch (error) {
      // Rollback on error
      if (itemToDelete) {
        setGalleryItems(prev => [...prev, itemToDelete].sort((a, b) => a._id.localeCompare(b._id)));
      }
      showMessage('error', '❌ Erreur lors de la suppression');
    }
  }, [galleryItems, saveGalleryItems, showMessage]);

  // Handle toggle gallery item status
  const handleToggleGalleryItemStatus = useCallback(async (itemId, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    // Optimistic update
    const updatedItems = galleryItems.map(item => 
      item._id === itemId 
        ? { ...item, status: newStatus, updatedAt: new Date().toISOString() }
        : item
    );

    setGalleryItems(updatedItems);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Save to localStorage
      saveGalleryItems(updatedItems);
      
      const actionText = newStatus === 'published' ? 'publié' : 'désactivé';
      showMessage('success', `✅ Élément ${actionText} avec succès !`);
    } catch (error) {
      // Rollback on error
      setGalleryItems(prev => 
        prev.map(item => 
          item._id === itemId 
            ? { ...item, status: currentStatus }
            : item
        )
      );
      showMessage('error', '❌ Erreur lors du changement de statut');
    }
  }, [galleryItems, saveGalleryItems, showMessage]);

  // Handle toggle featured status
  const handleToggleFeaturedStatus = useCallback(async (itemId, currentFeatured) => {
    const newFeaturedStatus = !currentFeatured;
    
    // Optimistic update
    const updatedItems = galleryItems.map(item => 
      item._id === itemId 
        ? { ...item, isFeatured: newFeaturedStatus, updatedAt: new Date().toISOString() }
        : item
    );

    setGalleryItems(updatedItems);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Save to localStorage
      saveGalleryItems(updatedItems);
      
      const actionText = newFeaturedStatus ? 'mis en vedette' : 'retiré des vedettes';
      showMessage('success', `✅ Élément ${actionText} avec succès !`);
    } catch (error) {
      // Rollback on error
      setGalleryItems(prev => 
        prev.map(item => 
          item._id === itemId 
            ? { ...item, isFeatured: currentFeatured }
            : item
        )
      );
      showMessage('error', '❌ Erreur lors du changement de statut vedette');
    }
  }, [galleryItems, saveGalleryItems, showMessage]);

  // Handle add new gallery item
  const handleAddGalleryItem = useCallback((newItem) => {
    const itemWithId = {
      ...newItem,
      _id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploadDate: new Date().toISOString(),
      viewCount: 0,
      updatedAt: new Date().toISOString()
    };

    const updatedItems = [...galleryItems, itemWithId];
    setGalleryItems(updatedItems);
    saveGalleryItems(updatedItems);
    showMessage('success', '✅ Nouvel élément ajouté avec succès !');
    fetchGalleryItems(); // Refresh the list
  }, [galleryItems, saveGalleryItems, showMessage, fetchGalleryItems]);

  // Render message based on type
  const renderMessage = () => {
    if (!galleryMessage.text) return null;

    const messageConfig = {
      success: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
      },
      error: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      warning: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        icon: (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.338 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        ),
      },
      info: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: (
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
    };

    const config = messageConfig[galleryMessage.type] || messageConfig.info;

    return (
      <div className={`p-4 rounded-md mb-6 ${config.bg} ${config.text} ${config.border}`}>
        <div className="flex items-center">
          {config.icon}
          <span>{galleryMessage.text}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Gestion de la Galerie</h2>
          <button
            onClick={() => setShowGalleryModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Ajouter un élément</span>
          </button>
        </div>

        {renderMessage()}
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 text-sm">Total des Éléments</h3>
            <p className="text-2xl font-bold text-blue-600">{galleryStats.totalItems}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-800 text-sm">Publiés</h3>
            <p className="text-2xl font-bold text-green-600">{galleryStats.publishedItems}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-medium text-yellow-800 text-sm">En Vedette</h3>
            <p className="text-2xl font-bold text-yellow-600">{galleryStats.featuredItems}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-medium text-purple-800 text-sm">Vues Totales</h3>
            <p className="text-2xl font-bold text-purple-600">{galleryStats.totalViews}</p>
          </div>
        </div>
      </div>

      <GalleryTable 
        galleryItems={galleryItems} 
        loading={galleryLoading} 
        onRefresh={fetchGalleryItems}
        onUpdateGalleryItem={handleUpdateGalleryItem}
        onDeleteGalleryItem={handleDeleteGalleryItem}
        onToggleGalleryItemStatus={handleToggleGalleryItemStatus}
        onToggleFeaturedStatus={handleToggleFeaturedStatus}
      />

      {showGalleryModal && (
        <GalleryItemModal 
          onClose={() => setShowGalleryModal(false)}
          onItemCreated={(newItem) => {
            handleAddGalleryItem(newItem);
            setShowGalleryModal(false);
          }}
        />
      )}
    </div>
  );
}