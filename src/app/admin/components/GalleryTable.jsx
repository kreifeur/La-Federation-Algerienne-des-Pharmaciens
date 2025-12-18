'use client';

import { useState } from 'react';

export default function GalleryTable({ 
  galleryItems, 
  loading, 
  onRefresh, 
  onUpdateGalleryItem, 
  onDeleteGalleryItem,
  onToggleFeaturedStatus,
  onToggleMemberOnlyStatus
}) {
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [selectedAccess, setSelectedAccess] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [uploadingFile, setUploadingFile] = useState(null);

  const fileTypeOptions = [
    { value: 'all', label: 'Tous' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Vidéos' },
    { value: 'document', label: 'Documents' },
    { value: 'audio', label: 'Audio' }
  ];

  const accessOptions = [
    { value: 'all', label: 'Tous' },
    { value: 'public', label: 'Public' },
    { value: 'memberOnly', label: 'Membres uniquement' }
  ];

  const getFileTypeLabel = (fileType) => {
    const labels = {
      image: 'Image',
      video: 'Vidéo',
      document: 'Document',
      audio: 'Audio'
    };
    return labels[fileType] || fileType;
  };

  const getAccessLabel = (isMemberOnly) => {
    return isMemberOnly ? 'Membres uniquement' : 'Public';
  };

  const handleEditClick = (item) => {
    setEditingItem(item._id);
    setEditFormData({
      title: item.title,
      description: item.description || '',
      tags: [...(item.tags || [])]
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

  const handleFileUpdate = async (itemId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(itemId);

    try {
      // First upload to Cloudinary
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", file);
      cloudinaryFormData.append("upload_preset", "FAPKREIFEUR");
      cloudinaryFormData.append("cloud_name", "dlr034bds");

      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/dlr034bds/upload`,
        {
          method: "POST",
          body: cloudinaryFormData,
        }
      );

      const cloudinaryResult = await cloudinaryResponse.json();

      if (!cloudinaryResponse.ok) {
        throw new Error(
          cloudinaryResult.error?.message || "Erreur lors de l'upload Cloudinary"
        );
      }

      const cloudinaryUrl = cloudinaryResult.secure_url;

      // Prepare update data with new Cloudinary URL
      const updateData = {
        imgURL: cloudinaryUrl,
        fileUrl: cloudinaryUrl,
        thumbnailUrl: cloudinaryUrl,
        // Detect file type
        fileType: getFileTypeFromFile(file)
      };

      // Call the parent update function
      await onUpdateGalleryItem(itemId, updateData);
      
      // Refresh the list
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du fichier:", error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setUploadingFile(null);
    }
  };

  const getFileTypeFromFile = (file) => {
    const type = file.type.split("/")[0];
    if (type === "image" || type === "video") {
      return type;
    } else if (
      file.type.includes("pdf") ||
      file.type.includes("document") ||
      file.type.includes("text")
    ) {
      return "document";
    } else if (file.type.includes("audio")) {
      return "audio";
    }
    return "document";
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
      // Filter by file type
      if (selectedFileType !== 'all' && item.fileType !== selectedFileType) {
        return false;
      }
      
      // Filter by access
      if (selectedAccess !== 'all') {
        if (selectedAccess === 'memberOnly' && !item.isMemberOnly) return false;
        if (selectedAccess === 'public' && item.isMemberOnly) return false;
      }
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchLower) ||
          (item.description && item.description.toLowerCase().includes(searchLower)) ||
          (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle dates
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      // Handle numbers
      if (sortBy === 'views') {
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
              <label className="text-sm font-medium text-gray-700">Type:</label>
              <select
                value={selectedFileType}
                onChange={(e) => setSelectedFileType(e.target.value)}
                className="p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {fileTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Accès:</label>
              <select
                value={selectedAccess}
                onChange={(e) => setSelectedAccess(e.target.value)}
                className="p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {accessOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
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
                Prévisualisation
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
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center">
                  Date d'ajout
                  {sortBy === 'createdAt' && (
                    <svg className={`ml-1 w-4 h-4 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('views')}
              >
                <div className="flex items-center">
                  Vues
                  {sortBy === 'views' && (
                    <svg className={`ml-1 w-4 h-4 ${sortOrder === 'asc' ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Accès
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedItems.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2">Aucun média trouvé</p>
                </td>
              </tr>
            ) : (
              filteredAndSortedItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  {/* Preview */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative group">
                      {uploadingFile === item._id ? (
                        <div className="h-16 w-16 flex flex-col items-center justify-center bg-gray-100 rounded-md border">
                          <svg className="animate-spin h-6 w-6 text-blue-600 mb-1" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span className="text-xs text-gray-600">Upload...</span>
                        </div>
                      ) : item.fileType === 'image' ? (
                        <img
                          src={item.thumbnailUrl || item.fileUrl || '/placeholder-image.jpg'}
                          alt={item.title}
                          className="h-16 w-16 object-cover rounded-md border"
                        />
                      ) : (
                        <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded-md border">
                          {item.fileType === 'video' ? (
                            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          ) : item.fileType === 'audio' ? (
                            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                          ) : (
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          )}
                        </div>
                      )}
                      {editingItem === item._id && !uploadingFile ? (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center">
                          <label className="cursor-pointer text-white text-xs p-1 bg-blue-600 rounded hover:bg-blue-700">
                            Changer
                            <input
                              type="file"
                              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.ppt,.pptx"
                              className="sr-only"
                              onChange={(e) => handleFileUpdate(item._id, e)}
                              disabled={uploadingFile === item._id}
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
                          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                          disabled={uploadingFile === item._id}
                        />
                        <textarea
                          name="description"
                          value={editFormData.description}
                          onChange={handleEditInputChange}
                          rows="2"
                          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                          disabled={uploadingFile === item._id}
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {item.description || 'Pas de description'}
                        </div>
                      </div>
                    )}
                  </td>

                  {/* File Type */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.fileType === 'image' ? 'bg-blue-100 text-blue-800' :
                      item.fileType === 'video' ? 'bg-purple-100 text-purple-800' :
                      item.fileType === 'document' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getFileTypeLabel(item.fileType)}
                    </span>
                  </td>

                  {/* Tags */}
                  <td className="px-6 py-4">
                    {editingItem === item._id ? (
                      <input
                        type="text"
                        value={editFormData.tags?.join(', ') || ''}
                        onChange={handleEditTagsChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="tag1, tag2, tag3"
                        disabled={uploadingFile === item._id}
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
                        {(!item.tags || item.tags.length === 0) && (
                          <span className="text-xs text-gray-400">Aucun tag</span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(item.createdAt)}
                  </td>

                  {/* Views */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.views?.toLocaleString() || 0}
                  </td>

                  {/* Access Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onToggleMemberOnlyStatus && onToggleMemberOnlyStatus(item._id, item.isMemberOnly)}
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        item.isMemberOnly
                          ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      } ${editingItem === item._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={editingItem === item._id}
                    >
                      {getAccessLabel(item.isMemberOnly)}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingItem === item._id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveEdit(item._id)}
                          className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Enregistrer"
                          disabled={uploadingFile === item._id}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Annuler"
                          disabled={uploadingFile === item._id}
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
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Modifier"
                          disabled={uploadingFile === item._id}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => onDeleteGalleryItem(item._id)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Supprimer"
                          disabled={uploadingFile === item._id}
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
                {sortBy === 'title' ? 'Titre' : sortBy === 'createdAt' ? 'Date' : 'Vues'}
              </span>{' '}
              ({sortOrder === 'asc' ? 'Croissant' : 'Décroissant'})
            </div>
          </div>
        </div>
      )}
    </div>
  );
}