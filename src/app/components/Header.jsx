// components/Header.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import logo from "../../../public/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier si l'utilisateur est connecté au chargement du composant
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");

      if (authToken && userData) {
        setIsConnected(true);
        const user = JSON.parse(userData);
        setUserName(user.firstName + " " + user.lastName || "Mon Compte");
      } else {
        setIsConnected(false);
        setUserName("");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsConnected(false);
      setUserName("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setIsConnected(false);
    setUserName("");
    // Optionnel: Rediriger vers la page d'accueil
    window.location.href = "/";
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <header className="bg-white text-blue-900 py-4 px-6 shadow-md sticky top-0 z-50 w-full">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img className="w-[200px]" src={logo.src} alt="logo" srcSet="" />
          </div>
          <div className="hidden md:flex space-x-4">
            <div className="w-20 h-8 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white text-blue-900 py-4 px-6 shadow-md sticky top-0 z-50 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img className="w-[200px]" src={logo.src} alt="logo" srcSet="" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-yellow-300 transition-colors">
            Accueil
          </Link>
          <Link
            href="/about"
            className="hover:text-yellow-300 transition-colors"
          >
            À propos
          </Link>
          <Link
            href="/events"
            className="hover:text-yellow-300 transition-colors"
          >
            Événements
          </Link>
          <Link
            href="/gallery"
            className="hover:text-yellow-300 transition-colors"
          >
            Galerie
          </Link>
          <Link
            href="/blog"
            className="hover:text-yellow-300 transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/membership"
            className="hover:text-yellow-300 transition-colors"
          >
            Adhésion
          </Link>
          <Link
            href="/contact"
            className="hover:text-yellow-300 transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Auth Buttons or User Menu */}
        <div className="hidden md:flex space-x-4 items-center">
          {isConnected ? (
            <div className="flex items-center space-x-4">
              {/* Menu déroulant utilisateur */}
              <div className="relative group">
                <button className="flex items-center space-x-2 px-4 py-2 border border-blue-900 rounded-md hover:bg-blue-900 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-blue-800 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {getInitials(userName)}
                  </div>
                  <span className="max-w-[120px] truncate">{userName}</span>
                  <span>▼</span>
                </button>

                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-200">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                  >
                    Mon Profil
                  </Link>
                  <Link
                    href="/dashboard/events"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                  >
                    Mes Événements
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <a
                href="/login"
                className="px-4 py-2 border border-blue-900 rounded-md hover:bg-blue-900 hover:text-white transition-colors"
              >
                Connexion
              </a>
              <a
                href="/membership"
                className="px-4 py-2 bg-yellow-500 text-blue-900 rounded-md hover:bg-yellow-400 transition-colors font-medium"
              >
                Adhérer
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-800 mt-4 py-4 px-6 rounded-lg text-white">
          <nav className="flex flex-col space-y-3">
            <Link
              href="/"
              className="hover:text-yellow-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link
              href="/about"
              className="hover:text-yellow-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              À propos
            </Link>
            <Link
              href="/events"
              className="hover:text-yellow-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Événements
            </Link>
            <Link
              href="/gallery"
              className="hover:text-yellow-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Galerie
            </Link>
            <Link
              href="/blog"
              className="hover:text-yellow-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/membership"
              className="hover:text-yellow-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Adhésion
            </Link>
            <Link
              href="/contact"
              className="hover:text-yellow-300 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
          <br />
          <hr />

          <div className="flex flex-col space-y-3 mt-4">
            {isConnected ? (
              <div className="space-y-3">
                <Link href="/dashboard" className="flex items-center space-x-2 px-3 py-2 bg-blue-700 rounded-md">
                  <div className="w-6 h-6 bg-white text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
                    {getInitials(userName)}
                  </div>
                  <span className="text-sm truncate">{userName}</span>
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="block px-3 py-2 bg-blue-700 rounded-md hover:bg-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mon Profil
                </Link>
                <Link
                  href="/dashboard/events"
                  className="block px-3 py-2 bg-blue-700 rounded-md hover:bg-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mes Événements
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 bg-red-600 rounded-md hover:bg-red-500 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <a
                  href="/login"
                  className="px-4 py-2 border border-white rounded-md hover:bg-white hover:text-blue-800 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </a>
                <a
                  href="/membership"
                  className="px-4 py-2 bg-yellow-500 text-blue-900 rounded-md hover:bg-yellow-400 transition-colors font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Adhérer
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
