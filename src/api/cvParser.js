import axios from 'axios';
import { API_BASE_URL } from '../config';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

// Default timeout in milliseconds (30 seconds)
const DEFAULT_TIMEOUT = 30000;

// Maximum number of polling attempts
const MAX_POLL_ATTEMPTS = 60; // Poll for up to 5 minutes (with 5s intervals)

const POLLING_INTERVAL = 2000; // Poll every 2 seconds
const MAX_POLLING_ATTEMPTS = 90; // Max 3 minutes of polling (90 * 2s = 180s)

/**
 * Poll for job completion until job is done or max attempts reached
 * @param {string} cvId - The CV ID to poll for completion
 * @returns {Promise<object>} - The parsed CV data
 */
const pollForCompletion = async (cvId) => {
    let attempts = 0;
    const MAX_POLLING_ATTEMPTS = 60;
    const POLLING_INTERVAL = 2000; // 2 seconds between polls
    
    // Create a promise that resolves when polling completes
    return new Promise((resolve, reject) => {
        const poll = async () => {
            try {
                attempts++;
                console.log(`Polling for completion attempt ${attempts}/${MAX_POLLING_ATTEMPTS}`);
                
                const response = await api.get(`/api/ai_cv_parser/parser/${cvId}/status/`);
                
                if (!response.data) {
                    console.error('Empty response while polling for status');
                    if (attempts >= MAX_POLLING_ATTEMPTS) {
                        reject(new Error('Maximum polling attempts reached with empty responses'));
                    } else {
                        setTimeout(poll, POLLING_INTERVAL);
                    }
                    return;
                }
                
                const status = response.data.status || 'unknown';
                console.log(`CV Status: ${status} (Attempt ${attempts}/${MAX_POLLING_ATTEMPTS})`);
                
                if (status === 'completed' || status === 'completed_with_errors') {
                    // Job is done, return the parsed CV data
                    console.log('CV parsing completed', status === 'completed_with_errors' ? 'with errors' : 'successfully');
                    
                    // Get the full CV details
                    try {
                        const detailsResponse = await api.get(`/api/ai_cv_parser/parser/${cvId}/`);
                        resolve(detailsResponse.data);
                    } catch (detailsError) {
                        console.error('Error getting CV details after completion:', detailsError);
                        // Fall back to the status response if we can't get details
                        resolve(response.data);
                    }
                } else if (status === 'failed') {
                    // Job failed
                    const errorMessage = response.data.error_message || 'CV parsing failed with no specific error message';
                    console.error('CV parsing failed:', errorMessage);
                    reject(new Error(errorMessage));
                } else if (attempts >= MAX_POLLING_ATTEMPTS) {
                    // Max attempts reached
                    console.error('CV parsing timed out after max polling attempts');
                    reject(new Error('CV parsing is taking longer than expected. Please check back later.'));
                } else {
                    // Job still in progress (pending, queued, processing), poll again after interval
                    setTimeout(poll, POLLING_INTERVAL);
                }
            } catch (error) {
                console.error('Error polling for completion:', error);
                if (attempts >= MAX_POLLING_ATTEMPTS) {
                    reject(new Error('Failed to check CV parsing status after multiple attempts.'));
                } else {
                    // Retry on network errors
                    setTimeout(poll, POLLING_INTERVAL);
                }
            }
        };
        
        // Start polling
        poll();
    });
};

/**
 * Upload document to the server with async processing
 * @param {File} file - The file to upload
 * @param {boolean} forceOverwrite - Whether to force overwrite an existing CV
 * @returns {Promise<object>} - The parsed CV data
 */
export const uploadDocument = async (file, forceOverwrite = false) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('force_overwrite', forceOverwrite.toString());

        // Get the token from localStorage or sessionStorage
        const token = localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
        
        if (!token) {
            throw new Error('Authentication token not found');
        }

        // Phase 1: Upload document and start processing
        console.log('Starting CV upload and processing...');
        
        try {
            const uploadResponse = await api.uploadFile(
                `/api/ai_cv_parser/parser/parse-cv/`,
                formData,
                (progress) => {
                    console.log(`Upload progress: ${progress}%`);
                    // You can use this callback to update UI with upload progress
                }
            );

            // Handle different response formats from the server
            if (uploadResponse.data) {
                // Look for CV ID in various response formats
                const cvId = uploadResponse.data.id || 
                            uploadResponse.data.cv_id || 
                            (uploadResponse.data.data && uploadResponse.data.data.id);
                
                if (cvId) {
                    console.log(`CV processing started with ID: ${cvId}`);
                    // Phase 2: Poll for job completion
                    return await pollForCompletion(cvId);
                } else {
                    console.error('No CV ID found in response:', uploadResponse.data);
                    
                    // Check if there's an error message in the response
                    if (uploadResponse.data.error || uploadResponse.data.message) {
                        throw new Error(uploadResponse.data.error || uploadResponse.data.message);
                    } else {
                        throw new Error('Server returned a response without a CV ID');
                    }
                }
            } else {
                console.error('Invalid response from server:', uploadResponse);
                throw new Error('Server returned an empty response');
            }
        } catch (error) {
            // Check if this is an overwrite confirmation error
            if (error.response?.status === 409 && error.response?.data?.requires_confirmation) {
                throw {
                    ...error,
                    requiresConfirmation: true,
                    confirmationMessage: error.response.data.message,
                    existingCVInfo: {
                        id: error.response.data.existing_cv_id,
                        name: error.response.data.existing_cv_name,
                        date: error.response.data.existing_cv_date
                    }
                };
            }
            
            // If it's a 500 server error, provide more helpful information
            if (error.response?.status === 500) {
                console.error('Server error details:', error.response.data);
                const errorMsg = error.response.data?.error || error.response.data?.message || 
                                'The server encountered an error while processing your CV.';
                throw new Error(`Server error: ${errorMsg}`);
            }
            
            // If it's another type of error, just re-throw it
            throw error;
        }
    } catch (error) {
        console.error('Error uploading document:', error);
        
        // Handle specific error cases
        if (error.response?.status === 401) {
            throw new Error('You must be logged in to upload documents');
        }
        
        // Throw the modified error (for confirmation) or the original error
        throw error;
    }
};

/**
 * Analyze a parsed CV to get additional insights
 * @param {string} cvId - The ID of the parsed CV to analyze
 * @returns {Promise<object>} - The analysis results
 */
export const analyzeCV = async (cvId) => {
    try {
        // Try different endpoint formats for backward compatibility
        const endpoints = [
            `/api/ai_cv_parser/parser/${cvId}/analyze/`,
            `/api/ai_cv_parser/parser/analyze/${cvId}/`,
            `/api/ai_cv_parser/parser/analyze/`,
        ];
        
        let lastError = null;
        
        // Try each endpoint in sequence until one works
        for (const endpoint of endpoints) {
            try {
                const data = endpoint === `/api/ai_cv_parser/parser/analyze/` 
                    ? { cv_id: cvId } 
                    : {};
                    
                const response = await api.post(endpoint, data);
                
                // Check if the response contains valid analysis data
                if (response.data && (response.data.analysis || response.data.result)) {
                    return response.data;
                }
                
                // If we got a response but no valid data, continue to next endpoint
                console.warn(`Endpoint ${endpoint} returned invalid data:`, response.data);
            } catch (error) {
                console.warn(`Endpoint ${endpoint} failed:`, error);
                lastError = error;
                // Continue to next endpoint
            }
        }
        
        // If all endpoints failed, throw the last error
        throw lastError || new Error('Failed to analyze CV');
    } catch (error) {
        console.error('Error analyzing CV:', error);
        throw error;
    }
};

/**
 * Get the status of a parsed CV
 * @param {string} cvId - The ID of the parsed CV
 * @returns {Promise<object>} - The status of the parsed CV
 */
export const getCVStatus = async (cvId) => {
    try {
        const response = await api.get(`/api/ai_cv_parser/parser/${cvId}/status/`);
        return response.data;
    } catch (error) {
        console.error('Error getting CV status:', error);
        throw error;
    }
};

/**
 * Get the details of a parsed CV
 * @param {string} cvId - The ID of the parsed CV
 * @returns {Promise<object>} - The details of the parsed CV
 */
export const getCVDetails = async (cvId) => {
    try {
        const response = await api.get(`/api/ai_cv_parser/parser/${cvId}/`);
        return response.data;
    } catch (error) {
        console.error('Error getting CV details:', error);
        throw error;
    }
};

/**
 * Transfer parsed CV data to the CV writer
 * @param {string} parsedData - The parsed CV data to transfer
 * @returns {Promise<object>} - The transfer result
 */
export const transferToWriter = async (parsedData) => {
    try {
        // Get the token from localStorage or sessionStorage
        const token = localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
        
        if (!token) {
            console.error('Authentication token not found');
            throw new Error('You must be logged in to transfer data to CV writer');
        }
        
        // Using our api instance with proper authentication and error handling
        const response = await api.post(
            `/api/cv_parser/transfer_to_writer/`,
            { parsed_data: parsedData },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                timeout: DEFAULT_TIMEOUT
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error transferring data to CV writer:', error);
        
        // Handle timeout errors
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timed out. Please try again later.');
        }
        
        // If unauthorized, redirect to login
        if (error.response?.status === 401) {
            window.location.href = '/login';
        }
        
        throw error;
    }
};

/**
 * Extract CV sections using DeepSeek integration
 * @param {string} text - The text to extract sections from
 * @returns {Promise<object>} - The extracted sections
 */
export const extractSections = async (text) => {
    try {
        // Get the token from localStorage or sessionStorage
        const token = localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
        
        if (!token) {
            console.error('Authentication token not found');
            throw new Error('You must be logged in to extract CV sections');
        }
        
        const response = await api.post(
            `/api/cv_parser/extract_sections/`,
            { text },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                timeout: DEFAULT_TIMEOUT
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error extracting CV sections:', error);
        
        // Handle timeout errors
        if (error.code === 'ECONNABORTED') {
            throw new Error('The section extraction process timed out. Please try again with shorter text.');
        }
        
        // If unauthorized, redirect to login
        if (error.response?.status === 401) {
            window.location.href = '/login';
        }
        
        throw error;
    }
};

/**
 * Fetch parsed CV data with enhanced error handling
 * @param {string} cvId - The ID of the parsed CV to fetch
 * @param {boolean} showToast - Whether to show toast messages for errors
 * @returns {Promise<object>} - The parsed CV data
 */
export const fetchParsedCV = async (cvId, showToast = false) => {
    if (!cvId) {
        const error = new Error('CV ID is required');
        console.error('No CV ID provided to fetchParsedCV');
        if (showToast) {
            toast.error('Unable to load CV: No CV ID provided');
        }
        throw error;
    }

    console.log(`Fetching CV data for ID: ${cvId}`);
    
    try {
        // Get the token from localStorage or sessionStorage
        const token = localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
        
        if (!token) {
            const error = new Error('Authentication token not found');
            console.error('No authentication token found when fetching CV');
            if (showToast) {
                toast.error('Please log in to view CV data');
            }
            throw error;
        }
        
        // Using our api instance with proper authentication and error handling
        const response = await api.get(
            `/api/ai_cv_parser/parser/${cvId}/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                timeout: DEFAULT_TIMEOUT
            }
        );

        // Validate response data
        if (!response.data) {
            throw new Error('No data received from server');
        }

        console.log('Fetched CV Parser Data:', response.data);
        
        // Handle undefined status field gracefully
        if (response.data.status === undefined) {
            console.warn('CV parser status is undefined, treating as completed');
            // Create a defensive copy with a default status
            return {
                ...response.data,
                status: 'completed',
                parser_completed_but_not_stored: true // Add a flag to indicate this special case
            };
        }
        
        return response.data;
    } catch (error) {
        console.error('Error fetching parsed CV data:', error);
        
        // Handle specific error cases
        if (error.code === 'ECONNABORTED') {
            const errorMsg = 'Request timed out while fetching CV data. Please try again later.';
            if (showToast) {
                toast.error(errorMsg);
            }
            throw new Error(errorMsg);
        }
        
        if (error.response?.status === 404) {
            const errorMsg = 'The requested CV was not found. It may have been deleted or the ID is incorrect.';
            if (showToast) {
                toast.error(errorMsg);
            }
            throw new Error(errorMsg);
        }
        
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Unauthorized access - handle based on app requirements
            const errorMsg = 'You must be logged in to view this CV.';
            if (showToast) {
                toast.error(errorMsg);
            }
            
            // Optional: Redirect to login
            // window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
            throw new Error(errorMsg);
        }
        
        // Default error with useful context
        const errorMessage = error.response?.data?.detail || 
                            error.response?.data?.error || 
                            error.response?.data?.message || 
                            error.message || 
                            'An error occurred while fetching the CV.';
                            
        if (showToast) {
            toast.error(errorMessage);
        }
        
        throw new Error(errorMessage);
    }
};

export default {
    uploadDocument,
    analyzeCV,
    getCVStatus,
    getCVDetails,
    transferToWriter,
    extractSections,
    fetchParsedCV
};