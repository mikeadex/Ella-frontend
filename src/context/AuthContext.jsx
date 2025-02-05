import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/api/auth/login/', { email, password });
      const { refresh, access, user: userData } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    navigate('/login');
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get('/api/auth/user/');
      setUser(response.data);
    } catch (error) {
      // If user retrieval fails, try refreshing token
      if (error.response?.status === 401) {
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          const refreshResponse = await axiosInstance.post('/api/token/refresh/', { 
            refresh: refreshToken 
          });
          
          localStorage.setItem('access_token', refreshResponse.data.access);
          
          // Retry user fetch
          const userResponse = await axiosInstance.get('/api/auth/user/');
          setUser(userResponse.data);
        } catch (refreshError) {
          logout();
        }
      } else {
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
    isAuthenticated: !!user
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
