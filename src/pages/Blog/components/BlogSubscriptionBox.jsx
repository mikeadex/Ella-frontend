import { useState } from 'react';
import { motion } from 'framer-motion';

const BlogSubscriptionBox = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // This is a placeholder for the actual subscription API call
      // Replace with your actual subscription API endpoint
      // await api.post('/api/blog/subscribe', { email });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
      setEmail('');
    } catch (err) {
      setError('Failed to subscribe. Please try again later.');
      console.error('Subscription error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 text-white overflow-hidden relative"
    >
      {/* Background decorative elements */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-xl" />
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-3">Subscribe to our newsletter</h3>
        <p className="text-blue-100 mb-5 text-sm md:text-base">
          Get the latest articles, resources and career tips delivered to your inbox.
        </p>
        
        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-green-500/20 backdrop-blur-sm border border-green-300/30 text-green-100 rounded-lg p-4 mb-4"
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p>Thanks for subscribing! We'll be in touch soon.</p>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 backdrop-blur-sm border border-red-300/30 text-red-100 rounded-lg p-4 mb-4"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p>{error}</p>
                </div>
              </motion.div>
            )}
            
            <div className="flex flex-col space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder-blue-100 border border-white/20 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  required
                />
                {email && (
                  <motion.button
                    type="button"
                    onClick={() => setEmail('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </motion.button>
                )}
              </div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-4 bg-white text-indigo-600 font-medium rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all disabled:opacity-70 shadow-md"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Subscribing...
                  </div>
                ) : (
                  'Subscribe Now'
                )}
              </motion.button>
            </div>
          </form>
        )}
        
        <p className="text-xs text-blue-200/80 mt-4 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </motion.div>
  );
};

export default BlogSubscriptionBox;
