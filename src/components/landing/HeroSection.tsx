import React from 'react';
import { Search, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 px-6 md:px-10 lg:px-0 overflow-hidden">
      <div className="container mx-auto flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 leading-tight mb-6 tracking-tight">
            Ask career questions.<br />
            Get answers.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Instantly.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto mb-10">
            Stop scrolling LinkedIn. Start discovering your network.
          </p>
          <button className="relative group px-8 py-4 rounded-full bg-purple-50 text-purple-600 font-light text-lg transition-all duration-300 hover:bg-purple-100">
            <span className="relative z-10 flex items-center justify-center gap-2">
              Try Circl 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
            <div className="backdrop-blur-xl bg-white/40 rounded-3xl border border-white/20 shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <Search className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 bg-white/60 rounded-xl p-3 text-left text-slate-700 font-light">
                      Where did ex-Goldman PMs go?
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-slate-50 to-white rounded-xl p-4 text-left">
                    <p className="text-slate-700 font-light leading-relaxed">
                      I found 47 former Goldman Sachs Product Managers who made interesting moves. Here's what I
                      discovered:
                    </p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-violet-400 rounded-full" />
                        <span className="text-sm text-slate-600 font-light">
                          32% joined fintech startups (Stripe, Plaid, Robinhood)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full" />
                        <span className="text-sm text-slate-600 font-light">28% became VCs at top-tier funds</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-rose-400 rounded-full" />
                        <span className="text-sm text-slate-600 font-light">23% founded their own companies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
};

export default HeroSection;