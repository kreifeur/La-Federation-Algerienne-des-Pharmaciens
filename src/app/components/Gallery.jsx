"use client"
// components/Gallery.js
import { useEffect, useState } from 'react';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryMessage, setGalleryMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        // Vous devez définir authToken selon votre logique d'authentification
        const authToken = localStorage.getItem('token') || ''; // Exemple
        
        const response = await fetch("/api/media", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement de la galerie");
        }

        const result = await response.json();

        if (result.success) {
          console.log("Gallery items loaded:", result.data?.media?.length || 0);
          setGalleryItems(result.data.media || []);
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
          image: `/gallery-${i + 1}.jpg`
        }));
        setGalleryItems(fallbackItems);
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
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryItems.map(item => (
            <div 
              key={item._id} 
              className="aspect-square bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center"
            >
              {item.thumbnailUrl ? (
                <img 
                  src={item.thumbnailUrl} 
                  alt={item.title || `Image ${item._id}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-500">
                  {item._title || `Image ${item._id}`}
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
      </div>
    </section>
  );
};

export default Gallery;