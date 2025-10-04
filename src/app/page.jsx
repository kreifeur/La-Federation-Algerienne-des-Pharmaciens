// pages/index.js
import Head from 'next/head';
import Header from '../app/components/Header';
import Hero from '../app/components/Hero';
import About from '../app/components/About';
import Services from '../app/components/Services';
import Events from '../app/components/Events';
import Gallery from '../app/components/Gallery';
import Membership from '../app/components/Membership';
import Footer from '../app/components/Footer';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Association de Cosmétologie</title>
        <meta name="description" content="Association professionnelle de cosmétologie" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Hero />
      <About />
      <Services />
      <Events />
      <Gallery />
      <Membership />
      <Footer />
    </div>
  );
}