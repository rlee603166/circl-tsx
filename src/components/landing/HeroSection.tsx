import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

interface HeroSectionProps {
  openWaitlistModal: (email?: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ openWaitlistModal }) => {
  // Animation states for carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typedQuestion, setTypedQuestion] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [showBullets, setShowBullets] = useState([false, false, false]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const queries = [
    {
      question: "Where do people like me end up in 5 years?",
      answer: "Based on your background, here are common career trajectories:",
      type: "profiles",
      bullets: [
        { 
          name: "Sarah Chen", 
          title: "Senior Product Manager → Co-founder", 
          previous: "Similar Background",
          detail: "Leveraged PM experience to start consumer tech company"
        },
        { 
          name: "Marcus Johnson", 
          title: "Product Manager → Head of Operations", 
          previous: "Parallel Career Path",
          detail: "Scaled from IC to leadership in high-growth fintech"
        },
        { 
          name: "Lisa Rodriguez", 
          title: "Product Manager → VP of Product", 
          previous: "Comparable Journey",
          detail: "Built design-focused products at leading design tools company"
        }
      ]
    },
    {
      question: "What percentage of CTOs have computer science degrees?",
      answer: "Analysis of 890 startup CTO backgrounds reveals interesting patterns:",
      type: "education",
      bullets: [
        { category: "Computer Science Degree", percentage: "73%", trend: "Traditional path" },
        { category: "Self-taught/Bootcamp", percentage: "18%", trend: "Rising trend" },
        { category: "Other Engineering Fields", percentage: "9%", trend: "Cross-disciplinary" }
      ]
    },
    {
      question: "Stanford MBA graduates who became solo founders",
      answer: "Tracked 156 Stanford MBAs who started companies independently:",
      type: "profiles",
      bullets: [
        {
          name: "David Park",
          title: "Founder at Linear",
          previous: "Stanford MBA '19",
          detail: "Building next-generation issue tracking software"
        },
        {
          name: "Amanda Foster",
          title: "CEO at Moonshot",
          previous: "Stanford MBA '17",
          detail: "Revolutionizing banking for startups"
        },
        {
          name: "Kevin Liu",
          title: "Founder at Lattice",
          previous: "Stanford MBA '16", 
          detail: "Creating modern performance management tools"
        }
      ]
    },
    {
      question: "Which cities do remote workers actually live in?",
      answer: "Geographic distribution of 2,400+ remote workers reveals surprising trends:",
      type: "geographic",
      bullets: [
        { location: "Austin, Texas", percentage: "22%", trend: "↑ 45% growth" },
        { location: "Denver, Colorado", percentage: "16%", trend: "↑ 38% growth" },
        { location: "Nashville, Tennessee", percentage: "12%", trend: "↑ 52% growth" }
      ]
    },
    {
      question: "Engineers with both Google and Meta experience",
      answer: "Discovered 284 engineers who worked at both tech giants:",
      type: "profiles",
      bullets: [
        {
          name: "Ryan Martinez",
          title: "Principal Engineer at Databricks",
          previous: "Google → Meta → Current",
          detail: "Scaling distributed systems and ML infrastructure"
        },
        {
          name: "Priya Sharma",
          title: "Engineering Manager at Airbnb",
          previous: "Meta → Google → Current",
          detail: "Leading platform engineering and reliability"
        },
        {
          name: "Alex Thompson",
          title: "Co-founder at Builder.io",
          previous: "Google → Meta → Startup",
          detail: "Building AI-powered development tools"
        }
      ]
    },
    {
      question: "Average time from junior to senior engineer role",
      answer: "Career progression analysis across 1,800+ engineering careers:",
      type: "career",
      bullets: [
        { path: "Big Tech (FAANG)", duration: "4.2 years average", trend: "Accelerated growth" },
        { path: "High-growth Startups", duration: "3.1 years average", trend: "Fastest promotion" },
        { path: "Traditional Enterprise", duration: "5.8 years average", trend: "Structured progression" }
      ]
    }
  ];
  
  // Auto-advance slides every 10 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      if (!isAnimating) {
        setCurrentSlide((prev) => (prev + 1) % queries.length);
      }
    }, 10000);

    return () => clearInterval(slideInterval);
  }, [isAnimating]);

  useEffect(() => {
    // Reset animation state when slide changes
    setTypedQuestion('');
    setShowAnswer(false);
    setAnswerText('');
    setShowBullets([false, false, false]);
    setIsAnimating(true);

    const currentQuery = queries[currentSlide];
    
    // Start typing animation
    const timer = setTimeout(() => {
      let questionIndex = 0;
      const questionInterval = setInterval(() => {
        if (questionIndex <= currentQuery.question.length) {
          setTypedQuestion(currentQuery.question.slice(0, questionIndex));
          questionIndex++;
        } else {
          clearInterval(questionInterval);
          setTimeout(() => {
            setShowAnswer(true);
          }, 1000);
        }
      }, 50);
      
      return () => clearInterval(questionInterval);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [currentSlide]);
  
  useEffect(() => {
    if (!showAnswer) return;
    
    const currentQuery = queries[currentSlide];
    
    // Type the answer text
    let answerIndex = 0;
    const answerInterval = setInterval(() => {
      if (answerIndex <= currentQuery.answer.length) {
        setAnswerText(currentQuery.answer.slice(0, answerIndex));
        answerIndex++;
      } else {
        clearInterval(answerInterval);
        // Show bullets one by one
        setTimeout(() => setShowBullets([true, false, false]), 500);
        setTimeout(() => setShowBullets([true, true, false]), 1000);
        setTimeout(() => {
          setShowBullets([true, true, true]);
          setIsAnimating(false);
        }, 1500);
      }
    }, 30);
    
    return () => clearInterval(answerInterval);
  }, [showAnswer, currentSlide]);

  return (
    <section className="pt-32 pb-20 px-8 md:px-10 lg:px-0 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center min-h-[925px]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h1 className="text-[2rem] leading-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-gray-900 mb-8 tracking-tight">
              Ask smarter. See further.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500"> Decide with confidence.</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 font-light mx-auto mb-12">
              The future of network intelligence is coming. Be the first to experience it.
            </p>
          </div>
          
          <div className="relative">
              {/* Remove fixed height to allow natural expansion */}
              <div className="backdrop-blur-xl bg-white/40 rounded-3xl border border-white/20 shadow-2xl p-6 md:p-10 relative overflow-hidden w-full max-w-4xl mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-6 md:mb-8 flex-shrink-0">
                    <div className="w-3 h-3 md:w-3.5 md:h-3.5 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 md:w-3.5 md:h-3.5 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 md:w-3.5 md:h-3.5 bg-green-400 rounded-full" />
                  </div>
                  
                  {/* Allow natural content flow */}
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center space-x-3 md:space-x-4 w-full flex-shrink-0">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Search className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                      <div className="w-0 flex-grow bg-white/60 rounded-xl p-3 md:p-4 text-left text-slate-700 font-normal text-base md:text-lg min-h-12 md:min-h-14">
                        <div className="break-words overflow-hidden">
                          {typedQuestion}
                          {typedQuestion && typedQuestion.length < queries[currentSlide].question.length && (
                            <span className="inline-block w-0.5 h-4 bg-slate-700 animate-pulse ml-0.5 align-baseline" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Remove fixed height and flex constraints to allow natural expansion */}
                    <div className={`bg-gradient-to-r from-slate-50 to-white rounded-xl text-left transition-all duration-700 ease-out ${
                      showAnswer 
                        ? 'opacity-100 p-4 md:p-6 transform translate-y-0' 
                        : 'opacity-0 p-0 transform -translate-y-2 pointer-events-none'
                    }`}>
                      <div className="break-words">
                        <p className="text-slate-700 font-light leading-relaxed text-base md:text-lg mb-3 md:mb-4">
                          {showAnswer ? answerText : ''}
                          {showAnswer && answerText && answerText.length < queries[currentSlide].answer.length && (
                            <span className="inline-block w-0.5 h-4 bg-slate-700 animate-pulse ml-0.5 align-baseline" />
                          )}
                        </p>
                      </div>
                      
                      {/* Natural content expansion */}
                      {showAnswer && answerText.length === queries[currentSlide].answer.length && (
                        <div className="space-y-2 md:space-y-3">
                          {queries[currentSlide].type === 'profiles' ? (
                            // Profile cards for people search
                            (queries[currentSlide].bullets as Array<{name: string; title: string; previous: string; detail: string}>).map((profile, index) => (
                              <div key={index} className={`transition-all duration-500 ${showBullets[index] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                <div className="bg-white/80 rounded-xl p-3 md:p-4 border border-white/40 hover:bg-white transition-colors w-full">
                                  <div className="flex items-start space-x-2 md:space-x-3 w-full">
                                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-violet-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-semibold text-xs md:text-sm flex-shrink-0">
                                      {profile.name.split(' ').map((n: string) => n[0]).join('')}
                                    </div>
                                    <div className="flex-1 min-w-0 overflow-hidden">
                                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 md:gap-2 mb-1">
                                        <h4 className="font-medium text-slate-800 text-sm flex-shrink-0">{profile.name}</h4>
                                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full w-fit">
                                          {profile.previous}
                                        </span>
                                      </div>
                                      <p className="text-slate-700 text-xs md:text-sm font-medium mb-1 break-words">{profile.title}</p>
                                      <p className="text-slate-600 text-xs font-light break-words">{profile.detail}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : queries[currentSlide].type === 'education' || queries[currentSlide].type === 'career' ? (
                            // Education/Career patterns display
                            (queries[currentSlide].bullets as Array<{category?: string; path?: string; percentage?: string; duration?: string; trend: string}>).map((item, index) => (
                              <div key={index} className={`transition-all duration-500 ${showBullets[index] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 md:p-4 border border-emerald-200 w-full">
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex-1 pr-2">
                                      <h4 className="font-medium text-slate-800 text-xs md:text-sm mb-1">{item.category || item.path}</h4>
                                      <p className="text-emerald-700 text-sm font-light">{item.percentage || item.duration}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-xs text-slate-500 mb-1">Pattern</p>
                                      <p className="text-emerald-700 text-xs md:text-sm font-medium">
                                        {item.trend}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            // Geographic distribution display
                            (queries[currentSlide].bullets as Array<{location: string; percentage: string; trend: string}>).map((geo, index) => (
                              <div key={index} className={`transition-all duration-500 ${showBullets[index] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 md:p-4 border border-blue-200 w-full">
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex-1 pr-2">
                                      <h4 className="font-medium text-slate-800 text-xs md:text-sm mb-1">{geo.location}</h4>
                                      <div className="flex items-center space-x-2">
                                        <span className="text-blue-700 text-base md:text-lg font-semibold">{geo.percentage}</span>
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                          geo.trend.includes('↑') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                          {geo.trend}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
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