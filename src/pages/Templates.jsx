import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const Templates = () => {
  const templates = [
    {
      id: 1,
      name: 'Modern Professional',
      description: 'Clean and contemporary design perfect for tech and corporate roles',
      image: '/templates/modern.png',
      category: 'Professional'
    },
    {
      id: 2,
      name: 'Creative Portfolio',
      description: 'Stand out with a unique layout ideal for creative industries',
      image: '/templates/creative.png',
      category: 'Creative'
    },
    {
      id: 3,
      name: 'Executive Classic',
      description: 'Traditional format trusted by senior professionals and executives',
      image: '/templates/executive.png',
      category: 'Professional'
    },
    // Add more templates as needed
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
              Professional CV Templates
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8"
            >
              Choose from our collection of professionally designed templates to create your perfect CV
            </motion.p>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-16 px-4 bg-white dark:bg-gradient-to-br dark:from-black dark:to-gray-900">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-800">
                  <img 
                    src={template.image} 
                    alt={template.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {template.category}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                    {template.name}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {template.description}
                  </p>
                  <Link
                    to="/cv-writer/write"
                    className="mt-4 inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    Use this template
                    <FiArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Ready to Create Your Professional CV?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Choose a template and start building your CV in minutes
          </p>
          <Link
            to="/cv-writer/write"
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

export default Templates;
