import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CirclLogo from '@/components/ui/CirclLogo';

interface NavbarProps {
  openWaitlistModal: (email?: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ openWaitlistModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleJoinWaitlistClick = () => {
    openWaitlistModal();
    setIsMobileMenuOpen(false);
  };

  const handleSignInClick = () => {
    router.push('/welcome?mode=login');
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'py-3 bg-white/80 backdrop-blur-xl shadow-sm' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <CirclLogo />

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm font-light transition-colors">
            Features
          </a>
          <a href="#examples" className="text-gray-600 hover:text-gray-900 text-sm font-light transition-colors">
            Examples
          </a>
          <a href="#cta" className="text-gray-600 hover:text-gray-900 text-sm font-light transition-colors">
            Demo
          </a>
          {/* <button 
            onClick={handleSignInClick}
            className="ml-4 px-5 py-4 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-light transition-all"
          >
            Sign In
          </button> */}
          <button
            onClick={handleJoinWaitlistClick}
            className="relative overflow-hidden rounded-full p-0.5 shadow-lg shadow-purple-200"
          >
            <div
              className="absolute inset-0 rounded-full bg-[conic-gradient(from_var(--border-angle),_theme(colors.purple.400),_theme(colors.pink.500),_theme(colors.red.500))] animate-border-gleam"
              aria-hidden="true"
            />
            <div className="relative rounded-full bg-purple-600 px-5 py-4 text-sm font-light text-white transition-colors hover:bg-purple-700">
              Get Started
            </div>
          </button>
        </nav>

        <button 
          className="md:hidden text-gray-900" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span className={`block h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div>

      <div className={`md:hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-white`}>
        <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
          <a 
            href="#features" 
            className="text-gray-600 hover:text-gray-900 py-2 text-lg font-light transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </a>
          <a 
            href="#examples" 
            className="text-gray-600 hover:text-gray-900 py-2 text-lg font-light transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Examples
          </a>
          <a 
            href="#cta" 
            className="text-gray-600 hover:text-gray-900 py-2 text-lg font-light transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Demo
          </a>
          <div className="flex flex-col gap-3 pt-4">
            {/* <button 
              onClick={handleSignInClick}
              className="w-full py-2.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-light transition-all"
            >
              Sign In
            </button> */}
            <button
              onClick={handleJoinWaitlistClick}
              className="relative w-full overflow-hidden rounded-full p-0.5 shadow-lg shadow-purple-200"
            >
              <div
                className="absolute inset-0 rounded-full bg-[conic-gradient(from_var(--border-angle),_theme(colors.purple.400),_theme(colors.pink.600),_theme(colors.red.500))] animate-border-gleam"
                aria-hidden="true"
              />
              <div className="relative w-full rounded-full bg-purple-600 py-2.5 text-center font-light text-white transition-colors hover:bg-purple-700">
                Get Started
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;