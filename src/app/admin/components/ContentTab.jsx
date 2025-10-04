'use client';

import { useState, useEffect } from 'react';
import ArticlesTable from './ArticlesTable';
import ArticleCreationModal from './ArticleCreationModal';

export default function ContentTab({ stats, setStats }) {
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);

  // Charger les articles
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setArticlesLoading(true);
    try {
      const authToken = localStorage.getItem('authToken');
      
      if (!authToken) {
        throw new Error('Token d\'authentification manquant');
      }

      const response = await fetch('/api/articles', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des articles');
      }

      const result = await response.json();
      
      if (result.success) {
        setArticles(result.data.articles || []);
        // Mettre à jour les stats
        updateStats(result.data.articles);
      } else {
        throw new Error(result.message || 'Erreur lors du chargement des articles');
      }
    } catch (error) {
      console.error('Erreur:', error);
      // Données de démonstration
      const demoArticles = [
        {
          _id: "1",
          title: "Nouvelles tendances en cosmétologie 2024",
          content: "Contenu complet de l'article avec toutes les informations détaillées...",
          excerpt: "Découvrez les dernières innovations en cosmétologie pour l'année 2024",
          authorId: {
            _id: "68d477bc406c710d096d8354",
            email: "membre@example.com"
          },
          tags: ["tendances", "innovation", "2024"],
          isMemberOnly: false,
          isPublished: true,
          publishedAt: "2025-09-29T13:00:37.601Z",
          views: 150,
          createdAt: "2025-09-29T13:00:37.602Z",
          updatedAt: "2025-09-29T13:09:05.215Z"
        },
        {
          _id: "2",
          title: "Les bienfaits des soins naturels",
          content: "Exploration des avantages des ingrédients naturels en cosmétique...",
          excerpt: "Pourquoi choisir des soins naturels pour votre peau",
          authorId: {
            _id: "68d477bc406c710d096d8354",
            email: "membre@example.com"
          },
          tags: ["naturel", "soins", "peau"],
          isMemberOnly: true,
          isPublished: false,
          views: 0,
          createdAt: "2025-09-28T10:30:15.123Z",
          updatedAt: "2025-09-28T10:30:15.123Z"
        }
      ];
      setArticles(demoArticles);
      updateStats(demoArticles);
    } finally {
      setArticlesLoading(false);
    }
  };

  const updateStats = (articles) => {
    const totalArticles = articles.length;
    const publishedArticles = articles.filter(article => article.isPublished).length;
    const memberOnlyArticles = articles.filter(article => article.isMemberOnly).length;

    setStats(prev => ({
      ...prev,
      totalResources: totalArticles,
      // Vous pouvez ajouter d'autres stats spécifiques aux articles si besoin
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Gestion des Articles</h2>
          <button
            onClick={() => setShowArticleModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            + Créer un article
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800">Articles Totaux</h3>
            <p className="text-2xl font-bold">{articles.length}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-800">Publiés</h3>
            <p className="text-2xl font-bold">{articles.filter(a => a.isPublished).length}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-medium text-purple-800">Réservés membres</h3>
            <p className="text-2xl font-bold">{articles.filter(a => a.isMemberOnly).length}</p>
          </div>
        </div>
      </div>

      <ArticlesTable 
        articles={articles} 
        loading={articlesLoading} 
        onRefresh={fetchArticles}
      />

      {showArticleModal && (
        <ArticleCreationModal 
          onClose={() => setShowArticleModal(false)}
          onArticleCreated={fetchArticles}
        />
      )}
    </div>
  );
}