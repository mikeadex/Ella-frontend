// api.js
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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

// Create a standard API instance
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Include credentials
    timeout: 30000,
})

console.log('Base URL:', BASE_URL);

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
)

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