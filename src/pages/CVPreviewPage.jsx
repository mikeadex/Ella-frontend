import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Alert } from '@mui/material';
import CVPreview from '../components/CVForm/CVPreview';
import axiosInstance from '../api/axios';
import {transformCVData} from '../utils/transformCVData';

// Use VITE_API_URL since it's already defined
const API_BASE_URL = import.meta.env.VITE_API_URL;

const CVPreviewPage = () => {
  const { id: cvId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cvData, setCvData] = useState(null);

  useEffect(() => {
    const fetchCvData = async () => {
      try {
        setLoading(true);
        // Get the auth token from localStorage
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const response = await axiosInstance.get(`/api/cv_writer/cv/${cvId}/detail/`);
        console.log("Raw CV Data:", response.data);
        const transformedData = transformCVData(response.data);
        console.log("Transformed CV Data:", transformedData);
        console.log("Profile Info", transformedData?.profile);
        setCvData(transformedData);
      } catch (error) {
        console.error('Error fetching CV data:', error);
        const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message;
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (cvId) {
      fetchCvData();
    }
  }, [cvId]);

  return <CVPreview cvData={cvData} loading={loading} error={error} />;
};

export default CVPreviewPage;
