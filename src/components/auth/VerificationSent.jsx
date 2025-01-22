import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContainer from './AuthContainer';
import AuthButton from './AuthButton';

const VerificationSent = () => {
  const navigate = useNavigate();

  return (
    <AuthContainer
      title="Verify Your Email Address"
      message="We have sent an email to verify your email address. Please check your inbox and click on the link to complete your registration."
      alert={{
        type: 'success',
        message: "If you don't receive the email within a few minutes, please check your spam folder.",
      }}
    >
      <div>
        <AuthButton onClick={() => navigate('/')}>
          Return to Home
        </AuthButton>
        <AuthButton
          secondary
          onClick={() => navigate('/auth/resend-confirmation')}
        >
          Resend Email
        </AuthButton>
      </div>
    </AuthContainer>
  );
};

export default VerificationSent;
