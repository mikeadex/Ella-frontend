import axios from 'axios';

// Determine the API URL with fallbacks
const getApiBaseUrl = () => {
  // First check for Vite environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Then check for React environment variable
  if (import.meta.env.REACT_APP_API_URL) {
    return import.meta.env.REACT_APP_API_URL;
  }
  
  // Check if we're in production based on hostname
  const isProduction = 
    window.location.hostname === 'ellacvwriter.com' || 
    window.location.hostname === 'www.ellacvwriter.com' ||
    window.location.hostname === 'ellacv.com' ||
    window.location.hostname === 'www.ellacv.com' ||
    window.location.hostname === 'ellacvwriter.vercel.app' ||
    window.location.hostname === 'www.ellacvwriter.vercel.app';
    
  // Return production or development URL
  return isProduction 
    ? 'https://api.ellacvwriter.com' 
    : 'http://localhost:8000';
};

const api = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
    // Add timeout to prevent infinite waiting
    timeout: 20000,
    // Add withCredentials to ensure cookies are sent cross-domain
    withCredentials: true,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Configure retry logic for network errors
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Add response interceptor for error handling with retry logic
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config } = error;
        
        // Only retry on network errors or 5xx server errors
        const shouldRetry = 
            (!error.response || (error.response.status >= 500 && error.response.status < 600)) && 
            config && 
            (!config._retryCount || config._retryCount < MAX_RETRIES);
            
        if (shouldRetry) {
            config._retryCount = config._retryCount || 0;
            config._retryCount += 1;
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * config._retryCount));
            
            console.log(`Retrying request (${config._retryCount}/${MAX_RETRIES}):`, config.url);
            return api(config);
        }
        
        // Handle authentication errors
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            // Only redirect if not already on login page to prevent redirect loops
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        
        // Log error details for debugging
        console.error('API Error:', {
            url: config?.url,
            method: config?.method,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        return Promise.reject(error);
    }
);

export default api;