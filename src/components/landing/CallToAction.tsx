import React from 'react';
import { ArrowRight } from 'lucide-react';

const CallToAction = () => {
  return (
    <section id="cta" className="py-20 px-6 md:px-10 lg:px-0">
      <div className="container mx-auto max-w-4xl rounded-3xl bg-purple-50 p-10 md:p-16 text-center">
        <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">Try it now — it's free</h2>
        <p className="text-gray-600 font-light max-w-xl mx-auto mb-10">
          Discover hidden insights about professional networks and career paths with Circl's conversational AI
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 rounded-full bg-purple-600 text-white font-light text-lg shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all">
            <span className="flex items-center justify-center gap-2">
              Try Circl
              <ArrowRight className="w-5 h-5" />
            </span>
          </button>
          
          <button className="px-8 py-4 rounded-full bg-white hover:bg-gray-50 text-gray-700 font-light text-lg border border-gray-200 transition-all">
            Join Waitlist
          </button>
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-lg">
          <div className="aspect-[16/9] bg-white flex items-center justify-center p-6 border border-gray-100">
            <div className="w-full max-w-md p-4 rounded-xl bg-gray-50 text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
                  C
                </div>
                <div>
                  <p className="text-gray-900 text-sm">Circl Assistant</p>
                  <p className="text-gray-500 text-xs">Exploring career insights</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-gray-100 mb-4">
                <input 
                  type="text" 
                  placeholder="Ask about career paths..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400 text-sm" 
                  readOnly
                />
                <button className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-gray-600 text-sm mb-2">Ask questions like:</p>
              <div className="space-y-2">
                <div className="text-gray-500 text-sm p-2 rounded bg-white hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100">
                  Ex-Google employees at climate startups
                </div>
                <div className="text-gray-500 text-sm p-2 rounded bg-white hover:bg-gray-50 transition-colors cursor-pointer border border-gray-100">
                  Career paths for UX researchers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;