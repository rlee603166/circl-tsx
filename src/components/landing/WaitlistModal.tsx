import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react'; 
import { ENDPOINTS } from '@/api.config';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

const anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose, initialEmail }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [code, setCode] = useState('');
  const [userCode, setUserCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedCode = localStorage.getItem('waitlist_code');
    if (storedCode) {
      setCode(storedCode);
      localStorage.removeItem("waitlist_code");
    }
  }, []);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false); 
      setError(''); // Clear any previous errors
      if (!initialEmail) {
        setEmail(''); // Reset email if not pre-filled and modal reopens
      }
    }
  }, [isOpen, initialEmail]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    setIsLoading(true);

    try {
      console.log('Waitlist submission:', { email, code });

      const response = await fetch(`${ENDPOINTS.supabase_edge}/join-waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anon_key}`,
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist. Please try again.');
      }

      setUserCode(data.referralCode);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Waitlist submission error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-opacity duration-300"
      onClick={onClose} 
    >
      <div 
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md relative transform transition-all duration-300 scale-95 opacity-0 animate-modalFadeInScaleUp"
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {!isSubmitted ? (
          <>
            <h3 className="text-2xl sm:text-3xl font-light text-gray-900 mb-3 text-center">Join the Circl Waitlist</h3>
            <p className="text-gray-600 text-center mb-8 text-sm sm:text-base">
              Be among the first to explore a new way to understand career paths and professional networks. Enter your email to request early access.
            </p>
            
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="modal-email" className="sr-only">Email address</label>
                <input 
                  type="email" 
                  name="email" 
                  id="modal-email" 
                  autoComplete="email" 
                  placeholder="you@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-gray-700 placeholder:text-gray-400 text-md"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label htmlFor="modal-referral-code" className="sr-only">Referral code</label>
                <input 
                  type="text" 
                  name="referralCode" 
                  id="modal-referral-code" 
                  placeholder="Referral code (optional)" 
                  maxLength={8}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none text-gray-700 placeholder:text-gray-400 text-md"
                  disabled={isLoading}
                />
                {code && code.length !== 8 && (
                  <p className="mt-1 text-sm text-amber-600">Referral code should be 8 characters</p>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full px-6 py-3.5 sm:py-4 rounded-lg bg-purple-600 text-white font-light text-lg shadow-md hover:bg-purple-700 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Submitting...' : 'Request Early Access'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <h4 className="text-xl sm:text-2xl font-light text-gray-900 mb-2">You're on the list! 🎉</h4>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">Keep an eye on your inbox. Refer friends to get priority access!</p>
            <div className="flex items-center justify-center mb-4">
              <input 
                type="text" 
                readOnly 
                value={`https://usecircl.com/ref/${userCode}`} // This would be dynamically generated
                className="w-full max-w-xs px-3 py-2.5 rounded-lg bg-gray-100 border border-gray-300 text-gray-700 text-sm select-all text-center sm:text-left"
              />
              <button 
                onClick={() => navigator.clipboard.writeText(`https://usecircl.com/ref/${userCode}`)}
                className="ml-2 px-4 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm transition-colors"
              >
                Copy Link
              </button>
            </div>
            <p className="text-gray-500 text-xs sm:text-sm">
              The more friends you invite, the sooner you'll get in.
            </p>
            <button 
              onClick={onClose}
              className="mt-6 px-6 py-2.5 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        )}
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-modalFadeInScaleUp {
          animation: fadeIn 0.3s ease-out forwards, scaleUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WaitlistModal; 