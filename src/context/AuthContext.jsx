import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await axiosInstance.post('/api/auth/login/', { 
        email, 
        password,
        remember_me: rememberMe
      });
      
      const { refresh, access, user: userData } = response.data;
      
      // Secure token storage with optional persistence
      if (rememberMe) {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
      } else {
        sessionStorage.setItem('access_token', access);
        sessionStorage.setItem('refresh_token', refresh);
      }
      
      setUser(userData);
      
      const from = location?.state?.from || '/dashboard';
      navigate(from, { replace: true });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear tokens from both storage mechanisms
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    
    setUser(null);
    navigate('/login');
  };

  const refreshTokens = async () => {
    const refreshToken = localStorage.getItem('refresh_token') || 
                         sessionStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axiosInstance.post('/api/token/refresh/', { 
        refresh: refreshToken 
      });
      
      const { access: newAccessToken } = response.data;
      
      // Store new token in the same storage as original
      if (localStorage.getItem('refresh_token')) {
        localStorage.setItem('access_token', newAccessToken);
      } else {
        sessionStorage.setItem('access_token', newAccessToken);
      }

      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout(); // Force logout on refresh failure
      throw error;
    }
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token') || 
                  sessionStorage.getItem('access_token');
    
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

      const response = await axiosInstance.get('/api/auth/user/');
      setUser(response.data);
    } catch (error) {
      console.error('Authentication check failed:', error);
      logout();
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
        const response = await axiosInstance.patch('/api/auth/profile/', profileData);
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

  return (
    <AuthContext.Provider value={authContextValue}>
      {loading ? <div>Loading...</div> : children}
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
