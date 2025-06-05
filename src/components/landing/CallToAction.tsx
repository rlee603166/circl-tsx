import React, { useState, useEffect } from 'react';
import { ArrowRight, Search } from 'lucide-react';

interface CallToActionProps {
  openWaitlistModal: (email?: string) => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ openWaitlistModal }) => {
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [typedQuestion, setTypedQuestion] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [showBullets, setShowBullets] = useState([false, false, false]);
  const [isAnimating, setIsAnimating] = useState(false);

  const queries = {
    climate: {
      question: "Past Meta employees at climate startups",
      answer: "I found 23 former Meta employees now working at climate startups. Here are the notable ones:",
      bullets: [
        { 
          name: "Sarah Chen", 
          title: "Lead Engineer at Rivian", 
          previous: "Ex-Meta AI Engineer",
          detail: "Led autonomous vehicle mapping initiatives"
        },
        { 
          name: "Marcus Rodriguez", 
          title: "VP Product at CarbonCure", 
          previous: "Former Instagram PM",
          detail: "Pioneering concrete carbon capture technology"
        },
        { 
          name: "Priya Patel", 
          title: "Head of AI at Climeworks", 
          previous: "Meta Research Scientist",
          detail: "Developing ML models for direct air capture"
        }
      ]
    },
    ux: {
      question: "Career paths for UX researchers",
      answer: "Analyzed 156 UX researcher career transitions over the past 3 years:",
      bullets: [
        "42% became Senior UX Researchers or Principal UX Researchers",
        "31% transitioned to Product Management roles",
        "27% moved to UX Research leadership positions (Director, VP)"
      ]
    }
  };

  const handleQueryClick = (queryType: 'climate' | 'ux') => {
    if (isAnimating) return;
    
    // Reset state
    setTypedQuestion('');
    setShowAnswer(false);
    setAnswerText('');
    setShowBullets([false, false, false]);
    setActiveQuery(queryType);
    setIsAnimating(true);

    const query = queries[queryType];
    
    // Start typing animation
    setTimeout(() => {
      let questionIndex = 0;
      const questionInterval = setInterval(() => {
        if (questionIndex <= query.question.length) {
          setTypedQuestion(query.question.slice(0, questionIndex));
          questionIndex++;
        } else {
          clearInterval(questionInterval);
          // Show answer after question is complete
          setTimeout(() => {
            setShowAnswer(true);
          }, 800);
        }
      }, 40);
    }, 500);
  };

  useEffect(() => {
    if (!showAnswer || !activeQuery) return;
    
    const query = queries[activeQuery as keyof typeof queries];
    
    // Type the answer text
    let answerIndex = 0;
    const answerInterval = setInterval(() => {
      if (answerIndex <= query.answer.length) {
        setAnswerText(query.answer.slice(0, answerIndex));
        answerIndex++;
      } else {
        clearInterval(answerInterval);
        // Show bullets one by one
        setTimeout(() => setShowBullets([true, false, false]), 400);
        setTimeout(() => setShowBullets([true, true, false]), 800);
        setTimeout(() => {
          setShowBullets([true, true, true]);
          setIsAnimating(false);
        }, 1200);
      }
    }, 25);
    
    return () => clearInterval(answerInterval);
  }, [showAnswer, activeQuery]);

  return (
    <section id="cta" className="py-20 px-6 md:px-10 lg:px-0">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto rounded-3xl bg-purple-50 p-12 md:p-20 text-center">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-8">Be the First to Know</h2>
          <p className="text-xl md:text-2xl text-gray-600 font-light max-w-2xl mx-auto mb-12">
            Discover hidden insights about professional networks and career paths with Circl's conversational AI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => openWaitlistModal()} 
              className="px-8 py-4 rounded-full bg-purple-600 text-white font-light text-lg shadow-lg shadow-purple-200 hover:bg-purple-700 transition-all hover:scale-105 focus:scale-105"
            >
              <span className="relative z-10">
                Join the Waitlist
              </span>
            </button>
            
            <a href="#features" className="px-8 py-4 rounded-full bg-white hover:bg-gray-50 text-gray-700 font-light text-lg border border-gray-200 transition-all hover:scale-105 focus:scale-105">
              Learn About Features
            </a>
          </div>
          
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="backdrop-blur-xl bg-white/60 rounded-3xl border border-white/20 shadow-2xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
              <div className="relative">
                {!activeQuery ? (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 w-full">
                      <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Search className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 bg-white/60 rounded-xl p-4 text-left text-slate-700 font-normal text-lg min-h-14 flex items-center">
                        <span className="text-slate-400">Ask about career paths...</span>
                      </div>
                    </div>
                    
                    <div className="text-left">
                      <p className="text-slate-600 text-md mb-4 font-light">Try these examples:</p>
                      <div className="space-y-3">
                        <button
                          onClick={() => handleQueryClick('climate')}
                          className="w-full text-left text-slate-600 text-md p-4 rounded-xl bg-white/80 hover:bg-white transition-all cursor-pointer border border-white/40 hover:shadow-md group"
                          disabled={isAnimating}
                        >
                          <span className="group-hover:text-slate-800 transition-colors">
                            Ex-Google employees at climate startups
                          </span>
                        </button>
                        <button
                          onClick={() => handleQueryClick('ux')}
                          className="w-full text-left text-slate-600 text-md p-4 rounded-xl bg-white/80 hover:bg-white transition-all cursor-pointer border border-white/40 hover:shadow-md group"
                          disabled={isAnimating}
                        >
                          <span className="group-hover:text-slate-800 transition-colors">
                            Career paths for UX researchers
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 w-full">
                      <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Search className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 bg-white/60 rounded-xl p-4 text-left text-slate-700 font-normal text-lg min-h-14">
                        <div className="break-words overflow-hidden">
                          {typedQuestion}
                          {typedQuestion && typedQuestion.length < queries[activeQuery as keyof typeof queries].question.length && (
                            <span className="inline-block w-0.5 h-4 bg-slate-700 animate-pulse ml-0.5 align-baseline" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`bg-gradient-to-r from-slate-50 to-white rounded-xl text-left transition-all duration-700 ease-out ${
                      showAnswer 
                        ? 'opacity-100 max-h-96 p-6 transform translate-y-0' 
                        : 'opacity-0 max-h-0 p-0 transform -translate-y-2 pointer-events-none'
                    }`}>
                      <div className="break-words">
                        <p className="text-slate-700 font-light leading-relaxed text-lg mb-4">
                          {showAnswer ? answerText : ''}
                          {showAnswer && answerText && answerText.length < queries[activeQuery as keyof typeof queries].answer.length && (
                            <span className="inline-block w-0.5 h-4 bg-slate-700 animate-pulse ml-0.5 align-baseline" />
                          )}
                        </p>
                      </div>
                      {showAnswer && answerText.length === queries[activeQuery as keyof typeof queries].answer.length && (
                        <div className="mt-4 space-y-3">
                          {activeQuery === 'climate' ? (
                            // Profile cards for people search
                            (queries.climate.bullets as any[]).map((profile, index) => (
                              <div key={index} className={`transition-all duration-500 ${showBullets[index] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                <div className="bg-white/80 rounded-xl p-4 border border-white/40 hover:bg-white transition-colors w-full">
                                  <div className="flex items-start space-x-3 w-full">
                                    <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                      {profile.name.split(' ').map((n: string) => n[0]).join('')}
                                    </div>
                                    <div className="flex-1 min-w-0 overflow-hidden">
                                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                        <h4 className="font-medium text-slate-800 text-md flex-shrink-0">{profile.name}</h4>
                                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full w-fit">
                                          {profile.previous}
                                        </span>
                                      </div>
                                      <p className="text-slate-700 text-sm font-medium mb-1 break-words">{profile.title}</p>
                                      <p className="text-slate-600 text-sm font-light break-words">{profile.detail}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            // Traditional bullet points for insights
                            (queries.ux.bullets as string[]).map((bullet, index) => (
                              <div key={index} className={`flex items-center space-x-3 transition-all duration-500 ${showBullets[index] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                                  index === 0 ? 'bg-violet-400' : 
                                  index === 1 ? 'bg-indigo-400' : 'bg-rose-400'
                                }`} />
                                <span className="text-md text-slate-600 font-light">
                                  {bullet}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                    
                    {!isAnimating && (
                      <div className="pt-4">
                        <button
                          onClick={() => {
                            setActiveQuery(null);
                            setTypedQuestion('');
                            setShowAnswer(false);
                            setAnswerText('');
                            setShowBullets([false, false, false]);
                          }}
                          className="text-slate-500 hover:text-slate-700 text-sm font-light transition-colors"
                        >
                          ← Try another query
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;