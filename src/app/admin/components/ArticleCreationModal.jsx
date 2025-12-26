'use client';

import { useState, useCallback } from 'react';


export default function ArticleCreationModal({ onClose, onArticleCreated }) {
  const [articleForm, setArticleForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: ['tendances', 'innovation'],
    isMemberOnly: false,
    isPublished: true
  });
  
  const [tagInput, setTagInput] = useState('');
  const [articleLoading, setArticleLoading] = useState(false);
  const [articleMessage, setArticleMessage] = useState('');

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setArticleForm(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setArticleForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, []);

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !articleForm.tags.includes(tagInput.trim())) {
      setArticleForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  }, [tagInput, articleForm.tags]);

  const handleRemoveTag = useCallback((tagToRemove) => {
    setArticleForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  }, [handleAddTag]);

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    setArticleLoading(true);
    setArticleMessage('');

    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Token d\'authentification manquant');
      }

      // Validation des données
      if (!articleForm.title || !articleForm.content || !articleForm.excerpt) {
        throw new Error('Veuillez remplir tous les champs obligatoires.');
      }

      if (articleForm.excerpt.length > 200) {
        throw new Error('L\'extrait ne doit pas dépasser 200 caractères.');
      }

      const articleData = {
        title: articleForm.title,
        content: articleForm.content,
        excerpt: articleForm.excerpt,
        tags: articleForm.tags,
        isMemberOnly: articleForm.isMemberOnly,
        isPublished: articleForm.isPublished
      };

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(articleData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la création de l\'article');
      }

      if (result.success) {
        setArticleMessage('✅ Article créé avec succès !');
        setArticleForm({
          title: '',
          content: '',
          excerpt: '',
          tags: ['tendances', 'innovation'],
          isMemberOnly: false,
          isPublished: true
        });
        
        onArticleCreated();
        
        setTimeout(() => {
          onClose();
          setArticleMessage('');
        }, 2000);
      } else {
        throw new Error(result.message || 'Erreur lors de la création de l\'article');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setArticleMessage(`❌ ${error.message}`);
    } finally {
      setArticleLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-blue-800">Créer un nouvel article</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          {articleMessage && (
            <div className={`p-4 rounded-md mb-6 ${
              articleMessage.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {articleMessage}
            </div>
          )}

          <form onSubmit={handleCreateArticle} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre *
              </label>
              <input
                type="text"
                name="title"
                required
                value={articleForm.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Titre de l'article"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Extrait *
              </label>
              <textarea
                name="excerpt"
                required
                value={articleForm.excerpt}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Court résumé de l'article (max 200 caractères)"
                maxLength="200"
              />
              <p className="text-xs text-gray-500 mt-1">
                {articleForm.excerpt.length}/200 caractères
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenu *
              </label>
              <textarea
                name="content"
                required
                value={articleForm.content}
                onChange={handleInputChange}
                rows="12"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contenu complet de l'article"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ajouter un tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Ajouter
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {articleForm.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isMemberOnly"
                  checked={articleForm.isMemberOnly}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Réservé aux membres seulement
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={articleForm.isPublished}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Publier immédiatement
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                disabled={articleLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={articleLoading}
                className="px-4 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {articleLoading ? 'Création en cours...' : 'Créer l\'article'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}