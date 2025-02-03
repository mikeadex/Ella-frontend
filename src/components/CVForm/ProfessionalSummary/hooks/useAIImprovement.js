import { useState, useEffect } from 'react';
import { cvImprovementService } from '../../../../services/cvImprovement';

const useAIImprovement = () => {
  const [improving, setImproving] = useState(false);
  const [improvedSummary, setImprovedSummary] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const improveSummary = async (summary) => {
    if (!summary?.trim()) {
      setError('Please write a summary first before improving.');
      return;
    }

    setImproving(true);
    setProgress(0);
    setError(null);
    setImprovedSummary(''); // Clear any previous improved summary

    try {
      console.log('useAIImprovement: Starting improvement with summary:', summary);
      
      // Start progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + 10, 90);
          console.log('useAIImprovement: Progress updated:', newProgress);
          return newProgress;
        });
      }, 500);

      const response = await cvImprovementService.improveSummary(summary);
      clearInterval(progressInterval);
      
      console.log('useAIImprovement: Service response:', response);
      
      if (!response?.improved) {
        throw new Error('No improved content received');
      }

      // Set final progress and improved summary
      setProgress(100);
      setImprovedSummary(response.improved);
      console.log('useAIImprovement: States updated:', {
        progress: 100,
        improvedSummary: response.improved
      });
    } catch (err) {
      console.error('useAIImprovement: Error improving summary:', err);
      setError('Failed to improve summary. Please try again.');
    } finally {
      setImproving(false);
    }
  };

  // Debug effects
  useEffect(() => {
    console.log('useAIImprovement: improvedSummary changed:', improvedSummary);
  }, [improvedSummary]);

  useEffect(() => {
    console.log('useAIImprovement: progress changed:', progress);
  }, [progress]);

  useEffect(() => {
    console.log('useAIImprovement: improving changed:', improving);
  }, [improving]);

  const resetImprovement = () => {
    setImprovedSummary('');
    setProgress(0);
    setError(null);
  };

  return {
    improving,
    improvedSummary,
    progress,
    error,
    improveSummary,
    resetImprovement
  };
};

export default useAIImprovement;
