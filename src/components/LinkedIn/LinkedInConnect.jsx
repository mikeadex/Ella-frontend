import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { linkedInService } from '../../services/linkedInService';
import { Button, Alert, Spinner } from '../common';

const LinkedInConnect = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check for OAuth callback
        const queryParams = new URLSearchParams(location.search);
        const code = queryParams.get('code');
        if (code) {
            handleOAuthCallback(code);
        }
    }, [location]);

    const handleOAuthCallback = async (code) => {
        try {
            setLoading(true);
            await linkedInService.connectProfile(code);
            navigate('/linkedin/profile');
        } catch (err) {
            setError('Failed to connect LinkedIn profile');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = () => {
        // LinkedIn OAuth configuration
        const clientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID;
        const redirectUri = `${window.location.origin}/linkedin/connect`;
        const scope = 'r_liteprofile r_emailaddress r_basicprofile';
        
        // Construct OAuth URL
        const oauthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
        
        // Redirect to LinkedIn OAuth
        window.location.href = oauthUrl;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white shadow rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-6">Connect LinkedIn Profile</h2>

                {error && (
                    <Alert type="error" message={error} onClose={() => setError(null)} />
                )}

                <div className="mb-8">
                    <p className="text-gray-600 mb-4">
                        Connect your LinkedIn profile to automatically import your professional experience,
                        education, skills, and more.
                    </p>
                    <p className="text-sm text-gray-500">
                        We'll only access your public profile information to help create your CV.
                    </p>
                </div>

                <Button
                    onClick={handleConnect}
                    className="bg-[#0077b5] hover:bg-[#006397] text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                >
                    <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span>Connect with LinkedIn</span>
                </Button>

                <p className="mt-6 text-xs text-gray-500">
                    By connecting your LinkedIn profile, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default LinkedInConnect;
