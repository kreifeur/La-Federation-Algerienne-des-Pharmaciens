'use client';

import { useCallback, useState } from 'react';

export default function ArticleEditForm({ 
  article, 
  articleForm, 
  setArticleForm, 
  articleMessage, 
  articleLoading,
  onCancel, 
  onUpdate 
}) {
  
  const [tagInput, setTagInput] = useState('');

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
  }, [setArticleForm]);

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !articleForm.tags.includes(tagInput.trim())) {
      setArticleForm(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  }, [tagInput, articleForm.tags, setArticleForm]);

  const handleRemoveTag = useCallback((tagToRemove) => {
    setArticleForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, [setArticleForm]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  }, [handleAddTag]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(article._id);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border-2 border-blue-200 mt-4">
      <h4 className="text-lg font-semibold text-blue-800 mb-4">Modifier l'article</h4>
      
      {articleMessage && (
        <div className={`p-3 rounded-md mb-4 ${
          articleMessage.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {articleMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Court résumé de l'article"
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
            rows="8"
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

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            disabled={articleLoading}
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={articleLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {articleLoading ? 'Mise à jour...' : 'Mettre à jour'}
          </button>
        </div>
      </form>
    </div>
  );
}