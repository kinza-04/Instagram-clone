import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface LandingPageProps {
  onLogin: (username: string) => void;
  onSignup: (username: string, fullName: string) => void;
}

const PHONE_SCREENSHOTS = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=380&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=380&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=380&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=380&auto=format&fit=crop&q=80'
];

export default function LandingPage({ onLogin, onSignup }: LandingPageProps) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);

  // Form states
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  // Cycle screenshots every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScreenshotIndex((prev) => (prev + 1) % PHONE_SCREENSHOTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!emailOrUser.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Accept login
    const targetUsername = emailOrUser.includes('@') 
      ? emailOrUser.split('@')[0].toLowerCase() 
      : emailOrUser.toLowerCase().replace(/\s+/g, '_');
    
    onLogin(targetUsername);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!emailOrUser.trim() || !password.trim() || !fullName.trim() || !username.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const cleanUsername = username.toLowerCase().replace(/\s+/g, '_');
    onSignup(cleanUsername, fullName);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between transition-colors duration-200">
      
      {/* Top Banner indicating a secure environment */}
      <div className="bg-black text-zinc-400 text-xs py-2 px-4 flex items-center justify-center gap-2 border-b border-zinc-800">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Secure Sandbox Preview Environment - Mock Credentials Accepted</span>
      </div>

      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="flex items-center justify-center gap-8 max-w-4xl w-full">
          
          {/* Left Side: Slidable Phone Mockup */}
          <div className="hidden md:block relative w-[380px] h-[580px] select-none bg-[url('https://static.cdninstagram.com/rsrc.php/yR/r/92ZsVHNkyvf.webp')] bg-no-repeat bg-contain bg-center">
            {/* Immersive inner sliding viewport */}
            <div className="absolute top-[28px] left-[110px] w-[210px] h-[454px] rounded-[18px] overflow-hidden bg-neutral-900">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentScreenshotIndex}
                  src={PHONE_SCREENSHOTS[currentScreenshotIndex]}
                  alt="App Preview"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side: Log-in / Sign-up Forms */}
          <div className="flex flex-col gap-3 w-full max-w-[350px]">
            
            {/* Main Instagram Card */}
            <div className="bg-black border border-zinc-800 rounded-lg p-9 flex flex-col items-center">
              {/* Logo Title */}
              <h1 className="font-serif text-4xl font-semibold tracking-wider my-6 italic text-white select-none">
                Instagram
              </h1>

              {!isLoginView && (
                <p className="text-sm font-semibold text-zinc-400 text-center mb-4 leading-snug">
                  See everyday moments from your close friends.
                </p>
              )}

              <form onSubmit={isLoginView ? handleLoginSubmit : handleSignupSubmit} className="w-full flex flex-col gap-2">
                {/* Form fields */}
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder={isLoginView ? "Mobile number, username or email" : "Mobile number or Email"}
                    className="w-full bg-zinc-900 text-white text-xs px-2.5 py-2.5 rounded border border-zinc-800 focus:outline-none focus:border-zinc-700 transition-colors"
                    value={emailOrUser}
                    onChange={(e) => setEmailOrUser(e.target.value)}
                  />
                </div>

                {!isLoginView && (
                  <>
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full bg-zinc-900 text-white text-xs px-2.5 py-2.5 rounded border border-zinc-800 focus:outline-none focus:border-zinc-700 transition-colors"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="relative w-full">
                      <input
                        type="text"
                        placeholder="Username"
                        className="w-full bg-zinc-900 text-white text-xs px-2.5 py-2.5 rounded border border-zinc-800 focus:outline-none focus:border-zinc-700 transition-colors"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full bg-zinc-900 text-white text-xs px-2.5 py-2.5 pr-10 rounded border border-zinc-800 focus:outline-none focus:border-zinc-700 transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Error Banner */}
                {error && (
                  <p className="text-xs text-rose-500 text-center mt-1 font-medium">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#0095f6] hover:bg-[#1877f2] active:bg-[#0082fb] text-white text-sm font-semibold py-1.5 rounded-lg mt-3 transition-colors duration-150 shadow-sm"
                >
                  {isLoginView ? 'Log In' : 'Sign up'}
                </button>

                {/* OR divider */}
                <div className="flex items-center justify-between w-full my-4">
                  <div className="h-[1px] bg-zinc-800 flex-grow"></div>
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase px-4">
                    OR
                  </span>
                  <div className="h-[1px] bg-zinc-800 flex-grow"></div>
                </div>

                {/* Login with Facebook / Quick access */}
                <button
                  type="button"
                  onClick={() => onLogin('meta_guest')}
                  className="flex items-center justify-center gap-2 text-xs font-semibold text-sky-500 hover:text-sky-400 transition-colors w-full py-1.5"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M22 12.037C22 6.494 17.523 2 12 2S2 6.494 2 12.037c0 4.707 3.229 8.656 7.584 9.741v-6.674H7.522v-3.067h2.062v-1.322c0-3.416 1.54-5 4.882-5 .634 0 1.727.125 2.174.25v2.78a12.807 12.807 0 0 0-1.155-.037c-1.64 0-2.273.623-2.273 2.244v1.085h3.266l-.56 3.067h-2.706V22C18.164 21.4 22 17.168 22 12.037z" />
                  </svg>
                  <span>Log in with Facebook</span>
                </button>

                {isLoginView && (
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setError('Demo login accepts any mock credentials.'); }}
                    className="text-[11px] text-center text-zinc-500 hover:text-zinc-400 mt-2 block"
                  >
                    Forgot password?
                  </a>
                )}
              </form>
            </div>

            {/* Alternating Card (Sign Up / Sign In Switcher) */}
            <div className="bg-black border border-zinc-800 rounded-lg p-6 text-center text-xs text-zinc-400">
              <span>
                {isLoginView ? "Don't have an account? " : "Have an account? "}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsLoginView(!isLoginView);
                  setError('');
                }}
                className="text-[#0095f6] font-semibold hover:underline"
              >
                {isLoginView ? 'Sign up' : 'Log in'}
              </button>
            </div>

            {/* Get the App */}
            <div className="flex flex-col gap-2.5 items-center mt-2">
              <span className="text-xs text-zinc-400">Get the app.</span>
              <div className="flex gap-2">
                <img
                  src="https://static.cdninstagram.com/rsrc.php/yL/r/avQDnJ1wuet.webp"
                  alt="App Store"
                  className="h-10 cursor-pointer object-contain hover:opacity-90 transition-opacity"
                />
                <img
                  src="https://static.cdninstagram.com/rsrc.php/yL/r/rULIXUVt8H2.webp"
                  alt="Google Play"
                  className="h-10 cursor-pointer object-contain hover:opacity-90 transition-opacity"
                />
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer Branding and Meta Information */}
      <footer className="w-full border-t border-zinc-900 bg-black py-6 px-4 text-xs text-zinc-500 flex flex-col items-center gap-4 transition-colors">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 max-w-3xl text-center">
          <a href="#" className="hover:underline">Meta</a>
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Blog</a>
          <a href="#" className="hover:underline">Jobs</a>
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">API</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Locations</a>
          <a href="#" className="hover:underline">Instagram Lite</a>
          <a href="#" className="hover:underline">Threads</a>
          <a href="#" className="hover:underline">Contact Uploading & Non-Users</a>
          <a href="#" className="hover:underline">Meta Verified</a>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            className="bg-transparent border-none outline-none cursor-pointer text-xs pr-1 font-medium text-zinc-500"
            defaultValue="en"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="it">Italiano</option>
          </select>
          <span>© 2026 Instagram from Meta</span>
        </div>
      </footer>

    </div>
  );
}
