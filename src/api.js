// api.js
import axios from "axios";

// Check if we have access token and refresh token in local storage
const api = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
        'Content-Type': 'application/json',
    },
})
console.log('Base URL:', 'http://localhost:8000/');

// Add a request interceptor to check if access token exists in local storage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
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

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    // No refresh token available, user needs to login again
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                    return Promise.reject(error);
                }

                // Try both refresh endpoints
                let response;
                try {
                    // Try dj-rest-auth refresh first
                    response = await axios.post('http://localhost:8000/api/auth/token/refresh/', {
                        refresh: refreshToken,
                    });
                } catch (refreshError) {
                    // If that fails, try simple-jwt refresh
                    response = await axios.post('http://localhost:8000/api/token/refresh/', {
                        refresh: refreshToken,
                    });
                }

                if (response.data.access || response.data.access_token) {
                    const newToken = response.data.access || response.data.access_token;
                    localStorage.setItem('access_token', newToken);
                    
                    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    
                    // Retry the original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                // Refresh failed, clear tokens and redirect to login
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
// default api will be used to make requests to the backend instead of calling axios directly and all the requests will have the access token in the header.