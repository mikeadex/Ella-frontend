import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useAuth } from '../context/AuthContext';

const LinkedInCallback = () => {
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check authentication
        if (!isAuthenticated) {
          navigate('/login', {
            state: {
              from: location.pathname + location.search,
              message: 'Please log in to complete LinkedIn connection'
            }
          });
          return;
        }

        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');
        const error = params.get('error');
        const error_description = params.get('error_description');
        
        // Check for LinkedIn OAuth errors
        if (error) {
          throw new Error(error_description || error);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Verify state
        const storedState = localStorage.getItem('linkedin_oauth_state');
        if (!storedState || storedState !== state) {
          throw new Error('Invalid state parameter');
        }

        // Clear stored state
        localStorage.removeItem('linkedin_oauth_state');

        // Exchange code for access token
        await axiosInstance.get(`/api/linkedin/callback/?code=${code}&state=${state}`);
        
        // Send message to opener window
        if (window.opener) {
          window.opener.postMessage(
            { type: 'LINKEDIN_CALLBACK', success: true },
            window.location.origin
          );
          window.close();
        } else {
          // If not in popup, redirect to LinkedIn test page
          navigate('/linkedin-test', { 
            state: { message: 'LinkedIn profile connected successfully!' }
          });
        }
      } catch (err) {
        console.error('LinkedIn callback error:', err);
        setError(err.response?.data?.error || err.message || 'Failed to connect LinkedIn profile');
        
        // Send error to opener window
        if (window.opener) {
          window.opener.postMessage(
            { type: 'LINKEDIN_CALLBACK', success: false, error: err.message },
            window.location.origin
          );
          window.close();
        }
      }
    };

    handleCallback();
  }, [location, navigate, isAuthenticated]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Connection Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => window.close()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Connecting your LinkedIn profile...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInCallback;
