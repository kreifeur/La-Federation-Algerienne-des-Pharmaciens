// pages/register/success.js
"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function RegisterSuccess() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Call the confirmation API when component mounts
    const confirmPayment = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/confirmation");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setStatus(data);

        // You can also check the payment status from the response
        // and update the UI accordingly
        if (data.errorCode === "0") {
          // Payment was successful
          console.log("Payment confirmed:", data);
        } else {
          // Handle payment failure
          console.error("Payment failed:", data);
        }
      } catch (err) {
        console.error("Error confirming payment:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <Head>
        <title>
          Inscription réussie - La Fédération Algérienne des Pharmaciens
        </title>
      </Head>

      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        {loading ? (
          <div className="py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800 mx-auto mb-4"></div>
            <p className="text-gray-600">
              Confirmation du paiement en cours...
            </p>
          </div>
        ) : error ? (
          <>
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Erreur de confirmation
            </h1>
            <p className="text-gray-600 mb-6">
              Une erreur est survenue lors de la confirmation de votre paiement.
              Veuillez contacter le support.
            </p>
            <p className="text-sm text-red-500 mb-6">{error}</p>
          </>
        ) : (
          <>
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Inscription réussie !
            </h1>
            <p className="text-gray-600 mb-6">
              Bienvenue dans La Fédération Algérienne des Pharmaciens. Un email
              de confirmation a été envoyé à votre adresse.
            </p>

            {status && status.orderStatus === 2 && (
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-green-800 mb-2">
                  Paiement confirmé !
                </h3>
                <p className="text-sm text-green-600">
                  Votre paiement a été traité avec succès.
                </p>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-semibold text-blue-800 mb-2">
                Prochaines étapes :
              </h3>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>• Vérifiez votre email pour confirmer votre compte</li>
                <li>• Accédez à votre espace membre</li>
                <li>• Découvrez les événements à venir</li>
                <li>• Explorez les ressources exclusives</li>
              </ul>
            </div>
          </>
        )}

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
