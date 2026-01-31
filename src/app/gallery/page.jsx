// pages/gallery.js
"use client"
import { useEffect, useState, useMemo } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryMessage, setGalleryMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    // Check for auth token on component mount
    const token = localStorage.getItem('authToken');
    setAuthToken(token);
    
    const fetchGallery = async () => {
      try {
        const response = await fetch("/api/media", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
          console.log("Gallery items loaded:", result.data?.media?.length || 0);
          
          // Process the data to ensure consistent structure
          const allItems = (result.data.media || []).map(item => {
            // Detect file type from URL or tags
            let detectedType = 'image'; // Default to image
            
            // Check URL extension for type detection
            if (item.url) {
              const url = item.url.toLowerCase();
              if (url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') || url.includes('.avi') || url.includes('.m4v') || url.includes('.mkv')) {
                detectedType = 'video';
              }
            }
            
            // Check if item has type property or infer from tags
            if (item.fileType) {
              detectedType = item.fileType;
            } else if (item.type) {
              detectedType = item.type;
            } else if (item.tags && (item.tags.includes('video') || item.tags.includes('vidéo'))) {
              detectedType = 'video';
            }
            
            // Extract or infer category from tags
            let category = 'events'; // Default category
            
            if (item.tags) {
              const tags = Array.isArray(item.tags) ? item.tags : [item.tags];
              if (tags.some(tag => tag.includes('workshop') || tag.includes('atelier'))) {
                category = 'workshops';
              } else if (tags.some(tag => tag.includes('visit') || tag.includes('visite'))) {
                category = 'visits';
              } else if (tags.some(tag => tag.includes('video') || tag.includes('vidéo'))) {
                category = 'videos';
              } else if (tags.some(tag => tag.includes('event') || tag.includes('événement'))) {
                category = 'events';
              }
            }
            
            return {
              ...item,
              id: item._id || item.id || `item-${Math.random().toString(36).substr(2, 9)}`,
              type: detectedType,
              category: item.category || category,
              thumbnailUrl: item.thumbnailUrl || item.url || `/gallery-placeholder.jpg`,
              tags: item.tags || '',
              title: item.title || `Événement ${Math.floor(Math.random() * 100) + 1}`,
              description: item.description || '',
              isMemberOnly: item.isMemberOnly || false,
            };
          });
          
          // Filter items based on authentication status
          let filteredItems = allItems;
          if (!token) {
            // If no auth token, only show non-member-only content
            filteredItems = allItems.filter(item => item.isMemberOnly !== true);
            console.log("Non-authenticated user: Showing", filteredItems.length, "public items out of", allItems.length);
          } else {
            console.log("Authenticated user: Showing all", filteredItems.length, "items");
          }
          
          setGalleryItems(filteredItems);
          setGalleryMessage('');
        } else {
          throw new Error(
            result.message || "Erreur lors du chargement de la galerie"
          );
        }
      } catch (error) {
        console.error("Erreur:", error);
        setGalleryMessage(`❌ ${error.message}`);
        
        // Fallback data with consistent structure
        const fallbackItems = Array.from({ length: 8 }, (_, i) => {
          const isVideo = i === 2 || i === 5 || i === 7;
          const videoUrls = [
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
          ];
          
          return {
            id: `fallback-${i + 1}`,
            title: isVideo ? `Vidéo ${i + 1}` : `Événement ${i + 1}`,
            description: isVideo 
              ? `Une vidéo captivante de nos activités ${i + 1}`
              : `Description de l'événement ${i + 1}`,
            thumbnailUrl: isVideo 
              ? `/video-thumbnail-${(i % 3) + 1}.jpg` 
              : `/gallery-${(i % 3) + 1}.jpg`,
            url: isVideo ? videoUrls[i % 3] : `/gallery-${(i % 3) + 1}.jpg`,
            type: isVideo ? 'video' : 'image',
            category: ['events', 'workshops', 'videos', 'events', 'workshops', 'videos', 'visits', 'videos'][i],
            tags: isVideo ? ['vidéo', 'documentaire'] : ['événement', 'atelier', 'visite'][i % 3],
            createdAt: new Date().toISOString(),
            isMemberOnly: i > 4,
          };
        });
        
        // Filter fallback items based on authentication
        let filteredFallback = fallbackItems;
        if (!token) {
          filteredFallback = fallbackItems.filter(item => item.isMemberOnly !== true);
        }
        
        setGalleryItems(filteredFallback);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, [authToken]);

  // Generate filters dynamically from available categories
  const filters = useMemo(() => {
    const categorySet = new Set(['all']);
    
    // Collect unique categories from gallery items
    galleryItems.forEach(item => {
      if (item.category) {
        categorySet.add(item.category);
      }
    });
    
    // Map categories to display names
    const categoryLabels = {
      'all': 'Tous',
      'events': 'Événements',
      'workshops': 'Ateliers',
      'visits': 'Visites',
      'videos': 'Vidéos',
    };
    
    return Array.from(categorySet).map(category => ({
      key: category,
      label: categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1)
    }));
  }, [galleryItems]);

  // Filter items based on active filter
  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') {
      return galleryItems;
    }
    
    return galleryItems.filter(item => {
      // Check both category and tags for filtering
      const matchesCategory = item.category === activeFilter;
      const matchesTags = item.tags && 
        (Array.isArray(item.tags) 
          ? item.tags.some(tag => tag.toLowerCase().includes(activeFilter.toLowerCase()))
          : item.tags.toLowerCase().includes(activeFilter.toLowerCase()));
      return matchesCategory || matchesTags;
    });
  }, [galleryItems, activeFilter]);

  // Open lightbox
  const openLightbox = (index) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Lightbox navigation
  const goToPrevious = () => {
    setCurrentImage(prev => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImage(prev => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      
      switch(e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  return (
    <div>
      <Head>
        <title>Galerie - La Fédération Algérienne des Pharmaciens</title>
        <meta name="description" content="Galerie photos et vidéos des événements de l'Association de Cosmétologie" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-blue-800 mb-4">Galerie</h1>
          <p className="text-lg text-center text-gray-700 max-w-3xl mx-auto mb-4">
            Découvrez les moments forts de nos événements, ateliers et rencontres à travers notre galerie photos et vidéos.
          </p>

          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
              <p className="mt-4 text-gray-600">Chargement de la galerie...</p>
            </div>
          )}

          {/* Error message */}
          {galleryMessage && !isLoading && (
            <div className="text-center py-4 px-4 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-red-600">{galleryMessage}</p>
            </div>
          )}

          {/* Filtres */}
          {!isLoading && galleryItems.length > 0 && (
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
          )}

          {/* Galerie */}
          {!isLoading && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer group relative"
                    onClick={() => openLightbox(index)}
                  >
                    {/* Member-only badge */}
                    {item.isMemberOnly && (
                      <div className="absolute top-2 right-2 z-10">
                        <span className="bg-blue-800 text-white text-xs px-2 py-1 rounded-full flex items-center">
                          <span className="mr-1">🔒</span> Membre
                        </span>
                      </div>
                    )}
                    
                    <div className="relative aspect-square overflow-hidden">
                      {item.type === 'video' ? (
                        <>
                          {/* Video Thumbnail with Play Button */}
                          <div className="absolute inset-0 bg-gray-900">
                            <video 
                              className="w-full h-full object-cover opacity-90"
                              muted
                              preload="metadata"
                            
                            >
                              <source src={item.thumbnailUrl} type="video/mp4" />
                              Votre navigateur ne supporte pas la lecture de vidéos.
                            </video>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-10 transition-opacity">
                            <div className="bg-blue-800 bg-opacity-80 rounded-full p-4 group-hover:scale-110 transition-transform">
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Image Thumbnail */
                        <div 
                          style={{ 
                            backgroundImage: `url(${item.thumbnailUrl})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                          }} 
                          className="absolute inset-0 bg-gray-200 group-hover:scale-105 transition-transform duration-300"
                        >
                          {!item.thumbnailUrl && (
                            <span className="text-gray-500 absolute inset-0 flex items-center justify-center">
                              Image non disponible
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-blue-800 mb-1 truncate">{item.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 h-10">{item.description}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full capitalize truncate max-w-[120px]">
                          {Array.isArray(item.tags) ? item.tags[0] : item.tags || 'Non catégorisé'}
                        </span>
                        <div className="flex items-center gap-2">
                          {item.isMemberOnly && (
                            <span className="text-xs text-blue-600">🔒</span>
                          )}
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                            {item.type === 'video' ? '🎬 Vidéo' : '📷 Photo'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  {galleryItems.length === 0 ? (
                    <div>
                      <p className="text-gray-600 text-lg mb-4">
                        {authToken 
                          ? "Aucun média disponible pour le moment." 
                          : "Aucun média public disponible. Connectez-vous pour voir le contenu réservé aux membres."}
                      </p>
                      {!authToken && (
                        <a 
                          href="/login" 
                          className="inline-block px-6 py-3 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                        >
                          Se connecter
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600">Aucun élément trouvé dans cette catégorie.</p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Lightbox */}
          {lightboxOpen && filteredItems[currentImage] && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) closeLightbox();
              }}
            >
              <button 
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white text-3xl z-10 hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full h-10 w-10 flex items-center justify-center"
                aria-label="Fermer"
              >
                &times;
              </button>

              <button 
                onClick={goToPrevious}
                className="absolute left-4 text-white text-3xl z-10 bg-blue-800 bg-opacity-80 rounded-full h-12 w-12 flex items-center justify-center hover:bg-opacity-100 transition-all hover:scale-110"
                aria-label="Précédent"
              >
                ‹
              </button>

              <button 
                onClick={goToNext}
                className="absolute right-4 text-white text-3xl z-10 bg-blue-800 bg-opacity-80 rounded-full h-12 w-12 flex items-center justify-center hover:bg-opacity-100 transition-all hover:scale-110"
                aria-label="Suivant"
              >
                ›
              </button>

              <div className="max-w-5xl w-full max-h-[90vh] bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                <div className="h-[70vh] bg-black flex items-center justify-center">
                  {filteredItems[currentImage].type === 'image' ? (
                    <img 
                      src={filteredItems[currentImage].thumbnailUrl || filteredItems[currentImage].thumbnailUrl} 
                      alt={filteredItems[currentImage].title}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/gallery-placeholder.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <video 
                        controls
                        autoPlay
                        className="max-w-full max-h-full"
                        poster={filteredItems[currentImage].thumbnailUrl}
                      >
                        <source src={filteredItems[currentImage].thumbnailUrl} type="video/mp4" />
                        <source src={filteredItems[currentImage].thumbnailUrl} type="video/webm" />
                        <source src={filteredItems[currentImage].thumbnailUrl} type="video/ogg" />
                        Votre navigateur ne supporte pas la lecture de vidéos.
                      </video>
                    </div>
                  )}
                </div>
                
                <div className="p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold">{filteredItems[currentImage].title}</h3>
                    {filteredItems[currentImage].isMemberOnly && (
                      <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full flex items-center">
                        <span className="mr-1">🔒</span> Contenu membre
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-200 mb-4">{filteredItems[currentImage].description}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm px-3 py-1 bg-blue-600 rounded-full">
                        {Array.isArray(filteredItems[currentImage].tags) 
                          ? filteredItems[currentImage].tags.map((tag, i) => (
                              <span key={i} className="mr-1">{tag}{i < filteredItems[currentImage].tags.length - 1 ? ',' : ''}</span>
                            ))
                          : filteredItems[currentImage].tags}
                      </span>
                      <span className="text-sm px-3 py-1 bg-gray-700 rounded-full">
                        {filteredItems[currentImage].type === 'video' ? '🎬 Vidéo' : '📷 Photo'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-400 ml-auto">
                      {filteredItems[currentImage].createdAt ? 
                        new Date(filteredItems[currentImage].createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 
                        'Date inconnue'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="bg-black bg-opacity-70 rounded-full px-6 py-2 backdrop-blur-sm flex items-center gap-4">
                  <span className="text-white text-sm font-medium">
                    {currentImage + 1} / {filteredItems.length}
                  </span>
                  <span className="text-gray-300 text-sm">
                    {filteredItems[currentImage].type === 'video' ? 'Vidéo en cours de lecture' : 'Image'}
                  </span>
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