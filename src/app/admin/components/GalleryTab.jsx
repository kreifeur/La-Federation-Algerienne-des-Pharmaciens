'use client';

import { useState, useEffect } from 'react';
import GalleryItemModal from './GalleryItemModal';
import GalleryTable from './GalleryTable';

export default function GalleryTab({ stats, showGalleryModal, setShowGalleryModal }) {
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryMessage, setGalleryMessage] = useState('');

  // Charger les éléments de la galerie
  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    setGalleryLoading(true);
    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch('/api/gallery', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement de la galerie');
      }

      const result = await response.json();
      
      if (result.success) {
        setGalleryItems(result.data.galleryItems || []);
      } else {
        throw new Error(result.message || 'Erreur lors du chargement de la galerie');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setGalleryMessage(`❌ ${error.message}`);
      // Fallback data
      setGalleryItems([
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
      ]);
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleUpdateGalleryItem = async (itemId, updates, newImage = null) => {
    try {
      setGalleryMessage('');
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        throw new Error('Token d\'authentification manquant');
      }

      const itemToUpdate = galleryItems.find(item => item._id === itemId);
      if (!itemToUpdate) {
        throw new Error('Élément non trouvé');
      }

      const formData = new FormData();
      
      // Append all update fields
      Object.keys(updates).forEach(key => {
        if (key !== '_id' && key !== 'imageUrl' && key !== 'fileName' && key !== '__v') {
          const value = updates[key];
          if (value !== null && value !== undefined) {
            if (key === 'tags' && Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value.toString());
            }
          }
        }
      });

      // Append new image if provided
      if (newImage) {
        formData.append('image', newImage);
      }

      const response = await fetch(`/api/gallery/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la mise à jour de l\'élément');
      }

      if (result.success) {
        setGalleryMessage('✅ Élément mis à jour avec succès !');
        fetchGalleryItems(); // Refresh the gallery items list
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setGalleryMessage('');
        }, 3000);
      } else {
        throw new Error(result.message || 'Erreur lors de la mise à jour de l\'élément');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setGalleryMessage(`❌ ${error.message}`);
    }
  };

  const handleDeleteGalleryItem = async (itemId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.')) {
      return;
    }

    try {
      setGalleryMessage('');
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`/api/gallery/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la suppression de l\'élément');
      }

      if (result.success) {
        setGalleryMessage('✅ Élément supprimé avec succès !');
        fetchGalleryItems(); // Refresh the gallery items list
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setGalleryMessage('');
        }, 3000);
      } else {
        throw new Error(result.message || 'Erreur lors de la suppression de l\'élément');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setGalleryMessage(`❌ ${error.message}`);
    }
  };

  const handleToggleGalleryItemStatus = async (itemId, currentStatus) => {
    try {
      setGalleryMessage('');
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        throw new Error('Token d\'authentification manquant');
      }

      const newStatus = currentStatus === 'published' ? 'draft' : 'published';

      const response = await fetch(`/api/gallery/${itemId}/status`, {
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
        setGalleryMessage(`✅ Élément ${newStatus === 'published' ? 'publié' : 'désactivé'} avec succès !`);
        fetchGalleryItems(); // Refresh the gallery items list
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setGalleryMessage('');
        }, 3000);
      } else {
        throw new Error(result.message || 'Erreur lors du changement de statut');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setGalleryMessage(`❌ ${error.message}`);
    }
  };

  const handleToggleFeaturedStatus = async (itemId, currentFeatured) => {
    try {
      setGalleryMessage('');
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`/api/gallery/${itemId}/featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors du changement de statut vedette');
      }

      if (result.success) {
        setGalleryMessage(`✅ Élément ${!currentFeatured ? 'mis en vedette' : 'retiré des vedettes'} avec succès !`);
        fetchGalleryItems(); // Refresh the gallery items list
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setGalleryMessage('');
        }, 3000);
      } else {
        throw new Error(result.message || 'Erreur lors du changement de statut vedette');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setGalleryMessage(`❌ ${error.message}`);
    }
  };

  // Calculate statistics
  const totalItems = galleryItems.length;
  const publishedItems = galleryItems.filter(item => item.status === 'published').length;
  const featuredItems = galleryItems.filter(item => item.isFeatured).length;
  const totalViews = galleryItems.reduce((sum, item) => sum + (item.viewCount || 0), 0);

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

        {galleryMessage && (
          <div
            className={`p-4 rounded-md mb-6 ${
              galleryMessage.includes('✅')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            <div className="flex items-center">
              {galleryMessage.includes('✅') ? (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span>{galleryMessage}</span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 text-sm">Total des Éléments</h3>
            <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-800 text-sm">Publiés</h3>
            <p className="text-2xl font-bold text-green-600">{publishedItems}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-medium text-yellow-800 text-sm">En Vedette</h3>
            <p className="text-2xl font-bold text-yellow-600">{featuredItems}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-medium text-purple-800 text-sm">Vues Totales</h3>
            <p className="text-2xl font-bold text-purple-600">{totalViews}</p>
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
          onItemCreated={() => {
            fetchGalleryItems();
            setShowGalleryModal(false);
          }}
        />
      )}
    </div>
  );
}