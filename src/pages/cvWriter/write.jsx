import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const createCV = async (formData) => {
    setLoading(true);
    setLoadingMessage("Creating your CV...");
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

      // Extract personal information from nested structure
      const personalInfo = {
        first_name: formData.personalInfo.first_name,
        last_name: formData.personalInfo.last_name,
        email: formData.personalInfo.email || '',
        address: formData.personalInfo.address,
        city: formData.personalInfo.city,
        country: formData.personalInfo.country,
        contact_number: formData.personalInfo.contact_number,
        user: user.pk || user.id,
      };

      // Only add additional_information if it exists and is not empty
      if (formData.personalInfo.additional_information && formData.personalInfo.additional_information.trim()) {
        personalInfo.additional_information = formData.personalInfo.additional_information;
      }

      console.log('Sending personal info:', personalInfo);
      
      // First, try to get the user's existing CV
      let cvId;
      try {
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
            skill_level: proficiencyToLevel(skill.proficiency),
            cv: cvId,
            user: user.pk || user.id,
          };
          console.log('Sending skill data:', skillData);
          const skillResponse = await axiosInstance.post("/api/cv_writer/skill/", skillData);
          console.log('Skill response:', skillResponse);
        }
      }

      setLoadingMessage("Adding certifications...");
      if (formData.certification && formData.certification.length > 0) {
        for (const cert of formData.certification) {
          const certificationData = {
            certificate_name: cert.name,
            issuer: cert.issuer,
            certificate_date: formatDate(cert.issueDate),
            expiry_date: cert.expiryDate ? formatDate(cert.expiryDate) : null,
            credential_id: cert.credentialId || '',
            cv: cvId,
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
            cv: cvId,
            user: user.pk || user.id,
          };
          console.log('Sending interest data:', interestData);
          const interestResponse = await axiosInstance.post("/api/cv_writer/interest/", interestData);
          console.log('Interest response:', interestResponse);
        }
      }

      setLoadingMessage("Adding languages...");
      if (formData.language && formData.language.length > 0) {
        for (const lang of formData.language) {
          const languageData = {
            language_name: lang.name,
            language_level: lang.level || "Basic",
            cv: cvId,
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
    <>
      <Navbar />
      <Container>
        {loading && (
          <LoadingOverlay>
            <LoadingText>{loadingMessage}</LoadingText>
          </LoadingOverlay>
        )}
        <Header isDark={isDark}>
          <TitleWrapper>
            <Title isDark={isDark}>Create your CV</Title>
            <SubTitle isDark={isDark}>Fill in your details to generate your professional CV</SubTitle>
          </TitleWrapper>
        </Header>
        <CVFormContainer onCVCreated={createCV} isLoading={loading} />
      </Container>
    </>
  );
}

export default Write;
