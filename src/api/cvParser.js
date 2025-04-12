import axios from 'axios';
import { API_BASE_URL } from '../config';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

// Default timeout in milliseconds (30 seconds)
const DEFAULT_TIMEOUT = 30000;

// Upload document to the server
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

        // Using our api instance with proper authentication and error handling
        const response = await api.post(
            `/api/cv_parser/parse-document/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },
                timeout: DEFAULT_TIMEOUT * 2 // Longer timeout for file uploads (60 seconds)
            }
        );

        console.log('CV Parser Response:', response.data);
        return {
            data: response.data,
            metadata: response.data.metadata || {}
        };
    } catch (error) {
        console.error('Error uploading document:', error);
        
        // Handle specific error types
        if (error.code === 'ECONNABORTED') {
            throw new Error('The parsing process is taking too long. Please try again with a smaller file or try later.');
        }
        
        // If unauthorized, redirect to login
        if (error.response?.status === 401) {
            window.location.href = '/login';
        }
        
        throw error;
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