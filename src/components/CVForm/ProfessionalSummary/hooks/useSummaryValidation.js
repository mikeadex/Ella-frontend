import { useState, useCallback } from 'react';

const useSummaryValidation = (characterLimit = 2000) => {
  const [error, setError] = useState(null);

  const validateSummary = useCallback((summary) => {
    console.log('Validating summary:', summary);
    if (!summary?.trim()) {
      console.log('Summary is empty');
      setError('Professional summary is required');
      return false;
    }

    if (summary.length > characterLimit) {
      console.log('Summary exceeds character limit');
      setError(`Professional summary must be less than ${characterLimit} characters`);
      return false;
    }

    console.log('Summary validation passed');
    setError(null);
    return true;
  }, [characterLimit]);

  const clearError = useCallback(() => {
    console.log('Clearing validation error');
    setError(null);
  }, []);

  return {
    error,
    validateSummary,
    clearError
  };
};

export default useSummaryValidation;
