// components/Hero.js
const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20 px-6">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Bienvenue à La Fédération Algérienne des Pharmaciens</h2>
        <p className="text-xl max-w-2xl mx-auto mb-8">
          organisation professionnelle qui regroupe et représente les pharmaciens exerçant dans différents secteurs 
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a href="/events" className="px-6 py-3 bg-yellow-500 text-blue-900 rounded-md hover:bg-yellow-400 transition-colors font-medium text-lg">
            Découvrir nos activités
          </a>
          <a href="/membership" className="px-6 py-3 border-2 border-white rounded-md hover:bg-white hover:text-blue-800 transition-colors font-medium text-lg">
            Devenir membre
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;