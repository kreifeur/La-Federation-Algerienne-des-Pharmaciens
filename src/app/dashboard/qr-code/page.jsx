// app/dashboard/qr-code/page.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function QRCodePage() {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [user, setUser] = useState(null);

  const authToken = localStorage.getItem("authToken");
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    // Get user data
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUser(userData);

    // Fetch QR code
    fetchQRCode();
  }, []);

  const fetchQRCode = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/api/profile/qr`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "image/png",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to generate QR code");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setQrCodeUrl(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = async () => {
    if (!qrCodeUrl) return;

    try {
      setDownloading(true);
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `qrcode-${user?.firstName}-${user?.lastName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      setError("Failed to download QR code");
    } finally {
      setDownloading(false);
    }
  };

  const regenerateQRCode = () => {
    setQrCodeUrl(null);
    fetchQRCode();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              QR code
            </h1>
            {/* <p className="text-sm text-gray-600 mt-1">
              Présentez ce QR code lors de vos événements
            </p> */}
          </div>
          {qrCodeUrl && !loading && (
            <button
              onClick={regenerateQRCode}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Régénérer
            </button>
          )}
        </div>

        {/* Main QR Code Card */}
        <div className="flex flex-col items-center justify-center py-8 border-2 border-gray-100 rounded-lg bg-gradient-to-br from-gray-50 to-white">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Génération du QR code...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchQRCode}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <>
              {/* QR Code Image */}
              <div className="bg-white p-4 rounded-xl shadow-md">
                {qrCodeUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={qrCodeUrl}
                    alt="QR Code Membre"
                    className="w-64 h-64 object-contain"
                  />
                )}
              </div>

              {/* User Info */}
              {user && (
                <div className="mt-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  {user.professionalStatus && (
                    <p className="text-sm text-gray-600">
                      {user.professionalStatus}
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.membershipStatus === "inactive"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.membershipStatus === "inactive"
                        ? "Inactif"
                        : "Membre Actif"}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex space-x-4">
                <button
                  onClick={downloadQRCode}
                  disabled={downloading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Téléchargement...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      <span>Télécharger</span>
                    </>
                  )}
                </button>
               {/*  <button
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  <span>Imprimer</span>
                </button> */}
              </div>
            </>
          )}
        </div>

        {/* Instructions */}
        {/* <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Comment utiliser votre carte membre ?
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Présentez ce QR code à l'entrée des événements Cosmeto</li>
            <li>• Scannez-le pour accéder à vos informations membre</li>
            <li>• Téléchargez-le pour y avoir accès hors ligne</li>
            <li>• Chaque QR code est unique et sécurisé</li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}