import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../api';

const ResetPasswordConfirm = () => {
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password1 !== password2) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Convert uid from base64url to base64
      const normalizedUid = uid.replace(/-/g, '+').replace(/_/g, '/');
      
      const response = await api.post('/api/auth/password/reset/confirm/', {
        new_password1: password1,
        new_password2: password2,
        uid: normalizedUid,
        token: token
      });

      if (response.data) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      console.error('Reset password error:', err.response?.data);
      let errorMessage = 'Failed to reset password. Please try again.';
      
      if (err.response?.data) {
        const data = err.response.data;
        if (data.token) errorMessage = 'Invalid or expired reset token. Please request a new password reset.';
        else if (data.uid) errorMessage = 'Invalid reset link. Please request a new password reset.';
        else if (data.new_password1) errorMessage = data.new_password1[0];
        else if (data.new_password2) errorMessage = data.new_password2[0];
        else if (data.detail) errorMessage = data.detail;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Password reset successful!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your password has been reset. Redirecting to login...
            </p>
          </div>
          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Go to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Set new password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your new password.
          </p>
        </div>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="password1" className="sr-only">
                New Password
              </label>
              <input
                id="password1"
                name="password1"
                type="password"
                required
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="New Password"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password2" className="sr-only">
                Confirm New Password
              </label>
              <input
                id="password2"
                name="password2"
                type="password"
                required
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm New Password"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;
