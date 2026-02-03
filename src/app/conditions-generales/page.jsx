"use client";

import { useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TermsConditions() {
  const [activeSection, setActiveSection] = useState("");

  const sections = [
    { id: "objet", title: "Article 1 - Objet" },
    { id: "adhesion", title: "Article 2 - Adhésion" },
    { id: "cotisations", title: "Article 3 - Cotisations et Paiements" },
    { id: "droits", title: "Article 4 - Droits des Membres" },
    { id: "obligations", title: "Article 5 - Obligations des Membres" },
    { id: "responsabilite", title: "Article 6 - Responsabilité" },
    { id: "confidentialite", title: "Article 7 - Confidentialité" },
    { id: "sanctions", title: "Article 8 - Sanctions" },
    { id: "modifications", title: "Article 9 - Modifications" },
    { id: "droit", title: "Article 10 - Droit Applicable" },
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
        <title>Conditions Générales - Fédération Algérienne des Pharmaciens</title>
        <meta
          name="description"
          content="Conditions générales d'adhésion à la Fédération Algérienne des Pharmaciens. Règles, droits et obligations des membres."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-semibold mb-4">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Conditions Générales d'Adhésion
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Conditions Générales
            </h1>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Règles et conditions régissant l'adhésion à la <span className="font-semibold text-blue-800">Fédération Algérienne des Pharmaciens</span>.
            </p>
            
            {/* Important Notice */}
            <div className="mt-8 max-w-3xl mx-auto">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-yellow-600 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-2">Note Importante</h3>
                    <p className="text-yellow-700 text-sm">
                      En souscrivant à une adhésion, vous reconnaissez avoir lu, compris et accepté l'intégralité des présentes conditions générales. 
                      Ces conditions constituent le contrat complet entre vous et la Fédération Algérienne des Pharmaciens.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Table of Contents - Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Sommaire des Articles
                </h2>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(section.id)}
                      className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                        activeSection === section.id
                          ? "bg-blue-50 text-blue-800 border-l-4 border-blue-800"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-800"
                      }`}
                    >
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  ))}
                </nav>

                {/* Document Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Version</p>
                      <p className="text-sm text-gray-600">2.1</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Entrée en vigueur</p>
                      <p className="text-sm text-gray-600">1er Janvier 2024</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Dernière mise à jour</p>
                      <p className="text-sm text-gray-600">25 Décembre 2024</p>
                    </div>
                  </div>
                </div>

                {/* Download Button */}
                <div className="mt-6">
                  <button
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Télécharger en PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-lg shadow-lg p-8">
                {/* Introduction */}
                <div className="mb-10 pb-8 border-b border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-800 text-white rounded-lg w-12 h-12 flex items-center justify-center mr-4">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Conditions Générales d'Adhésion</h2>
                      <p className="text-gray-600">Fédération Algérienne des Pharmaciens</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-5">
                    <p className="text-gray-700 leading-relaxed">
                      Les présentes conditions générales régissent les relations entre la <span className="font-semibold">Fédération Algérienne des Pharmaciens</span>, 
                      ci-après dénommée "la Fédération", et ses membres, ci-après dénommés "le Membre" ou "les Membres". 
                      Toute adhésion à la Fédération implique l'acceptation sans réserve des présentes conditions générales.
                    </p>
                  </div>
                </div>

                {/* Article 1 */}
                <section id="objet" className="mb-12 scroll-mt-24">
                  <div className="flex items-start mb-6">
                    <div className="bg-blue-100 text-blue-800 rounded-lg w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="font-bold">1</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Article 1 - Objet</h2>
                      <div className="w-16 h-1 bg-blue-800 mt-2"></div>
                    </div>
                  </div>
                  
                  <div className="ml-14">
                    <div className="space-y-4">
                      <p className="text-gray-700">
                        Les présentes conditions générales ont pour objet de définir les règles régissant :
                      </p>
                      
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="bg-blue-50 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <span className="text-blue-800 text-sm">1.1</span>
                          </div>
                          <span>L'adhésion à la Fédération Algérienne des Pharmaciens</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-blue-50 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <span className="text-blue-800 text-sm">1.2</span>
                          </div>
                          <span>Les droits et obligations des Membres</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-blue-50 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <span className="text-blue-800 text-sm">1.3</span>
                          </div>
                          <span>Les modalités de cotisation et de paiement</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-blue-50 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <span className="text-blue-800 text-sm">1.4</span>
                          </div>
                          <span>Les règles de déontologie et d'éthique professionnelle</span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-blue-50 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <span className="text-blue-800 text-sm">1.5</span>
                          </div>
                          <span>Les modalités de résiliation de l'adhésion</span>
                        </li>
                      </ul>
                      
                      <div className="bg-blue-50 border-l-4 border-blue-800 p-4 mt-4">
                        <p className="text-gray-700 italic">
                          La Fédération se réserve le droit de modifier les présentes conditions générales. 
                          Les Membres seront informés des modifications par email au moins 30 jours avant leur entrée en vigueur.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Article 2 */}
                <section id="adhesion" className="mb-12 scroll-mt-24">
                  <div className="flex items-start mb-6">
                    <div className="bg-blue-100 text-blue-800 rounded-lg w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="font-bold">2</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Article 2 - Adhésion</h2>
                      <div className="w-16 h-1 bg-blue-800 mt-2"></div>
                    </div>
                  </div>
                  
                  <div className="ml-14">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">2.1. Conditions d'éligibilité</h3>
                        <p className="text-gray-700 mb-4">
                          Peut devenir Membre de la Fédération toute personne physique ou morale remplissant les conditions suivantes :
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-800 mb-2">Pour les personnes physiques :</h4>
                            <ul className="text-sm text-gray-700 space-y-2">
                              <li className="flex items-start">
                                <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Être titulaire d'un diplôme de pharmacien reconnu en Algérie
                              </li>
                              <li className="flex items-start">
                                <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Être inscrit à l'Ordre des Pharmaciens
                              </li>
                              <li className="flex items-start">
                                <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Être en règle avec la législation professionnelle
                              </li>
                            </ul>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-800 mb-2">Pour les personnes morales :</h4>
                            <ul className="text-sm text-gray-700 space-y-2">
                              <li className="flex items-start">
                                <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Être une entreprise du secteur pharmaceutique
                              </li>
                              <li className="flex items-start">
                                <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Avoir un représentant légal pharmacien
                              </li>
                              <li className="flex items-start">
                                <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Être enregistrée au registre du commerce
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">2.2. Procédure d'adhésion</h3>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <div className="bg-blue-800 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                              <span className="text-xs">1</span>
                            </div>
                            <div>
                              <p className="text-gray-700">
                                <span className="font-medium">Soumission de la demande :</span> Le candidat remplit le formulaire d'adhésion en ligne et fournit les documents requis.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-blue-800 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                              <span className="text-xs">2</span>
                            </div>
                            <div>
                              <p className="text-gray-700">
                                <span className="font-medium">Vérification :</span> La Fédération vérifie les documents et l'éligibilité du candidat sous 15 jours ouvrés.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-blue-800 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                              <span className="text-xs">3</span>
                            </div>
                            <div>
                              <p className="text-gray-700">
                                <span className="font-medium">Validation :</span> La commission d'adhésion statue sur la demande.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-blue-800 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                              <span className="text-xs">4</span>
                            </div>
                            <div>
                              <p className="text-gray-700">
                                <span className="font-medium">Paiement :</span> Le candidat procède au paiement de la cotisation annuelle.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-blue-800 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                              <span className="text-xs">5</span>
                            </div>
                            <div>
                              <p className="text-gray-700">
                                <span className="font-medium">Activation :</span> L'adhésion est activée et la carte de membre est envoyée.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Article 3 */}
                <section id="cotisations" className="mb-12 scroll-mt-24">
                  <div className="flex items-start mb-6">
                    <div className="bg-blue-100 text-blue-800 rounded-lg w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="font-bold">3</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Article 3 - Cotisations et Paiements</h2>
                      <div className="w-16 h-1 bg-blue-800 mt-2"></div>
                    </div>
                  </div>
                  
                  <div className="ml-14">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">3.1. Montant des cotisations</h3>
                        
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Catégorie
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Montant Annuel (DA)
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Validité
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  Étudiant en pharmacie
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  2 500 DA
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  1 an
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  Pharmacien individuel
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  8 000 DA
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  1 an
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  Entreprise/Institution
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  35 000 DA
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  1 an
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">3.2. Modalités de paiement</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <h4 className="font-medium text-gray-800">En ligne</h4>
                            </div>
                            <p className="text-sm text-gray-600">Paiement sécurisé via SATIM (CIB/EDAHABIA)</p>
                          </div>
                          
                          <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <h4 className="font-medium text-gray-800">En espèces</h4>
                            </div>
                            <p className="text-sm text-gray-600">Paiement au siège de la Fédération</p>
                          </div>
                          
                          <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <div className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                                  <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                                </svg>
                              </div>
                              <h4 className="font-medium text-gray-800">Virement bancaire</h4>
                            </div>
                            <p className="text-sm text-gray-600">Sur le compte de la Fédération</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
                        <h3 className="text-lg font-semibold text-yellow-800 mb-2">3.3. Renouvellement</h3>
                        <p className="text-gray-700">
                          Les cotisations sont annuelles et se renouvellent automatiquement. Un rappel est envoyé par email 30 jours avant l'échéance. 
                          Le défaut de paiement dans les 30 jours suivant la date d'échéance entraîne la suspension des droits du Membre.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Article 4 */}
                <section id="droits" className="mb-12 scroll-mt-24">
                  <div className="flex items-start mb-6">
                    <div className="bg-blue-100 text-blue-800 rounded-lg w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="font-bold">4</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Article 4 - Droits des Membres</h2>
                      <div className="w-16 h-1 bg-blue-800 mt-2"></div>
                    </div>
                  </div>
                  
                  <div className="ml-14">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-lg p-5">
                        <div className="flex items-center mb-3">
                          <div className="bg-blue-800 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-800">Accès aux événements</h3>
                        </div>
                        <ul className="text-sm text-gray-700 space-y-2">
                          <li className="flex items-start">
                            <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Participation aux congrès et séminaires
                          </li>
                          <li className="flex items-start">
                            <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Tarifs préférentiels sur les formations
                          </li>
                          <li className="flex items-start">
                            <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Accès VIP pour certaines catégories
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-5">
                        <div className="flex items-center mb-3">
                          <div className="bg-green-800 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-800">Ressources documentaires</h3>
                        </div>
                        <ul className="text-sm text-gray-700 space-y-2">
                          <li className="flex items-start">
                            <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Accès à la bibliothèque numérique
                          </li>
                          <li className="flex items-start">
                            <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Revue trimestrielle spécialisée
                          </li>
                          <li className="flex items-start">
                            <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Veille réglementaire
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-5">
                        <div className="flex items-center mb-3">
                          <div className="bg-purple-800 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-800">Reconnaissance</h3>
                        </div>
                        <ul className="text-sm text-gray-700 space-y-2">
                          <li className="flex items-start">
                            <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Carte de membre officielle
                          </li>
                          <li className="flex items-start">
                            <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Certification professionnelle
                          </li>
                          <li className="flex items-start">
                            <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Mention sur le site web (entreprises)
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-orange-50 rounded-lg p-5">
                        <div className="flex items-center mb-3">
                          <div className="bg-orange-800 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-800">Support et assistance</h3>
                        </div>
                        <ul className="text-sm text-gray-700 space-y-2">
                          <li className="flex items-start">
                            <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Accès à l'espace membre en ligne
                          </li>
                          <li className="flex items-start">
                            <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Support technique prioritaire
                          </li>
                          <li className="flex items-start">
                            <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Conseil professionnel personnalisé
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6 bg-blue-50 border-l-4 border-blue-800 p-4">
                      <p className="text-gray-700 text-sm">
                        <span className="font-semibold">Note :</span> L'exercice de ces droits est conditionné au paiement à jour des cotisations et au respect des obligations déontologiques.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Article 5 */}
                <section id="obligations" className="mb-12 scroll-mt-24">
                  <div className="flex items-start mb-6">
                    <div className="bg-blue-100 text-blue-800 rounded-lg w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="font-bold">5</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Article 5 - Obligations des Membres</h2>
                      <div className="w-16 h-1 bg-blue-800 mt-2"></div>
                    </div>
                  </div>
                  
                  <div className="ml-14">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">5.1. Obligations générales</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="bg-red-50 text-red-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Respect de l'éthique professionnelle</p>
                              <p className="text-sm text-gray-600 mt-1">
                                Le Membre s'engage à respecter les règles de déontologie pharmaceutique et à maintenir une conduite professionnelle exemplaire.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-red-50 text-red-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Exactitude des informations</p>
                              <p className="text-sm text-gray-600 mt-1">
                                Le Membre garantit l'exactitude et la sincérité des informations fournies lors de son adhésion et s'engage à les mettre à jour en cas de changement.
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-red-50 text-red-800 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Paiement des cotisations</p>
                              <p className="text-sm text-gray-600 mt-1">
                                Le Membre s'engage à payer les cotisations dans les délais impartis et à jour.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">5.2. Restrictions</h3>
                        
                        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                          <p className="text-red-800 font-medium mb-2">Le Membre s'engage à ne pas :</p>
                          <ul className="text-sm text-red-700 space-y-2">
                            <li className="flex items-start">
                              <div className="w-1 h-1 bg-red-800 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                              Utiliser son statut de membre à des fins commerciales non autorisées
                            </li>
                            <li className="flex items-start">
                              <div className="w-1 h-1 bg-red-800 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                              Partager son accès à l'espace membre avec des tiers
                            </li>
                            <li className="flex items-start">
                              <div className="w-1 h-1 bg-red-800 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                              Porter atteinte à l'image ou à la réputation de la Fédération
                            </li>
                            <li className="flex items-start">
                              <div className="w-1 h-1 bg-red-800 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                              Violer les droits de propriété intellectuelle de la Fédération
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Article 6 */}
                <section id="responsabilite" className="mb-12 scroll-mt-24">
                  <div className="flex items-start mb-6">
                    <div className="bg-blue-100 text-blue-800 rounded-lg w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="font-bold">6</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Article 6 - Responsabilité</h2>
                      <div className="w-16 h-1 bg-blue-800 mt-2"></div>
                    </div>
                  </div>
                  
                  <div className="ml-14">
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-lg p-5">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">6.1. Responsabilité de la Fédération</h3>
                        <p className="text-gray-700 mb-3">
                          La Fédération s'engage à :
                        </p>
                        <ul className="text-sm text-gray-700 space-y-2 mb-4">
                          <li className="flex items-start">
                            <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Fournir les services décrits dans les présentes conditions
                          </li>
                          <li className="flex items-start">
                            <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Respecter la confidentialité des données des Membres
                          </li>
                          <li className="flex items-start">
                            <svg className="w-4 h-4 text-green-600 mt-1 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Maintenir un environnement professionnel et respectueux
                          </li>
                        </ul>
                        
                        <div className="bg-yellow-50 p-4 rounded border border-yellow-100">
                          <p className="text-sm text-yellow-800 italic">
                            La responsabilité de la Fédération est limitée au montant de la cotisation annuelle. 
                            Elle ne saurait être tenue responsable des dommages indirects ou consécutifs.
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-5">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">6.2. Responsabilité du Membre</h3>
                        <p className="text-gray-700 mb-3">
                          Le Membre est responsable :
                        </p>
                        <ul className="text-sm text-gray-700 space-y-2">
                          <li className="flex items-start">
                            <div className="w-1 h-1 bg-gray-800 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            De l'utilisation qu'il fait des services de la Fédération
                          </li>
                          <li className="flex items-start">
                            <div className="w-1 h-1 bg-gray-800 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            Du maintien de la confidentialité de ses identifiants
                          </li>
                          <li className="flex items-start">
                            <div className="w-1 h-1 bg-gray-800 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            Des contenus qu'il publie ou partage via les plateformes de la Fédération
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Article 7 */}
                <section id="confidentialite" className="mb-12 scroll-mt-24">
                  <div className="flex items-start mb-6">
                    <div className="bg-blue-100 text-blue-800 rounded-lg w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="font-bold">7</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Article 7 - Confidentialité</h2>
                      <div className="w-16 h-1 bg-blue-800 mt-2"></div>
                    </div>
                  </div>
                  
                  <div className="ml-14">
                    <div className="bg-blue-50 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <svg className="w-6 h-6 text-blue-800 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-800">Protection des données personnelles</h3>
                      </div>
                      
                      <p className="text-gray-700 mb-4">
                        La Fédération s'engage à protéger les données personnelles des Membres conformément à la Loi n° 18-07 
                        relative à la protection des données à caractère personnel et à sa politique de confidentialité.
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="bg-blue-800 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <span className="text-xs">7.1</span>
                          </div>
                          <div>
                            <p className="text-gray-700">
                              <span className="font-medium">Collecte des données :</span> Les données sont collectées uniquement pour les finalités définies dans la politique de confidentialité.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-blue-800 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <span className="text-xs">7.2</span>
                          </div>
                          <div>
                            <p className="text-gray-700">
                              <span className="font-medium">Utilisation des données :</span> Les données ne sont utilisées que pour la gestion de l'adhésion et la fourniture des services.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-blue-800 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <span className="text-xs">7.3</span>
                          </div>
                          <div>
                            <p className="text-gray-700">
                              <span className="font-medium">Partage des données :</span> Les données ne sont partagées qu'avec les partenaires strictement nécessaires ou si requis par la loi.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-blue-200">
                        <p className="text-sm text-gray-600">
                          Pour plus d'informations, consultez notre <a href="/privacy-policy" className="text-blue-800 hover:underline font-medium">Politique de Confidentialité</a>.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Article 8 */}
                <section id="sanctions" className="mb-12 scroll-mt-24">
                  <div className="flex items-start mb-6">
                    <div className="bg-blue-100 text-blue-800 rounded-lg w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="font-bold">8</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Article 8 - Sanctions</h2>
                      <div className="w-16 h-1 bg-blue-800 mt-2"></div>
                    </div>
                  </div>
                  
                  <div className="ml-14">
                    <div className="space-y-6">
                      <div className="bg-red-50 border border-red-100 rounded-lg p-5">
                        <h3 className="text-lg font-semibold text-red-800 mb-3">8.1. Motifs de sanctions</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-red-800 mb-2">Sanctions légères</h4>
                            <ul className="text-sm text-red-700 space-y-1">
                              <li className="flex items-start">
                                <div className="w-1 h-1 bg-red-800 rounded-full mt-2 mr-2"></div>
                                Retard de paiement supérieur à 30 jours
                              </li>
                              <li className="flex items-start">
                                <div className="w-1 h-1 bg-red-800 rounded-full mt-2 mr-2"></div>
                                Non-respect mineur du règlement intérieur
                              </li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-red-800 mb-2">Sanctions graves</h4>
                            <ul className="text-sm text-red-700 space-y-1">
                              <li className="flex items-start">
                                <div className="w-1 h-1 bg-red-800 rounded-full mt-2 mr-2"></div>
                                Fraude ou fausse déclaration
                              </li>
                              <li className="flex items-start">
                                <div className="w-1 h-1 bg-red-800 rounded-full mt-2 mr-2"></div>
                                Atteinte à l'image de la Fédération
                              </li>
                              <li className="flex items-start">
                                <div className="w-1 h-1 bg-red-800 rounded-full mt-2 mr-2"></div>
                                Violation grave de l'éthique professionnelle
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-5">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">8.2. Types de sanctions</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="bg-yellow-100 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                              <span className="text-sm font-bold">A</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Avertissement écrit</p>
                              <p className="text-sm text-gray-600 mt-1">Notification par email avec mise en demeure de régularisation</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-orange-100 text-orange-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                              <span className="text-sm font-bold">S</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Suspension temporaire</p>
                              <p className="text-sm text-gray-600 mt-1">Suspension des droits d'accès aux services pour une durée déterminée</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="bg-red-100 text-red-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                              <span className="text-sm font-bold">R</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">Radi définitive</p>
                              <p className="text-sm text-gray-600 mt-1">Exclusion définitive sans remboursement des cotisations</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Procédure :</span> Toute sanction fait l'objet d'une procédure contradictoire. 
                            Le Membre dispose de 15 jours pour présenter ses observations avant décision définitive.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Article 9 */}
                <section id="modifications" className="mb-12 scroll-mt-24">
                  <div className="flex items-start mb-6">
                    <div className="bg-blue-100 text-blue-800 rounded-lg w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="font-bold">9</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Article 9 - Modifications</h2>
                      <div className="w-16 h-1 bg-blue-800 mt-2"></div>
                    </div>
                  </div>
                  
                  <div className="ml-14">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <svg className="w-6 h-6 text-gray-800 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-800">Modification des conditions générales</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <p className="text-gray-700">
                          La Fédération se réserve le droit de modifier les présentes conditions générales à tout moment. 
                          Les modifications entrent en vigueur selon les modalités suivantes :
                        </p>
                        
                        <div className="flex items-start">
                          <div className="bg-blue-800 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <span className="text-sm">30j</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Préavis de 30 jours</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Les Membres sont informés des modifications par email au moins 30 jours avant leur entrée en vigueur.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-blue-800 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <span className="text-sm">AC</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Acceptation continue</p>
                            <p className="text-sm text-gray-600 mt-1">
                              La poursuite de l'adhésion après l'entrée en vigueur des modifications vaut acceptation des nouvelles conditions.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="bg-blue-800 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <span className="text-sm">RT</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Droit de résiliation</p>
                            <p className="text-sm text-gray-600 mt-1">
                              En cas de désaccord avec les modifications, le Membre peut résilier son adhésion sans frais dans les 30 jours suivant la notification.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          Les conditions générales en vigueur sont toujours disponibles sur le site web de la Fédération.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Article 10 */}
                <section id="droit" className="scroll-mt-24">
                  <div className="flex items-start mb-6">
                    <div className="bg-blue-100 text-blue-800 rounded-lg w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                      <span className="font-bold">10</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Article 10 - Droit Applicable</h2>
                      <div className="w-16 h-1 bg-blue-800 mt-2"></div>
                    </div>
                  </div>
                  
                  <div className="ml-14">
                    <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-lg p-8">
                      <div className="flex items-center mb-4">
                        <svg className="w-8 h-8 text-white mr-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-xl font-bold">Règlement des litiges</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Droit applicable</h4>
                          <p>
                            Les présentes conditions générales sont régies et interprétées conformément au droit algérien.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Tribunal compétent</h4>
                          <p>
                            En cas de litige, les tribunaux de [Ville] sont seuls compétents.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Conciliation préalable</h4>
                          <p>
                            Toute contestation fait l'objet d'une tentative de conciliation amiable avant toute action judiciaire.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Langue</h4>
                          <p>
                            Les présentes conditions générales sont rédigées en langue française. En cas de divergence avec une version traduite, la version française prévaut.
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-8 pt-6 border-t border-blue-400">
                        <p className="text-blue-100 text-sm">
                          Fait à [Ville], le [Date]
                          <br />
                          Pour la Fédération Algérienne des Pharmaciens
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-start">
                        <svg className="w-6 h-6 text-green-600 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <h3 className="font-semibold text-green-800 mb-2">Acceptation des conditions</h3>
                          <p className="text-green-700">
                            En souscrivant à une adhésion, vous déclarez avoir lu, compris et accepté l'intégralité des présentes conditions générales. 
                            Ces conditions constituent le contrat complet entre vous et la Fédération Algérienne des Pharmaciens.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Final Section */}
                <div className="mt-16 pt-8 border-t border-gray-200">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-800 text-white rounded-full mb-4">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Questions ?</h3>
                    <p className="text-gray-700 max-w-2xl mx-auto mb-6">
                      Pour toute question concernant ces conditions générales, n'hésitez pas à contacter notre service juridique.
                    </p>
                    
                    <a
                      href="mailto:juridique@federation-pharmaciens.dz"
                      className="inline-flex items-center px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Contact juridique
                    </a>
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