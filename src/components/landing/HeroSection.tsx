import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface HeroSectionProps {
  openWaitlistModal: (email?: string) => void;
}

// Stop scrolling LinkedIn. Start discovering your network.
const HeroSection: React.FC<HeroSectionProps> = ({ openWaitlistModal }) => {
  const [typedQuestion, setTypedQuestion] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [showBullets, setShowBullets] = useState([false, false, false]);
  
  const fullQuestion = "Where did ex-Google PMs go?";
  const fullAnswer = "I found 47 former Google Product Managers who made interesting moves. Here's what I discovered:";
  
  useEffect(() => {
    // Start animation when component mounts
    const timer = setTimeout(() => {
      // Type the question
      let questionIndex = 0;
      const questionInterval = setInterval(() => {
        if (questionIndex <= fullQuestion.length) {
          setTypedQuestion(fullQuestion.slice(0, questionIndex));
          questionIndex++;
        } else {
          clearInterval(questionInterval);
          // Show answer after question is complete
          setTimeout(() => {
            setShowAnswer(true);
          }, 1000);
        }
      }, 50);
      
      return () => clearInterval(questionInterval);
    }, 1000); // Initial delay before starting
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!showAnswer) return;
    
    // Type the answer text
    let answerIndex = 0;
    const answerInterval = setInterval(() => {
      if (answerIndex <= fullAnswer.length) {
        setAnswerText(fullAnswer.slice(0, answerIndex));
        answerIndex++;
      } else {
        clearInterval(answerInterval);
        // Show bullets one by one
        setTimeout(() => setShowBullets([true, false, false]), 500);
        setTimeout(() => setShowBullets([true, true, false]), 1000);
        setTimeout(() => setShowBullets([true, true, true]), 1500);
      }
    }, 30);
    
    return () => clearInterval(answerInterval);
  }, [showAnswer]);

  return (
    <section className="pt-32 pb-20 px-6 md:px-10 lg:px-0 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 leading-tight mb-8 tracking-tight">
              Ask career questions.<br />
              Get answers.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">Instantly.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-light mx-auto mb-12">
              The future of network discovery is coming. Be the first to experience it.
            </p>
          </div>
          
          <div className="relative">
              <div className="backdrop-blur-xl bg-white/40 rounded-3xl border border-white/20 shadow-2xl p-10 relative overflow-hidden w-full max-w-4xl min-w-[300px] md:min-w-[600px] lg:min-w-[896px] mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-3.5 h-3.5 bg-red-400 rounded-full" />
                    <div className="w-3.5 h-3.5 bg-yellow-400 rounded-full" />
                    <div className="w-3.5 h-3.5 bg-green-400 rounded-full" />
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 w-full">
                      <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Search className="w-5 h-5 text-white" />
                      </div>
                      <div className="w-0 flex-grow bg-white/60 rounded-xl p-4 text-left text-slate-700 font-normal text-lg min-h-14">
                        <div className="break-words overflow-hidden">
                          {typedQuestion}
                          {typedQuestion && typedQuestion.length < fullQuestion.length && (
                            <span className="inline-block w-0.5 h-4 bg-slate-700 animate-pulse ml-0.5 align-baseline" />
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Smooth expansion with max-height and transform */}
                    <div className={`bg-gradient-to-r from-slate-50 to-white rounded-xl overflow-hidden text-left transition-all duration-700 ease-out ${
                      showAnswer 
                        ? 'opacity-100 max-h-96 p-6 transform translate-y-0' 
                        : 'opacity-0 max-h-0 p-0 transform -translate-y-2 pointer-events-none'
                    }`}>
                      <div className="break-words overflow-hidden">
                        <p className="text-slate-700 font-light leading-relaxed text-lg mb-4">
                          {showAnswer ? answerText : ''}
                          {showAnswer && answerText && answerText.length < fullAnswer.length && (
                            <span className="inline-block w-0.5 h-4 bg-slate-700 animate-pulse ml-0.5 align-baseline" />
                          )}
                        </p>
                      </div>
                      {showAnswer && answerText.length === fullAnswer.length && (
                        <div className="mt-4 space-y-3">
                          <div className={`flex items-center space-x-3 transition-all duration-500 ${showBullets[0] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                            <div className="w-2.5 h-2.5 bg-violet-400 rounded-full flex-shrink-0" />
                            <span className="text-md text-slate-600 font-light">
                              32% joined fintech startups (Stripe, Plaid, Robinhood)
                            </span>
                          </div>
                          <div className={`flex items-center space-x-3 transition-all duration-500 ${showBullets[1] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                            <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full flex-shrink-0" />
                            <span className="text-md text-slate-600 font-light">28% joined top-tier VCs like Sequoia, a16z, and Bessemer</span>
                          </div>
                          <div className={`flex items-center space-x-3 transition-all duration-500 ${showBullets[2] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                            <div className="w-2.5 h-2.5 bg-rose-400 rounded-full flex-shrink-0" />
                            <span className="text-md text-slate-600 font-light">23% founded their own companies</span>
                          </div>
                        </div>
                      )}
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