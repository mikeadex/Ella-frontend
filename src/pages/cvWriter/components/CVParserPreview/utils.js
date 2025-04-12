/**
 * Utility functions for the CV Parser Preview components
 */

/**
 * Get color based on skill level
 * 
 * @param {number|string} level - The skill level (1-10)
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 * @returns {string} The color for the skill level
 */
export const getLevelColor = (level, isDarkMode) => {
  const numericLevel = typeof level === 'number' ? level : parseInt(level) || 0;
  
  if (numericLevel >= 9) return isDarkMode ? '#10b981' : '#10b981'; // Green - Expert
  if (numericLevel >= 7) return isDarkMode ? '#059669' : '#059669'; // Green - Advanced
  if (numericLevel >= 5) return isDarkMode ? '#f59e0b' : '#f59e0b'; // Yellow - Intermediate
  if (numericLevel >= 3) return isDarkMode ? '#d97706' : '#d97706'; // Orange - Basic
  return isDarkMode ? '#ef4444' : '#ef4444'; // Red - Beginner
};

/**
 * Get text label for skill level
 * 
 * @param {number|string} level - The skill level (1-10)
 * @returns {string} The label for the skill level
 */
export const getSkillLevel = (level) => {
  const numericLevel = typeof level === 'number' ? level : parseInt(level) || 0;
  
  if (numericLevel >= 9) return 'Expert';
  if (numericLevel >= 7) return 'Advanced';
  if (numericLevel >= 5) return 'Intermediate';
  if (numericLevel >= 3) return 'Basic';
  return 'Beginner';
};

/**
 * Format a file size in bytes to a human-readable string
 * 
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes < 1024) {
    return bytes + ' bytes';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
};

/**
 * Create a function to update analysis stages
 * 
 * @param {Function} setStages - State setter for stages
 * @returns {Function} Function to update stages
 */
export const createStageUpdater = (setStages) => {
  return (stageId, isCompleted = false) => {
    setStages(prevStages => 
      prevStages.map(stage => ({
        ...stage,
        active: stage.id === stageId && !isCompleted,
        completed: stage.id < stageId || (stage.id === stageId && isCompleted)
      }))
    );
  };
};
