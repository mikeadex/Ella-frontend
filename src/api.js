// api.js
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Configure global axios defaults for enterprise-grade reliability
axios.defaults.timeout = 60000; // 60 seconds
axios.defaults.maxContentLength = 50 * 1024 * 1024; // 50MB limit for file uploads
axios.defaults.maxBodyLength = 50 * 1024 * 1024; // 50MB limit for request body

// Configuration for retries
const RETRY_COUNT = 3;
const RETRY_DELAY = 1000; // 1 second in ms
const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504];

// Create a custom axios instance with special handling for auth endpoints
const createAuthApi = () => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Always include credentials for auth requests
    timeout: 30000,
  });
};

// Create a file upload API instance with special configuration
const createFileUploadApi = () => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
    timeout: 120000, // 2 minutes for file uploads
    maxContentLength: 50 * 1024 * 1024, // 50MB
    maxBodyLength: 50 * 1024 * 1024, // 50MB
  });
};

// Create a standard API instance
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Include credentials
    timeout: 30000,
});

console.log('Base URL:', BASE_URL);

// Helper function to implement retry logic
const retryRequest = async (config, retryCount = 0) => {
  try {
    return await axios(config);
  } catch (error) {
    // Only retry on network errors or specific status codes
    const shouldRetry = (
      error.code === 'ECONNABORTED' || 
      error.code === 'ERR_NETWORK' ||
      (error.response && RETRY_STATUS_CODES.includes(error.response.status))
    );
    
    // If we should retry and haven't exceeded max retries
    if (shouldRetry && retryCount < RETRY_COUNT) {
      console.log(`Retrying request (${retryCount + 1}/${RETRY_COUNT})...`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
      
      // Retry with incremented count
      return retryRequest(config, retryCount + 1);
    }
    
    // If we shouldn't retry or have exceeded max retries, throw the error
    throw error;
  }
};

// Add a request interceptor to check if access token exists in local storage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// File upload with progress, retry logic and better error handling
api.uploadFile = async (endpoint, formData, onProgress = () => {}) => {
  const fileUploadApi = createFileUploadApi();
  
  // Get token for authorization
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) {
    fileUploadApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    let retryCount = 0;
    let lastError = null;
    
    while (retryCount <= RETRY_COUNT) {
      try {
        // Add progress tracking
        const response = await fileUploadApi.post(endpoint, formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        });
        
        return response;
      } catch (error) {
        lastError = error;
        
        // Only retry on network errors or specific status codes
        const shouldRetry = (
          error.code === 'ECONNABORTED' || 
          error.code === 'ERR_NETWORK' ||
          (error.response && RETRY_STATUS_CODES.includes(error.response.status))
        );
        
        if (shouldRetry && retryCount < RETRY_COUNT) {
          retryCount++;
          console.log(`Retrying file upload (${retryCount}/${RETRY_COUNT})...`);
          
          // Wait before retrying with progressive backoff
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
          continue;
        }
        
        // If we shouldn't retry or have exceeded max retries, throw the error
        throw error;
      }
    }
    
    // If we've exhausted retries, throw the last error
    throw lastError;
  } catch (error) {
    console.error('File upload failed after retries:', error);
    throw error;
  }
};

// Special function for auth-related requests to avoid token interference
api.authRequest = async (method, endpoint, data = {}) => {
  const authApi = createAuthApi();
  
  try {
    // Don't automatically include auth headers for these endpoints
    const response = await authApi({
      method,
      url: endpoint,
      data,
    });
    
    return response;
  } catch (error) {
    console.error(`Auth request failed (${method} ${endpoint}):`, error);
    throw error;
  }
};

// Refresh token logic
api.refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        const response = await api.post('/api/token/refresh/', { refresh: refreshToken });
        
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        return response.data.access;
    } catch (error) {
        // Handle refresh token failure
        console.error('Token refresh failed', error);
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        throw error;
    }
};

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle timeout errors specifically
        if (error.code === 'ECONNABORTED') {
            console.error('Request timed out:', originalRequest.url);
            error.message = 'The request is taking too long to process. Please try again later.';
            return Promise.reject(error);
        }

        // Handle server errors with more specific messages
        if (error.response?.status === 500) {
            console.error('Server error:', error.response.data);
            if (error.response.data?.error) {
                error.message = `Server error: ${error.response.data.error}`;
            } else {
                error.message = 'The server encountered an error. Please try again later.';
            }
            return Promise.reject(error);
        }

        // If error is not 401 or request already retried, reject
        if (!error.response || error.response.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            // Attempt to refresh the token
            const newAccessToken = await api.refreshToken();
            
            // Update the Authorization header with the new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

            // Retry original request
            return api(originalRequest);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
);

export default api;
// default api will be used to make requests to the backend instead of calling axios directly and all the requests will have the access token in the header.