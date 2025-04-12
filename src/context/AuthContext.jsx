import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (email, password, rememberMe = false) => {
    try {
      console.log('Attempting login to:', `${api.defaults.baseURL}/api/auth/login/`);
      
      // First clear any existing tokens to prevent conflicts
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      
      // Use the specialized auth request method instead of standard API call
      const response = await api.authRequest('post', '/api/auth/login/', { 
        email, 
        password,
        remember_me: rememberMe
      });
      
      console.log('Login response:', response);
      
      const { refresh, access, user: userData } = response.data;
      
      if (!access || !refresh) {
        throw new Error('Authentication tokens not received from server');
      }
      
      // Store tokens
      localStorage.setItem(ACCESS_TOKEN, access);
      localStorage.setItem(REFRESH_TOKEN, refresh);
      
      // Set token in API headers for subsequent requests
      api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      setUser(userData);
      
      const from = location?.state?.from || '/dashboard';
      navigate(from, { replace: true });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      console.error('Login error details:', error.response?.data || 'No response data');
      
      // More descriptive error messages based on the error
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.response.status === 403) {
          errorMessage = 'Your account is inactive or blocked. Please contact support.';
        } else if (error.response.status === 429) {
          errorMessage = 'Too many login attempts. Please try again later.';
        } else if (error.response.data?.detail) {
          errorMessage = error.response.data.detail;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Server not responding. Please check your internet connection and try again.';
      }
      
      // Throw a more specific error
      const enhancedError = new Error(errorMessage);
      enhancedError.originalError = error;
      throw enhancedError;
    }
  };

  const logout = () => {
    // Clear tokens
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    
    setUser(null);
    navigate('/login');
  };

  const refreshTokens = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await api.post('/api/token/refresh/', { 
        refresh: refreshToken 
      });
      
      const { access: newAccessToken } = response.data;
      
      // Store new token
      localStorage.setItem(ACCESS_TOKEN, newAccessToken);

      // Update API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Don't force logout on refresh failure during initial check
      throw error;
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Token expiration check
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        // Token expired, attempt refresh
        await refreshTokens();
      }

      // Set the token in API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await api.get('/api/auth/user/');
      setUser(response.data);
    } catch (error) {
      console.error('Authentication check failed:', error);
      // Only logout if it's not the initial check and it's not a refresh token error
      if (!loading && error.response?.status !== 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const authContextValue = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    refreshTokens,
    isAuthenticated: !!user,
    updateProfile: async (profileData) => {
      try {
        const response = await api.patch('/api/auth/profile/', profileData);
        setUser(prevUser => ({ ...prevUser, ...response.data }));
        return response.data;
      } catch (error) {
        console.error('Profile update error:', error);
        throw error;
      }
    }
  }), [user, loading]);

  // Only run auth check once on mount
  useEffect(() => {
    let isMounted = true;
    
    const performAuthCheck = async () => {
      if (isMounted) {
        await checkAuth();
      }
    };

    performAuthCheck();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
