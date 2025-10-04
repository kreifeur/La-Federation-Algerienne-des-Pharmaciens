// components/About.js
const About = () => {
  return (
    <section id="about" className="py-16 px-6 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">
          À propos de la Fédération
        </h2>

        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="md:w-1/2">
            <div className="bg-blue-100 rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4 text-blue-800">
                Nos missions
              </h3>
              <p className="mb-4">
                La Fédération Algérienne des Pharmaciens est une organisation
                professionnelle qui regroupe et représente les pharmaciens
                exerçant dans différents secteurs : officine, industrie,
                hôpital, recherche et distribution. Elle œuvre pour la
                valorisation de la profession, le renforcement des compétences
                et la protection de la santé publique.
              </p>
              <p className="mb-4">Nous œuvrons pour :</p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>
                  Représentation : Porter la voix des pharmaciens auprès des
                  institutions nationales et internationales.
                </li>
                <li>
                  Développement professionnel : Organiser des formations,
                  congrès et ateliers pour renforcer les compétences des
                  pharmaciens.
                </li>
                <li>
                  Santé publique : Participer aux campagnes de prévention et
                  sensibilisation pour améliorer la santé des citoyens.
                </li>
                <li>
                  Encadrement et réglementation : Veiller au respect des textes
                  législatifs et proposer des réformes adaptées aux évolutions
                  du secteur.
                </li>
                <li>
                  Promotion de la recherche et de l’industrie : Valoriser la
                  recherche pharmaceutique nationale et encourager l’innovation
                  en industrie.
                </li>
              </ul>
              <p>
                Rejoignez-nous pour contribuer au développement de notre secteur
                et bénéficier de nombreux avantages réservés à nos membres.
              </p>
            </div>
          </div>

          <div className="md:w-1/2">
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <span className="text-gray-500">Image de l'équipe ou logo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
