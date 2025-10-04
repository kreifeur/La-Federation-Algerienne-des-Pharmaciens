// pages/gallery.js
"use client"
import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Données de la galerie
  const galleryItems = [
    {
      id: 1,
      title: "Congrès Annuel 2023",
      category: "events",
      type: "image",
      src: "/placeholder-congres.jpg",
      description: "Notre congrès annuel réunissant les experts du secteur de la cosmétologie"
    },
    {
      id: 2,
      title: "Atelier Formulation",
      category: "workshops",
      type: "image",
      src: "/placeholder-atelier.jpg",
      description: "Session pratique sur la formulation des produits cosmétiques"
    },
    {
      id: 3,
      title: "Remise des Prix",
      category: "events",
      type: "image",
      src: "/placeholder-prix.jpg",
      description: "Cérémonie de remise des prix d'excellence en cosmétologie"
    },
    {
      id: 4,
      title: "Visite Laboratoire",
      category: "visits",
      type: "image",
      src: "/placeholder-lab.jpg",
      description: "Visite exclusive d'un laboratoire de recherche cosmétique"
    },
    {
      id: 5,
      title: "Formulation Naturelle",
      category: "workshops",
      type: "video",
      src: "/placeholder-video-1.jpg",
      videoId: "abc123",
      description: "Apprentissage des techniques de formulation naturelle"
    },
    {
      id: 6,
      title: "Salon Professionnel",
      category: "events",
      type: "image",
      src: "/placeholder-salon.jpg",
      description: "Notre stand au salon international de la cosmétique"
    },
    {
      id: 7,
      title: "Interview Expert",
      category: "videos",
      type: "video",
      src: "/placeholder-video-2.jpg",
      videoId: "def456",
      description: "Interview d'un expert en réglementation cosmétique"
    },
    {
      id: 8,
      title: "Usine Partenaire",
      category: "visits",
      type: "image",
      src: "/placeholder-usine.jpg",
      description: "Visite d'une usine de production cosmétique partenaire"
    },
    {
      id: 9,
      title: "Techniques Avancées",
      category: "workshops",
      type: "video",
      src: "/placeholder-video-3.jpg",
      videoId: "ghi789",
      description: "Formation sur les techniques de production avancées"
    },
    {
      id: 10,
      title: "Cocktail Réseautage",
      category: "events",
      type: "image",
      src: "/placeholder-cocktail.jpg",
      description: "Événement de réseautage entre membres de l'association"
    },
    {
      id: 11,
      title: "Documentaire Innovation",
      category: "videos",
      type: "video",
      src: "/placeholder-video-4.jpg",
      videoId: "jkl012",
      description: "Documentaire sur les innovations en cosmétologie"
    },
    {
      id: 12,
      title: "Centre R&D",
      category: "visits",
      type: "image",
      src: "/placeholder-recherche.jpg",
      description: "Visite d'un centre de recherche et développement"
    }
  ];

  // Filtres disponibles
  const filters = [
    { key: 'all', label: 'Tous' },
    { key: 'events', label: 'Événements' },
    { key: 'workshops', label: 'Ateliers' },
    { key: 'visits', label: 'Visites' },
    { key: 'videos', label: 'Vidéos' }
  ];

  // Filtrer les éléments selon la catégorie active
  const filteredItems = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  // Ouvrir la lightbox
  const openLightbox = (index) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };

  // Navigation dans la lightbox
  const goToPrevious = () => {
    setCurrentImage(prev => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImage(prev => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      <Head>
        <title>Galerie - Association de Cosmétologie</title>
        <meta name="description" content="Galerie photos et vidéos des événements de l'Association de Cosmétologie" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-blue-800 mb-4">Galerie</h1>
          <p className="text-lg text-center text-gray-700 max-w-3xl mx-auto mb-12">
            Découvrez les moments forts de nos événements, ateliers et rencontres à travers notre galerie photos et vidéos.
          </p>

          {/* Filtres */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filters.map(filter => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-blue-800 text-white'
                    : 'bg-white text-blue-800 hover:bg-blue-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Galerie */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <div className="relative aspect-square">
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Image {item.id}</span>
                  </div>
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-blue-800 bg-opacity-70 rounded-full p-3">
                        <span className="text-white text-2xl">▶</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-blue-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.type === 'video' ? 'Vidéo' : 'Photo'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucun élément trouvé dans cette catégorie.</p>
            </div>
          )}

          {/* Lightbox */}
          {lightboxOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
              <button 
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 text-white text-3xl z-10"
              >
                &times;
              </button>

              <button 
                onClick={goToPrevious}
                className="absolute left-4 text-white text-3xl z-10 bg-blue-800 bg-opacity-50 rounded-full h-10 w-10 flex items-center justify-center"
              >
                ‹
              </button>

              <button 
                onClick={goToNext}
                className="absolute right-4 text-white text-3xl z-10 bg-blue-800 bg-opacity-50 rounded-full h-10 w-10 flex items-center justify-center"
              >
                ›
              </button>

              <div className="max-w-4xl w-full max-h-full">
                {filteredItems[currentImage].type === 'image' ? (
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-700 flex items-center justify-center">
                      <span className="text-white">Image {filteredItems[currentImage].id}</span>
                    </div>
                    <div className="p-6 text-white">
                      <h3 className="text-xl font-semibold mb-2">{filteredItems[currentImage].title}</h3>
                      <p>{filteredItems[currentImage].description}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="aspect-video bg-gray-700 flex items-center justify-center">
                      <div className="text-center">
                        <div className="bg-blue-800 bg-opacity-70 rounded-full p-4 inline-block mb-4">
                          <span className="text-white text-4xl">▶</span>
                        </div>
                        <p className="text-white">Vidéo {filteredItems[currentImage].videoId}</p>
                      </div>
                    </div>
                    <div className="p-6 text-white">
                      <h3 className="text-xl font-semibold mb-2">{filteredItems[currentImage].title}</h3>
                      <p>{filteredItems[currentImage].description}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="bg-black bg-opacity-50 rounded-full px-4 py-2">
                  <p className="text-white text-sm">
                    {currentImage + 1} / {filteredItems.length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section Témoignages */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">Ils témoignent</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-800 font-semibold">ML</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Marie Laurent</h4>
                    <p className="text-sm text-gray-600">Responsable R&D</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Les événements de l'association m'ont permis de rencontrer des experts incroyables 
                  et de découvrir les dernières innovations en cosmétologie."
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-800 font-semibold">PD</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Pierre Dubois</h4>
                    <p className="text-sm text-gray-600">Formulateur indépendant</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "Les ateliers pratiques sont d'une qualité exceptionnelle. J'ai considérablement 
                  développé mes compétences grâce à ces formations."
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-800 font-semibold">SC</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Sophie Chen</h4>
                    <p className="text-sm text-gray-600">Directrice de laboratoire</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">
                  "La visite des sites de production organisée par l'association a été une révélation 
                  pour optimiser nos processus de fabrication."
                </p>
              </div>
            </div>
          </section>

          {/* Newsletter */}
          <section className="mt-16 bg-blue-800 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-semibold mb-4">Restez informé</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Inscrivez-vous à notre newsletter pour recevoir les actualités de l'association, 
              les invitations à nos événements et les dernières innovations du secteur.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-yellow-500 text-blue-900 rounded-md hover:bg-yellow-400 transition-colors font-medium"
              >
                S'inscrire
              </button>
            </form>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}