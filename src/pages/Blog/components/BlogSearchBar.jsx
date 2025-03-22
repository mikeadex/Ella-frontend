import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const BlogSearchBar = ({ initialQuery = '', className = '', variant = 'default' }) => {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/blog/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
  
  // Styling variants
  const variants = {
    default: 'bg-white dark:bg-gray-800 shadow-md rounded-full border border-gray-100 dark:border-gray-700',
    minimal: 'bg-gray-100 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-colors rounded-full',
    hero: 'shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full border border-gray-100 dark:border-gray-700',
  };
  
  return (
    <motion.form 
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        boxShadow: isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.3)' : 'none' 
      }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit} 
      className={`flex w-full overflow-hidden ${variants[variant] || variants.default} ${className}`}
    >
      <input
        type="search"
        placeholder="Search articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full px-6 py-3 border-none focus:outline-none focus:ring-0 bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
        aria-label="Search blog"
      />
      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="m-1 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex-shrink-0 flex items-center justify-center"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={2} 
          stroke="currentColor" 
          className="w-5 h-5"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" 
          />
        </svg>
      </motion.button>
    </motion.form>
  );
};

BlogSearchBar.propTypes = {
  initialQuery: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'minimal', 'hero'])
};

export default BlogSearchBar;
