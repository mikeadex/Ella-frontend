import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import AnimatedCards from '../components/AnimatedCards';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar/Navbar'; // Import the existing Navbar component
import Footer from '../components/Footer/Footer';

gsap.registerPlugin(ScrollTrigger);

// Lazy-loaded components for performance
const ThemeSwitcher = React.lazy(() => import('../components/ThemeSwitcher'));

function Home() {
  const cvContainerRef = useRef(null);
  const cvRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const cvContainer = cvContainerRef.current;
    const cv = cvRef.current;

    // Initial state
    gsap.set(cv, {
      width: '595px',
      height: '842px',
      borderRadius: '0px',
      transformOrigin: 'center center',
      scale: 1
    });

    // Create the ScrollTrigger instance
    const cvScrollTrigger = ScrollTrigger.create({
      trigger: cvContainer,
      start: 'top 60%',
      end: '+=200',
      scrub: true,
      markers: false,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Calculate interpolated values
        const width = gsap.utils.interpolate(595, 320, progress);
        const height = gsap.utils.interpolate(842, 600, progress);
        const borderRadius = gsap.utils.interpolate(0, 20, progress);
        const scale = gsap.utils.interpolate(1, 0.9, progress);
        
        // Apply the interpolated values
        gsap.to(cv, {
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: `${borderRadius}px`,
          scale: scale,
          duration: 0.1,
          overwrite: true,
          ease: 'none'
        });
      }
    });

    // Handle resize
    const handleResize = () => {
      const newSize = { width: 595, height: 842 };
      if (!cvScrollTrigger.progress) { // Only reset if not scrolled
        gsap.set(cv, {
          width: `${newSize.width}px`,
          height: `${newSize.height}px`
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cvScrollTrigger.kill();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const heroRef = useRef(null);
  const gradientRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const updateGradient = (progress, x = 50, y = 50) => {
      if (!gradientRef.current) return;
      
      // Define gradient colors for different scroll positions
      const colors = {
        start: {
          c1: '14, 165, 233', // sky-500
          c2: '139, 92, 246', // violet-500
          c3: '99, 102, 241'  // indigo-500
        },
        end: {
          c1: '59, 130, 246', // blue-500
          c2: '168, 85, 247',  // purple-500
          c3: '236, 72, 153'   // pink-500
        }
      };

      // Interpolate between colors based on scroll progress
      const interpolateColor = (c1, c2, progress) => {
        const [r1, g1, b1] = c1.split(',').map(Number);
        const [r2, g2, b2] = c2.split(',').map(Number);
        
        const r = Math.round(r1 + (r2 - r1) * progress);
        const g = Math.round(g1 + (g2 - g1) * progress);
        const b = Math.round(b1 + (b2 - b1) * progress);
        
        return `${r}, ${g}, ${b}`;
      };

      // Calculate interpolated colors
      const currentC1 = interpolateColor(colors.start.c1, colors.end.c1, progress);
      const currentC2 = interpolateColor(colors.start.c2, colors.end.c2, progress);
      const currentC3 = interpolateColor(colors.start.c3, colors.end.c3, progress);

      const opacity = document.documentElement.classList.contains('dark') ? '0.25' : '0.15';
      
      gradientRef.current.style.background = `
        radial-gradient(circle at ${x}% ${y}%, 
          rgba(${currentC1}, ${opacity}) 0%, 
          rgba(${currentC2}, ${opacity}) 15%, 
          rgba(${currentC3}, ${opacity}) 30%, 
          transparent 45%
        )
      `;
    };

    // Autonomous movement animation
    let startTime = Date.now();
    const radius = window.innerWidth < 768 ? 15 : 20; // Smaller radius on mobile
    const speed = window.innerWidth < 768 ? 3000 : 5000; // Faster on mobile

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = ScrollTrigger.getById('heroGradient')?.progress || 0;
      
      // Calculate position using sine waves for smooth movement
      const x = 50 + radius * Math.sin(elapsed / speed);
      const y = 50 + radius * Math.cos((elapsed / speed) * 1.3); // Different frequency for y
      
      updateGradient(progress, x, y);
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Handle mouse movement on non-touch devices
    const handleMouseMove = (e) => {
      if (window.matchMedia('(hover: hover)').matches) {
        if (!heroRef.current) return;
        
        const rect = heroRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        const progress = ScrollTrigger.getById('heroGradient')?.progress || 0;
        updateGradient(progress, x, y);
        
        // Pause autonomous animation while mouse is moving
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        
        // Resume autonomous animation after mouse stops moving
        startTime = Date.now(); // Reset time to prevent jumping
        setTimeout(() => {
          if (!animationRef.current) {
            animate();
          }
        }, 2000);
      }
    };

    // Set up GSAP scroll trigger
    const trigger = gsap.to(heroRef.current, {
      scrollTrigger: {
        id: 'heroGradient',
        trigger: heroRef.current,
        start: 'top 60%',
        end: '+=200',
        scrub: true,
        markers: false,
        onUpdate: (self) => {
          const progress = self.progress;
          // Don't update position here, let the animation handle it
          updateGradient(progress);
        },
      },
    });

    // Add mouse move listener
    if (heroRef.current) {
      heroRef.current.addEventListener('mousemove', handleMouseMove);
    }

    // Cleanup
    return () => {
      if (heroRef.current) {
        heroRef.current.removeEventListener('mousemove', handleMouseMove);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      trigger.kill();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-300">
      <Helmet>
        <title>Ella - Professional CV Builder</title>
      </Helmet>

      <main className="text-gray-900 dark:text-white">
        {/* Navigation */}
        <Suspense fallback={<div className="h-16" />}>
          <Navbar />
        </Suspense>

        {/* Hero Section */}
        <section 
          ref={heroRef} 
          className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36"
        >
          {/* Gradient Morph */}
          <div 
            ref={gradientRef}
            className="absolute inset-0 transition-all duration-300 ease-out z-10"
            style={{
              background: `
                radial-gradient(circle at 50% 50%, 
                  rgba(14, 165, 233, 0.15) 0%, 
                  rgba(139, 92, 246, 0.15) 15%, 
                  rgba(99, 102, 241, 0.15) 30%, 
                  transparent 45%
                )
              `,
              mixBlendMode: 'lighter'
            }}
          />

          {/* Subtle Grid Pattern */}
          {/* <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${document.documentElement.classList.contains('dark') ? '1d1d1f' : 'a0aec0'}' fill-opacity='0.03'%3E%3Cpath d='M30 30h60v60H30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}
          /> */}

          {/* Content */}
          <div className="container mx-auto px-4 relative z-10">
            {/* Main Content */}
            <div className="max-w-5xl mx-auto mb-20">
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium text-sm mb-6 backdrop-blur-sm border border-indigo-100/20 dark:border-indigo-400/20"
                >
                  <span className="flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-indigo-400 dark:bg-indigo-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500 dark:bg-indigo-300"></span>
                  </span>
                  AI-Powered CV Builder
                </motion.div>

                <motion.h1 
                  className="font-display text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="text-slate-900 dark:text-white relative">
                    Professional CV in Minutes
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-indigo-500/10 dark:to-violet-500/10 blur-2xl opacity-20 mix-blend-multiply dark:mix-blend-overlay" />
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent relative">
                    Ella AI
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-indigo-500/10 dark:to-violet-500/10 blur-2xl opacity-20 mix-blend-multiply dark:mix-blend-overlay" />
                  </span>
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="relative"
                >
                  <p className="font-display text-lg text-slate-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto mb-12">
                    Stand out from the crowd with Ella. An AI-powered CV builder. 
                    Create professional, ATS-friendly resumes tailored to your industry 
                    and experience level.
                  </p>
                  <div className="absolute -inset-4 bg-gradient-to-r from-indigo-50/50 to-violet-50/50 dark:from-indigo-500/5 dark:to-violet-500/5 blur-xl opacity-20 mix-blend-multiply dark:mix-blend-overlay" />
                </motion.div>

                <motion.div
                  className="flex flex-wrap justify-center gap-4 mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <Link 
                    to="/cv-writer/write" 
                    className="group inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-10" />
                    <span className="relative">Start Building</span>
                    <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform relative" />
                  </Link>

                  <a 
                    href="#features" 
                    className="inline-flex items-center px-8 py-4 text-lg font-medium text-slate-700 dark:text-white bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-200 dark:border-gray-700 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-5" />
                    <span className="relative">See Examples</span>
                  </a>
                </motion.div>

                {/* Trust Badges */}
                <motion.div 
                  className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-600 dark:text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center bg-white/80 dark:bg-gray-900/80 px-6 py-3 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm">
                    <div className="flex -space-x-2 mr-3">
                      {[1, 2, 3].map((i) => (
                        <div 
                          key={i} 
                          className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900 bg-gradient-to-r from-indigo-500 to-violet-500"
                        />
                      ))}
                    </div>
                    <span className="font-medium">Trusted by 2,000+ professionals</span>
                  </div>

                  <div className="flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 px-6 py-3 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm">
                    <svg className="w-5 h-5 text-amber-500 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium">Top-rated on ProductHunt</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Animated Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="relative max-w-5xl mx-auto"
            >
              <AnimatedCards />
            </motion.div>
          </div>
        </section>

        {/* Elevate Your Career Journey Section */}
        <section className="relative py-8 md:py-16 overflow-hidden dark:bg-gradient-to-br dark:from-black dark:to-gray-900">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900/20 dark:to-black" />
          <div className="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-5" />
          <div className="absolute -left-20 top-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute -right-20 bottom-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Column - Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <h2 className="text-5xl font-bold leading-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
                  Elevate Your Career Journey
                </h2>
                <p className="text-lg text-gray-700 dark:text-white leading-relaxed">
                  Transform your professional narrative with our AI-powered CV builder. 
                  Stand out in today's competitive job market with a perfectly crafted resume 
                  that highlights your unique strengths and achievements.
                </p>
                <div className="space-y-6">
                  {[
                    { title: "AI-Powered Optimization", desc: "Smart suggestions and ATS-friendly formatting" },
                    { title: "Professional Templates", desc: "Beautifully crafted, industry-tested designs" },
                    { title: "Real-Time Collaboration", desc: "Share and get feedback instantly" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start space-x-4"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mt-1">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                        <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Link 
                    to="/cv-writer/write" 
                    className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Start Building Now
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Right Column - Interactive Elements */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/80 dark:bg-black backdrop-blur-sm shadow-2xl border border-gray-100 dark:border-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-900/20 dark:to-black" />
                  <div className="relative p-8 h-full flex flex-col">
                    {/* Mock CV Preview */}
                    <div className="flex-1 space-y-6">
                      <div className="h-8 w-3/4 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-gray-900 dark:to-black rounded-lg animate-pulse" />
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div 
                            key={i} 
                            className="space-y-2"
                          >
                            <div className="h-3 md:h-4 w-full bg-gray-100 dark:bg-gray-900 rounded" />
                            <div className="h-3 md:h-4 w-5/6 bg-gray-100 dark:bg-gray-900 rounded" />
                            <div className="h-3 md:h-4 w-4/6 bg-gray-100 dark:bg-gray-900 rounded" />
                          </div>
                        ))}
                      </div>
                      <div className="pt-4 space-y-3">
                        <div className="h-4 bg-gray-100 dark:bg-gray-900 rounded w-5/6" />
                        <div className="h-4 bg-gray-100 dark:bg-gray-900 rounded w-4/6" />
                      </div>
                      <div className="pt-4 space-y-3">
                        <div className="h-4 bg-gray-100 dark:bg-gray-900 rounded w-5/6" />
                        <div className="h-4 bg-gray-100 dark:bg-gray-900 rounded w-4/6" />
                        <div className="h-4 bg-gray-100 dark:bg-gray-900 rounded w-3/6" />
                      </div>
                    </div>
                    {/* Interactive Elements */}
                    <div className="absolute bottom-8 right-8 flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg flex items-center justify-center cursor-pointer text-white"
                      >
                        <svg 
                          className="w-6 h-6" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M15 19l-7-7 7-7m0 0l-5 5m5-5H6" 
                          />
                        </svg>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg flex items-center justify-center cursor-pointer text-white"
                      >
                        <svg 
                          className="w-6 h-6" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                          />
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Responsive CV Showcase Section */}
        <section className="relative py-6 md:py-12 overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:via-black dark:to-gray-900">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-6 md:mb-12">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent px-4"
              >
                Perfect on Every Device
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-700 dark:text-white px-4 max-w-xl mx-auto"
              >
                Your CV adapts seamlessly to any screen size, ensuring your professional story looks great everywhere.
              </motion.p>
            </div>

            {/* CV Transform Container */}
            <div 
              ref={cvContainerRef}
              className="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden"
            >
              {/* Device Frame */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 flex items-center justify-center px-4"
              >
                <div className="relative w-full max-w-lg overflow-hidden">
                  {/* CV Preview */}
                  <div
                    ref={cvRef}
                    className="bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black shadow-2xl will-change-transform overflow-hidden mx-auto transform-gpu dark:shadow-blue-500/5"
                    style={{
                      transition: 'box-shadow 0.3s ease-out',
                      maxWidth: '100%'
                    }}
                  >
                    {/* CV Content */}
                    <div className="p-4 md:p-8 h-full">
                      {/* Header */}
                      <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                        <div className="h-8 md:h-12 w-36 md:w-48 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-900 dark:to-black rounded-lg" />
                        <div className="h-3 md:h-4 w-48 md:w-64 bg-gray-100 dark:bg-gray-900 rounded" />
                        <div className="h-3 md:h-4 w-40 md:w-56 bg-gray-100 dark:bg-gray-900 rounded" />
                      </div>
                      
                      {/* Experience Section */}
                      <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
                        <div className="h-5 md:h-6 w-24 md:w-32 bg-blue-100 dark:bg-gray-900 rounded" />
                        <div className="space-y-3 md:space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div 
                              key={i} 
                              className="space-y-2"
                            >
                              <div className="h-3 md:h-4 w-full bg-gray-100 dark:bg-gray-900 rounded" />
                              <div className="h-3 md:h-4 w-5/6 bg-gray-100 dark:bg-gray-900 rounded" />
                              <div className="h-3 md:h-4 w-4/6 bg-gray-100 dark:bg-gray-900 rounded" />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Skills Section */}
                      <div className="space-y-3 md:space-y-4">
                        <div className="h-5 md:h-6 w-20 md:w-24 bg-purple-100 dark:bg-gray-900 rounded" />
                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                          {[...Array(6)].map((_, i) => (
                            <div 
                              key={i} 
                              className="h-3 md:h-4 bg-gray-100 dark:bg-gray-900 rounded"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Device Indicators */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    <div className="w-8 md:w-12 h-1 rounded-full bg-blue-500 opacity-50 dark:bg-blue-500/50" />
                    <div className="w-6 md:w-8 h-1 rounded-full bg-purple-500" />
                    <div className="w-8 md:w-12 h-1 rounded-full bg-blue-500 opacity-50 dark:bg-blue-500/50" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {/* <section className="py-8 md:py-16 px-4 bg-white dark:bg-gradient-to-br dark:from-black dark:to-gray-900">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-black border border-gray-100 dark:border-gray-800 shadow-lg dark:shadow-blue-500/5"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">John Doe</h3>
                    <p className="text-gray-700 dark:text-gray-300">Software Engineer</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "Ella transformed my CV completely. The AI suggestions were spot-on, and the design is absolutely stunning."
                </p>
              </motion.div>
            ))}
          </div>
        </section> */}

        {/* Call to Action Section */}
        <section className="py-8 md:py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto"
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Your Career Transformation Starts Here
            </h2>
            <p className="text-xl mb-12 text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of professionals who have elevated their careers with 
              data-driven, AI-enhanced CVs.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/cv-writer/write" 
                className="inline-flex items-center px-10 py-5 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Build Your Standout CV
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

export default Home;