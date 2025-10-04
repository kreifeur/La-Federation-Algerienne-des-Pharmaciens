// components/Services.js
const Services = () => {
  const services = [
    {
      icon: "👥",
      title: "Réseau professionnel",
      description: "Rejoignez un réseau de professionnels passionnés et échangez sur les meilleures pratiques du secteur."
    },
    {
      icon: "🎓",
      title: "Formations continues",
      description: "Accédez à des formations de qualité pour développer vos compétences et rester à la pointe."
    },
    {
      icon: "📅",
      title: "Événements exclusifs",
      description: "Participez à nos congrès, séminaires et rencontres professionnelles tout au long de l'année."
    }
  ];

  return (
    <section className="py-16 px-6 bg-blue-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">Nos services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-800">{service.title}</h3>
              <p className="text-gray-700">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;