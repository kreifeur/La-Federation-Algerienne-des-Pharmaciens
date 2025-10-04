// pages/forgot-password.js
"use client"
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation d'envoi d'email de réinitialisation
    try {
      console.log('Demande de réinitialisation pour:', email);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Mot de passe oublié - La Fédération Algérienne des Pharmaciens</title>
        <meta name="description" content="Réinitialisez votre mot de passe pour accéder à votre espace membre" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      
      <main className="min-h-screen bg-blue-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              {!isSubmitted ? (
                <>
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-blue-800 mb-2">Mot de passe oublié</h1>
                    <p className="text-gray-600">
                      Entrez votre adresse email pour recevoir les instructions de réinitialisation
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Adresse email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="votre@email.com"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3 px-4 rounded-md font-medium text-white ${
                        isLoading 
                          ? 'bg-blue-400 cursor-not-allowed' 
                          : 'bg-blue-800 hover:bg-blue-700'
                      } transition-colors`}
                    >
                      {isLoading ? 'Envoi en cours...' : 'Réinitialiser le mot de passe'}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <Link href="/login" className="text-blue-600 text-sm hover:underline">
                      ← Retour à la connexion
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="text-green-500 text-5xl mb-4">✓</div>
                  <h2 className="text-xl font-semibold text-blue-800 mb-4">Email envoyé !</h2>
                  <p className="text-gray-600 mb-6">
                    Un email avec les instructions de réinitialisation a été envoyé à <strong>{email}</strong>.
                  </p>
                  <p className="text-sm text-gray-500 mb-6">
                    Si vous ne recevez pas l'email dans les prochaines minutes, vérifiez votre dossier spam
                    ou contactez notre support.
                  </p>
                  <Link 
                    href="/login"
                    className="px-6 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-700 transition-colors font-medium inline-block"
                  >
                    Retour à la connexion
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}