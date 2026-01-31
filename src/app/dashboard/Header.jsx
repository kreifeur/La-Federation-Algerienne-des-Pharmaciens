// components/Header.jsx
"use client";

import { useState } from "react";

export default function Header({ user }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Tableau de Bord
          </h2>
          <p className="text-sm text-gray-600">
            Bienvenue, {user?.firstName} {user?.lastName}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* <button className="p-2 text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button> */}

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.firstName?.charAt(0)}
                </span>
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <a
                  href="/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Accueil
                </a>

                <a
                  href="/dashboard"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Tableau de bord
                </a>
                <a
                  href="/dashboard/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mon profil
                </a>

                <a
                  href="/dashboard/events"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Événements
                </a>

                <a
                  href="/dashboard/directory"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Annuaire
                </a>

                {/*NOTIMPORTATNT*/}
                {/* <a href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Paramètres
                </a> */}
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={() => {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("user");
                    localStorage.removeItem("userData");
                    window.location.href = "/login";
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
