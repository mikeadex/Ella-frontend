/**
 * Utility functions for handling images in the application
 */

/**
 * Fixes image URLs to work in both development and production environments
 * In development, it converts production URLs to local URLs
 * In production, it keeps the original URL
 * 
 * @param {string} url - The image URL to fix
 * @returns {string} - The fixed URL that will work in the current environment
 */
export const fixImageUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  
  // Check if we're in development mode
  const isDev = window.location.hostname === 'localhost';
  
  // Patterns to detect production URLs
  const prodPatterns = ['ellacvwriter.com', 'www.ellacvwriter.com'];
  
  // Check if this is a production URL
  const isProdUrl = prodPatterns.some(pattern => url.includes(pattern));
  
  // Only fix URLs if we're in development and it's a production URL
  if (isDev && isProdUrl) {
    // Replace production domain with localhost
    return url.replace(/(https?:\/\/)?(www\.)?ellacvwriter\.com/g, 'http://localhost:8000');
  }
  
  // Return the original URL for production environment
  return url;
};

/**
 * Get a fallback image URL when the original image can't be loaded
 * 
 * @param {string} category - Optional category to generate a relevant placeholder
 * @returns {string} - URL to a placeholder image
 */
export const getFallbackImageUrl = (category = 'blog') => {
  // Define placeholder texts for different categories
  const placeholderText = {
    blog: 'Blog+Image',
    avatar: 'User+Avatar',
    logo: 'Logo',
    default: 'Image+Unavailable'
  };
  
  const text = placeholderText[category] || placeholderText.default;
  
  // Generate a placeholder with a professional color scheme
  return `https://placehold.co/600x400/e2e8f0/475569?text=${text}`;
};

/**
 * Extracts the filename from an image URL
 * 
 * @param {string} url - The image URL
 * @returns {string} - The filename extracted from the URL
 */
export const getImageFilename = (url) => {
  if (!url || typeof url !== 'string') return '';
  return url.split('/').pop();
};

/**
 * Extracts the directory path from an image URL
 * 
 * @param {string} url - The image URL
 * @returns {string} - The directory path extracted from the URL
 */
export const getImagePath = (url) => {
  if (!url || typeof url !== 'string') return '';
  const lastSlashIndex = url.lastIndexOf('/');
  return lastSlashIndex > 0 ? url.substring(0, lastSlashIndex) : '';
};

/**
 * Gets the best available image URL from a post object
 * Checks multiple possible property names and ensures URL is fixed for environment
 * 
 * @param {Object} post - Post object from API
 * @param {string} defaultImage - Default image to use if no image is found
 * @returns {string} - The fixed image URL
 */
export const getPostImageUrl = (post, defaultImage = '/images/placeholder-blog.svg') => {
  // Check various possible image properties
  const imageUrl = 
    post?.featured_image_url || 
    post?.featured_image || 
    post?.image || 
    post?.thumbnail || 
    post?.cover_image || 
    '';
  
  if (!imageUrl) {
    return 'https://placehold.co/600x400/e2e8f0/475569?text=No+Image+Available';
  }

  // Handle relative URLs by prepending the API base URL
  if (imageUrl && imageUrl.startsWith('/')) {
    // Determine environment
    const baseUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:8000' 
      : 'http://www.ellacvwriter.com';
    
    return `${baseUrl}${imageUrl}`;
  }

  // Fix production URLs if in development environment
  if (window.location.hostname === 'localhost' && imageUrl.includes('ellacvwriter.com')) {
    return imageUrl.replace('http://www.ellacvwriter.com', 'http://localhost:8000');
  }

  return imageUrl;
};
