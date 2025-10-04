// components/Footer.js
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-12 px-6 w-full">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Association de Cosmétologie</h3>
            <p className="mb-4">Promouvant l'excellence et l'innovation dans le secteur de la cosmétologie depuis 2010.</p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <span className="sr-only">Facebook</span>
                <FaFacebookF/>
              </a>
              <a href="#" className="h-10 w-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <span className="sr-only">Twitter</span>
              <FaTwitter/>
              </a>
              <a href="#" className="h-10 w-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin/>
              </a>
              <a href="#" className="h-10 w-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <span className="sr-only">Instagram</span>
                <FaInstagram/>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-yellow-300 transition-colors">Accueil</a></li>
              <li><a href="#about" className="hover:text-yellow-300 transition-colors">À propos</a></li>
              <li><a href="#events" className="hover:text-yellow-300 transition-colors">Événements</a></li>
              <li><a href="#gallery" className="hover:text-yellow-300 transition-colors">Galerie</a></li>
              <li><a href="#membership" className="hover:text-yellow-300 transition-colors">Adhésion</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <address className="not-italic">
              <p className="mb-2">123 Rue de la Cosmétique, Paris</p>
              <p className="mb-2">Tél: +33 1 23 45 67 89</p>
              <p className="mb-2">Email: contact@association-cosmetologie.fr</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-blue-800 mt-10 pt-6 text-center">
          <p>&copy; 2025 Association de Cosmétologie. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;