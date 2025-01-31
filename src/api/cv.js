import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/cv_writer';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

// Get auth token from localStorage
const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
});

export const fetchCVById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cv/${id}/detail/`, {
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
    const response = await axios.post(`${API_BASE_URL}/cv/`, cvData, {
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
    const response = await axios.put(`${API_BASE_URL}/cv/${id}/`, cvData, {
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
    const response = await axios.post(`${API_BASE_URL}/cv/${id}/improve/`, {}, {
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
    const response = await axios.get(`${API_BASE_URL}/professional-summary/${cvId}/`, {
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
    const response = await axios.get(`${API_BASE_URL}/experience/`, {
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
    const response = await axios.get(`${API_BASE_URL}/education/`, {
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
    const response = await axios.get(`${API_BASE_URL}/skill/`, {
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
    const response = await axios.get(`${API_BASE_URL}/language/`, {
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
    const response = await axios.get(`${API_BASE_URL}/certification/`, {
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
    const response = await axios.get(`${API_BASE_URL}/interest/`, {
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
    const response = await axios.get(`${API_BASE_URL}/social-media/`, {
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
    const response = await axios.get(`${API_BASE_URL}/reference/`, {
      headers: getAuthHeader(),
      params: { cv: cvId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching references:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch references');
  }
};
