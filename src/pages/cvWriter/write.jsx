import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import CVFormContainer from "../../components/CVForm/CVFormContainer";
import styled from "styled-components";

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
      // Create personal information
      const personalInfo = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        contact_number: formData.contact_number,
      };

      // Only add additional_information if it exists and is not empty
      if (formData.additional_information && formData.additional_information.trim()) {
        personalInfo.additional_information = formData.additional_information;
      }

      const cvResponse = await api.post("cv_writer/writer/", personalInfo);

      if (cvResponse.status === 201) {
        const cvId = cvResponse.data.id;

        // Create education records
        if (formData.education && formData.education.length > 0) {
          for (const edu of formData.education) {
            const educationData = {
              ...edu,
              cv: cvId,
              start_date: formatDate(edu.start_date),
              end_date: edu.current ? null : formatDate(edu.end_date),
            };
            await api.post("cv_writer/education/", educationData);
          }
        }

        // Create experience records
        if (formData.experience && formData.experience.length > 0) {
          for (const exp of formData.experience) {
            const experienceData = {
              ...exp,
              cv: cvId,
              start_date: formatDate(exp.start_date),
              end_date: exp.current ? null : formatDate(exp.end_date),
              job_description: exp.job_description || "Not provided",
              achievements: exp.achievements || "Not provided",
              employment_type: exp.employment_type || "Full-time",
            };
            await api.post("cv_writer/experience/", experienceData);
          }
        }

        // Create skills records
        if (formData.skill && formData.skill.length > 0) {
          for (const skill of formData.skill) {
            const skillData = {
              skill_name: skill.name,
              skill_level: proficiencyToLevel(skill.proficiency),
              cv: cvId,
            };
            await api.post("cv_writer/skill/", skillData);
          }
        }

        // Create certification records
        if (formData.certification && formData.certification.length > 0) {
          for (const cert of formData.certification) {
            const certificationData = {
              certificate_name: cert.certification_name,
              certificate_date: formatDate(cert.certification_date),
              certificate_link: cert.certification_link,
              cv: cvId,
            };
            await api.post("cv_writer/certification/", certificationData);
          }
        }

        // Create professional summary records
        if (formData.professionalSummary && formData.professionalSummary.length > 0) {
          for (const proSum of formData.professionalSummary) {
            await api.post("cv_writer/professional-summary/", { ...proSum, cv: cvId });
          }
        }

        // Create interest records
        if (formData.interest && formData.interest.length > 0) {
          for (const intr of formData.interest) {
            await api.post("cv_writer/interest/", { ...intr, cv: cvId });
          }
        }

        // Create language records
        if (formData.language && formData.language.length > 0) {
          for (const lang of formData.language) {
            await api.post("cv_writer/language/", {
              language_name: lang.name,
              language_level: lang.level || "Basic",
              cv: cvId,
            });
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
              reference_type: ref.reference_type,
              cv: cvId,
            };
            await api.post("cv_writer/reference/", referenceData);
          }
        }

        // Create social media records
        if (formData.socialMedia && formData.socialMedia.length > 0) {
          for (const social of formData.socialMedia) {
            await api.post("cv_writer/social-media/", { ...social, cv: cvId });
          }
        }

        console.log("CV created successfully!");
        navigate("/"); // Redirect to home page after successful creation
      }
    } catch (error) {
      console.error("Error creating CV:", error.response?.data || error.message);
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
