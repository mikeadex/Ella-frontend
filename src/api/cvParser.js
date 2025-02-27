import axios from 'axios';

const BASE_URL = '/api/cv_parser';

const uploadDocument = async (file) => {
  // Get token from the same storage locations as AuthContext
  const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  
  if (!token) {
    throw new Error('Please log in to upload files');
  }

  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post(`${BASE_URL}/parse_document/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error.response?.data || error.message);
    if (error.response?.data?.detail === 'Given token not valid for any token type') {
      // Token is invalid, user needs to log in again
      localStorage.removeItem('access_token');
      sessionStorage.removeItem('access_token');
      throw new Error('Your session has expired. Please log in again.');
    }
    throw error.response?.data || error.message;
  }
};

export { uploadDocument };