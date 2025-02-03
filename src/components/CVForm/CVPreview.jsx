import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import DOMPurify from 'dompurify';
import { modernTheme } from '../../styles/theme/modern';
import { Container } from '../modern/Layout/Container';
import { ModernHeader } from '../modern/Header/ModernHeader';
import { ModernSection } from '../modern/Section/ModernSection';
import { ModernEducation } from '../modern/Education/ModernEducation';
import { ModernWorkExperience } from '../modern/WorkExperience/ModernWorkExperience';
import { Skills } from '../layout/Skills';
import { SocialMedia } from '../layout/SocialMedia';
import { ModernInterestsAndLanguages } from '../modern/InterestsAndLanguages/ModernInterestsAndLanguages';
import { ModernCertifications } from '../modern/Certifications/ModernCertifications';

const ResumeContent = styled.main`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
`;

const CVPreview = ({ cvData, loading, error }) => {
  if (loading) {
    return (
      <ThemeProvider theme={modernTheme}>
        <Container>
          <div>Loading...</div>
        </Container>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={modernTheme}>
        <Container>
          <div>Error: {error}</div>
        </Container>
      </ThemeProvider>
    );
  }

  if (!cvData) {
    return (
      <ThemeProvider theme={modernTheme}>
        <Container>
          <div>No CV data available</div>
        </Container>
      </ThemeProvider>
    );
  }

  const { 
    profile, 
    contacts, 
    education, 
    skills, 
    professionalSummary, 
    workExperience,
    socialMedia,
    interestsAndLanguages = { interests: [], languages: [] },
    certifications = []
  } = cvData;

  const { 
    interests = interestsAndLanguages.interests, 
    languages = interestsAndLanguages.languages 
  } = interestsAndLanguages;

  return (
    <ThemeProvider theme={modernTheme}>
      <Container>
        <ModernHeader 
          name={profile?.name} 
          profession={profile?.profession}
          contacts={[
            ...(profile?.email ? [{ icon: 'envelope', value: profile.email }] : []),
            ...(profile?.contact_number ? [{
              icon: 'phone', 
              value: profile.contact_number
            }] : []),
            ...(contacts || [])
          ]}
          socialMedia={socialMedia}
        />

        <ResumeContent>
          <MainContent>
            {professionalSummary && (
              <ModernSection title="Professional Summary">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(professionalSummary) 
                  }} 
                />
              </ModernSection>
            )}

            {education && education.length > 0 && (
              <ModernSection title="Education">
                <ModernEducation educationList={education} />
              </ModernSection>
            )}

            {workExperience && workExperience.length > 0 && (
              <ModernSection title="Work Experience">
                <ModernWorkExperience 
                  experiences={workExperience.map(exp => ({
                    title: exp.job_title,
                    company: exp.company_name,
                    description: exp.job_description,
                    responsibilities: Array.isArray(exp.achievements) 
                      ? exp.achievements 
                      : exp.achievements?.split(/[.;]\s*/).filter(a => a.trim()) || [],
                    period: exp.period,
                    location: exp.location
                  }))} 
                />
              </ModernSection>
            )}

            {certifications.length > 0 && (
              <ModernSection title="Certifications">
                <ModernCertifications certifications={certifications} />
              </ModernSection>
            )}

            {skills && skills.length > 0 && (
              <ModernSection title="Skills">
                <Skills skills={skills} />
              </ModernSection>
            )}

            {(interests.length > 0 || languages.length > 0) && (
              <ModernSection title="Interests and Languages">
                <ModernInterestsAndLanguages 
                  interests={interests}
                  languages={languages}
                />
              </ModernSection>
            )}
          </MainContent>
        </ResumeContent>
      </Container>
    </ThemeProvider>
  );
};

export default CVPreview;
