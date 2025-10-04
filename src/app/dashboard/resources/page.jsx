// app/dashboard/resources/page.jsx
'use client';

import { useState } from 'react';

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'Toutes les ressources' },
    { id: 'documents', name: 'Documents' },
    { id: 'videos', name: 'Vidéos' },
    { id: 'forms', name: 'Formulaires' },
    { id: 'guides', name: 'Guides' }
  ];

  const resources = [
    {
      id: 1,
      title: "Guide des Bonnes Pratiques de Fabrication",
      category: "guides",
      type: "pdf",
      size: "2.4 MB",
      uploadDate: "2023-08-15",
      downloads: 142
    },
    {
      id: 2,
      title: "Webinaire : Nouveaux ingrédients actifs 2023",
      category: "videos",
      type: "video",
      size: "156 MB",
      uploadDate: "2023-07-22",
      downloads: 87
    },
    {
      id: 3,
      title: "Formulaire de candidature - Conférencier",
      category: "forms",
      type: "doc",
      size: "0.8 MB",
      uploadDate: "2023-09-01",
      downloads: 53
    },
    {
      id: 4,
      title: "Étude de marché : Cosmétiques naturels",
      category: "documents",
      type: "pdf",
      size: "3.1 MB",
      uploadDate: "2023-06-10",
      downloads: 204
    }
  ];

  const filteredResources = activeCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === activeCategory);

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'doc': return '📝';
      case 'video': return '🎥';
      default: return '📁';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ressources</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeCategory === category.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {filteredResources.length === 0 ? (
            <p className="text-gray-600 text-center py-8">Aucune ressource dans cette catégorie</p>
          ) : (
            <div className="space-y-4">
              {filteredResources.map(resource => (
                <div key={resource.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{getFileIcon(resource.type)}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{resource.title}</h3>
                      <p className="text-sm text-gray-500">
                        Ajouté le {new Date(resource.uploadDate).toLocaleDateString('fr-FR')} • {resource.size} • {resource.downloads} téléchargements
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                    Télécharger
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}