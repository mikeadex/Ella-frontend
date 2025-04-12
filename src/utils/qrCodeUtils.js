/**
 * QR Code utility functions for CV templates
 */

/**
 * Generate a QR code data URL from a string
 * @param {string} text - Text to encode in the QR code
 * @param {number} size - Size of the QR code in pixels
 * @returns {string} - Data URL of the QR code
 */
export const generateQRCode = (text, size = 100) => {
  // Use a template literal to create a Google Charts API URL for QR code generation
  // This is a simple implementation that doesn't require additional dependencies
  const encodedText = encodeURIComponent(text);
  return `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodedText}&choe=UTF-8`;
};

/**
 * Format a URL for display, removing protocol and trailing slashes
 * @param {string} url - URL to format
 * @returns {string} - Formatted URL
 */
export const formatPortfolioUrl = (url) => {
  if (!url) return '';
  
  // Remove protocol (http://, https://)
  let formatted = url.replace(/^https?:\/\//, '');
  
  // Remove trailing slash if present
  formatted = formatted.replace(/\/$/, '');
  
  return formatted;
};
