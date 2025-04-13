import axios from 'axios';
import { API_BASE_URL } from '../config';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

// Default timeout in milliseconds (30 seconds)
const DEFAULT_TIMEOUT = 30000;

// Maximum number of polling attempts
const MAX_POLL_ATTEMPTS = 60; // Poll for up to 5 minutes (with 5s intervals)

// Upload document to the server with async processing
export const uploadDocument = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        // Get the token from localStorage or sessionStorage
        const token = localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
        
        if (!token) {
            console.error('Authentication token not found');
            throw new Error('You must be logged in to upload documents');
        }

        // Phase 1: Upload document and start processing
        console.log('Starting CV upload and processing...');
        const uploadResponse = await api.uploadFile(
            `/api/cv_parser/parse-cv/`,
            formData,
            (progress) => {
                console.log(`Upload progress: ${progress}%`);
                // You can use this callback to update UI with upload progress
            }
        );

        // Check if we got a processing ID
        if (!uploadResponse.data || !uploadResponse.data.id) {
            console.error('Invalid response from server:', uploadResponse.data);
            throw new Error('Server returned an invalid response');
        }

        const parsedCvId = uploadResponse.data.id;
        console.log(`CV processing started with ID: ${parsedCvId}`);

        // Phase 2: Poll for job completion
        return await pollForCompletion(parsedCvId);
    } catch (error) {
        console.error('Error uploading document:', error);
        
        // Handle specific error types
        if (error.code === 'ECONNABORTED') {
            throw new Error('The request timed out. Please try again with a smaller file or try later.');
        }
        
        // If unauthorized, redirect to login
        if (error.response?.status === 401) {
            window.location.href = '/login';
            throw new Error('You must be logged in to upload documents');
        }
        
        throw error;
    }
};

// Poll for job completion
const pollForCompletion = async (cvId, attempt = 0) => {
    if (attempt >= MAX_POLL_ATTEMPTS) {
        throw new Error('CV processing is taking longer than expected. Please check back later.');
    }
    
    try {
        // Wait 5 seconds between polls to avoid overloading the server
        if (attempt > 0) {
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
        
        // Get current status
        const response = await api.get(`/api/cv_parser/parser/${cvId}/`);
        
        if (!response.data) {
            throw new Error('Failed to retrieve processing status');
        }
        
        const status = response.data.status;
        console.log(`CV Processing status: ${status} (attempt ${attempt + 1}/${MAX_POLL_ATTEMPTS})`);
        
        // If completed, return the data
        if (status === 'completed') {
            console.log('CV processing completed successfully');
            return {
                data: response.data.parsed_data || {},
                metadata: response.data.metadata || {
                    processing_time: response.data.processing_time,
                    uploaded_at: response.data.uploaded_at,
                    processed_at: response.data.processed_at
                }
            };
        } 
        // If failed, throw an error
        else if (status === 'failed') {
            throw new Error(response.data.error_message || 'CV processing failed');
        }
        // If still processing, continue polling
        else {
            return await pollForCompletion(cvId, attempt + 1);
        }
    } catch (error) {
        console.error(`Error polling for CV completion (attempt ${attempt + 1}):`, error);
        
        // Only throw after several failed polling attempts
        if (attempt > 3) {
            throw error;
        }
        
        // Otherwise, try again
        return await pollForCompletion(cvId, attempt + 1);
    }
};

// Transfer parsed CV data to the CV writer
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

// Extract CV sections using DeepSeek integration
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

// Fetch parsed CV data with enhanced error handling
export const fetchParsedCV = async (cvId) => {
    try {
        if (!cvId) {
            throw new Error('CV ID is required');
        }

        // Get the token from localStorage or sessionStorage
        const token = localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);
        
        if (!token) {
            console.error('Authentication token not found');
            throw new Error('You must be logged in to view parsed CV data');
        }
        
        // Using our api instance with proper authentication and error handling
        const response = await api.get(
            `/api/cv_parser/parser/${cvId}/`,
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
                status: 'completed'
            };
        }
        
        return response.data;
    } catch (error) {
        console.error('Error fetching parsed CV data:', error);
        
        // Handle specific error cases
        if (error.code === 'ECONNABORTED') {
            throw new Error('Request timed out while fetching CV data. Please try again later.');
        }
        
        if (error.response?.status === 404) {
            throw new Error('The requested CV was not found. It may have been deleted or the ID is incorrect.');
        }
        
        if (error.response?.status === 401 || error.response?.status === 403) {
            // Unauthorized access
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
            throw new Error('You must be logged in to view this CV.');
        }
        
        // Default error with useful context
        const errorMessage = error.response?.data?.detail || 
                            error.response?.data?.error || 
                            error.message ||
                            'Failed to fetch CV data. Please try again later.';
        
        throw new Error(errorMessage);
    }
};