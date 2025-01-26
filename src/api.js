// api.js
import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

// Check if we have access token and refresh token in local storage
const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
})
console.log('Base URL:', 'http://localhost:8000');

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
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await axios.post('http://localhost:8000/api/token/refresh/', {
                refresh: refreshToken
            });

            const { access } = response.data;

            // Store new access token
            localStorage.setItem(ACCESS_TOKEN, access);

            // Update authorization header
            originalRequest.headers.Authorization = `Bearer ${access}`;
            api.defaults.headers.common['Authorization'] = `Bearer ${access}`;

            // Retry original request
            return api(originalRequest);
        } catch (refreshError) {
            // If refresh fails, clear tokens and reject
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }
);

export default api;
// default api will be used to make requests to the backend instead of calling axios directly and all the requests will have the access token in the header.