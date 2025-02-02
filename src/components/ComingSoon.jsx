import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

const ComingSoon = ({ title, description }) => {
  return (
    <main className="text-gray-900 dark:text-white">
      {/* Navigation */}
      <Suspense fallback={<div className="h-16" />}>
        <Navbar />
      </Suspense>

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-6 md:pb-12 overflow-hidden bg-slate-50 dark:bg-black min-h-screen">
        <div className="absolute inset-0">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] bg-[center_-1px] [mask-image:linear-gradient(0deg,transparent,black,transparent)]" />
          {/* Radial Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(120,119,198,0.1),transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,rgba(120,119,198,0.05),transparent)]" />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8"
            >
              {description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-8"
            >
              <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-indigo-600 dark:border-indigo-400" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default ComingSoon;
