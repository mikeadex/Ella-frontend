import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { Box, Typography, Card, CardContent, Button, Chip, CircularProgress, Alert } from '@mui/material';
import { WorkOutline, LocationOn, BusinessCenter, Score } from '@mui/icons-material';

const JobRecommendations = ({ onJobSelect }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/jobstract/opportunities/recommended/');
      setRecommendations(response.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Create a CV to get personalized job recommendations');
      } else {
        setError('Failed to fetch recommendations. Please try again later.');
      }
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Posted yesterday';
    if (diffDays < 7) return `Posted ${diffDays} days ago`;
    if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
    return `Posted ${Math.floor(diffDays / 30)} months ago`;
  };

  const handleApply = (applicationUrl) => {
    window.open(applicationUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-white">
            Recommended for You
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-[rgba(251,251,253,0.8)] dark:bg-black/80 backdrop-blur-[50px] rounded-lg p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 dark:bg-[#1d1d1f] rounded w-3/4 mb-4" />
              <div className="h-3 bg-gray-200 dark:bg-[#1d1d1f] rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-[#1d1d1f] rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="h-5 w-5 text-yellow-400" />
          <h2 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            {error}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <SparklesIcon className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-[#1d1d1f] dark:text-white">
          Recommended for You
        </h2>
      </div>
      {recommendations.length === 0 ? (
        <Alert severity="info">
          No job recommendations yet. Make sure your CV is up to date with your skills and experience!
        </Alert>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {recommendations.map((job) => (
            <div
              key={job.id}
              className="bg-[rgba(251,251,253,0.8)] dark:bg-black/80 backdrop-blur-[50px] hover:bg-white/90 dark:hover:bg-black/60 rounded-lg p-6 transition-all duration-200 border border-gray-200 dark:border-[#1d1d1f] cursor-pointer"
              onClick={() => onJobSelect(job)}
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-[#1d1d1f] dark:text-white">
                    {job.title}
                  </h3>
                  <span className="text-xs text-[#424245] dark:text-gray-400">
                    {formatDate(job.date_posted)}
                  </span>
                </div>
                <p className="text-sm text-[#424245] dark:text-gray-400 mb-2">
                  {job.employer.employer_name}
                  {job.location && (
                    <span className="ml-2 text-[#424245] dark:text-gray-400">
                      • {job.location}
                    </span>
                  )}
                </p>
                {job.salary_range && (
                  <p className="text-sm text-[#424245] dark:text-gray-400 mb-2">
                    {job.salary_range}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {job.mode && (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-500/10 text-indigo-400">
                      {job.mode}
                    </span>
                  )}
                  {job.time_commitment && (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-500/10 text-green-400">
                      {job.time_commitment}
                    </span>
                  )}
                  {job.experience_level && (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-500/10 text-yellow-400">
                      {job.experience_level}
                    </span>
                  )}
                  {job.matching_score && (
                    <Chip
                      icon={<Score />}
                      label={`${job.matching_score}% Match`}
                      color="primary"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </div>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleApply(job.application_url)}
                    disabled={!job.application_url}
                  >
                    Apply Now
                  </Button>
                </Box>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobRecommendations;
