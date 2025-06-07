"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import InsightCards from '@/components/landing/InsightCards';
import QueryExamples from '@/components/landing/QueryExamples';
import CallToAction from '@/components/landing/CallToAction';
import Footer from '@/components/landing/Footer';
import WaitlistModal from '@/components/landing/WaitlistModal';
import { useRouter, useSearchParams } from 'next/navigation';

function App() {
  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialEmail, setModalInitialEmail] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams ? searchParams.get('referralCode') : null;

  // Modal control functions
  const handleOpenModal = (email: string = '') => {
    setModalInitialEmail(email);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    clearLocalStorage();
    router.push('/');
    setIsModalOpen(false);
    setModalInitialEmail('');
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('waitlist_code');
    localStorage.removeItem('referral_code');
  };

  useEffect(() => {
    if (referralCode) {
      handleOpenModal();
    }
  }, [referralCode]);

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
