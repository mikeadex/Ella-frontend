import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContainer from './AuthContainer';
import AuthButton from './AuthButton';
import axios from 'axios';

const EmailConfirmation = () => {
  const { key } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('confirming');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        await axios.post(`/api/auth/registration/account-confirm-email/${key}/`);
        setStatus('success');
      } catch (error) {
        setStatus('error');
      }
    };

    if (key) {
      confirmEmail();
    }
  }, [key]);

  const getContent = () => {
    switch (status) {
      case 'confirming':
        return {
          title: 'Confirming Your Email',
          message: 'Please wait while we confirm your email address...',
        };
      case 'success':
        return {
          title: 'Email Confirmed!',
          message: 'Thank you for confirming your email address. Your registration is now complete.',
          alert: {
            type: 'success',
            message: 'Your email has been successfully verified.',
          },
        };
      case 'error':
        return {
          title: 'Confirmation Error',
          message: 'There was a problem confirming your email address.',
          alert: {
            type: 'error',
            message: 'This email confirmation link is invalid or has expired. Please request a new confirmation email.',
          },
        };
      default:
        return {};
    }
  };

  const content = getContent();

  return (
    <AuthContainer
      title={content.title}
      message={content.message}
      alert={content.alert}
    >
      <div>
        <AuthButton onClick={() => navigate('/')}>
          Go to Dashboard
        </AuthButton>
        {status === 'error' && (
          <AuthButton
            secondary
            onClick={() => navigate('/auth/resend-confirmation')}
          >
            Request New Confirmation
          </AuthButton>
        )}
      </div>
    </AuthContainer>
  );
};

export default EmailConfirmation;
