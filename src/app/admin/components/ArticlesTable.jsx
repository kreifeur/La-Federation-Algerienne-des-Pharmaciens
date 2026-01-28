'use client';

import { useState } from 'react';
import ArticleEditForm from './ArticleEditForm';

export default function ArticlesTable({ articles, loading, onRefresh }) {
  const [editingArticle, setEditingArticle] = useState(null);
  const [articleMessage, setArticleMessage] = useState('');
  const [articleLoading, setArticleLoading] = useState(false);
  const [articleForm, setArticleForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: [],
    isMemberOnly: false,
    isPublished: false
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Non publié';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (isPublished) => {
    return isPublished ? (
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
        Publié
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
        Brouillon
      </span>
    );
  };

  const getAccessBadge = (isMemberOnly) => {
    return isMemberOnly ? (
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
        Membres seulement
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
        Public
      </span>
    );
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article._id);
    setArticleForm({
      title: article.title || '',
      content: article.content || '',
      excerpt: article.excerpt || '',
      tags: article.tags || [],
      isMemberOnly: article.isMemberOnly || false,
      isPublished: article.isPublished || false
    });
    setArticleMessage('');
  };

  const handleCancelEdit = () => {
    setEditingArticle(null);
    setArticleForm({
      title: '',
      content: '',
      excerpt: '',
      tags: [],
      isMemberOnly: false,
      isPublished: false
    });
    setArticleMessage('');
  };

  const handleUpdateArticle = async (articleId) => {
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

      const articleData = {
        title: articleForm.title,
        content: articleForm.content,
        excerpt: articleForm.excerpt,
        tags: articleForm.tags,
        isMemberOnly: articleForm.isMemberOnly,
        isPublished: articleForm.isPublished
      };

      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(articleData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la mise à jour de l\'article');
      }

      if (result.success) {
        setArticleMessage('✅ Article mis à jour avec succès !');
        onRefresh();
        setTimeout(() => {
          setEditingArticle(null);
          setArticleMessage('');
        }, 2000);
      } else {
        throw new Error(result.message || 'Erreur lors de la mise à jour de l\'article');
      }
    } catch (error) {
      setArticleMessage(`❌ ${error.message}`);
    } finally {
      setArticleLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.')) {
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la suppression de l\'article');
      }

      if (result.success) {
        setArticleMessage('✅ Article supprimé avec succès !');
        onRefresh();
        setTimeout(() => setArticleMessage(''), 2000);
      } else {
        throw new Error(result.message || 'Erreur lors de la suppression de l\'article');
      }
    } catch (error) {
      setArticleMessage(`❌ ${error.message}`);
    }
  };

  const handleTogglePublish = async (articleId, currentStatus) => {
    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Token d\'authentification manquant');
      }

      const newStatus = !currentStatus;
      const response = await fetch(`/api/articles/${articleId}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ isPublished: newStatus })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors du changement de statut');
      }

      if (result.success) {
        setArticleMessage(`✅ Article ${newStatus ? 'publié' : 'dépublié'} avec succès !`);
        onRefresh();
        setTimeout(() => setArticleMessage(''), 2000);
      } else {
        throw new Error(result.message || 'Erreur lors du changement de statut');
      }
    } catch (error) {
      setArticleMessage(`❌ ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Tous les Articles</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des articles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Tous les Articles</h2>
      </div>
      
      <div className="p-6">
        {articleMessage && !editingArticle && (
          <div className={`p-4 rounded-md mb-4 ${
            articleMessage.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {articleMessage}
          </div>
        )}

        {articles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Aucun article trouvé.</p>
            <p className="text-sm text-gray-500 mt-2">Créez votre premier article pour commencer.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut & Accès
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vues
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map((article) => (
                  <tr key={article._id} className="hover:bg-gray-50">
                    {editingArticle === article._id ? (
                      <td colSpan="7">
                        <ArticleEditForm 
                          article={article}
                          articleForm={articleForm}
                          setArticleForm={setArticleForm}
                          articleMessage={articleMessage}
                          articleLoading={articleLoading}
                          onCancel={handleCancelEdit}
                          onUpdate={handleUpdateArticle}
                        />
                      </td>
                    ) : (
                      <>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {article.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                              {article.excerpt}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {article.authorId?.email || 'Auteur inconnu'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {article.tags.map((tag, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1 flex items-center gap-1">
                            {getStatusBadge(article.isPublished)}
                            {getAccessBadge(article.isMemberOnly)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                          {article.views || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(article.publishedAt || article.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditArticle(article)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Modifier
                            </button>
{/*                             <button
                              onClick={() => handleTogglePublish(article._id, article.isPublished)}
                              className={`${
                                article.isPublished 
                                  ? 'text-orange-600 hover:text-orange-900' 
                                  : 'text-green-600 hover:text-green-900'
                              }`}
                            >
                              {article.isPublished ? 'Dépublier' : 'Publier'}
                            </button> */}
                            <button
                              onClick={() => handleDeleteArticle(article._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}