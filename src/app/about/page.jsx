// pages/about.js
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import aboutimage from '../../../public/about.png'
export default function About() {
  // Données de l'équipe
  const teamMembers = [
    {
      id: 1,
      name: "Dr. Sophie Martin",
      role: "Présidente",
      bio: "Docteure en pharmacie avec 15 ans d'expérience dans l'industrie cosmétique. Ancienne directrice R&D chez L'Oréal.",
      image: "/team/sophie-martin.jpg",
    },
    {
      id: 2,
      name: "Pierre Dubois",
      role: "Vice-président",
      bio: "Expert en réglementation cosmétique avec une carrière de 20 ans chez Chanel et Dior. Enseignant à l'ISIPCA.",
      image: "/team/pierre-dubois.jpg",
    },
    {
      id: 3,
      name: "Marie-Laurence Leroy",
      role: "Secrétaire générale",
      bio: "Spécialiste en marketing cosmétique. Fondatrice de l'agence de conseil en stratégie beauté ML Conseil.",
      image: "/team/marie-laurence-leroy.jpg",
    },
    {
      id: 4,
      name: "Thomas Moreau",
      role: "Trésorier",
      bio: "Expert-comptable spécialisé dans les entreprises de cosmétiques. Ancien directeur financier chez Yves Rocher.",
      image: "/team/thomas-moreau.jpg",
    },
    {
      id: 5,
      name: "Dr. Chloé Zhang",
      role: "Responsable scientifique",
      bio: "Docteure en chimie des produits naturels. Research Fellow à l'Université de Paris en cosmétologie.",
      image: "/team/chloe-zhang.jpg",
    },
    {
      id: 6,
      name: "Michel Bernard",
      role: "Responsable des événements",
      bio: "Organisateur d'événements professionnels depuis 12 ans. Fondateur de l'agence Événements & Cosmétiques.",
      image: "/team/michel-bernard.jpg",
    },
  ];

  // Chiffres clés
  const keyFigures = [
    { number: "450+", label: "Membres actifs" },
    { number: "12", label: "Ans d'existence" },
    { number: "35", label: "Événements par an" },
    { number: "15", label: "Pays représentés" },
  ];

  // Partenaires
  const partners = [
    { name: "L'Oréal", logo: "/partners/loreal.png" },
    { name: "LVMH", logo: "/partners/lvmh.png" },
    { name: "Chanel", logo: "/partners/chanel.png" },
    { name: "Pierre Fabre", logo: "/partners/pierre-fabre.png" },
    { name: "ISIPCA", logo: "/partners/isipca.png" },
    { name: "Université de Paris", logo: "/partners/universite-paris.png" },
  ];

  return (
    <div>
      <Head>
        <title>À propos de la Fédération</title>
        <meta
          name="description"
          content="Découvrez l'Association de Cosmétologie : notre histoire, notre mission, notre équipe et nos valeurs"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="min-h-screen bg-blue-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20 px-6">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              À propos de la Fédération
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              Découvrez l’histoire, la mission et les valeurs de la Fédération
              Algérienne des Pharmaciens, acteur majeur du secteur depuis sa
              création.
            </p>
          </div>
        </section>

        {/* Histoire */}
        <section className="py-16 px-6 bg-white">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-blue-800 mb-6">
                  Notre histoire
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    La Fédération Algérienne des Pharmaciens est une
                    organisation professionnelle qui regroupe et représente les
                    pharmaciens exerçant dans différents secteurs : officine,
                    industrie, hôpital, recherche et distribution. Elle œuvre
                    pour la valorisation de la profession, le renforcement des
                    compétences et la protection de la santé publique.
                  </p>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className=" rounded-lg h-80 flex items-center justify-center">
                  <img className="h-80 filter rounded-lg " src={aboutimage.src} alt="" />
          
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission et Valeurs */}
        <section className="py-16 px-6 bg-blue-800 text-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Notre mission et nos valeurs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-yellow-300">
                  Nos Missions
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      Représentation{" "}
                    </h4>
                    <p>
                      Porter la voix des pharmaciens auprès des institutions
                      nationales et internationales.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      Développement professionnel
                    </h4>
                    <p>
                      Organiser des formations, congrès et ateliers pour
                      renforcer les compétences des pharmaciens.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      Santé publique
                    </h4>
                    <p>
                      Participer aux campagnes de prévention et sensibilisation
                      pour améliorer la santé des citoyens.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      Encadrement et réglementation
                    </h4>
                    <p>
                      Veiller au respect des textes législatifs et proposer des
                      réformes adaptées aux évolutions du secteur.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">
                      Promotion de la recherche et de l’industrie
                    </h4>
                    <p>
                      Valoriser la recherche pharmaceutique nationale et
                      encourager l’innovation en industrie.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-6 text-yellow-300">
                  Nos valeurs
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Engagement</h4>
                    <p>
                      Défendre les intérêts de la profession pharmaceutique et
                      contribuer à l’amélioration continue de la santé en
                      Algérie.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Éthique</h4>
                    <p>
                      Promouvoir une pratique professionnelle responsable,
                      respectueuse de la réglementation et des patients.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Solidarité</h4>
                    <p>
                      Fédérer les pharmaciens autour d’une vision commune, dans
                      un esprit de collaboration et de partage.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2">Innovation</h4>
                    <p>
                      Encourager la recherche, la digitalisation et l’adoption
                      de solutions modernes pour répondre aux besoins actuels et
                      futurs.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">Proximité</h4>
                    <p>
                      Être à l’écoute des pharmaciens et des citoyens pour mieux
                      répondre à leurs attentes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chiffres clés */}
        <section className="py-16 px-6 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">
              L'association en chiffres
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {keyFigures.map((figure, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-blue-800 mb-2">
                    {figure.number}
                  </div>
                  <div className="text-gray-700">{figure.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Équipe */}
<section className="py-16 px-6 bg-blue-50">
  <div className="container mx-auto">
    <h2 className="text-3xl font-bold text-center text-blue-800 mb-4">
      Membres du bureau
    </h2>
    <p className="text-lg text-center text-gray-700 max-w-3xl mx-auto mb-12">
      Voici les membres qui composent le bureau de la Fédération Algérienne des Pharmaciens.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Président */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Photo de Boudis Abdelhakim</span>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-1">Boudis Abdelhakim</h3>
          <p className="text-yellow-600 font-medium mb-4">Président</p>
          <p className="text-gray-700">Engagé dans la défense de la profession, il œuvre à renforcer la place du pharmacien dans la société algérienne.</p>
        </div>
      </div>

      {/* Vice président 1 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Photo de Selka Mohamed Adil</span>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-1">Selka Mohamed Adil</h3>
          <p className="text-yellow-600 font-medium mb-4">Vice-président 1</p>
          <p className="text-gray-700">Passionné par l’innovation pharmaceutique, il contribue au développement de solutions modernes pour la santé.</p>
        </div>
      </div>

      {/* Vice président 2 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Photo de Mezaour Yacine</span>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-1">Mezaour Yacine</h3>
          <p className="text-yellow-600 font-medium mb-4">Vice-président 2</p>
          <p className="text-gray-700">Spécialiste en santé publique, il met son expertise au service de la prévention et de la sensibilisation.</p>
        </div>
      </div>

      {/* SG */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Photo de Achouri Mohamed Yacine</span>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-1">Achouri Mohamed Yacine</h3>
          <p className="text-yellow-600 font-medium mb-4">Secrétaire Général</p>
          <p className="text-gray-700">Organisé et rigoureux, il assure la coordination et la bonne gestion administrative de la Fédération.</p>
        </div>
      </div>

      {/* Trésorier */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Photo de Zebbiche Younes</span>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-1">Zebbiche Younes</h3>
          <p className="text-yellow-600 font-medium mb-4">Trésorier</p>
          <p className="text-gray-700">Garant de la transparence financière, il veille à la bonne gestion des ressources de la Fédération.</p>
        </div>
      </div>

      {/* SG adjoint */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Photo de Khouader Nassima</span>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-1">Khouader Nassima</h3>
          <p className="text-yellow-600 font-medium mb-4">Secrétaire Général Adjoint</p>
          <p className="text-gray-700">Dynamique et impliquée, elle contribue activement à l’organisation des événements et projets de la Fédération.</p>
        </div>
      </div>

      {/* Trésorier Adjoint */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Photo de Lakhlef Oussama</span>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-blue-800 mb-1">Lakhlef Oussama</h3>
          <p className="text-yellow-600 font-medium mb-4">Trésorier Adjoint</p>
          <p className="text-gray-700">Jeune et motivé, il apporte son soutien à la gestion financière et au suivi des projets budgétaires.</p>
        </div>
      </div>
    </div>
  </div>
</section>


        {/* Partenaires */}
        <section className="py-16 px-6 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">
              Nos partenaires
            </h2>
            <p className="text-lg text-center text-gray-700 max-w-3xl mx-auto mb-12">
              Nous collaborons avec des acteurs majeurs du secteur pour offrir à
              nos membres des opportunités uniques et des contenus exclusifs.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {partners.map((partner, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center p-4 bg-gray-100 rounded-lg h-32"
                >
                  <span className="text-gray-500 text-center">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-blue-800 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Rejoignez-nous</h2>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Devenez membre de La Fédération Algérienne des Pharmaciens et bénéficiez de
              tous nos services exclusifs, ressources privilégiées et d'un
              réseau de qualité.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/membership"
                className="px-8 py-3 bg-yellow-500 text-blue-900 rounded-md hover:bg-yellow-400 transition-colors font-medium text-lg"
              >
                Devenir membre
              </a>
              <a
                href="/contact"
                className="px-8 py-3 border-2 border-white rounded-md hover:bg-white hover:text-blue-800 transition-colors font-medium text-lg"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
