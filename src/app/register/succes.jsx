// pages/register/success.js
import Head from 'next/head';
import Link from 'next/link';

export default function RegisterSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <Head>
        <title>Inscription réussie - La Fédération Algérienne des Pharmaciens</title>
      </Head>

      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Inscription réussie !</h1>
        <p className="text-gray-600 mb-6">
          Bienvenue dans La Fédération Algérienne des Pharmaciens. Un email de confirmation a été envoyé à votre adresse.
        </p>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
          <h3 className="font-semibold text-blue-800 mb-2">Prochaines étapes :</h3>
          <ul className="text-sm text-blue-600 space-y-1">
            <li>• Vérifiez votre email pour confirmer votre compte</li>
            <li>• Accédez à votre espace membre</li>
            <li>• Découvrez les événements à venir</li>
            <li>• Explorez les ressources exclusives</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="w-full bg-blue-800 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors block"
          >
            Se connecter
          </Link>
          <Link
            href="/"
            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors block"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}