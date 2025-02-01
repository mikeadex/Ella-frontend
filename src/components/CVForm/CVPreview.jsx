import React, { useEffect } from 'react';
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

const Summary = styled.p`
  font-size: 1em;
  line-height: 1.8;
  color: var(--text-light);

  @media (max-width: 768px) {
    font-size: 0.95em;
    line-height: 1.6;
  }

  @media (max-width: 480px) {
    font-size: 0.9em;
    line-height: 1.5;
  }
`;

const CVPreview = ({ cvData, loading, error }) => {
  useEffect(() => {
    console.log('CVData in Preview:', cvData);
    console.log('Work Experience:', cvData?.workExperience);
  }, [cvData]);

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

  console.log('RENDER - Work Experience:', workExperience)

  return (
    <ThemeProvider theme={modernTheme}>
      <Container>
        <ModernHeader 
          name={profile.name} 
          profession={profile.profession}
          contacts={[
            ...(profile.email ? [{ icon: 'envelope', value: profile.email }] : []),
            ...(profile.contact_number ? [{
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
                <Summary 
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

            {workExperience && (
              console.log('Work Experience Details:', 
                workExperience.map(exp => ({
                  jobTitle: exp.job_title,
                  companyName: exp.company_name,
                  achievements: exp.achievements
                }))
              )
            )}

            {workExperience && workExperience.length > 0 && (
              <ModernSection title="Work Experience">
                <div>
                  <ModernWorkExperience 
                    experiences={workExperience.map(exp => {
                      // Attempt to parse achievements if it's a string with HTML
                      const parseAchievements = (achievementsData) => {
                        if (!achievementsData) return [];
                        
                        if (typeof achievementsData === 'string') {
                          // Remove HTML tags
                          const strippedAchievements = achievementsData.replace(/<[^>]*>/g, '');
                          
                          // Split by common delimiters
                          return strippedAchievements.split(/[.;]\s*/).filter(a => a.trim());
                        }
                        
                        // If it's already an array, return it
                        return Array.isArray(achievementsData) 
                          ? achievementsData 
                          : [];
                      };

                      return {
                        title: exp.job_title,
                        company: exp.company_name,
                        description: exp.job_description,
                        responsibilities: parseAchievements(exp.achievements),
                        period: exp.period,
                        location: exp.location
                      };
                    })} 
                  />
                </div>
              </ModernSection>
            )}

            {certifications.length > 0 && (
              <ModernSection title="Certifications">
                <ModernCertifications certifications={certifications} />
              </ModernSection>
            )}

            {/* {socialMedia && socialMedia.length > 0 && (
              <ModernSection title="Social Media">
                <SocialMedia socialMedia={socialMedia} />
              </ModernSection>
            )} */}

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
