import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const BlogImage = ({ 
  src, 
  alt = 'Blog image', 
  className = '', 
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);
  
  // Placeholder image for when the actual image fails to load
  const placeholderImg = 'https://placehold.co/600x400/e2e8f0/475569?text=Image+Unavailable';

  useEffect(() => {
    // Reset state when src changes
    setIsLoading(true);
    setHasError(false);
    
    // Fix URL if it's a production URL in development environment
    if (src && typeof src === 'string') {
      // Check if we're in development and the URL is a production URL
      const isDev = window.location.hostname === 'localhost';
      const isProdUrl = src.includes('ellacvwriter.com');
      
      if (isDev && isProdUrl) {
        // Convert production URL to local development URL
        const localSrc = src.replace(
          'http://www.ellacvwriter.com', 
          'http://localhost:8000'
        );
        console.log(`Converted image URL: ${src} → ${localSrc}`);
        setImageSrc(localSrc);
      } else {
        setImageSrc(src);
      }
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    console.log('Image loaded successfully:', imageSrc);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    console.error('Image failed to load:', imageSrc);
    
    // Log debugging information
    const filename = imageSrc?.split('/')?.pop();
    const path = imageSrc?.substring(0, imageSrc.lastIndexOf('/'));
    
    console.warn('If image fails, check if this file exists:', filename);
    console.warn('Image path:', path);
    console.warn('Ensure the filename in the database matches actual files on disk');
  };

  return (
    <div className={`relative ${className}`}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse"
          />
        )}
      </AnimatePresence>
      
      {hasError ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <svg
            className="w-12 h-12 text-gray-400 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Image could not be loaded
          </p>
          {/* Fallback to placeholder image */}
          <img 
            src={placeholderImg}
            alt={alt} 
            className="hidden" // Load but don't display - helps prevent layout shifts
          />
        </div>
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          {...props}
        />
      )}
    </div>
  );
};

BlogImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
};

export default BlogImage;