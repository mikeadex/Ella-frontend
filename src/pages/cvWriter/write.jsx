import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axiosInstance from "../../api/axios";
import CVFormContainer from "../../components/CVForm/CVFormContainer";
import Navbar from "../../components/Navbar/Navbar";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 5rem;
  padding: 5rem 1rem 2rem;

  @media (min-width: 640px) {
    padding: 5rem 1.5rem 2rem;
  }
`;

const Header = styled.div`
  margin: 1rem 0 2rem;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  &::after {
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 0;
    right: 0;
    height: 1px;
    background: ${props => props.isDark 
      ? 'linear-gradient(to right, rgba(250, 204, 21, 0.2), transparent)'
      : 'linear-gradient(to right, rgba(59, 130, 246, 0.1), transparent)'
    };
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${props => props.isDark ? '#fbbf24' : 'var(--text-color)'};
  
  &::before {
    content: '';
    display: inline-block;
    width: 3px;
    height: 1.25rem;
    background: ${props => props.isDark
      ? 'linear-gradient(to bottom, #fbbf24, #f59e0b)'
      : 'linear-gradient(to bottom, #3b82f6, #1d4ed8)'
    };
    border-radius: 2px;
  }
`;

const SubTitle = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${props => props.isDark ? 'rgba(250, 204, 21, 0.6)' : 'var(--text-secondary)'};
  font-weight: 400;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingText = styled.div`
  color: white;
  font-size: 1.2rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.7);
  padding: 1rem 2rem;
  border-radius: 0.5rem;
`;

function Write() {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();  // Get user from auth context
  const { isDark } = useTheme();
  const { id } = useParams();  // Get CV ID from URL if it exists
  const [existingCV, setExistingCV] = useState(null);
  const [initialFormData, setInitialFormData] = useState(null);
  const [loadingExistingCV, setLoadingExistingCV] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Helper function to format dates to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // Helper function to convert proficiency (1-5) to skill level
  const proficiencyToLevel = (proficiency) => {
    const levels = {
      1: "Beginner",
      2: "Elementary",
      3: "Intermediate",
      4: "Advanced",
      5: "Expert",
    };
    return levels[proficiency] || "Intermediate";
  };

  // Load existing CV data if we have an ID
  useEffect(() => {
    const fetchExistingCV = async () => {
      if (!id) return; // No ID to load
      
      try {
        setLoadingExistingCV(true);
        setLoadError(null);
        setLoadingMessage("Loading your CV...");
        
        console.log(`Loading CV with ID: ${id}`);
        
        // Use validateStatus to prevent axios from throwing on 404
        const response = await axiosInstance.get(`/api/cv_writer/cv/${id}/`, {
          validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500
          }
        });
        
        // Check if the CV was found
        if (response.status === 404) {
          setLoadError(`CV with ID ${id} not found. This CV might have been deleted or doesn't exist.`);
          console.error(`CV with ID ${id} not found`);
          return;
        }
        
        console.log('Loaded CV data:', response.data);
        setExistingCV(response.data);
        
        try {
          // Also load related data (experience, education, skills, etc.)
          const [
            experienceRes,
            educationRes,
            skillsRes,
            certificationsRes,
            summaryRes,
            interestsRes,
            languagesRes,
            referencesRes,
            socialMediaRes
          ] = await Promise.all([
            axiosInstance.get(`/api/cv_writer/experience/?cv=${id}`),
            axiosInstance.get(`/api/cv_writer/education/?cv=${id}`),
            axiosInstance.get(`/api/cv_writer/skill/?user=${user.pk || user.id}`),
            axiosInstance.get(`/api/cv_writer/certification/?user=${user.pk || user.id}`),
            axiosInstance.get(`/api/cv_writer/professional-summary/?cv=${id}`),
            axiosInstance.get(`/api/cv_writer/interest/?user=${user.pk || user.id}`),
            axiosInstance.get(`/api/cv_writer/language/?user=${user.pk || user.id}`),
            axiosInstance.get(`/api/cv_writer/reference/?cv=${id}`),
            axiosInstance.get(`/api/cv_writer/social-media/?cv=${id}`)
          ]);
          
          // Convert data to the format expected by the CV Form
          const initialData = {
            personalInfo: {
              firstName: response.data.first_name || '',
              lastName: response.data.last_name || '',
              email: response.data.email || '',
              phone: response.data.contact_number || '',
              address: response.data.address || '',
              city: response.data.city || '',
              country: response.data.country || '',
              title: response.data.title || '',
              description: response.data.description || '',
              additional_information: response.data.additional_information || ''
            },
            experience: experienceRes.data.map(exp => ({
              company_name: exp.company_name,
              job_title: exp.job_title,
              start_date: exp.start_date,
              end_date: exp.end_date,
              current: !exp.end_date,
              job_description: exp.job_description,
              achievements: exp.achievements,
              employment_type: exp.employment_type,
              location: exp.location
            })),
            education: educationRes.data.map(edu => ({
              institution_name: edu.institution_name,
              degree: edu.degree,
              field_of_study: edu.field_of_study,
              start_date: edu.start_date,
              end_date: edu.end_date,
              current: !edu.end_date,
              gpa: edu.gpa,
              description: edu.description
            })),
            skills: skillsRes.data.map(skill => ({
              name: skill.skill_name,
              level: skill.skill_level
            })),
            certifications: certificationsRes.data.map(cert => ({
              certificate_name: cert.certificate_name,
              certificate_date: cert.certificate_date,
              credential_id: cert.certificate_link
            })),
            professionalSummary: summaryRes.data.length > 0 ? summaryRes.data[0].summary : '',
            interests: interestsRes.data.map(interest => ({
              name: interest.name
            })),
            languages: languagesRes.data.map(lang => ({
              name: lang.language_name,
              level: lang.language_level
            })),
            reference: referencesRes.data.map(ref => ({
              name: ref.name,
              title: ref.title,
              company: ref.company,
              email: ref.email,
              phone: ref.phone,
              reference_type: ref.reference_type
            })),
            socialMedia: socialMediaRes.data.map(social => ({
              platform: social.platform,
              url: social.url
            }))
          };
          
          console.log('Initial form data:', initialData);
          setInitialFormData(initialData);
        } catch (dataError) {
          console.error('Error loading CV related data:', dataError);
          setLoadError(`Error loading CV sections: ${dataError.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error loading CV:', error);
        setLoadError(error.message || 'Failed to load CV data');
      } finally {
        setLoadingExistingCV(false);
        setLoadingMessage('');
      }
    };
    
    fetchExistingCV();
  }, [id, user]);

  const createCV = async (formData) => {
    setLoading(true);
    setLoadingMessage("Processing your CV...");
    try {
      // Check if we have a token and user
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found');
        navigate('/login');
        return;
      }

      if (!user) {
        console.error('No user found');
        navigate('/login');
        return;
      }

      console.log('Current user:', user);
      console.log('Is editing:', Boolean(id));
      console.log('Form data to process:', formData);

      // Extract personal information from nested structure
      const personalInfo = {
        first_name: formData.personalInfo.firstName || user.username,
        last_name: formData.personalInfo.lastName || user.username,
        email: formData.personalInfo.email || user.email,
        address: formData.personalInfo.address || 'Not provided',
        city: formData.personalInfo.city || 'Not specified',
        country: formData.personalInfo.country || 'Not specified',
        contact_number: formData.personalInfo.phone || 'Not provided',
        user: user.pk || user.id,
        
        // Add default values for optional fields
        title: formData.personalInfo.title || 'Professional CV',
        description: formData.personalInfo.description || 'My professional profile',
        status: 'draft',
        visibility: 'private',
      };

      // Only add additional_information if it exists and is not empty
      if (formData.personalInfo.additional_information && formData.personalInfo.additional_information.trim()) {
        personalInfo.additional_information = formData.personalInfo.additional_information;
      }

      console.log('Sending personal info:', personalInfo);
      
      // Determine if we're editing or creating
      let cvId = id;
      
      if (id) {
        // We're editing an existing CV
        setLoadingMessage("Updating your CV information...");
        try {
          // Update the existing CV
          const updateResponse = await axiosInstance.put(`/api/cv_writer/cv/${id}/`, personalInfo);
          console.log('CV Update Response:', updateResponse.data);
          
          // Clear existing data for this CV
          await Promise.all([
            axiosInstance.delete(`/api/cv_writer/education/clear/?cv=${id}`),
            axiosInstance.delete(`/api/cv_writer/experience/clear/?cv=${id}`),
            axiosInstance.delete(`/api/cv_writer/reference/clear/?cv=${id}`),
            axiosInstance.delete(`/api/cv_writer/professional-summary/clear/?cv=${id}`),
            axiosInstance.delete(`/api/cv_writer/social-media/clear/?cv=${id}`)
          ]);
        } catch (error) {
          console.error('Error updating CV:', error.response?.data || error.message);
          throw error;
        }
      } else {
        // We're creating a new CV
        try {
          // First, try to get the user's existing CV
          const existingCVs = await axiosInstance.get("/api/cv_writer/cv/");
          console.log('Existing CVs:', existingCVs.data);
          
          if (existingCVs.data && existingCVs.data.length > 0) {
            // Use the first CV found
            const existingCV = existingCVs.data[0];
            cvId = existingCV.id;
            console.log('Using existing CV with ID:', cvId);
            
            // Merge existing data with new data, prioritizing new data where it exists
            const updatedPersonalInfo = {
              ...existingCV,
              ...personalInfo,
              // Ensure we don't override existing name if new values are undefined
              first_name: personalInfo.first_name || existingCV.first_name,
              last_name: personalInfo.last_name || existingCV.last_name,
            };
            
            // Update the existing CV
            const updateResponse = await axiosInstance.put(`/api/cv_writer/cv/`, updatedPersonalInfo);
            console.log('CV Update Response:', updateResponse.data);
          } else {
            // Create a new CV
            const createResponse = await axiosInstance.post("/api/cv_writer/cv/", personalInfo);
            console.log('CV Create Response:', createResponse.data);
            
            // Try to get the CV ID from the response or fetch it again
            if (createResponse.data && createResponse.data.id) {
              cvId = createResponse.data.id;
            } else {
              // If we didn't get the ID in the response, fetch the CV list again
              const newCVs = await axiosInstance.get("/api/cv_writer/cv/");
              if (newCVs.data && newCVs.data.length > 0) {
                cvId = newCVs.data[0].id;
              } else {
                throw new Error('Could not get CV ID after creation');
              }
            }
            console.log('Created new CV with ID:', cvId);
          }
        } catch (error) {
          console.error('Error managing CV:', error.response?.data || error.message);
          throw error;
        }
      }

      if (!cvId) {
        throw new Error('Failed to get CV ID');
      }

      setLoadingMessage("Adding education details...");
      if (formData.education && formData.education.length > 0) {
        for (const edu of formData.education) {
          const educationData = {
            ...edu,
            cv: cvId,
            user: user.pk || user.id,
            start_date: formatDate(edu.start_date),
            end_date: edu.current ? null : formatDate(edu.end_date),
          };
          console.log('Sending education data:', educationData);
          const eduResponse = await axiosInstance.post("/api/cv_writer/education/", educationData);
          console.log('Education response:', eduResponse);
        }
      }

      setLoadingMessage("Adding work experience...");
      if (formData.experience && formData.experience.length > 0) {
        for (const exp of formData.experience) {
          const experienceData = {
            ...exp,
            cv: cvId,
            user: user.pk || user.id,
            start_date: formatDate(exp.start_date),
            end_date: exp.current ? null : formatDate(exp.end_date),
            job_description: exp.job_description || "Not provided",
            achievements: exp.achievements || "Not provided",
            employment_type: exp.employment_type || "Full-time",
          };
          console.log('Sending experience data:', experienceData);
          const expResponse = await axiosInstance.post("/api/cv_writer/experience/", experienceData);
          console.log('Experience response:', expResponse);
        }
      }

      setLoadingMessage("Adding skills...");
      if (formData.skills && formData.skills.length > 0) {
        for (const skill of formData.skills) {
          const skillData = {
            skill_name: skill.name,
            skill_level: skill.level || 'Intermediate',
            user: user.pk || user.id,
          };
          console.log('Sending skill data:', skillData);
          const skillResponse = await axiosInstance.post("/api/cv_writer/skill/", skillData);
          console.log('Skill response:', skillResponse);
        }
      }

      setLoadingMessage("Adding certifications...");
      if (formData.certifications && formData.certifications.length > 0) {
        for (const cert of formData.certifications) {
          const certificationData = {
            certificate_name: cert.certificate_name || cert.name,
            certificate_date: formatDate(cert.certificate_date),
            certificate_link: cert.credential_id || null,
            user: user.pk || user.id,
          };
          console.log('Sending certification data:', certificationData);
          const certResponse = await axiosInstance.post("/api/cv_writer/certification/", certificationData);
          console.log('Certification response:', certResponse);
        }
      }

      setLoadingMessage("Adding professional summary...");
      if (formData.professionalSummary) {
        await axiosInstance.post("/api/cv_writer/professional-summary/", { 
          summary: formData.professionalSummary,
          cv: cvId,
          user: user.pk || user.id,
        });
      }

      setLoadingMessage("Adding interests...");
      if (formData.interests && formData.interests.length > 0) {
        for (const interest of formData.interests) {
          const interestData = { 
            name: interest.name,
            user: user.pk || user.id,
          };
          console.log('Sending interest data:', interestData);
          const interestResponse = await axiosInstance.post("/api/cv_writer/interest/", interestData);
          console.log('Interest response:', interestResponse);
        }
      }

      setLoadingMessage("Adding languages...");
      if (formData.languages && formData.languages.length > 0) {
        for (const lang of formData.languages) {
          const languageData = {
            language_name: lang.language || lang.name,
            language_level: lang.proficiency || lang.level,
            is_custom: true, // assuming custom languages can be added
            user: user.pk || user.id,
          };
          console.log('Sending language data:', languageData);
          const langResponse = await axiosInstance.post("/api/cv_writer/language/", languageData);
          console.log('Language response:', langResponse);
        }
      }

      setLoadingMessage("Adding references...");
      if (formData.reference && formData.reference.length > 0) {
        for (const ref of formData.reference) {
          const referenceData = {
            name: ref.name,
            title: ref.title,
            company: ref.company,
            email: ref.email,
            phone: ref.phone || "",
            reference_type: ref.reference_type || "Professional",
            cv: cvId,
            user: user.pk || user.id,
          };
          console.log('Sending reference data:', referenceData);
          const refResponse = await axiosInstance.post("/api/cv_writer/reference/", referenceData);
          console.log('Reference response:', refResponse);
        }
      }

      setLoadingMessage("Adding social media...");
      if (formData.socialMedia && formData.socialMedia.length > 0) {
        for (const social of formData.socialMedia) {
          try {
            // First try to get existing social media entry
            const existingResponse = await axiosInstance.get('/api/cv_writer/social-media/', {
              params: {
                platform: social.platform,
                user: user.pk || user.id
              }
            });

            const socialData = {
              platform: social.platform,
              url: social.url,
              cv: cvId,
              user: user.pk || user.id,
            };

            if (existingResponse.data && existingResponse.data.length > 0) {
              // Update existing entry
              const existingId = existingResponse.data[0].id;
              await axiosInstance.put(`/api/cv_writer/social-media/${existingId}/`, socialData);
            } else {
              // Create new entry
              await axiosInstance.post("/api/cv_writer/social-media/", socialData);
            }
          } catch (error) {
            console.error('Error managing social media:', error);
            // Continue with other social media entries even if one fails
          }
        }
      }

      // Start CV improvement process
      setLoadingMessage("Improving your CV with AI...");
      try {
        // First, ensure the CV exists
        const cvResponse = await axiosInstance.get(`/api/cv_writer/cv/${cvId}/`);
        console.log("CV data:", cvResponse.data);

        // Start the improvement process with specific sections
        const improvementResponse = await axiosInstance.post(`/api/cv_writer/cv/${cvId}/improve/`, {
          sections: [
            "professional_summary",
            "experience",
            "education",
            "skills"
          ],
          improvement_type: "enhance",
          tone: "professional"
        });
        console.log("CV improvement started:", improvementResponse.data);
        
        // Get improvement history to confirm it started
        const historyResponse = await axiosInstance.get(`/api/cv_writer/cv/${cvId}/improvement-history/`);
        console.log("CV improvement history:", historyResponse.data);
        
        // Navigate to preview page with success message
        navigate(`/cv-writer/preview/${cvId}`, { 
          state: { 
            message: "Your CV has been created and is being improved by AI. You'll be notified when the improvements are ready.",
            type: "success"
          }
        });
      } catch (error) {
        console.error("Error during CV improvement:", error);
        // Still navigate to preview, but with error message
        navigate(`/cv-writer/preview/${cvId}`, {
          state: {
            message: "Your CV was created but there was an error starting the AI improvement. You can try improving it later.",
            type: "error"
          }
        });
      }
    } catch (error) {
      console.error("Error creating CV:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <div>
      <Helmet>
        <title>{id ? 'Edit CV' : 'Create New CV'} | Ella CV Writer</title>
      </Helmet>
      <Navbar />
      <Container>
        <Header isDark={isDark}>
          <TitleWrapper>
            <Title isDark={isDark}>
              {id ? 'Edit Your CV' : 'Create New CV'}
            </Title>
            <SubTitle isDark={isDark}>
              {id ? 'Update your professional profile' : 'Fill in your details to generate your professional CV'}
            </SubTitle>
          </TitleWrapper>
        </Header>

        {/* Show loading state if loading existing CV */}
        {loadingExistingCV && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            margin: '3rem 0',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '50%',
              borderTop: `2px solid ${isDark ? '#fbbf24' : '#3b82f6'}`,
              borderBottom: `2px solid ${isDark ? '#fbbf24' : '#3b82f6'}`,
              animation: 'spin 1s linear infinite',
              marginBottom: '1rem'
            }} />
            <p>Loading your CV data...</p>
          </div>
        )}
        
        {/* Show error message if loading failed */}
        {loadError && !loadingExistingCV && (
          <div style={{
            backgroundColor: isDark ? 'rgba(220, 38, 38, 0.1)' : '#fee2e2',
            border: `1px solid ${isDark ? 'rgba(220, 38, 38, 0.3)' : '#f87171'}`,
            color: isDark ? '#f87171' : '#b91c1c',
            padding: '1rem',
            borderRadius: '0.5rem',
            margin: '1.5rem 0'
          }}>
            <strong style={{ fontWeight: 'bold' }}>Error!</strong>
            <span style={{ marginLeft: '0.5rem' }}>{loadError}</span>
            <p style={{ marginTop: '0.5rem' }}>Please try again or return to the dashboard.</p>
            <div style={{ 
              display: 'flex', 
              gap: '0.75rem', 
              marginTop: '1rem',
              flexDirection: 'row',
              justifyContent: 'flex-start'
            }}>
              <button 
                onClick={() => navigate('/dashboard')}
                style={{
                  backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
                  border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                  borderRadius: '0.375rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  color: isDark ? '#e5e7eb' : '#1f2937',
                  cursor: 'pointer'
                }}
              >
                Go to Dashboard
              </button>
              <button 
                onClick={() => {
                  // Clear the id parameter
                  navigate('/cv-writer/create', { replace: true });
                  // Reload the page to clear state
                  window.location.reload();
                }}
                style={{
                  backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : '#d1fae5',
                  border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.3)' : '#6ee7b7'}`,
                  borderRadius: '0.375rem',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  color: isDark ? '#10b981' : '#047857',
                  cursor: 'pointer'
                }}
              >
                Create New CV Instead
              </button>
            </div>
          </div>
        )}
        
        {/* Only show form if not loading or if we have the data */}
        {(!id || (id && initialFormData && !loadingExistingCV)) && (
          <CVFormContainer 
            onSubmit={createCV} 
            initialValues={initialFormData}
            isEditing={Boolean(id)}
            isLoading={loading}
          />
        )}
      </Container>
      {loading && (
        <LoadingOverlay>
          <LoadingText>
            <div className="animate-spin mb-3 h-10 w-10 border-t-2 border-b-2 border-white rounded-full mx-auto"></div>
            {loadingMessage}
          </LoadingText>
        </LoadingOverlay>
      )}
    </div>
  );
}

export default Write;
