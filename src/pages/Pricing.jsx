import React, { Suspense, useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiX } from 'react-icons/fi';
import { Modal, Alert, Spin, Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { useAuth } from '../context/AuthContext';
import SubscriptionService from '../services/subscriptionService';
import { useUserCurrency, formatPriceForDisplay } from '../utils/currencyUtils';
import { STRIPE_PUBLISHABLE_KEY } from '../config';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Stripe promise for payment processing
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

function PaymentForm({ onSuccess, onCancel, plan, processing, error }) {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState(null);
  const { currency } = useUserCurrency();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setCardError(null);
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setCardError('Could not find card element');
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setCardError(error.message);
        return;
      }

      onSuccess(paymentMethod.id);
    } catch (err) {
      setCardError('An error occurred while processing your payment.');
      console.error('Payment error:', err);
    }
  };

  // Format price for display with correct currency
  const formattedPrice = formatPriceForDisplay(plan?.price || 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Subscribe to {plan?.name}</h3>
        <p className="text-gray-600">{formattedPrice}/{plan?.selectedInterval}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="p-4 border rounded-md bg-white">
            <CardElement options={{
              style: {
                base: {
                  color: '#32325d',
                  fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                  fontSmoothing: 'antialiased',
                  fontSize: '16px',
                  '::placeholder': {
                    color: '#aab7c4'
                  }
                },
                invalid: {
                  color: '#fa755a',
                  iconColor: '#fa755a'
                }
              }
            }} />
          </div>
        </div>

        {(cardError || error) && (
          <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm">
            {cardError || error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || processing}
            className={`
              px-6 py-2 rounded-md text-white
              ${processing 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'
              }
            `}
          >
            {processing ? 'Processing...' : `Pay ${formattedPrice}`}
          </button>
        </div>
      </form>
    </div>
  );
}

function Pricing() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingInterval, setBillingInterval] = useState('month');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);
  const [fetchingPlans, setFetchingPlans] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const pricingRef = useRef(null);
  const headerRef = useRef(null);
  const gradientRef = useRef(null);
  
  // Get user's currency based on location
  const { currency, countryCode } = useUserCurrency();

  // Default plans fallback
  const defaultPlans = [
    {
      id: 1,
      name: "Basic",
      price: 9.99,
      annual_price: 99.90,
      is_yearly: false,
      yearly_plan_id: 4,
      popular: false,
      features: [
        "1 CV Template",
        "Up to 3 CV Exports",
        "Basic Job Matching",
        "Standard Support"
      ],
      cta: "Choose Plan"
    },
    {
      id: 2,
      name: "Professional",
      price: 19.99,
      annual_price: 199.90,
      is_yearly: false,
      yearly_plan_id: 5,
      popular: true,
      features: [
        "10 CV Templates",
        "Unlimited CV Exports",
        "Advanced Job Matching",
        "Priority Support",
        "AI Resume Review"
      ],
      cta: "Choose Plan"
    },
    {
      id: 3,
      name: "Enterprise",
      price: 29.99,
      annual_price: 299.90,
      is_yearly: false,
      yearly_plan_id: 6,
      popular: false,
      features: [
        "All Professional Features",
        "Custom Branding",
        "Team Management",
        "Analytics Dashboard",
        "Dedicated Account Manager",
        "API Access"
      ],
      cta: "Choose Plan"
    }
  ];

  // Helper function to get the correct price based on billing interval with proper currency formatting
  const getPrice = (plan) => {
    let price;
    if (billingInterval === 'year') {
      // Use annual_price if it exists, otherwise calculate it from monthly price
      price = plan.annual_price || (parseFloat(plan.price) * 10);
    } else {
      price = plan.price;
    }
    return formatPriceForDisplay(price, countryCode);
  };

  // Calculate savings amount with currency
  const getSavingsAmount = (plan) => {
    const yearlyPrice = parseFloat(plan.annual_price || (parseFloat(plan.price) * 10));
    const monthlyCost = parseFloat(plan.price) * 12;
    const savings = monthlyCost - yearlyPrice;
    return formatPriceForDisplay(savings.toFixed(2), countryCode);
  };

  // Fetch subscription plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setFetchingPlans(true);
        setFetchError(null);
        
        console.log('Fetching subscription plans...');
        
        // Fetch plans from the backend
        const plansData = await SubscriptionService.getPlans();
        console.log('Received plans data:', plansData);
        
        if (!plansData || plansData.length === 0) {
          console.warn('No plans data received, using fallback plans');
          setPlans(defaultPlans);
          return;
        }
        
        // Only process monthly plans initially - yearly plans will be referenced by ID when needed
        const monthlyPlans = plansData.filter(plan => !plan.is_yearly);
        
        if (monthlyPlans.length === 0) {
          console.warn('No monthly plans found, using fallback plans');
          setPlans(defaultPlans);
          return;
        }
        
        // Process plans data to add UI-specific properties
        const processedPlans = monthlyPlans.map((plan, index) => {
          // Find the corresponding yearly plan if it exists
          const yearlyPlan = plansData.find(p => p.id === plan.yearly_plan_id);
          
          return {
            ...plan,
            id: plan.id,
            name: plan.name || `Plan ${index + 1}`,
            price: parseFloat(plan.price) || 0,
            annual_price: yearlyPlan ? parseFloat(yearlyPlan.price) : (parseFloat(plan.price) * 10),
            yearly_plan_id: yearlyPlan?.id || null,
            // Make the middle plan popular if we have 3 plans, otherwise the first one
            popular: monthlyPlans.length === 3 ? index === 1 : index === 0,
            features: plan.features || [],
            cta: "Choose Plan"
          };
        });
        
        console.log('Processed plans:', processedPlans);
        setPlans(processedPlans);
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
        setFetchError('Failed to load subscription plans. Please try again later.');
        // Use default plans as fallback
        setPlans(defaultPlans);
      } finally {
        setFetchingPlans(false);
      }
    };

    // Fetch plans when component mounts
    fetchPlans();
    
    // Clean up function
    return () => {
      console.log('Cleaning up plans fetching effect');
    };
  }, []);

  // Handle scrolling animations
  useEffect(() => {
    if (!headerRef.current || !gradientRef.current) return;

    // Create fancy gradient animation on scroll
    const updateGradient = (progress) => {
      if (!gradientRef.current) return;
      
      // Define gradient colors for different scroll positions
      const colors = {
        start: {
          c1: '14, 165, 233', // sky-500
          c2: '139, 92, 246', // violet-500
          c3: '99, 102, 241'  // indigo-500
        },
        end: {
          c1: '56, 189, 248', // sky-400
          c2: '167, 139, 250', // violet-400
          c3: '129, 140, 248'  // indigo-400
        }
      };
      
      // Interpolate between start and end colors based on scroll progress
      const c1 = interpolateColor(colors.start.c1, colors.end.c1, progress);
      const c2 = interpolateColor(colors.start.c2, colors.end.c2, progress);
      const c3 = interpolateColor(colors.start.c3, colors.end.c3, progress);
      
      // Update the gradient
      gradientRef.current.style.background = `radial-gradient(circle at center, rgba(${c1}, 0.15) 0%, rgba(${c2}, 0.15) 45%, rgba(${c3}, 0.15) 100%)`;
    };

    // Interpolate between two RGB colors
    const interpolateColor = (color1, color2, progress) => {
      const c1 = color1.split(',').map(Number);
      const c2 = color2.split(',').map(Number);
      
      return c1.map((v, i) => {
        return Math.round(v + (c2[i] - v) * progress);
      }).join(', ');
    };
    
    // Initialize scroll animation
    ScrollTrigger.create({
      trigger: headerRef.current,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => updateGradient(self.progress),
      scrub: true
    });
  }, []);

  const handlePlanSelect = (plan) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location, selectedPlan: plan.id } });
      return;
    }

    // Choose the correct plan ID based on billing interval
    const planId = billingInterval === 'year' && plan.yearly_plan_id ? plan.yearly_plan_id : plan.id;
    
    // Set selected plan with interval and correct ID
    setSelectedPlan({
      ...plan,
      selectedInterval: billingInterval,
      id: planId
    });
    
    console.log(`Selected ${billingInterval} plan:`, planId);
    setShowPaymentModal(true);
  };

  const handleBillingIntervalChange = (checked) => {
    // Update billing interval (true = yearly, false = monthly)
    const newInterval = checked ? 'year' : 'month';
    console.log(`Switching billing interval to: ${newInterval}`);
    setBillingInterval(newInterval);
    
    // If there's a currently selected plan, update its ID based on the new interval
    if (selectedPlan) {
      const planId = checked && selectedPlan.yearly_plan_id ? selectedPlan.yearly_plan_id : selectedPlan.id;
      setSelectedPlan({
        ...selectedPlan,
        selectedInterval: newInterval,
        id: planId
      });
    }
  };

  const handlePaymentSuccess = async (paymentMethodId) => {
    setProcessing(true);
    try {
      // Pass billing interval in the subscription request
      await SubscriptionService.subscribe(selectedPlan.id, paymentMethodId, selectedPlan.selectedInterval);
      setShowPaymentModal(false);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to process subscription. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="text-gray-900 dark:text-white min-h-screen">
      <Helmet>
        <title>Pricing Plans | Ella - AI-Powered CV Builder</title>
        <meta 
          name="description" 
          content="Choose the perfect subscription plan for your CV and job application needs. Ella offers flexible pricing options for job seekers at all levels."
        />
      </Helmet>

      {/* Navigation */}
      <Suspense fallback={<div className="h-16" />}>
        <Navbar />
      </Suspense>

      {/* Hero Section */}
      <section
        ref={headerRef}
        className="relative pt-24 md:pt-32 pb-12 md:pb-20 overflow-hidden"
      >
        <div ref={gradientRef} className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-gray-900 dark:to-black" />
        <div className="absolute inset-0">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] bg-[center_-1px] [mask-image:linear-gradient(0deg,transparent,black,transparent)]" />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-600 bg-clip-text text-transparent"
            >
              Choose Your Perfect Plan
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto"
            >
              Unlock the full potential of your job search with our flexible subscription options. 
              Whether you're just starting out or seeking advanced features, we have a plan that's right for you.
            </motion.p>
            
            {/* Billing toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center mb-8"
            >
              <span className={`mr-3 ${billingInterval === 'month' ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Monthly
              </span>
              <Switch 
                checked={billingInterval === 'year'} 
                onChange={handleBillingIntervalChange}
                className="bg-gray-300 dark:bg-gray-600"
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              />
              <span className={`ml-3 flex items-center ${billingInterval === 'year' ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Yearly
                <span className="ml-2 px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                  Save 16%
                </span>
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section ref={pricingRef} className="py-16 px-4 bg-white dark:bg-gradient-to-br dark:from-black dark:to-gray-900">
        <div className="container mx-auto">
          {fetchError && (
            <Alert 
              message="Error" 
              description={fetchError} 
              type="error" 
              className="mb-8 max-w-6xl mx-auto"
              showIcon
            />
          )}
          
          {fetchingPlans ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large">
                <div className="py-8 px-6 text-gray-500">Loading plans...</div>
              </Spin>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                  className={`relative p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 transition-all duration-300 ${
                    plan.popular || plan.is_popular ? 'ring-2 ring-indigo-600 dark:ring-indigo-400' : ''
                  }`}
                >
                  {(plan.popular || plan.is_popular) && (
                    <div className="absolute top-0 right-0 -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  
                  {/* Plan description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    {plan.short_description || "Perfect for your career journey."}
                  </p>
                  
                  <div className="mb-6">
                    <div className="text-3xl font-bold">
                      {getPrice(plan)}
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        /{billingInterval === 'year' ? 'year' : 'month'}
                      </span>
                    </div>
                    {billingInterval === 'year' && (
                      <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                        Save {getSavingsAmount(plan)} per year
                      </div>
                    )}
                  </div>
                  
                  {/* Features section with structured display */}
                  <div className="mb-8 border-t border-gray-100 dark:border-gray-800 pt-4">
                    <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-3">Plan includes:</h4>
                    <ul className="space-y-3">
                      {/* If we have features from the API in the new format */}
                      {plan.features && Array.isArray(plan.features) && plan.features.length > 0 && 
                        (Array.isArray(plan.features[0]) || typeof plan.features[0] === 'string') && (
                        // Simple string array format
                        plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))
                      )}
                      
                      {/* If we have structured features from the API in the new format */}
                      {plan.features && Array.isArray(plan.features) && plan.features.length > 0 && 
                        typeof plan.features[0] === 'object' && (
                        plan.features.map((featureObj, idx) => {
                          const feature = featureObj.feature || {};
                          return (
                            <li key={idx} className={`flex items-start ${featureObj.is_available ? '' : 'text-gray-400 dark:text-gray-600'}`}>
                              {featureObj.is_available ? (
                                <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                              ) : (
                                <FiX className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                              )}
                              <div>
                                <span>{feature.name || 'Feature'}</span>
                                {featureObj.value_limit && (
                                  <span className="ml-1 text-gray-500 text-sm">({featureObj.value_limit})</span>
                                )}
                                {feature.description && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{feature.description}</p>
                                )}
                              </div>
                            </li>
                          );
                        })
                      )}
                      
                      {/* Default feature flags when no structured features are available */}
                      {(!plan.features || !Array.isArray(plan.features) || plan.features.length === 0) && (
                        <>
                          <li className="flex items-start">
                            <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span>{`CV Exports: ${plan.max_cv_generations || 'Unlimited'}`}</span>
                          </li>
                          <li className="flex items-start">
                            <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span>{`Job Applications: ${plan.max_job_applications || 'Unlimited'}`}</span>
                          </li>
                          <li className="flex items-start">
                            <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            <span>{`Saved Jobs: ${plan.max_saved_jobs || 'Unlimited'}`}</span>
                          </li>
                          <li className={`flex items-start ${plan.has_cv_analytics ? '' : 'text-gray-400 dark:text-gray-600'}`}>
                            {plan.has_cv_analytics ? (
                              <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            ) : (
                              <FiX className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            )}
                            <span>CV Analytics</span>
                          </li>
                          <li className={`flex items-start ${plan.has_job_alerts ? '' : 'text-gray-400 dark:text-gray-600'}`}>
                            {plan.has_job_alerts ? (
                              <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            ) : (
                              <FiX className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            )}
                            <span>Job Alerts</span>
                          </li>
                          <li className={`flex items-start ${plan.has_priority_support ? '' : 'text-gray-400 dark:text-gray-600'}`}>
                            {plan.has_priority_support ? (
                              <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            ) : (
                              <FiX className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            )}
                            <span>Priority Support</span>
                          </li>
                          <li className={`flex items-start ${plan.has_ai_interview_prep ? '' : 'text-gray-400 dark:text-gray-600'}`}>
                            {plan.has_ai_interview_prep ? (
                              <FiCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            ) : (
                              <FiX className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                            )}
                            <span>AI Interview Prep</span>
                          </li>
                        </>
                      )}
                    </ul>
                    
                    {/* Link to show full comparison */}
                    <button 
                      onClick={() => {
                        const element = document.getElementById('plans-comparison');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 inline-flex items-center"
                    >
                      View all features 
                      <FiArrowRight className="ml-1" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handlePlanSelect(plan)}
                    disabled={processing}
                    className={`w-full text-center py-3 px-6 rounded-full transition-all duration-300 ${
                      plan.popular || plan.is_popular
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {processing && selectedPlan?.id === plan.id ? (
                      <Spin size="small" className="mr-2" />
                    ) : (
                      <></>
                    )}
                    {processing && selectedPlan?.id === plan.id ? 'Processing...' : (plan.cta || 'Choose Plan')}
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 px-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-600 bg-clip-text text-transparent"
            >
              Why Choose Ella?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-gray-600 dark:text-gray-400"
            >
              Our platform offers unique advantages to help you succeed in your job search
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md"
            >
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI-Powered CV Builder</h3>
              <p className="text-gray-600 dark:text-gray-400">Our advanced AI helps you create professional CVs that stand out to employers and pass ATS screening.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md"
            >
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Effortless Job Applications</h3>
              <p className="text-gray-600 dark:text-gray-400">Apply to multiple jobs with just a few clicks and track your application status in one dashboard.</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0h2a2 2 0 002 2v2a2 2 0 01-2 2H9a2 2 0 01-2-2v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 01-2 2H3a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Analytics & Insights</h3>
              <p className="text-gray-600 dark:text-gray-400">Get valuable insights on how your CV performs and receive personalized improvement recommendations.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white dark:bg-gradient-to-br dark:from-black dark:to-gray-900">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-600 bg-clip-text text-transparent"
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="grid gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-800"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can cancel your subscription at any time. You'll continue to have access to your plan until the end of your billing period.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-800"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-md border border-gray-100 dark:border-gray-800"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Can I switch between plans?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll only pay the prorated difference. When downgrading, your new plan will take effect in the next billing cycle.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Plans Comparison Table */}
      <section id="plans-comparison" className="py-16 px-4 bg-gray-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-600 bg-clip-text text-transparent"
            >
              Compare Plan Features
            </motion.h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A detailed breakdown of all features included in each plan to help you make the best choice for your career needs.
            </p>
          </div>
          
          {fetchingPlans ? (
            <div className="flex justify-center items-center py-8">
              <Spin size="large">
                <div className="py-8 px-6 text-gray-500">Loading comparison table...</div>
              </Spin>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="py-4 px-6">Feature</th>
                    {plans.map(plan => (
                      <th key={plan.id} className="py-4 px-6 text-center">
                        <div className="text-lg font-bold">{plan.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {getPrice(plan)}/{billingInterval === 'year' ? 'year' : 'month'}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Core Features Group */}
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <td colSpan={plans.length + 1} className="py-2 px-6 font-medium">Core Features</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-6">CV Exports</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="py-4 px-6 text-center">
                        {plan.max_cv_generations > 0 ? plan.max_cv_generations : 'Unlimited'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-6">Job Applications</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="py-4 px-6 text-center">
                        {plan.max_job_applications > 0 ? plan.max_job_applications : 'Unlimited'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-6">Saved Jobs</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="py-4 px-6 text-center">
                        {plan.max_saved_jobs > 0 ? plan.max_saved_jobs : 'Unlimited'}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Advanced Features Group */}
                  <tr className="bg-gray-100 dark:bg-gray-900">
                    <td colSpan={plans.length + 1} className="py-2 px-6 font-medium">Advanced Features</td>
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-6">CV Analytics</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="py-4 px-6 text-center">
                        {plan.has_cv_analytics ? (
                          <FiCheck className="inline text-green-500" />
                        ) : (
                          <FiX className="inline text-red-500" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-6">Job Alerts</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="py-4 px-6 text-center">
                        {plan.has_job_alerts ? (
                          <FiCheck className="inline text-green-500" />
                        ) : (
                          <FiX className="inline text-red-500" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-6">Priority Support</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="py-4 px-6 text-center">
                        {plan.has_priority_support ? (
                          <FiCheck className="inline text-green-500" />
                        ) : (
                          <FiX className="inline text-red-500" />
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-4 px-6">AI Interview Preparation</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="py-4 px-6 text-center">
                        {plan.has_ai_interview_prep ? (
                          <FiCheck className="inline text-green-500" />
                        ) : (
                          <FiX className="inline text-red-500" />
                        )}
                      </td>
                    ))}
                  </tr>
                  
                  {/* Dynamic Features from the API */}
                  {plans[0]?.features && Array.isArray(plans[0].features) && 
                   plans[0].features.length > 0 && typeof plans[0].features[0] === 'object' && (
                    <>
                      <tr className="bg-gray-100 dark:bg-gray-900">
                        <td colSpan={plans.length + 1} className="py-2 px-6 font-medium">Extra Features</td>
                      </tr>
                      {/* Get a unique list of all feature names across all plans */}
                      {Array.from(new Set(
                        plans.flatMap(plan => 
                          plan.features.map(f => f.feature?.name || '')
                        ).filter(name => name)
                      )).map(featureName => (
                        <tr key={featureName} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-4 px-6">{featureName}</td>
                          {plans.map(plan => {
                            const featureObj = plan.features.find(f => f.feature?.name === featureName);
                            return (
                              <td key={plan.id} className="py-4 px-6 text-center">
                                {featureObj ? (
                                  featureObj.is_available ? (
                                    <div>
                                      <FiCheck className="inline text-green-500" />
                                      {featureObj.value_limit && (
                                        <span className="ml-1 text-sm">{featureObj.value_limit}</span>
                                      )}
                                    </div>
                                  ) : (
                                    <FiX className="inline text-red-500" />
                                  )
                                ) : (
                                  <FiX className="inline text-red-500" />
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td className="py-4 px-6"></td>
                    {plans.map(plan => (
                      <td key={plan.id} className="py-4 px-6 text-center">
                        <button
                          onClick={() => handlePlanSelect(plan)}
                          disabled={processing}
                          className={`py-2 px-4 rounded-full transition-all duration-300 text-sm ${
                            plan.popular || plan.is_popular
                              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                          }`}
                        >
                          {processing && selectedPlan?.id === plan.id ? 'Processing...' : (plan.cta || 'Choose Plan')}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Payment Modal */}
      <Modal
        title="Complete Your Subscription"
        open={showPaymentModal}
        onCancel={() => !processing && setShowPaymentModal(false)}
        footer={null}
        width={500}
        maskClosable={!processing}
        closable={!processing}
      >
        <Elements stripe={stripePromise}>
          <PaymentForm
            plan={selectedPlan}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setShowPaymentModal(false)}
            processing={processing}
            error={error}
          />
        </Elements>
      </Modal>

      {/* Footer */}
      <Footer />
    </main>
  );
}

export default Pricing;
