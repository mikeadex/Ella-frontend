import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon } from '@heroicons/react/24/solid';
import { EyeSlashIcon } from '@heroicons/react/24/solid';
import { LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import gsap from 'gsap';

import { useAuth } from '../context/AuthContext';
import SocialLoginButtons from '../components/auth/SocialLoginButtons';

const LOGIN_VARIANTS = {
  initial: { 
    opacity: 0, 
    scale: 0.9,
    y: 50 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    y: 50,
    transition: {
      duration: 0.3
    }
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const loginContainerRef = useRef(null);
  const gradientRef = useRef(null);

  useEffect(() => {
    const updateGradient = (x = 50, y = 50) => {
      if (!gradientRef.current) return;
      
      // Define gradient colors
      const colors = {
        c1: '14, 165, 233', // sky-500
        c2: '139, 92, 246', // violet-500
        c3: '99, 102, 241'  // indigo-500
      };

      const opacity = document.documentElement.classList.contains('dark') ? '0.15' : '0.05';
      
      gradientRef.current.style.background = `
        radial-gradient(circle at ${x}% ${y}%, 
          rgba(${colors.c1}, ${opacity}) 0%, 
          rgba(${colors.c2}, ${opacity}) 15%, 
          rgba(${colors.c3}, ${opacity}) 30%, 
          transparent 45%
        )
      `;
    };

    // Autonomous movement animation
    let startTime = Date.now();
    const radius = window.innerWidth < 768 ? 15 : 20;
    const speed = window.innerWidth < 768 ? 3000 : 5000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      // Calculate position using sine waves for smooth movement
      const x = 50 + radius * Math.sin(elapsed / speed);
      const y = 50 + radius * Math.cos((elapsed / speed) * 1.3);
      
      updateGradient(x, y);
      requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Handle mouse movement on non-touch devices
    const handleMouseMove = (e) => {
      if (window.matchMedia('(hover: hover)').matches && loginContainerRef.current) {
        const rect = loginContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        updateGradient(x, y);
      }
    };

    const currentContainer = loginContainerRef.current;
    currentContainer?.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      currentContainer?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password, rememberMe);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.detail 
        || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSocialLogin = (provider) => {
    // Placeholder for social login logic
    console.log(`Attempting to log in with ${provider}`);
    // TODO: Implement actual social login functionality
  };

  return (
    <div 
      ref={loginContainerRef} 
      className="min-h-screen flex items-center justify-center 
                 bg-gradient-to-br from-blue-50 via-white to-blue-100 
                 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
                 transition-colors duration-500 p-4 relative"
    >
      {/* Dynamic gradient overlay */}
      <div 
        ref={gradientRef} 
        className="absolute inset-0 pointer-events-none z-0"
      ></div>

      <AnimatePresence>
        <motion.div 
          key="login-container"
          initial={LOGIN_VARIANTS.initial}
          animate={LOGIN_VARIANTS.animate}
          exit={LOGIN_VARIANTS.exit}
          className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 space-y-6 relative overflow-hidden z-10"
        >
          {/* Subtle background gradient effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600 opacity-80"></div>

          <div className="text-center">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight"
            >
              Welcome Back
            </motion.h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Sign in to continue to Ella
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 p-3 rounded-md"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                id="email-address"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 
                           text-gray-900 dark:text-white 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           transition-colors duration-300 
                           placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           bg-white dark:bg-gray-700 
                           text-gray-900 dark:text-white 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           transition-colors duration-300
                           placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 
                           text-gray-500 dark:text-gray-400 
                           hover:text-gray-700 dark:hover:text-gray-200
                           focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label 
                  htmlFor="remember-me" 
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/reset-password"
                  className="font-medium text-blue-600 hover:text-blue-500 
                             dark:text-blue-300 dark:hover:text-blue-200 
                             transition-colors duration-300 
                             hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 
                         bg-black dark:bg-gradient-to-r dark:from-blue-500 dark:to-purple-600 
                         hover:bg-gray-800 dark:hover:from-blue-600 dark:hover:to-purple-700 
                         text-white font-bold py-2 px-4 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         transition-all duration-300 ease-in-out 
                         transform hover:scale-[1.02] active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         text-sm tracking-wider"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <SocialLoginButtons onSocialLogin={handleSocialLogin} />

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-medium 
                           text-blue-600 hover:text-blue-500 
                           dark:text-blue-300 dark:hover:text-blue-200
                           transition-colors duration-300 
                           hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Login;
