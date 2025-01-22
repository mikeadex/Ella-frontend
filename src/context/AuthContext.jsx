import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await api.get('api/auth/user/');
        setUser(response.data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const storeTokens = (accessToken, refreshToken, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('access_token', accessToken);
    if (refreshToken) {
      storage.setItem('refresh_token', refreshToken);
    }
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  };

  const login = async (email, password, rememberMe = false) => {
    try {
      // Try dj-rest-auth login first
      const loginResponse = await api.post('api/auth/login/', {
        email: email,
        password: password,
      });

      let accessToken = null;
      let refreshToken = null;

      if (loginResponse.data) {
        if (loginResponse.data.access_token) {
          // dj-rest-auth format
          accessToken = loginResponse.data.access_token;
          refreshToken = loginResponse.data.refresh_token;
        } else if (loginResponse.data.access) {
          // simple-jwt format
          accessToken = loginResponse.data.access;
          refreshToken = loginResponse.data.refresh;
        }
      }

      if (accessToken) {
        // Store tokens in the appropriate storage
        storeTokens(accessToken, refreshToken, rememberMe);
        
        try {
          // Get user data
          const userResponse = await api.get('api/auth/user/');
          setUser(userResponse.data);
          return { success: true };
        } catch (userError) {
          console.error('Failed to get user data:', userError);
          // Even if getting user data fails, we're still logged in
          return { success: true };
        }
      }

      // If we get here, try the simple-jwt endpoint
      const jwtResponse = await api.post('api/token/', {
        email: email,
        password: password,
      });

      if (jwtResponse.data.access) {
        storeTokens(jwtResponse.data.access, jwtResponse.data.refresh, rememberMe);
        
        try {
          const userResponse = await api.get('api/auth/user/');
          setUser(userResponse.data);
        } catch (userError) {
          console.error('Failed to get user data:', userError);
        }
        
        return { success: true };
      }

      throw new Error('No access token received');
    } catch (error) {
      console.error('Login failed:', error);
      let errorMessage = 'Login failed';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (error.response.data?.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data?.non_field_errors) {
          errorMessage = error.response.data.non_field_errors[0];
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const signup = async (email, password1, password2) => {
    try {
      const response = await api.post('api/auth/registration/', {
        email,
        password1,
        password2,
      });

      if (response.data.access_token || response.data.access) {
        const accessToken = response.data.access_token || response.data.access;
        const refreshToken = response.data.refresh_token || response.data.refresh;

        // For new registrations, we'll use localStorage by default
        storeTokens(accessToken, refreshToken, true);
        
        try {
          const userResponse = await api.get('api/auth/user/');
          setUser(userResponse.data);
        } catch (userError) {
          console.error('Failed to get user data:', userError);
        }
        
        return { success: true };
      } else {
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      let errorMessage = 'Signup failed';
      
      if (error.response) {
        if (error.response.data?.email) {
          errorMessage = error.response.data.email[0];
        } else if (error.response.data?.password1) {
          errorMessage = error.response.data.password1[0];
        } else if (error.response.data?.non_field_errors) {
          errorMessage = error.response.data.non_field_errors[0];
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
