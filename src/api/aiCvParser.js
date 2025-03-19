import api from '../api';

/**
 * Upload a CV document to the AI CV Parser for parsing
 * @param {File} file - CV document file (PDF, DOCX)
 * @returns {Promise<Object>} - Parsed CV data
 */
export const uploadCV = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/ai_cv_parser/parser/parse/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading document to AI CV Parser:', error);
    throw error;
  }
};

/**
 * Transfer parsed CV data to the CV Writer
 * @param {Object} parsedData - Parsed CV data from the AI CV Parser
 * @returns {Promise<Object>} - Response with CV Writer ID
 */
export const transferToWriter = async (parsedData) => {
  try {
    const response = await api.post('/api/ai_cv_parser/transfer-to-writer/', {
      parsed_data: parsedData
    });
    return response.data;
  } catch (error) {
    console.error('Error transferring data to CV Writer:', error);
    throw error;
  }
};

/**
 * Get a list of all parsed CVs for the user
 * @returns {Promise<Array>} - List of parsed CVs
 */
export const fetchParsedCVs = async () => {
  try {
    const response = await api.get('/api/ai_cv_parser/');
    return response.data;
  } catch (error) {
    console.error('Error fetching parsed CVs:', error);
    throw error;
  }
};

/**
 * Get a specific parsed CV by ID
 * @param {number} id - ID of the parsed CV
 * @returns {Promise<Object>} - Parsed CV data
 */
export const getParsedCV = async (id) => {
  try {
    const response = await api.get(`/api/ai_cv_parser/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching parsed CV with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Download the parsed data for a specific CV
 * @param {number} id - ID of the parsed CV
 * @returns {Promise<Object>} - Parsed CV data
 */
export const downloadParsedData = async (cvId) => {
  try {
    const response = await api.get(`/api/ai_cv_parser/${cvId}/download/`);
    return response.data;
  } catch (error) {
    console.error('Error downloading parsed data:', error);
    throw error;
  }
}; 