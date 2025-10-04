// pages/contact.js
"use client"
import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {FaTwitter, FaInstagram, FaLinkedin, FaFacebookF } from "react-icons/fa";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici vous ajouterez la logique pour envoyer le formulaire
    console.log('Formulaire soumis:', formData);
    setIsSubmitted(true);
    
    // Réinitialiser le formulaire après 3 secondes
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div>
      <Head>
        <title>Contact - Association de Cosmétologie</title>
        <meta name="description" content="Contactez l'Association de Cosmétologie pour toute question ou demande d'information" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-blue-800 mb-4">Contactez-nous</h1>
          <p className="text-lg text-center text-gray-700 max-w-2xl mx-auto mb-12">
            Nous sommes à votre disposition pour répondre à toutes vos questions concernant l'association, l'adhésion ou nos événements.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulaire de contact */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-blue-800 mb-6">Envoyez-nous un message</h2>
              
              {isSubmitted ? (
                <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
                  Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.
                </div>
              ) : null}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Objet *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionnez un objet</option>
                    <option value="membership">Adhésion à l'association</option>
                    <option value="events">Événements et formations</option>
                    <option value="partnership">Partenariat</option>
                    <option value="information">Demande d'information</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="w-full bg-blue-800 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Envoyer le message
                  </button>
                </div>
              </form>
            </div>
            
            {/* Informations de contact */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold text-blue-800 mb-6">Nos coordonnées</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <span className="text-blue-800 text-xl">📍</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Adresse</h3>
                      <p className="text-gray-700">123 Rue de la Cosmétique<br />75000 Paris, France</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <span className="text-blue-800 text-xl">📞</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Téléphone</h3>
                      <p className="text-gray-700">+33 1 23 45 67 89</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <span className="text-blue-800 text-xl">✉️</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Email</h3>
                      <p className="text-gray-700">contact@association-cosmetologie.fr</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <span className="text-blue-800 text-xl">🕒</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Horaires</h3>
                      <p className="text-gray-700">Lundi - Vendredi: 9h - 17h<br />Week-end: Fermé</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-semibold text-blue-800 mb-6">Suivez-nous</h2>
                
                <div className="flex space-x-4">
                  <a href="#" className="h-12 w-12 bg-blue-800 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <span className="sr-only">Facebook</span>
                    <FaFacebookF/>
                  </a>
                  <a href="#" className="h-12 w-12 bg-blue-800 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <FaTwitter/>
                  </a>
                  <a href="#" className="h-12 w-12 bg-blue-800 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <span className="sr-only">LinkedIn</span>
                    <FaLinkedin/>
                  </a>
                  <a href="#" className="h-12 w-12 bg-blue-800 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <span className="sr-only">Instagram</span>
                    <FaInstagram/>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Carte de localisation */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-center text-blue-800 mb-6">Notre localisation</h2>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <span className="text-4xl mb-4">🗺️</span>
                  <p className="text-gray-600">Carte interactive ici (Intégration Google Maps ou autre)</p>
                  <p className="text-sm text-gray-500 mt-2">123 Rue de la Cosmétique, 75000 Paris</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-center text-blue-800 mb-6">Questions fréquentes</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Comment devenir membre de l'association ?</h3>
                <p className="text-gray-700">
                  Vous pouvez devenir membre en remplissant le formulaire d'adhésion en ligne sur notre site. 
                  Notre équipe vous contactera ensuite pour finaliser votre inscription.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Quels sont les avantages d'être membre ?</h3>
                <p className="text-gray-700">
                  Nos membres bénéficient d'accès privilégié à nos événements, de tarifs préférentiels sur les formations, 
                  de ressources exclusives et d'un réseau professionnel de qualité.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Comment participer à vos événements ?</h3>
                <p className="text-gray-700">
                  Consultez notre calendrier d'événements et inscrivez-vous en ligne. Les membres bénéficient de tarifs préférentiels 
                  et d'un accès prioritaire à certaines activités.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Proposez-vous des formations ?</h3>
                <p className="text-gray-700">
                  Oui, nous organisons régulièrement des formations continues pour les professionnels de la cosmétologie. 
                  Consultez notre section Événements pour découvrir notre programme.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}