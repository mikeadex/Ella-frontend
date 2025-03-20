import axios from 'axios';
import { API_BASE_URL } from '../config';

class CVImprovementService {
    constructor() {
        this.baseUrl = `${API_BASE_URL}/api/ai_cv_parser`;
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
            
            return {
                improved: response.data.improved
            };
        } catch (error) {
            console.error('CVImprovementService: Error improving summary:', error);
            throw error;
        }
    }

    // Format CV data for backend
    formatCVData(data) {
        const cvData = data.cv_data.data || {};
        const personalInfo = cvData.personal_info || {};
        
        return {
            personal_info: {
                first_name: personalInfo.first_name || "",
                last_name: personalInfo.last_name || "",
                address: personalInfo.address || "",
                city: personalInfo.city || "",
                country: personalInfo.country || "",
                contact_number: personalInfo.contact_number || "",
                email: personalInfo.email || ""
            },
            title: cvData.title || "My CV",
            description: cvData.description || "",
            professional_summary: cvData.professional_summary || "",
            experience: Array.isArray(cvData.experience) ? cvData.experience.map(exp => ({
                job_title: exp.job_title || exp.title || "",
                company_name: exp.company || exp.company_name || "",
                location: exp.location || "",
                start_date: exp.start_date || "",
                end_date: exp.end_date || "",
                description: exp.description || exp.job_description || "",
                current: exp.current || false,
                employment_type: exp.employment_type || "Full-time"
            })) : [],
            education: Array.isArray(cvData.education) ? cvData.education.map(edu => ({
                school: edu.institution || edu.school || edu.school_name || "",
                degree: edu.degree || "",
                field: edu.field_of_study || edu.field || "",
                start_date: edu.start_date || "",
                end_date: edu.end_date || "",
                description: edu.description || edu.details || "",
                current: edu.current || false
            })) : [],
            skills: Array.isArray(cvData.skills) ? cvData.skills.map(skill => 
                typeof skill === 'string' ? {
                    name: skill,
                    level: "Intermediate",
                    category: "General"
                } : {
                    name: skill.name || skill.skill_name || "",
                    level: skill.level || skill.skill_level || "Intermediate",
                    category: skill.category || "General"
                }
            ) : [],
            languages: Array.isArray(cvData.languages) ? cvData.languages.map(lang =>
                typeof lang === 'string' ? {
                    language: lang,
                    proficiency: "Intermediate"
                } : {
                    language: lang.language || lang.name || "",
                    proficiency: lang.proficiency || lang.level || "Intermediate"
                }
            ) : [],
            certifications: Array.isArray(cvData.certifications) ? cvData.certifications.map(cert => ({
                name: cert.name || cert.certificate_name || "",
                issuer: cert.issuer || "",
                date: cert.date || cert.certificate_date || "",
                link: cert.link || cert.certificate_link || ""
            })) : [],
            additional_info: cvData.additional_info || cvData.additional_information || ""
        };
    }

    // Rewrite entire CV
    async rewriteCV(cvData) {
        try {
            // Format the data to match backend expectations
            const formattedData = {
                professional_summary: cvData.professional_summary || '',
                experience: Array.isArray(cvData.experience) ? cvData.experience.map(exp => ({
                    job_title: exp.job_title || '',
                    company_name: exp.company_name || '',
                    description: exp.description || ''
                })) : [],
                skills: cvData.skills || '',
                industry: 'technology' // Default industry
            };

            const response = await axios.post(
                `${this.baseUrl}/rewrite/`,
                { data: formattedData },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    },
                }
            );

            if (!response.data) {
                throw new Error('No data received from server');
            }

            return response.data;
        } catch (error) {
            console.error('Error rewriting CV:', error);
            throw new Error(error.response?.data?.error || 'Failed to rewrite CV. Please try again.');
        }
    }
}

export const cvImprovementService = new CVImprovementService();
export default cvImprovementService;
