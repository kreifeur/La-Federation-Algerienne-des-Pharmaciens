// components/Header.js
"use client";
import { useState } from "react";
import Link from "next/link";
import logo from "../../../public/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

        {/* Auth Buttons */}
        <div className="hidden md:flex space-x-4">
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

            <Link
              href="/login"
              className="hover:text-yellow-300 transition-colors"
            >
              Connexion
            </Link>

          </nav>
          <div className="flex flex-col space-y-3 mt-4">
            <div className="hidden md:flex space-x-4">
              <a
                href="/login"
                className="px-4 py-2 border border-blue-900 rounded-md hover:bg-blue-900 hover:text-white transition-colors"
              >
                Connexion
              </a>
              <a
                href="/register"
                className="px-4 py-2 bg-yellow-500 text-blue-900 rounded-md hover:bg-yellow-400 transition-colors font-medium"
              >
                Adhérer
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
