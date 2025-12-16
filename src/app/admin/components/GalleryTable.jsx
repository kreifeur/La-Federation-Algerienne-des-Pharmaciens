'use client';

import { useState } from 'react';

export default function GalleryTable({ 
  galleryItems, 
  loading, 
  onRefresh, 
  onUpdateGalleryItem, 
  onDeleteGalleryItem,
  onToggleGalleryItemStatus,
  onToggleFeaturedStatus
}) {
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState('desc');

  const categories = [
    'all',
    'logos',
    'events',
    'workshops',
    'conferences',
    'members',
    'projects',
    'other'
  ];

  const getCategoryLabel = (category) => {
    const labels = {
      logos: 'Logos',
      events: 'Événements',
      workshops: 'Ateliers',
      conferences: 'Conférences',
      members: 'Membres',
      projects: 'Projets',
      other: 'Autre',
      all: 'Toutes'
    };
    return labels[category] || category;
  };

  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Brouillon',
      published: 'Publié',
      all: 'Tous'
    };
    return labels[status] || status;
  };

  const handleEditClick = (item) => {
    setEditingItem(item._id);
    setEditFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      tags: [...item.tags]
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setEditFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleSaveEdit = async (itemId) => {
    await onUpdateGalleryItem(itemId, editFormData);
    setEditingItem(null);
    setEditFormData({});
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditFormData({});
  };

  const handleImageUpdate = async (itemId, e) => {
    const file = e.target.files[0];
    if (file) {
      await onUpdateGalleryItem(itemId, {}, file);
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Filter and sort gallery items
  const filteredAndSortedItems = galleryItems
    .filter(item => {
      // Filter by category
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      
      // Filter by status
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle dates
      if (sortBy === 'uploadDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      // Handle numbers
      if (sortBy === 'viewCount') {
        aValue = aValue || 0;
        bValue = bValue || 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatFileSize = (size) => {
    if (!size) return '-';
    return size;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="ml-3 text-gray-600">Chargement de la galerie...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Filters and Search */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Catégorie:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {getCategoryLabel(category)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Statut:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tous</option>
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 pl-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <button
              onClick={onRefresh}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              title="Rafraîchir"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center">
                  Titre
                  {sortBy === 'title' && (
                    <svg className={`ml-1 w-4 h-4 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Infos
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('uploadDate')}
              >
                <div className="flex items-center">
                  Date
                  {sortBy === 'uploadDate' && (
                    <svg className={`ml-1 w-4 h-4 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('viewCount')}
              >
                <div className="flex items-center">
                  Vues
                  {sortBy === 'viewCount' && (
                    <svg className={`ml-1 w-4 h-4 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedItems.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2">Aucun élément trouvé dans la galerie</p>
                </td>
              </tr>
            ) : (
              filteredAndSortedItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  {/* Image */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative group">
                      <img
                        src={item.imageUrl || '/placeholder-image.jpg'}
                        alt={item.title}
                        className="h-16 w-16 object-cover rounded-md border"
                      />
                      {editingItem === item._id ? (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center">
                          <label className="cursor-pointer text-white text-xs p-1 bg-blue-600 rounded hover:bg-blue-700">
                            Changer
                            <input
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e) => handleImageUpdate(item._id, e)}
                            />
                          </label>
                        </div>
                      ) : null}
                    </div>
                  </td>

                  {/* Title and Description */}
                  <td className="px-6 py-4">
                    {editingItem === item._id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          name="title"
                          value={editFormData.title}
                          onChange={handleEditInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                        <textarea
                          name="description"
                          value={editFormData.description}
                          onChange={handleEditInputChange}
                          rows="2"
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {item.description}
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingItem === item._id ? (
                      <select
                        name="category"
                        value={editFormData.category}
                        onChange={handleEditInputChange}
                        className="p-2 border border-gray-300 rounded-md text-sm"
                      >
                        {categories.filter(cat => cat !== 'all').map(category => (
                          <option key={category} value={category}>
                            {getCategoryLabel(category)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getCategoryLabel(item.category)}
                      </span>
                    )}
                  </td>

                  {/* Tags */}
                  <td className="px-6 py-4">
                    {editingItem === item._id ? (
                      <input
                        type="text"
                        value={editFormData.tags?.join(', ') || ''}
                        onChange={handleEditTagsChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        placeholder="tag1, tag2, tag3"
                      />
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {item.tags?.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags?.length > 3 && (
                          <span className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                            +{item.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Info */}
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="space-y-1">
                      <div>{formatFileSize(item.fileSize)}</div>
                      <div>{item.dimensions || '-'}</div>
                      <div className="flex items-center">
                        <svg className={`w-4 h-4 mr-1 ${item.isFeatured ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{item.isFeatured ? 'En vedette' : '-'}</span>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(item.uploadDate)}
                  </td>

                  {/* Views */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.viewCount?.toLocaleString() || 0}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onToggleGalleryItemStatus(item._id, item.status)}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        item.status === 'published'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      }`}
                    >
                      {item.status === 'published' ? 'Publié' : 'Brouillon'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingItem === item._id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveEdit(item._id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-600 hover:text-red-900"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Modifier"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => onToggleFeaturedStatus(item._id, item.isFeatured)}
                          className={`${item.isFeatured ? 'text-yellow-600 hover:text-yellow-800' : 'text-gray-400 hover:text-gray-600'}`}
                          title={item.isFeatured ? "Retirer des vedettes" : "Mettre en vedette"}
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => onDeleteGalleryItem(item._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      {filteredAndSortedItems.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Affichage de <span className="font-medium">1</span> à{' '}
              <span className="font-medium">{filteredAndSortedItems.length}</span> sur{' '}
              <span className="font-medium">{filteredAndSortedItems.length}</span> éléments
            </div>
            <div className="text-sm text-gray-700">
              Trié par: <span className="font-medium">
                {sortBy === 'title' ? 'Titre' : sortBy === 'uploadDate' ? 'Date' : 'Vues'}
              </span>{' '}
              ({sortOrder === 'asc' ? 'Croissant' : 'Décroissant'})
            </div>
          </div>
        </div>
      )}
    </div>
  );
}