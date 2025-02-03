import axiosInstance from '../api/axios';

class CVImprovementService {
    constructor(client = axiosInstance) {
        this.client = client;
    }

    // Improve summary specifically
    async improveSummary(summary) {
        try {
            console.log('CVImprovementService: Sending summary to improve:', summary);
            const response = await this.client.post('/api/cv_writer/cv/improve_summary/', {
                summary
            });
            console.log('CVImprovementService: Raw API response:', response);
            console.log('CVImprovementService: Response data:', response.data);
            
            // Return the improved summary directly from the response
            return {
                improved: response.data.improved
            };
        } catch (error) {
            console.error('CVImprovementService: Error improving summary:', error);
            throw error;
        }
    }
}

export const cvImprovementService = new CVImprovementService();
