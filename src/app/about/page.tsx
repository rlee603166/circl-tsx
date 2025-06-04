"use client";

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import InsightCards from '@/components/landing/InsightCards';
import QueryExamples from '@/components/landing/QueryExamples';
import CallToAction from '@/components/landing/CallToAction';
import Footer from '@/components/landing/Footer';

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <InsightCards />
          <QueryExamples />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
