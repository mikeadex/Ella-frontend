/**
 * Truncates text to a specified length and adds an ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length of the truncated text
 * @param {string} suffix - String to append to truncated text (default: '...')
 * @returns {string} - Truncated text with suffix if needed
 */
export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  // Find the last space within the maxLength
  const lastSpaceIndex = text.substring(0, maxLength).lastIndexOf(' ');
  
  // If no space found or very short text, just cut at maxLength
  if (lastSpaceIndex === -1 || lastSpaceIndex < maxLength / 2) {
    return text.substring(0, maxLength) + suffix;
  }
  
  // Cut at the last space to avoid cutting words
  return text.substring(0, lastSpaceIndex) + suffix;
};

/**
 * Extracts plain text from HTML content
 * @param {string} html - The HTML content
 * @returns {string} - Plain text without HTML tags
 */
export const htmlToPlainText = (html) => {
  if (!html) return '';
  
  // Create a temporary DOM element
  const tempElement = document.createElement('div');
  tempElement.innerHTML = html;
  
  // Get the text content and normalize whitespace
  return tempElement.textContent || tempElement.innerText || '';
};

/**
 * Formats a number for display (e.g., 1000 -> 1k)
 * @param {number} num - The number to format
 * @returns {string} - Formatted number
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  
  return num.toString();
};

/**
 * Calculates reading time for a text
 * @param {string} content - The content to calculate reading time for
 * @param {number} wordsPerMinute - Average reading speed (default: 200)
 * @returns {number} - Estimated reading time in minutes
 */
export const calculateReadingTime = (content, wordsPerMinute = 200) => {
  if (!content) return 1;
  
  // Remove HTML tags if present and count words
  const plainText = typeof content === 'string' ? htmlToPlainText(content) : '';
  const words = plainText.trim().split(/\s+/).length;
  
  // Calculate reading time in minutes
  const readingTime = Math.ceil(words / wordsPerMinute);
  
  // Return at least 1 minute
  return Math.max(1, readingTime);
};
