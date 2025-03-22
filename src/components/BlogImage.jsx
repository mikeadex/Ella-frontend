import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

// Base64 encoded minimal placeholder to show immediately
const INLINE_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmNGY4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMHB4IiBmaWxsPSIjNzE4MDk2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5FbGxhIEJsb2c8L3RleHQ+PC9zdmc+';

/**
 * A robust image component for blog posts that handles loading states and errors
 */
const BlogImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  onLoad,
  onError,
  fallbackImage = '/images/placeholder-blog.svg',
  animate = true,
  retryCount = 2,
  priority = false
}) => {
  const [imageUrl, setImageUrl] = useState(INLINE_PLACEHOLDER); // Start with inline placeholder
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retries, setRetries] = useState(0);

  /**
   * Normalizes image URLs to ensure they're properly formatted
   * @param {string} url - The image URL to normalize
   * @returns {string} - Normalized URL
   */
  const normalizeImageUrl = (url) => {
    if (!url) return fallbackImage;
    
    // If it's already a data URL or absolute URL, return as is
    if (url.startsWith('data:') || url.startsWith('http')) {
      return url;
    }
    
    // Make sure URL starts with / if it's a relative path
    return url.startsWith('/') ? url : `/${url}`;
  };

  /**
   * Attempt to fix common URL issues and find alternative images
   */
  const tryAlternativeImage = () => {
    if (!src || retries >= retryCount) {
      // If we've exhausted retries, use the fallback image
      if (fallbackImage !== imageUrl) {
        console.warn(`Max retries (${retryCount}) reached. Using fallback image.`);
        setImageUrl(fallbackImage);
        setRetries(prev => prev + 1);
      } else {
        // If even the fallback failed, revert to the inline placeholder
        console.error("Fallback image also failed to load. Using inline placeholder.");
        setImageUrl(INLINE_PLACEHOLDER);
        setIsLoading(false);
        setHasError(true);
      }
      return;
    }

    // Try fixing common URL issues
    const parts = src.split('/');
    const filename = parts.pop();
    const baseUrl = parts.join('/');

    if (retries === 0) {
      // First retry: try with the normalized path
      const normalizedUrl = normalizeImageUrl(src);
      if (normalizedUrl !== src) {
        console.info(`Retrying with normalized URL: ${normalizedUrl}`);
        setImageUrl(normalizedUrl);
        setRetries(prev => prev + 1);
        return;
      }
    }
    
    // Second retry: try fixing common filename issues (e.g., 9829479 → 9841329)
    if (retries === 1 && filename.includes('9829479')) {
      const correctedFilename = filename.replace('9829479', '9841329');
      const correctedUrl = `${baseUrl}/${correctedFilename}`;
      console.info(`Trying with corrected filename: ${correctedFilename}`);
      setImageUrl(correctedUrl);
      setRetries(prev => prev + 1);
      return;
    }
    
    // If we reach here and still have retries left, log details and use fallback
    console.warn(`If image fails, check if this file exists: ${filename}`);
    console.warn(`Image path: ${baseUrl}`);
    console.warn(`Ensure the filename in the database matches actual files on disk`);
    setImageUrl(fallbackImage);
    setRetries(prev => prev + 1);
  };

  // Initialize with the actual image once component mounts
  useEffect(() => {
    if (src) {
      setImageUrl(normalizeImageUrl(src));
      setIsLoading(true);
      setHasError(false);
      setRetries(0);
    }
  }, [src, fallbackImage]);

  const handleLoad = (e) => {
    setIsLoading(false);
    setHasError(false);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    console.error(`Image failed to load: ${e.target.src}`);
    
    if (retries < retryCount + 1) { // +1 to allow for fallback image retry
      tryAlternativeImage();
    } else {
      setIsLoading(false);
      setHasError(true);
      if (onError) onError(e);
    }
  };

  const imageAnimation = animate ? {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4 }
  } : {};

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <motion.img
        src={imageUrl}
        alt={alt || 'Blog image'}
        className={`object-cover w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        {...imageAnimation}
      />
    </div>
  );
};

BlogImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onLoad: PropTypes.func,
  onError: PropTypes.func,
  fallbackImage: PropTypes.string,
  animate: PropTypes.bool,
  retryCount: PropTypes.number,
  priority: PropTypes.bool
};

export default BlogImage;
