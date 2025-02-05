import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE_URL = `${BASE_URL}/api/cv_writer`;

const cvApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Get auth token from localStorage
const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
});

export const fetchCVById = async (id) => {
  try {
    const response = await cvApi.get(`cv/${id}/detail/`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching CV:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch CV');
  }
};

export const createCV = async (cvData) => {
  try {
    const response = await cvApi.post('cv/', cvData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating CV:', error);
    throw new Error(error.response?.data?.error || 'Failed to create CV');
  }
};

export const updateCV = async (id, cvData) => {
  try {
    const response = await cvApi.put(`cv/${id}/`, cvData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating CV:', error);
    throw new Error(error.response?.data?.error || 'Failed to update CV');
  }
};

export const improveCV = async (id) => {
  try {
    const response = await cvApi.post(`cv/${id}/improve/`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error improving CV:', error);
    throw new Error(error.response?.data?.error || 'Failed to improve CV');
  }
};

// Fetch CV sections
export const fetchProfessionalSummary = async (cvId) => {
  try {
    const response = await cvApi.get(`professional-summary/${cvId}/`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching professional summary:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch professional summary');
  }
};

export const fetchExperiences = async (cvId) => {
  try {
    const response = await cvApi.get('experience/', {
      headers: getAuthHeader(),
      params: { cv: cvId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching experiences:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch experiences');
  }
};

export const fetchEducation = async (cvId) => {
  try {
    const response = await cvApi.get('education/', {
      headers: getAuthHeader(),
      params: { cv: cvId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching education:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch education');
  }
};

export const fetchSkills = async (cvId) => {
  try {
    const response = await cvApi.get('skill/', {
      headers: getAuthHeader(),
      params: { cv: cvId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching skills:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch skills');
  }
};

export const fetchLanguages = async (cvId) => {
  try {
    const response = await cvApi.get('language/', {
      headers: getAuthHeader(),
      params: { cv: cvId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching languages:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch languages');
  }
};

export const fetchCertifications = async (cvId) => {
  try {
    const response = await cvApi.get('certification/', {
      headers: getAuthHeader(),
      params: { cv: cvId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching certifications:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch certifications');
  }
};

export const fetchInterests = async (cvId) => {
  try {
    const response = await cvApi.get('interest/', {
      headers: getAuthHeader(),
      params: { cv: cvId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching interests:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch interests');
  }
};

export const fetchSocialMedia = async (cvId) => {
  try {
    const response = await cvApi.get('social-media/', {
      headers: getAuthHeader(),
      params: { cv: cvId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching social media:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch social media');
  }
};

export const fetchReferences = async (cvId) => {
  try {
    const response = await cvApi.get('reference/', {
      headers: getAuthHeader(),
      params: { cv: cvId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching references:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch references');
  }
};
