import React, { useState } from 'react';
import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';

const LinkedInConnect = () => {
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    try {
      console.log('Starting LinkedIn connect flow...');
      
      // Get token from localStorage
      const token = localStorage.getItem(ACCESS_TOKEN);
      console.log('Access token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        window.location.href = '/login';
        return;
      }

      console.log('Making request to connect endpoint...');
      // Start OAuth flow
      const response = await axios.post('http://localhost:8000/api/linkedin/profiles/connect/', null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Connect response:', response.data);
      
      // Redirect to LinkedIn authorization page
      if (response.data.auth_url) {
        console.log('Redirecting to:', response.data.auth_url);
        window.location.href = response.data.auth_url;
      } else {
        setError('No authorization URL received');
      }
    } catch (error) {
      console.error('Failed to connect LinkedIn:', error.response || error);
      setError(error.response?.data?.detail || error.message || 'Failed to connect to LinkedIn');
    }
  };

  return (
    <div>
      <button 
        onClick={handleConnect}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.68 1.68 0 0 0-1.68 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
        </svg>
        <span>Connect with LinkedIn</span>
      </button>
      
      {error && (
        <div className="mt-2 text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default LinkedInConnect;
