"use client";

import React, { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import InsightCards from '@/components/landing/InsightCards';
import QueryExamples from '@/components/landing/QueryExamples';
import CallToAction from '@/components/landing/CallToAction';
import Footer from '@/components/landing/Footer';
import WaitlistModal from '@/components/landing/WaitlistModal';

function App() {
  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialEmail, setModalInitialEmail] = useState('');

  // Modal control functions
  const handleOpenModal = (email: string = '') => {
    setModalInitialEmail(email);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalInitialEmail('');
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white">
      <div className="relative z-10">
        <Navbar openWaitlistModal={handleOpenModal} />
        <main>
          <HeroSection openWaitlistModal={handleOpenModal} />
          <InsightCards />
          <QueryExamples />
          <CallToAction openWaitlistModal={handleOpenModal} />
        </main>
        <Footer openWaitlistModal={handleOpenModal} />
      </div>
      
      {/* Render the modal */}
      <WaitlistModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialEmail={modalInitialEmail}
      />
    </div>
  );
}

export default App;
