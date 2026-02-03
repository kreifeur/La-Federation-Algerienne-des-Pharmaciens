"use client";
import { useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("");

  const sections = [
    { id: "collecte", title: "1. Collecte des Données Personnelles" },
    { id: "utilisation", title: "2. Utilisation des Données" },
    { id: "partage", title: "3. Partage des Données" },
    { id: "securite", title: "4. Sécurité des Données" },
    { id: "droits", title: "5. Vos Droits" },
    { id: "contact", title: "6. Contact" },
  ];

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Politique de Confidentialité - Fédération Algérienne des Pharmaciens</title>
        <meta
          name="description"
          content="Politique de confidentialité de la Fédération Algérienne des Pharmaciens. Nous protégeons vos données personnelles conformément à la loi algérienne."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-12 pt-3">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
              Politique de Confidentialité
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              La <span className="font-semibold text-blue-800">Fédération Algérienne des Pharmaciens</span> s'engage à protéger la confidentialité de vos données personnelles conformément aux lois en vigueur en Algérie.
            </p>
            <div className="mt-8">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-semibold">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Conforme à la Loi n° 18-07
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Table of Contents - Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">
                  Sommaire
                </h2>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(section.id)}
                      className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                        activeSection === section.id
                          ? "bg-blue-50 text-blue-800 border-l-4 border-blue-800"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>

                {/* Last Updated */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Dernière mise à jour :</span>
                    <br />
                    25 Décembre 2024
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-lg shadow-md p-8">
                {/* Introduction */}
                <div className="mb-10">
                  <p className="text-gray-700 leading-relaxed">
                    La <span className="font-semibold text-blue-800">Fédération Algérienne des Pharmaciens</span> s'engage à protéger la confidentialité de vos données personnelles conformément aux lois en vigueur en Algérie, notamment la Loi n° 18-07 relative à la protection des données à caractère personnel. Ce document explique comment nous collectons, utilisons et partageons vos informations personnelles.
                  </p>
                </div>

                {/* Section 1 */}
                <section id="collecte" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      1
                    </span>
                    Collecte des Données Personnelles
                  </h2>
                  
                  <div className="ml-13">
                    <p className="text-gray-700 mb-4">
                      Nous collectons les informations personnelles nécessaires à la fourniture de nos services, notamment :
                    </p>
                    
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span><strong>Identifiants personnels</strong> (nom, prénom, date de naissance, etc.)</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span><strong>Coordonnées</strong> (adresse, numéro de téléphone, adresse email)</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span><strong>Données de paiement</strong> (numéro de carte bancaire, informations de compte)</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span><strong>Données professionnelles</strong> (diplôme, spécialité, établissement d'exercice)</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="w-5 h-5 text-blue-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span><strong>Données techniques</strong> (adresse IP, données de connexion et de navigation)</span>
                      </li>
                    </ul>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 mb-6">
                      <h3 className="font-semibold text-blue-800 mb-2">Images et contenu multimédia</h3>
                      <p className="text-gray-700 mb-3">
                        Notre site web et notre plateforme peuvent collecter des images des utilisateurs à des fins diverses, telles que les photos de profil ou la soumission de contenu.
                      </p>
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <p className="text-sm text-gray-700 italic">
                          "Veuillez noter que toutes les images soumises sur notre plateforme peuvent être stockées sur nos serveurs pour une utilisation future. Cependant, nous ne partageons pas ces images avec des tiers ; elles sont uniquement utilisées en interne, par exemple pour améliorer nos services et l'expérience utilisateur. En soumettant une image sur notre plateforme, vous reconnaissez et consentez à notre collecte et stockage de votre image."
                        </p>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-100 rounded-lg p-5">
                      <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        1.1. Comment protégeons-nous vos informations ?
                      </h3>
                      <p className="text-gray-700">
                        Toutes les données relatives aux informations bancaires des utilisateurs sont gérées par <span className="font-semibold">SATIM</span>. Après un échange, vos données privées ne seront pas partagées avec nos collaborateurs.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 2 */}
                <section id="utilisation" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      2
                    </span>
                    Utilisation des Données
                  </h2>
                  
                  <div className="ml-13">
                    <p className="text-gray-700 mb-6">
                      Nous utilisons vos données personnelles pour :
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                            </svg>
                          </div>
                          <span className="font-medium text-blue-800">Inscription</span>
                        </div>
                        <p className="text-sm text-gray-700">Vous inscrire en tant que nouveau membre</p>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="font-medium text-blue-800">Paiement</span>
                        </div>
                        <p className="text-sm text-gray-700">Assurer le processus de paiement de vos cotisations</p>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                          </div>
                          <span className="font-medium text-blue-800">Relation membre</span>
                        </div>
                        <p className="text-sm text-gray-700">Gérer votre relation avec nous</p>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="font-medium text-blue-800">Amélioration</span>
                        </div>
                        <p className="text-sm text-gray-700">Améliorer nos services et votre expérience</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-5">
                      <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                        </svg>
                        2.1. Cookies et autres identifiants
                      </h3>
                      <p className="text-gray-700 mb-3">
                        Nous utilisons des cookies techniques pour faciliter et exécuter certaines fonctions lors de votre navigation sur notre site web. Ces cookies ne sont pas utilisés à des fins publicitaires.
                      </p>
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <p className="text-sm text-gray-700 italic">
                          Si nous devions utiliser des cookies publicitaires à l'avenir, nous vous en informerions à l'avance et demanderions votre consentement.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 3 */}
                <section id="partage" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      3
                    </span>
                    Partage des Données
                  </h2>
                  
                  <div className="ml-13">
                    <p className="text-gray-700 mb-6">
                      Vos informations personnelles ne sont partagées qu'avec :
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="bg-blue-100 text-blue-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">Partenaires nécessaires</h4>
                        <p className="text-sm text-gray-600">Nos partenaires strictement nécessaires à la fourniture des services</p>
                      </div>
                      
                      <div className="text-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="bg-red-100 text-red-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">Autorités</h4>
                        <p className="text-sm text-gray-600">Les autorités réglementaires si la loi algérienne l'exige</p>
                      </div>
                      
                      <div className="text-center p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="bg-green-100 text-green-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M3 8V7a1 1 0 011-1h12a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-2">Prestataires de paiement</h4>
                        <p className="text-sm text-gray-600">SATIM pour le traitement sécurisé des transactions</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 4 */}
                <section id="securite" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      4
                    </span>
                    Sécurité des Données
                  </h2>
                  
                  <div className="ml-13">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 mb-6">
                      <p className="text-gray-700 leading-relaxed">
                        Nous mettons en œuvre des mesures de sécurité pour protéger vos données contre toute accès non autorisé, modification ou divulgation. Le personnel de notre fédération et nos sous-traitants chargés du traitement des données peuvent avoir accès à vos données pour les finalités mentionnées dans cette politique.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                        <div className="flex items-center mb-3">
                          <div className="bg-green-100 text-green-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-800">Sous-traitants certifiés</h3>
                        </div>
                        <p className="text-gray-700 text-sm">
                          Nous veillons à ce que nos sous-traitants respectent des normes élevées en matière de protection des données.
                        </p>
                      </div>
                      
                      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                        <div className="flex items-center mb-3">
                          <div className="bg-purple-100 text-purple-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-800">Accès limité</h3>
                        </div>
                        <p className="text-gray-700 text-sm">
                          L'accès aux données est strictement contrôlé et limité aux personnes autorisées.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 5 */}
                <section id="droits" className="mb-12 scroll-mt-24">
                  <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      5
                    </span>
                    Vos Droits
                  </h2>
                  
                  <div className="ml-13">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <p className="text-gray-700 mb-6">
                        Conformément à la Loi n° 18-07, vous disposez des droits suivants concernant vos données personnelles :
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="bg-blue-800 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <span className="text-sm">A</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">Droit d'accès</h4>
                            <p className="text-gray-700 text-sm">Vous avez le droit d'accéder à vos données personnelles.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-blue-800 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <span className="text-sm">R</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">Droit de rectification</h4>
                            <p className="text-gray-700 text-sm">Vous pouvez demander la correction de données inexactes.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-blue-800 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <span className="text-sm">E</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">Droit à l'effacement</h4>
                            <p className="text-gray-700 text-sm">Vous pouvez demander la suppression de vos données.</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-blue-800 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <span className="text-sm">P</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">Droit à la portabilité</h4>
                            <p className="text-gray-700 text-sm">Vous pouvez récupérer vos données dans un format structuré.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          Pour exercer vos droits, veuillez nous contacter à l'adresse email indiquée dans la section "Contact".
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 6 */}
                <section id="contact" className="scroll-mt-24">
                  <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      6
                    </span>
                    Contact
                  </h2>
                  
                  <div className="ml-13">
                    <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-lg p-8">
                      <h3 className="text-xl font-bold mb-4">Contactez notre Délégué à la Protection des Données</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">Par email</h4>
                          <a 
                            href="mailto:protection-donnees@federation-pharmaciens.dz" 
                            className="inline-flex items-center bg-white text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            protection-donnees@federation-pharmaciens.dz
                          </a>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Par téléphone</h4>
                          <a 
                            href="tel:+213XXXXXXXXX" 
                            className="inline-flex items-center bg-white text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            +213 (0) XXX XX XX XX
                          </a>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-blue-400">
                        <p className="text-blue-100">
                          Pour toute question concernant notre politique de confidentialité ou pour exercer vos droits, n'hésitez pas à nous contacter.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Footer Note */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Cette politique de confidentialité peut être mise à jour périodiquement. Nous vous encourageons à la consulter régulièrement.
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="inline-flex items-center text-blue-800 hover:text-blue-600 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Retour en haut
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}