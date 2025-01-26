import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import CVFormContainer from "../../components/CVForm/CVFormContainer";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  color: var(--text-color);
  margin: 0;
`;

function Write() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();  // Get user from auth context

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
        const existingCVs = await api.get("/cv_writer/cv/");
        console.log('Existing CVs:', existingCVs.data);
        
        if (existingCVs.data && existingCVs.data.length > 0) {
          // Use the first CV found
          cvId = existingCVs.data[0].id;
          console.log('Using existing CV with ID:', cvId);
          
          // Update the existing CV
          const updateResponse = await api.put(`/cv_writer/cv/${cvId}/`, personalInfo);
          console.log('CV Update Response:', updateResponse.data);
        } else {
          // Create a new CV
          const createResponse = await api.post("/cv_writer/cv/", personalInfo);
          console.log('CV Create Response:', createResponse.data);
          
          // Try to get the CV ID from the response or fetch it again
          if (createResponse.data && createResponse.data.id) {
            cvId = createResponse.data.id;
          } else {
            // If we didn't get the ID in the response, fetch the CV list again
            const newCVs = await api.get("/cv_writer/cv/");
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

      // Create education records
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
          const eduResponse = await api.post("/cv_writer/education/", educationData);
          console.log('Education response:', eduResponse);
        }
      }

      // Create experience records
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
          const expResponse = await api.post("/cv_writer/experience/", experienceData);
          console.log('Experience response:', expResponse);
        }
      }

      // Create skills records
      if (formData.skills && formData.skills.length > 0) {
        for (const skill of formData.skills) {
          const skillData = {
            skill_name: skill.name,
            skill_level: proficiencyToLevel(skill.proficiency),
            cv: cvId,
            user: user.pk || user.id,
          };
          console.log('Sending skill data:', skillData);
          const skillResponse = await api.post("/cv_writer/skill/", skillData);
          console.log('Skill response:', skillResponse);
        }
      }

      // Create certification records
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
          const certResponse = await api.post("/cv_writer/certification/", certificationData);
          console.log('Certification response:', certResponse);
        }
      }

      // Create professional summary records
      if (formData.professionalSummary) {
        await api.post("/cv_writer/professional-summary/", { 
          summary: formData.professionalSummary,
          cv: cvId,
          user: user.pk || user.id,
        });
      }

      // Create interest records
      if (formData.interests && formData.interests.length > 0) {
        for (const interest of formData.interests) {
          const interestData = { 
            name: interest.name,
            cv: cvId,
            user: user.pk || user.id,
          };
          console.log('Sending interest data:', interestData);
          const interestResponse = await api.post("/cv_writer/interest/", interestData);
          console.log('Interest response:', interestResponse);
        }
      }

      // Create language records
      if (formData.language && formData.language.length > 0) {
        for (const lang of formData.language) {
          const languageData = {
            language_name: lang.name,
            language_level: lang.level || "Basic",
            cv: cvId,
            user: user.pk || user.id,
          };
          console.log('Sending language data:', languageData);
          const langResponse = await api.post("/cv_writer/language/", languageData);
          console.log('Language response:', langResponse);
        }
      }

      // Create reference records
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
          const refResponse = await api.post("/cv_writer/reference/", referenceData);
          console.log('Reference response:', refResponse);
        }
      }

      // Create social media records
      if (formData.socialMedia && formData.socialMedia.length > 0) {
        for (const social of formData.socialMedia) {
          const socialData = {
            platform: social.platform,
            url: social.url,
            cv: cvId,
            user: user.pk || user.id,
          };
          console.log('Sending social media data:', socialData);
          const socialResponse = await api.post("/cv_writer/social-media/", socialData);
          console.log('Social media response:', socialResponse);
        }
      }

      console.log("CV created successfully!");
      navigate("/"); // Redirect to home page after successful creation
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
    }
  };

  return (
    <Container>
      <Header>
        <Title>Create Your CV</Title>
      </Header>

      <CVFormContainer onCVCreated={createCV} isLoading={loading} />
    </Container>
  );
}

export default Write;
