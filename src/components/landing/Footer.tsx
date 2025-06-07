import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import CirclLogo from '@/components/ui/CirclLogo';

interface FooterProps {
  openWaitlistModal: (email?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ openWaitlistModal }) => {
  const [footerEmail, setFooterEmail] = useState('');

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleJoinClick = () => {
    openWaitlistModal(footerEmail);
    setFooterEmail(''); // Clear the input after attempting to open modal
  };

  return (
    <footer className="py-16 px-6 md:px-10 lg:px-0 border-t border-gray-100">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <CirclLogo size={30} textSize="text-xl" />
          
          <div className="order-3 md:order-2">
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-light transition-colors">
                About
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-light transition-colors">
                Contact
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-light transition-colors">
                Privacy
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-4 order-2 md:order-3 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Enter email for waitlist"
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                className="w-full md:w-64 py-2.5 px-4 pr-16 rounded-full bg-gray-50 border border-gray-200 focus:border-gray-300 outline-none text-gray-700 text-sm placeholder:text-gray-400" 
              />
              <button 
                onClick={handleJoinClick}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-auto h-8 px-3 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm hover:bg-purple-700 transition-colors"
              >
                Join
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center text-gray-500 text-sm font-light">
          © {new Date().getFullYear()} Circl. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;