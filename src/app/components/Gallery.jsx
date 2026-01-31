"use client"
// components/Gallery.js
import { useEffect, useState } from 'react';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryMessage, setGalleryMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
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
            'Authorization': token ? `Bearer ${token}` : '',
          }
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement de la galerie");
        }

        const result = await response.json();

        if (result.success) {
          let mediaItems = result.data?.media || [];
          
          // Filter media based on authentication status
          if (!token) {
            // If no auth token, only show non-member-only content
            mediaItems = mediaItems.filter(item => !item.isMemberOnly);
            console.log("Non-authenticated user: Showing", mediaItems.length, "public items");
          } else {
            console.log("Authenticated user: Showing all", mediaItems.length, "items");
          }
          
          setGalleryItems(mediaItems);
        } else {
          throw new Error(
            result.message || "Erreur lors du chargement de la galerie"
          );
        }
      } catch (error) {
        console.error("Erreur:", error);
        setGalleryMessage(`❌ ${error.message}`);
        
        // Fallback data with Cloudinary URLs
        const fallbackItems = Array(6).fill(null).map((_, i) => ({
          id: i + 1,
          title: `Événement ${i + 1}`,
          image: `/gallery-${i + 1}.jpg`,
          isMemberOnly: i > 2 // Example: make some items member-only
        }));
        
        // Filter fallback items based on authentication
        let filteredFallback = fallbackItems;
        if (!authToken) {
          filteredFallback = fallbackItems.filter(item => !item.isMemberOnly);
        }
        
        setGalleryItems(filteredFallback);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  if (isLoading) {
    return (
      <section id="gallery" className="py-16 px-6 bg-blue-50">
        <div className="container mx-auto text-center">
          <p>Chargement de la galerie...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-16 px-6 bg-blue-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">Galerie</h2>
        
        {galleryMessage && (
          <div className="text-center mb-4 text-red-600">
            {galleryMessage}
          </div>
        )}
        
        {galleryItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              {authToken 
                ? "Aucun média disponible pour le moment." 
                : "Aucun média public disponible. Connectez-vous pour voir plus de contenu."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryItems.map(item => (
                <div 
                  key={item._id || item.id} 
                  className="aspect-square bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center relative"
                >
                  {item.isMemberOnly && (
                    <div className="absolute top-2 right-2 bg-blue-800 text-white text-xs px-2 py-1 rounded z-10">
                      Membres
                    </div>
                  )}
                  
                  {item.thumbnailUrl || item.image ? (
                    <img 
                      src={item.thumbnailUrl || item.image} 
                      alt={item.title || `Image ${item._id || item.id}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">
                      {item.title || `Image ${item._id || item.id}`}
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <a 
                href="/gallery" 
                className="px-6 py-3 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Voir toute la galerie
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Gallery;