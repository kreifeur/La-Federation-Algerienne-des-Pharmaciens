// pages/index.js
"use client";

import Head from "next/head";
import { useState, useEffect } from "react";

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

  // Use useLayoutEffect to load user before paint (prevents flicker)
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        // Silent fail - invalid JSON, just don't set user
      }
    }
  }, []);

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

      <Header/>
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