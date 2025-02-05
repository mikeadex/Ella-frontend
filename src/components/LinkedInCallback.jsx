import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';

const LinkedInCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Processing LinkedIn callback...');
        // Get code and state from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const returnedState = urlParams.get('state');
        const savedState = localStorage.getItem('linkedin_oauth_state');

        console.log('OAuth params:', { 
          code: code ? 'present' : 'missing', 
          returnedState: returnedState || 'missing',
          savedState: savedState || 'missing'
        });

        // Verify state parameter
        if (!returnedState || !savedState || returnedState !== savedState) {
          console.error('State mismatch:', { returnedState, savedState });
          setError('Invalid state parameter. Please try connecting again.');
          setTimeout(() => navigate('/linkedin-test'), 3000);
          return;
        }

        // Clear the state from storage
        localStorage.removeItem('linkedin_oauth_state');

        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
          console.error('No access token found');
          setError('Authentication required. Please log in again.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Exchange code for access token
        console.log('Exchanging code for access token...');
        const response = await axios.post(
          'http://localhost:8000/api/linkedin/profiles/oauth_callback/',
          {
            code,
            state: returnedState
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        console.log('OAuth callback response:', response.data);

        // If successful, sync profile
        if (response.data.profile_id) {
          console.log('Syncing LinkedIn profile...');
          await axios.post(
            `http://localhost:8000/api/linkedin/profiles/${response.data.profile_id}/sync_profile/`,
            null,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          console.log('Profile sync completed');
        }

        // Redirect back to test page
        navigate('/linkedin-test');
      } catch (error) {
        console.error('LinkedIn callback failed:', error.response?.data || error);
        setError(error.response?.data?.error || 'Failed to connect LinkedIn profile');
        setTimeout(() => navigate('/linkedin-test'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">
          {error ? 'LinkedIn Connection Failed' : 'Processing LinkedIn Connection...'}
        </h2>
        {error ? (
          <p className="text-red-600 mb-4">{error}</p>
        ) : (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        )}
        <p className="text-gray-600 text-sm">
          {error ? 'Redirecting you back...' : 'Please wait while we process your LinkedIn connection.'}
        </p>
      </div>
    </div>
  );
};

export default LinkedInCallback;
