import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const getAccessToken = useCallback(() => {
    return localStorage.getItem('access_token');
  }, []);

  const isAuthenticated = useCallback(() => {
    const token = getAccessToken();
    return !!token;
  }, [getAccessToken]);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/api/auth/login/', { email, password });
      console.log('Login response:', response.data);
      const { access, refresh, user: userData } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setUser(userData);
      
      // Check if we have a redirect path
      const from = location?.state?.from || '/dashboard';
      navigate(from, { replace: true });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const checkAuth = useCallback(async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get('/api/auth/user/');
      console.log('Auth check response:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('Auth check error:', error);
      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, logout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    login,
    logout,
    getAccessToken,
  };

  if (loading) {
    return <div>Loading...</div>; // or your loading component
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
