// components/Gallery.js
const Gallery = () => {
  const galleryItems = Array(6).fill(null).map((_, i) => ({
    id: i + 1,
    title: `Événement ${i + 1}`,
    image: `/gallery-${i + 1}.jpg`
  }));

  return (
    <section id="gallery" className="py-16 px-6 bg-blue-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">Galerie</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryItems.map(item => (
            <div key={item.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
              <span className="text-gray-500">Image {item.id}</span>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <a href="/gallery" className="px-6 py-3 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
            Voir toute la galerie
          </a>
        </div>
      </div>
    </section>
  );
};

export default Gallery;