import axios from 'axios';
import { API_BASE_URL } from '../config';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

// Default timeout for API requests (20 seconds)
const DEFAULT_TIMEOUT = 20000;

/**
 * Rewrite a CV and periodically poll for the status
 * @param {Object} parsedCV - The parsed CV data
 * @param {Object} personalInfo - Personal information for the CV
 * @param {Object} callbacks - Callback functions for updating UI
 * @returns {Promise<Object>} - The rewritten CV data
 */
export const rewriteCV = async (parsedCV, personalInfo = {}, callbacks = {}) => {
  try {
    // Extract callbacks for updating UI
    const { 
      setRewriteStages, 
      setRewriteProgress, 
      setRewriteDialogOpen, 
      setRewriteData, 
      setRewriteError, 
      setRewriteLoading 
    } = callbacks;
    
    // Validate required data
    if (!parsedCV || !parsedCV.id) {
      throw new Error('CV data is required for rewriting');
    }
    
    // Get authentication token
    const token = localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    console.log("Initiating CV rewrite with payload:", {
      cv_id: parsedCV.id,
      personal_info: personalInfo
    });
    
    // Initiate the rewrite
    const response = await api.post('/api/cv_writer/cv/rewrite/', {
      cv_data: {
        cv_id: parsedCV.id,
        parsed_cv: parsedCV,
        personal_info: personalInfo
      }
    });
    
    // Get the session ID
    const sessionId = response.data.session_id;
    console.log("CV rewrite initiated. Session ID:", sessionId);
    
    if (!sessionId) {
      throw new Error('Failed to initiate CV rewrite');
    }
    
    // Set stage 1 to completed and activate stage 2
    if (setRewriteStages) {
      // Wait 1.5s to give a sense of progress
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setRewriteStages(prevStages => {
        return prevStages.map(stage => {
          if (stage.id === 1) {
            return { ...stage, active: false, completed: true };
          } else if (stage.id === 2) {
            return { ...stage, active: true };
          }
          return stage;
        });
      });
      
      setRewriteProgress(40);
    }
    
    // Poll for the rewrite status
    let status = 'pending';
    let result = null;
    let attempts = 0;
    const maxAttempts = 60; // Maximum number of polling attempts
    const pollInterval = 2000; // Polling interval in milliseconds
    
    while (status !== 'completed' && status !== 'error' && attempts < maxAttempts) {
      attempts++;
      
      try {
        // Get the rewrite status
        const statusResponse = await api.get(`/api/cv_writer/rewrite/status/${sessionId}/`);
        status = statusResponse.data.status;
        result = statusResponse.data;
        
        // Update progress and stages based on status
        if (setRewriteStages && setRewriteProgress) {
          // Calculate the stage based on attempts
          if (attempts === 3) {
            // Move to stage 3
            setRewriteStages(prevStages => {
              return prevStages.map(stage => {
                if (stage.id === 2) {
                  return { ...stage, active: false, completed: true };
                } else if (stage.id === 3) {
                  return { ...stage, active: true };
                }
                return stage;
              });
            });
            setRewriteProgress(60);
          } else if (attempts === 6) {
            // Move to stage 4
            setRewriteStages(prevStages => {
              return prevStages.map(stage => {
                if (stage.id === 3) {
                  return { ...stage, active: false, completed: true };
                } else if (stage.id === 4) {
                  return { ...stage, active: true };
                }
                return stage;
              });
            });
            setRewriteProgress(80);
          } else {
            // Increment progress within the current stage
            setRewriteProgress(prev => {
              // Don't exceed 95% until completion
              const increment = attempts * 2;
              return Math.min(95, prev + (increment > 10 ? 1 : 2));
            });
          }
        }
        
        console.log("CV rewrite status:", status);
        
        if (status === 'completed' || status === 'error') {
          break;
        }
        
        // Wait before the next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      } catch (error) {
        console.error('Error polling rewrite status:', error);
        attempts++;
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
    }
    
    // Handle timeout
    if (attempts >= maxAttempts && status !== 'completed') {
      throw new Error('CV rewrite timed out. Please try again.');
    }
    
    console.log("CV rewrite successful:", result);
    
    // Complete the final stage and set progress to 100%
    if (setRewriteStages && setRewriteProgress) {
      setRewriteStages(prevStages => {
        return prevStages.map(stage => {
          return { ...stage, active: false, completed: true };
        });
      });
      setRewriteProgress(100);
      
      // Wait a moment before updating the UI with results
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // If there was an error in the result, throw it
    if (status === 'error' || (result.result && result.result.status === 'error')) {
      const errorMessage = result.result?.message || result.result?.error || 'Error rewriting CV';
      throw new Error(errorMessage);
    }
    
    // Return the rewritten data
    return result;
  } catch (error) {
    console.error('Error in CV rewrite process:', error);
    throw error;
  }
};

/**
 * Save a rewritten CV to the CV Writer from a rewrite session
 * @param {string} sessionId - The rewrite session ID
 * @param {object} personalInfo - Optional personal info to update the CV with
 * @returns {Promise<Object>} - Response with CV ID 
 */
export const saveRewrittenCV = async (sessionId, personalInfo = {}) => {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
    
    if (!token) {
      console.error('Authentication token not found');
      throw new Error('You must be logged in to save your rewritten CV');
    }
    
    if (!sessionId) {
      throw new Error('Rewrite session ID is required');
    }
    
    // Use direct axios call to ensure proper URL format
    const response = await axios.post(
      `${API_BASE_URL}/api/cv_writer/rewritten-cv/save/`,
      {
        session_id: sessionId,
        personal_info: personalInfo || {}
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: DEFAULT_TIMEOUT
      }
    );
    
    // Return data with CV ID for redirection
    return response.data;
  } catch (error) {
    console.error('Error saving rewritten CV:', error);
    
    // Handle axios errors
    if (error.response) {
      // Server responded with non-2xx status code
      const errorMessage = error.response.data?.message || error.response.data?.error || 'Failed to save CV';
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request made but no response received
      throw new Error('No response from server. Please check your internet connection and try again.');
    } else {
      // Something else caused the error
      throw error;
    }
  }
};

/**
 * Check the status of a CV rewrite session
 * @param {string} sessionId - The ID of the rewrite session to check
 * @returns {Promise<object>} - The status of the rewrite session
 */
export const checkRewriteStatus = async (sessionId) => {
  try {
    // Get the token from localStorage or sessionStorage
    const token = localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
    
    if (!token) {
      console.error('Authentication token not found');
      throw new Error('You must be logged in to check rewrite status');
    }
    
    const response = await api.get(
      `/api/ai_cv_parser/rewrite/${sessionId}/status/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        timeout: DEFAULT_TIMEOUT
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error checking rewrite status:', error);
    throw error;
  }
};

// Export the module with all functions
export default {
  rewriteCV,
  saveRewrittenCV,
  checkRewriteStatus
};
