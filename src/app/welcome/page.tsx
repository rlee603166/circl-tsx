"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ClientSafeProvider, getProviders, LiteralUnion, signIn } from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";
import CirclLogo from '@/components/ui/CirclLogo';

const WelcomeScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams ? searchParams.get('mode') : null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, isAuthenticated } = useAuth();
  const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null);
  const [isLogin, setIsLogin] = useState(mode !== 'signup');
  const [showPassword, setShowPassword] = useState(false);
  
  // Add validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  // Animation states for carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typedQuestion, setTypedQuestion] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [showBullets, setShowBullets] = useState([false, false, false]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const queries = [
    {
      question: "Who left Goldman Sachs for fintech startups?",
      answer: "I found 18 former Goldman Sachs employees now at fintech companies:",
      type: "profiles",
      bullets: [
        { 
          name: "David Kim", 
          title: "VP Engineering at Stripe", 
          previous: "Ex-Goldman Tech",
          detail: "Leading payment infrastructure scaling"
        },
        { 
          name: "Rachel Martinez", 
          title: "Head of Risk at Robinhood", 
          previous: "Former GS Risk Analyst",
          detail: "Building algorithmic trading safeguards"
        },
        { 
          name: "Alex Chen", 
          title: "Co-founder at Ramp", 
          previous: "Goldman Investment Banking",
          detail: "Revolutionizing corporate expense management"
        }
      ]
    },
    {
      question: "How long do engineers spend at each company?",
      answer: "Based on 2,400+ engineer resumes, here's the typical tenure patterns:",
      type: "tenure",
      bullets: [
        { company: "Big Tech (FAANG)", duration: "3.2 years average", trend: "↑ 15% retention" },
        { company: "Startups (Series A-B)", duration: "2.1 years average", trend: "↓ 8% retention" },
        { company: "Enterprise/Fortune 500", duration: "4.7 years average", trend: "→ Stable" }
      ]
    },
    {
      question: "Ex-Netflix engineers at AI companies",
      answer: "Discovered 31 former Netflix engineers now working in AI:",
      type: "profiles", 
      bullets: [
        {
          name: "Sophia Rodriguez",
          title: "ML Lead at OpenAI",
          previous: "Ex-Netflix ML Engineer", 
          detail: "Developing large language model architectures"
        },
        {
          name: "James Liu",
          title: "Principal Engineer at Anthropic",
          previous: "Former Netflix Backend",
          detail: "Building AI safety and alignment systems"
        },
        {
          name: "Maya Patel", 
          title: "Research Scientist at DeepMind",
          previous: "Netflix Recommendation Systems",
          detail: "Advancing reinforcement learning algorithms"
        }
      ]
    },
    {
      question: "Where do Y Combinator founders relocate?",
      answer: "Geographic movement analysis of 450 YC alumni over 3 years:",
      type: "geographic",
      bullets: [
        { location: "San Francisco Bay Area", percentage: "68%", trend: "↑ 12%" },
        { location: "New York City", percentage: "15%", trend: "↑ 8%" },
        { location: "Austin, Texas", percentage: "9%", trend: "↑ 24%" }
      ]
    }
  ];
  
  // Get auth providers
  useEffect(() => {
    getProviders().then(prov => setProviders(prov));
  }, []);
  
  // Redirect authenticated users to main chat
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/new');
    }
  }, [loading, isAuthenticated, router]);
  
  useEffect(() => {
    // Auto-advance slides every 8 seconds
    const slideInterval = setInterval(() => {
      if (!isAnimating) {
        setCurrentSlide((prev) => (prev + 1) % queries.length);
      }
    }, 8000);

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
          }, 800);
        }
      }, 40);
      
      return () => clearInterval(questionInterval);
    }, 500);
    
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
        setTimeout(() => setShowBullets([true, false, false]), 400);
        setTimeout(() => setShowBullets([true, true, false]), 800);
        setTimeout(() => {
          setShowBullets([true, true, true]);
          setIsAnimating(false);
        }, 1200);
      }
    }, 25);
    
    return () => clearInterval(answerInterval);
  }, [showAnswer, currentSlide]);

  useEffect(() => {
    setIsLogin(mode !== 'signup');
  }, [mode]);

  // Add email validation function
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setEmailError('');
    
    if (!email.trim()) {
      setEmailError('Email is required.');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Email is not valid.');
      return;
    }
    
    if (isLogin) {
      // For login, show password field after email
      setShowPassword(true);
    } else {
      // For signup, proceed with email-only registration
      console.log("Email submitted for signup:", email);
      // Add your signup logic here
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setPasswordError('');
    
    if (!password.trim()) {
      setPasswordError('Password is required.');
      return;
    }
    
    console.log("Login attempt:", { email, password });
    // Add your login logic here
  };

  const toggleMode = () => {
    const newIsLogin = !isLogin;
    setIsLogin(newIsLogin);
    setShowPassword(false);
    setEmail('');
    setPassword('');
    setEmailError('');
    setPasswordError('');
    setEmailFocused(false);
    setPasswordFocused(false);
    
    // Update URL based on mode
    if (newIsLogin) {
      router.push('/welcome?mode=login');
    } else {
      router.push('/welcome?mode=signup');
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 py-5">
        <div className="container mx-auto px-0">
          <div className="cursor-pointer w-fit" onClick={() => router.push("/")}>
            <CirclLogo />
          </div>
        </div>
      </div>

      {/* Left Side - Login Card */}
      <div className="w-full lg:w-1/2 flex justify-center px-8 pt-24 pb-12 bg-white">
        <div className="w-full max-w-md">
          {/* Inspiring headline section */}
          <div className="mb-8  text-center">
            <h1 className="text-5xl font-light text-gray-900 leading-tight mb-4 tracking-tight">
              Network intelligence<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">at your fingertips</span>
            </h1>
            <p className="text-lg text-gray-600 font-light leading-relaxed">
              Ask questions. Find patterns. Discover connections.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            {/* Email Form */}
            <div className="space-y-4 mb-3">
              {/* Floating Label Email Input */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className={`w-full px-4 py-4 border-2 rounded-xl bg-white transition-all duration-200 focus:outline-none peer ${
                    emailError 
                      ? 'border-red-400 focus:border-red-400' 
                      : emailFocused 
                        ? 'border-blue-500 focus:border-blue-500' 
                        : 'border-gray-200 focus:border-blue-500'
                  }`}
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                    emailFocused || email
                      ? '-top-2.5 text-sm bg-white px-2 ' + (emailError ? 'text-red-400' : 'text-blue-500')
                      : 'top-4 text-base text-gray-400'
                  }`}
                >
                  Email address
                </label>
                {emailError && (
                  <div className="flex items-center mt-2 text-red-400 text-sm">
                    <div className="w-4 h-4 rounded-full bg-red-400 flex items-center justify-center mr-2 flex-shrink-0">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    {emailError}
                  </div>
                )}
              </div>

              {isLogin && showPassword && (
                <div className="animate-in slide-in-from-top-2 duration-300 relative">
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className={`w-full px-4 py-4 border-2 rounded-xl bg-white transition-all duration-200 focus:outline-none peer ${
                      passwordError 
                        ? 'border-red-400 focus:border-red-400' 
                        : passwordFocused 
                          ? 'border-blue-500 focus:border-blue-500' 
                          : 'border-gray-200 focus:border-blue-500'
                    }`}
                    placeholder=" "
                    autoFocus
                  />
                  <label
                    htmlFor="password"
                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      passwordFocused || password
                        ? '-top-2.5 text-sm bg-white px-2 ' + (passwordError ? 'text-red-400' : 'text-blue-500')
                        : 'top-4 text-base text-gray-400'
                    }`}
                  >
                    Password
                  </label>
                  {passwordError && (
                    <div className="flex items-center mt-2 text-red-400 text-sm">
                      <div className="w-4 h-4 rounded-full bg-red-400 flex items-center justify-center mr-2 flex-shrink-0">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      {passwordError}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={isLogin && showPassword ? handlePasswordSubmit : handleEmailSubmit}
                className="cursor-pointer w-full text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
                style={{ backgroundColor: "#000000" }}
                onMouseEnter={e => ((e.target as HTMLElement).style.backgroundColor = "#333333")}
                onMouseLeave={e => ((e.target as HTMLElement).style.backgroundColor = "#000000")}
              >
                Continue
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            {providers &&
              Object.values(providers).map(provider => (
                <div key={provider.name} className="space-y-3 mb-4">
                  <button
                    onClick={() => signIn(provider.id, { callbackUrl: "/new" })}
                    className="cursor-pointer w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-gray-700 font-medium">
                      Continue with {provider.name}
                    </span>
                  </button>
                </div>
              ))}

            {/* Toggle link with smooth transition */}
            <div className="h-6 mb-4 flex items-center justify-center">
              <p className="text-sm text-gray-600 transition-all duration-300 ease-in-out">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <a 
                  onClick={toggleMode}
                  onMouseDown={(e) => e.preventDefault()} 
                  className="hover:underline cursor-pointer transition-all duration-300 ease-in-out" 
                  style={{ color: "oklch(62.3% 0.214 259.815)" }}
                >
                  {isLogin ? "Sign up" : "Log in"}
                </a>
              </p>
            </div>

            {/* Footer Links */}
            <div className="mt-2 flex justify-center space-x-4 text-sm text-gray-500">
              <a href="/terms" className="hover:underline">
                Terms of Use
              </a>
              <span>|</span>
              <a href="/privacy" className="hover:underline">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Demo */}
      <div className="w-full lg:w-1/2 flex justify-center px-8 py-4 bg-white">
        <div className="w-full max-w-2xl">
          <div className="pt-20">
            <div className="bg-gray-50 rounded-3xl border border-gray-200 shadow-lg p-8 relative overflow-hidden w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 pointer-events-none" />
              <div className="relative">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 w-full">
                    <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Search className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-grow bg-white rounded-xl p-4 text-left text-slate-700 font-normal min-h-14 shadow-sm border border-gray-200">
                      <div className="break-words overflow-hidden">
                        {typedQuestion}
                        {typedQuestion && typedQuestion.length < queries[currentSlide].question.length && (
                          <span className="inline-block w-0.5 h-4 bg-slate-700 animate-pulse ml-0.5 align-baseline" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`bg-white rounded-xl overflow-hidden text-left transition-all duration-700 ease-out shadow-sm border border-gray-200 ${
                    showAnswer 
                      ? 'opacity-100 max-h-[500px] p-6 transform translate-y-0' 
                      : 'opacity-0 max-h-0 p-0 transform -translate-y-2 pointer-events-none'
                  }`}>
                    <div className="break-words overflow-hidden">
                      <p className="text-slate-700 font-light leading-relaxed mb-4">
                        {showAnswer ? answerText : ''}
                        {showAnswer && answerText && answerText.length < queries[currentSlide].answer.length && (
                          <span className="inline-block w-0.5 h-4 bg-slate-700 animate-pulse ml-0.5 align-baseline" />
                        )}
                      </p>
                    </div>
                    {showAnswer && answerText.length === queries[currentSlide].answer.length && (
                      <div className="mt-4 space-y-3">
                        {queries[currentSlide].type === 'profiles' ? (
                          // Profile cards for people search
                          (queries[currentSlide].bullets as Array<{name: string; title: string; previous: string; detail: string}>).map((profile, index) => (
                            <div key={index} className={`transition-all duration-500 ${showBullets[index] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                              <div className="bg-white/80 rounded-xl p-4 border border-white/40 hover:bg-white transition-colors w-full">
                                <div className="flex items-start space-x-3 w-full">
                                  <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-indigo-400 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                    {profile.name.split(' ').map((n: string) => n[0]).join('')}
                                  </div>
                                  <div className="flex-1 min-w-0 overflow-hidden">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                      <h4 className="font-medium text-slate-800 text-sm flex-shrink-0">{profile.name}</h4>
                                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full w-fit">
                                        {profile.previous}
                                      </span>
                                    </div>
                                    <p className="text-slate-700 text-sm font-medium mb-1 break-words">{profile.title}</p>
                                    <p className="text-slate-600 text-xs font-light break-words">{profile.detail}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : queries[currentSlide].type === 'tenure' ? (
                          // Tenure patterns display
                          (queries[currentSlide].bullets as Array<{company: string; duration: string; trend: string}>).map((tenure, index) => (
                            <div key={index} className={`transition-all duration-500 ${showBullets[index] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 w-full">
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex-1">
                                    <h4 className="font-medium text-slate-800 text-sm mb-1">{tenure.company}</h4>
                                    <p className="text-green-700 text-sm font-light">{tenure.duration}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs text-slate-500 mb-1">Trend</p>
                                    <p className={`text-${tenure.trend.includes('↑') ? 'green' : tenure.trend.includes('↓') ? 'red' : 'gray'}-700 text-sm font-medium`}>
                                      {tenure.trend}
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
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 w-full">
                                <div className="flex items-center justify-between w-full">
                                  <div className="flex-1">
                                    <h4 className="font-medium text-slate-800 text-sm mb-1">{geo.location}</h4>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-blue-700 text-lg font-semibold">{geo.percentage}</span>
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${
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
    </div>
  );
};

export default WelcomeScreen; 