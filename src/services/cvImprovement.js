import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

class CVImprovementService {
    constructor() {
        this.client = axios.create({
            baseURL: `${API_BASE_URL}/cv`,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Analyze CV content
    async analyzeCv(cvData) {
        try {
            const response = await this.client.post('/analyze', cvData);
            return response.data;
        } catch (error) {
            console.error('Error analyzing CV:', error);
            throw error;
        }
    }

    // Improve specific section
    async improveSection(section, content, level = 'minimal') {
        try {
            const response = await this.client.post('/improve/section', {
                section,
                content,
                level
            });
            return response.data;
        } catch (error) {
            console.error('Error improving section:', error);
            throw error;
        }
    }

    // Complete CV review
    async reviewCv(cvData) {
        try {
            const response = await this.client.post('/review', cvData);
            return response.data;
        } catch (error) {
            console.error('Error reviewing CV:', error);
            throw error;
        }
    }
}

export const cvImprovementService = new CVImprovementService();
