import api from './api';

const BASE_URL = '/api/linkedin/profiles';

export const linkedInService = {
    // Get user's LinkedIn profile
    getProfile: async (id = '') => {
        const response = await api.get(`${BASE_URL}/${id}`);
        return response.data;
    },

    // Sync LinkedIn profile
    syncProfile: async (profileId) => {
        const response = await api.post(`${BASE_URL}/${profileId}/sync_profile/`);
        return response.data;
    },

    // Get education history
    getEducation: async (profileId) => {
        const response = await api.get(`${BASE_URL}/${profileId}/education/`);
        return response.data;
    },

    // Get work experience
    getExperience: async (profileId) => {
        const response = await api.get(`${BASE_URL}/${profileId}/experience/`);
        return response.data;
    },

    // Get skills
    getSkills: async (profileId) => {
        const response = await api.get(`${BASE_URL}/${profileId}/skills/`);
        return response.data;
    },

    // Get certifications
    getCertifications: async (profileId) => {
        const response = await api.get(`${BASE_URL}/${profileId}/certifications/`);
        return response.data;
    },

    // Get languages
    getLanguages: async (profileId) => {
        const response = await api.get(`${BASE_URL}/${profileId}/languages/`);
        return response.data;
    },

    // Generate CV from LinkedIn data
    generateCV: async (profileId) => {
        const response = await api.post(`${BASE_URL}/${profileId}/generate_cv/`);
        return response.data;
    },

    // Connect LinkedIn profile (OAuth)
    connectProfile: async (code) => {
        const response = await api.post(`${BASE_URL}/connect/`, { code });
        return response.data;
    },
};
