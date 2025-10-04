// components/Membership.js
const Membership = () => {
  const benefits = [
    "Accès à tous nos événements à tarif préférentiel",
    "Formations continues et développement professionnel",
    "Réseautage avec les experts du secteur",
    "Accès à l'espace membre avec ressources exclusives",
    "Revue professionnelle trimestrielle"
  ];

  return (
    <section id="membership" className="py-16 px-6 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">Devenez membre</h2>
        
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg mb-6">
            Rejoignez notre communauté de professionnels et bénéficiez de tous les avantages réservés à nos membres :
          </p>
          
          <ul className="list-disc list-inside text-left mb-8 space-y-2 mx-auto max-w-md">
            {benefits.map((benefit, index) => (
              <li key={index} className="text-gray-700">{benefit}</li>
            ))}
          </ul>
          
          <a href="/membership"className="px-8 py-3 bg-yellow-500 text-blue-900 rounded-md hover:bg-yellow-400 transition-colors font-medium text-lg">
            Adhérer en ligne
          </a>
        </div>
      </div>
    </section>
  );
};

export default Membership;