import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiEdit3, FiLayout, FiDownload, FiGlobe, FiRefreshCw, FiShield } from 'react-icons/fi';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const Features = () => {
  const features = [
    {
      id: 1,
      icon: FiEdit3,
      title: 'AI-Powered Writing Assistant',
      description: 'Our intelligent AI helps you write compelling content and suggests improvements in real-time.'
    },
    {
      id: 2,
      icon: FiLayout,
      title: 'Professional Templates',
      description: 'Choose from a variety of ATS-friendly templates designed by HR professionals.'
    },
    {
      id: 3,
      icon: FiDownload,
      title: 'Multiple Export Formats',
      description: 'Export your CV in PDF, Word, or plain text formats suitable for any application process.'
    },
    {
      id: 4,
      icon: FiGlobe,
      title: 'Multi-Language Support',
      description: 'Create CVs in multiple languages and formats to apply for international positions.'
    },
    {
      id: 5,
      icon: FiRefreshCw,
      title: 'Real-Time Preview',
      description: 'See changes instantly as you type with our live preview feature.'
    },
    {
      id: 6,
      icon: FiShield,
      title: 'ATS Optimization',
      description: 'Ensure your CV passes Applicant Tracking Systems with our built-in optimization tools.'
    }
  ];

  return (
    <main className="text-gray-900 dark:text-white">
      {/* Navigation */}
      <Suspense fallback={<div className="h-16" />}>
        <Navbar />
      </Suspense>

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-6 md:pb-12 overflow-hidden bg-slate-50 dark:bg-black">
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
              Powerful Features for Your CV
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8"
            >
              Everything you need to create a professional CV that stands out
            </motion.p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-white dark:bg-gradient-to-br dark:from-black dark:to-gray-900">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <feature.icon className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Ready to Experience These Features?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Start creating your professional CV with our powerful tools
          </p>
          <Link
            to="/cv-writer"
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-medium text-lg transition-all duration-300 transform hover:shadow-lg"
          >
            Get Started
            <FiArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Features;
