import React from 'react';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { modernTheme } from '../../../styles/theme/modern';
import { Container } from '../../../components/modern/Layout/Container';
import { ModernHeader } from '../../../components/modern/Header/ModernHeader';
import { ModernSection } from '../../../components/modern/Section/ModernSection';
import { ModernEducation } from '../../../components/modern/Education/ModernEducation';
import { FloatingContact } from "../../../components/common/FloatingContact";
import { ModernWorkExperience } from '../../../components/modern/WorkExperience/ModernWorkExperience';
import { Skills } from "../../../components/layout/Skills";
import { ModernProfessionalProfiles } from '../../../components/modern/ProfessionalProfiles/ModernProfessionalProfiles';

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

const ModernTemplate = ({ data }) => {
  const {
    profile,
    contacts,
    professionalSummary,
    education,
    workExperience,
    skills,
    certifications,
    languages,
    interests,
    references
  } = data;

  return (
    <ThemeProvider theme={modernTheme}>
      <Container>
        <ModernHeader
          name={profile.name}
          profession={profile.title}
          contacts={contacts}
        />
        <ResumeContent>
          <MainContent>
            {professionalSummary?.text && (
              <ModernSection title="Professional Summary">
                <Summary>{professionalSummary.text}</Summary>
              </ModernSection>
            )}
            {education?.length > 0 && (
              <ModernSection title="Education">
                <ModernEducation educationList={education} />
              </ModernSection>
            )}
            {workExperience?.length > 0 && (
              <ModernSection title="Work Experience">
                <ModernWorkExperience experiences={workExperience} />
              </ModernSection>
            )}
            {skills?.length > 0 && (
              <ModernSection title="Skills">
                <Skills skills={skills} />
              </ModernSection>
            )}
            {certifications?.length > 0 && (
              <ModernSection title="Certifications">
                {certifications.map((cert, index) => (
                  <div key={index} className="certification-item">
                    <h3>{cert.name}</h3>
                    <p>{cert.issuer} - {cert.date}</p>
                    {cert.description && <p>{cert.description}</p>}
                  </div>
                ))}
              </ModernSection>
            )}
            {languages?.length > 0 && (
              <ModernSection title="Languages">
                <div className="languages-grid">
                  {languages.map((lang, index) => (
                    <div key={index} className="language-item">
                      {lang.name}
                      <span className="level">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </ModernSection>
            )}
            {interests?.length > 0 && (
              <ModernSection title="Interests">
                <div className="interests-grid">
                  {interests.map((interest, index) => (
                    <div key={index} className="interest-item">
                      {interest.name}
                    </div>
                  ))}
                </div>
              </ModernSection>
            )}
            {references?.length > 0 && (
              <ModernSection title="References">
                <div className="references-grid">
                  {references.map((ref, index) => (
                    <div key={index} className="reference-item">
                      <h3>{ref.name}</h3>
                      <p>{ref.title}</p>
                      {ref.company && <p>{ref.company}</p>}
                      <p>{ref.contact}</p>
                    </div>
                  ))}
                </div>
              </ModernSection>
            )}
            {profile.socials && (
              <ModernSection title="Professional Profiles">
                <ModernProfessionalProfiles socials={profile.socials} />
              </ModernSection>
            )}
          </MainContent>
          <FloatingContact contacts={contacts} />
        </ResumeContent>
      </Container>
    </ThemeProvider>
  );
};

export default ModernTemplate;
