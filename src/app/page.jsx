// pages/index.js
"use client";

import Head from "next/head";
import { useEffect, useState } from "react";

import Header from "../app/components/Header";
import Hero from "../app/components/Hero";
import About from "../app/components/About";
import Services from "../app/components/Services";
import Events from "../app/components/Events";
import Gallery from "../app/components/Gallery";
import Membership from "../app/components/Membership";
import Footer from "../app/components/Footer";

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        
        // Check localStorage first for immediate user data
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error("Error parsing stored user:", error);
          }
        }

        if (!token) {
          setIsLoading(false);
          return;
        }

        // Then fetch fresh profile data
        const response = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const { data } = await response.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Show loading screen while fetching
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-blue-900">Chargement...</h2>
          <p className="text-gray-600 mt-2">Préparation de votre espace</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>La Fédération Algérienne des Pharmaciens</title>
        <meta
          name="description"
          content="La Fédération Algérienne des Pharmaciens"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header user={user} />
      <Hero />
      <About />
      <Services />
      <Events />
      <Gallery />
      <Membership />
      <Footer />
    </>
  );
}