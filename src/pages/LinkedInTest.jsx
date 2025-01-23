import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';

const LinkedInTest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) {
        navigate('/login', { 
          state: { 
            from: '/linkedin-test',
            message: 'Please log in to connect your LinkedIn account'
          }
        });
        return;
      }

      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/linkedin/profile/');
        setProfile(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (err.response?.status === 401) {
          navigate('/login', { 
            state: { 
              from: '/linkedin-test',
              message: 'Please log in to connect your LinkedIn account'
            }
          });
        } else if (err.response?.status === 404) {
          // Profile not found is normal when not connected
          setProfile(null);
        } else {
          setError(err.response?.data?.error || 'Failed to fetch profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, isAuthenticated]);

  const handleConnect = async () => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          from: '/linkedin-test',
          message: 'Please log in to connect your LinkedIn account'
        }
      });
      return;
    }

    try {
      setLoading(true);
      const state = Math.random().toString(36).substring(2);
      localStorage.setItem('linkedin_oauth_state', state);
      
      const redirectUri = `${window.location.origin}/linkedin/callback`;
      const response = await axiosInstance.get(
        `/api/linkedin/auth/?state=${state}&redirect_uri=${encodeURIComponent(redirectUri)}`
      );
      
      if (response.data.authorization_url) {
        // Open LinkedIn authorization in a popup window
        const width = 600;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        window.open(
          response.data.authorization_url,
          'LinkedIn Authorization',
          `width=${width},height=${height},left=${left},top=${top}`
        );

        // Listen for messages from the popup
        window.addEventListener('message', async (event) => {
          if (event.origin === window.location.origin && event.data.type === 'LINKEDIN_CALLBACK') {
            try {
              await fetchProfile();
            } catch (err) {
              console.error('Error updating profile after callback:', err);
            }
          }
        });
      } else {
        throw new Error('No authorization URL received');
      }
    } catch (err) {
      console.error('Error starting auth:', err);
      if (err.response?.status === 401) {
        navigate('/login', { 
          state: { 
            from: '/linkedin-test',
            message: 'Please log in to connect your LinkedIn account'
          }
        });
      } else {
        setError(err.response?.data?.error || 'Failed to start LinkedIn authentication');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      await axiosInstance.post('/api/linkedin/disconnect/');
      setProfile(null);
    } catch (err) {
      console.error('Error disconnecting:', err);
      setError(err.response?.data?.error || 'Failed to disconnect LinkedIn account');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              LinkedIn Integration
            </h3>
            
            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {profile ? (
              <div className="mt-5">
                <div className="rounded-md bg-white shadow-sm p-4">
                  <div className="flex items-center space-x-4">
                    {profile.profile_picture_url && (
                      <img
                        src={profile.profile_picture_url}
                        alt={profile.full_name}
                        className="h-16 w-16 rounded-full"
                      />
                    )}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {profile.full_name}
                      </h4>
                      <p className="text-sm text-gray-500">{profile.headline}</p>
                      <p className="text-sm text-gray-500">{profile.email}</p>
                      {profile.linkedin_url && (
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-500"
                        >
                          View LinkedIn Profile
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={handleDisconnect}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Disconnect LinkedIn
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5">
                <button
                  onClick={handleConnect}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Connect LinkedIn
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInTest;
