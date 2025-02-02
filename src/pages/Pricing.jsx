import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

const Pricing = () => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '0',
      description: 'Perfect for getting started',
      features: [
        'Create 1 CV',
        'Basic templates',
        'Export to PDF',
        'Basic AI suggestions',
        '7-day access to premium features'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '9',
      description: 'Best for job seekers',
      features: [
        'Create unlimited CVs',
        'All premium templates',
        'Export to multiple formats',
        'Advanced AI writing assistant',
        'ATS optimization',
        'Priority support',
        'Cover letter builder'
      ],
      cta: 'Go Pro',
      popular: true
    },
    {
      id: 'team',
      name: 'Team',
      price: '29',
      description: 'For career coaches & teams',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Client management',
        'Custom branding',
        'Analytics dashboard',
        'API access',
        'Dedicated support'
      ],
      cta: 'Contact Sales',
      popular: false
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
              Simple, Transparent Pricing
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8"
            >
              Choose the perfect plan for your CV needs
            </motion.p>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-16 px-4 bg-white dark:bg-gradient-to-br dark:from-black dark:to-gray-900">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                  plan.popular ? 'ring-2 ring-indigo-600 dark:ring-indigo-400' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400">/month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <FiCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.id === 'team' ? '/contact' : '/cv-writer/write'}
                  className={`block w-full text-center py-3 px-6 rounded-full transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can cancel your subscription at any time. You'll continue to have access to your plan until the end of your billing period.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We offer a 30-day money-back guarantee if you're not satisfied with our service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Pricing;
