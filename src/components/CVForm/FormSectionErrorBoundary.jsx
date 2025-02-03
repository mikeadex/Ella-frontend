import React from 'react';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { useCVForm } from '../../context/CVFormContext';

const FormSectionErrorBoundary = ({ sectionKey, children }) => {
  const { clearErrors } = useCVForm();

  const handleRetry = () => {
    // Clear any form errors for this section when retrying
    clearErrors(sectionKey);
  };

  return (
    <ErrorBoundary
      fallbackMessage={`We encountered an error in the ${sectionKey} section. Please try again.`}
      onRetry={handleRetry}
      showError={process.env.NODE_ENV === 'development'}
    >
      {children}
    </ErrorBoundary>
  );
};

export default FormSectionErrorBoundary;
