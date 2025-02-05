// api.js
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
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
        window.location.href = '/login';
        throw error;
    }
};

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is not 401 or request already retried, reject
        if (error.response.status !== 401 || originalRequest._retry) {
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