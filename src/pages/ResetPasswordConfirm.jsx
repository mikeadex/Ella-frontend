import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import gsap from 'gsap';

const RESET_PASSWORD_CONFIRM_VARIANTS = {
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

const ResetPasswordConfirm = () => {
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const resetContainerRef = useRef(null);
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
      if (window.matchMedia('(hover: hover)').matches && resetContainerRef.current) {
        const rect = resetContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        updateGradient(x, y);
      }
    };

    const currentContainer = resetContainerRef.current;
    currentContainer?.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      currentContainer?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const togglePasswordVisibility1 = () => {
    setShowPassword1((prevState) => !prevState);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (password1 !== password2) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post('/api/auth/password/reset/confirm/', {
        uid,
        token,
        new_password1: password1,
        new_password2: password2,
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        Object.values(err.response?.data || {})[0]?.[0] ||
        'Failed to reset password. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div 
        ref={resetContainerRef}
        className="min-h-screen flex items-center justify-center 
                   bg-gradient-to-br from-blue-50 via-white to-blue-100 
                   dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
                   transition-colors duration-500 p-4 relative"
      >
        <div 
          ref={gradientRef} 
          className="absolute inset-0 pointer-events-none z-0"
        ></div>

        <AnimatePresence>
          <motion.div
            key="success-container"
            initial={RESET_PASSWORD_CONFIRM_VARIANTS.initial}
            animate={RESET_PASSWORD_CONFIRM_VARIANTS.animate}
            exit={RESET_PASSWORD_CONFIRM_VARIANTS.exit}
            className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 space-y-6 relative overflow-hidden z-10"
          >
            <div className="rounded-md bg-green-50 dark:bg-green-900 p-4">
              <div className="text-sm text-green-700 dark:text-green-300">
                Password reset successful! Redirecting to login...
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div 
      ref={resetContainerRef}
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
          key="reset-container"
          initial={RESET_PASSWORD_CONFIRM_VARIANTS.initial}
          animate={RESET_PASSWORD_CONFIRM_VARIANTS.animate}
          exit={RESET_PASSWORD_CONFIRM_VARIANTS.exit}
          className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 space-y-6 relative overflow-hidden z-10"
        >
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
              Reset your password
            </h2>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
            
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <LockClosedIcon className="h-5 w-5 
                    text-blue-500 dark:text-blue-400
                    transition-colors duration-300" />
                </div>
                <input
                  id="password1"
                  name="password1"
                  type={showPassword1 ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password1}
                  onChange={(e) => setPassword1(e.target.value)}
                  className="appearance-none rounded-none relative block w-full pl-10 pr-10 px-3 py-2 border border-gray-300 dark:border-gray-600 
                             placeholder-gray-500 dark:placeholder-gray-400 
                             text-gray-900 dark:text-white 
                             rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 
                             bg-white dark:bg-gray-800
                             transition-colors duration-300"
                  placeholder="New Password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility1}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 
                             text-gray-500 dark:text-gray-400 
                             hover:text-gray-700 dark:hover:text-gray-200
                             focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                >
                  {showPassword1 ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <LockClosedIcon className="h-5 w-5 
                    text-blue-500 dark:text-blue-400
                    transition-colors duration-300" />
                </div>
                <input
                  id="password2"
                  name="password2"
                  type={showPassword2 ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  className="appearance-none rounded-none relative block w-full pl-10 pr-10 px-3 py-2 border border-gray-300 dark:border-gray-600 
                             placeholder-gray-500 dark:placeholder-gray-400 
                             text-gray-900 dark:text-white 
                             rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 
                             bg-white dark:bg-gray-800
                             transition-colors duration-300"
                  placeholder="Confirm New Password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility2}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 
                             text-gray-500 dark:text-gray-400 
                             hover:text-gray-700 dark:hover:text-gray-200
                             focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                >
                  {showPassword2 ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-black dark:bg-gradient-to-r dark:from-blue-500 dark:to-purple-600 
                         hover:bg-gray-800 dark:hover:from-blue-600 dark:hover:to-purple-700 
                         text-white font-bold py-2 px-4 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         transition-all duration-300 ease-in-out 
                         transform hover:scale-[1.02] active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         text-sm tracking-wider"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 
                           dark:text-blue-300 dark:hover:text-blue-200
                           transition-colors duration-300 
                           hover:underline"
              >
                Back to login
              </Link>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ResetPasswordConfirm;
