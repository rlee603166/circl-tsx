import React from 'react';
import { CircleUser, ArrowUp, ArrowRight } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="py-16 px-6 md:px-10 lg:px-0 border-t border-gray-100">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <CircleUser className="h-6 w-6 text-purple-500" />
            <span className="text-xl font-light text-gray-900">Circl</span>
          </div>
          
          <div className="flex gap-8">
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
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your email"
                className="w-64 py-2.5 px-4 rounded-full bg-gray-50 border border-gray-200 focus:border-gray-300 outline-none text-gray-700 text-sm placeholder:text-gray-400" 
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <button 
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 border border-gray-200 transition-all"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
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