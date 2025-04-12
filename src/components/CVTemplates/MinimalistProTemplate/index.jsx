import React from 'react';
import styled from 'styled-components';
import './styles.css';

// Main container with subtle styling
const CVContainer = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  max-width: 210mm;
  margin: 0 auto;
  background: #ffffff;
  color: #2d3748;
  line-height: 1.6;
  border: 1px solid #edf2f7;

  /* Apply special styles when printing */
  &.for-print {
    @media print {
      width: 210mm;
      height: auto;
      padding: 0;
      margin: 0;
      border: none;
    }
  }
`;

// Header section with name and title
const Header = styled.header`
  padding: 40px 50px 20px;
  border-bottom: 1px solid #edf2f7;
  text-align: center;
`;

const Name = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #1a202c;
  margin: 0 0 10px;
  letter-spacing: -0.02em;
`;

const Profession = styled.h2`
  font-size: 20px;
  font-weight: 400;
  color: #4a5568;
  margin: 0 0 25px;
`;

// Contact info styled as a horizontal row
const ContactRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 15px;
  font-size: 14px;
  color: #4a5568;
  justify-content: center;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// Main content area
const Content = styled.main`
  padding: 30px 50px 50px;
`;

// Section with title
const Section = styled.section`
  margin-bottom: 30px;
  page-break-inside: avoid;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1a202c;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #edf2f7;
`;

// Summary paragraph
const Summary = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: #4a5568;
`;

// Experience section
const ExperienceGrid = styled.div`
  display: grid;
  gap: 25px;
`;

const ExperienceItem = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const ExperienceMeta = styled.div`
  font-size: 14px;
`;

const ExperienceDate = styled.div`
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 5px;
`;

const ExperienceCompany = styled.div`
  color: #718096;
`;

const ExperienceContent = styled.div``;

const ExperienceTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 8px;
`;

const ExperienceDescription = styled.p`
  margin: 0 0 12px;
  font-size: 14px;
  line-height: 1.6;
  color: #4a5568;
`;

const AchievementsList = styled.ul`
  margin: 10px 0 0;
  padding-left: 20px;
`;

const AchievementItem = styled.li`
  margin-bottom: 5px;
  font-size: 14px;
  color: #4a5568;
`;

// Education section
const EducationGrid = styled.div`
  display: grid;
  gap: 20px;
`;

const EducationItem = styled.div`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const EducationMeta = styled.div`
  font-size: 14px;
`;

const EducationDate = styled.div`
  font-weight: 500;
  color: #4a5568;
`;

const EducationContent = styled.div``;

const EducationDegree = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 5px;
`;

const EducationSchool = styled.div`
  font-size: 14px;
  color: #4a5568;
`;

// Skills section
const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const SkillTag = styled.div`
  padding: 6px 12px;
  background-color: #f7fafc;
  border-radius: 4px;
  font-size: 14px;
  color: #4a5568;
  border: 1px solid #edf2f7;
`;

// Languages and certifications
const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
`;

const GridItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: 10px 15px;
  background-color: #f7fafc;
  border-radius: 4px;
  border: 1px solid #edf2f7;
`;

/**
 * MinimalistPro CV Template - Clean and ATS-friendly layout
 * optimized for readability and modern simplicity
 */
const MinimalistProTemplate = ({ data }) => {
  const {
    profile,
    contacts = [],
    professionalSummary,
    education = [],
    workExperience = [],
    skills = [],
    certifications = [],
    languages = []
  } = data || {};

  // Filter out duplicate contact items
  const filteredContacts = contacts.filter(contact => {
    if (profile?.email && contact.value === profile.email) return false;
    if (profile?.phone && contact.value === profile.phone) return false;
    return true;
  });

  return (
    <CVContainer id="minimalist-pro-cv-template" className="minimalist-pro-template">
      <Header>
        <Name>{profile?.name || 'Full Name'}</Name>
        <Profession>{profile?.title || 'Professional Title'}</Profession>
        <ContactRow>
          {filteredContacts.map((contact, index) => (
            <ContactItem key={index}>
              {contact.icon && <i className={`fa fa-${contact.icon}`}></i>}
              {contact.value}
            </ContactItem>
          ))}
          {profile?.email && (
            <ContactItem>
              <i className="fa fa-envelope"></i>
              {profile.email}
            </ContactItem>
          )}
          {profile?.phone && (
            <ContactItem>
              <i className="fa fa-phone"></i>
              {profile.phone}
            </ContactItem>
          )}
        </ContactRow>
      </Header>

      <Content>
        {professionalSummary && (
          <Section>
            <SectionTitle>Professional Summary</SectionTitle>
            <Summary>{professionalSummary}</Summary>
          </Section>
        )}

        {workExperience.length > 0 && (
          <Section>
            <SectionTitle>Experience</SectionTitle>
            <ExperienceGrid>
              {workExperience.map((exp, index) => (
                <ExperienceItem key={index}>
                  <ExperienceMeta>
                    <ExperienceDate>
                      {exp.period || `${exp.start_date || ''} - ${exp.end_date || 'Present'}`}
                    </ExperienceDate>
                    <ExperienceCompany>{exp.company_name || exp.company}</ExperienceCompany>
                  </ExperienceMeta>
                  <ExperienceContent>
                    <ExperienceTitle>{exp.job_title || exp.title}</ExperienceTitle>
                    <ExperienceDescription>
                      {exp.job_description || exp.description}
                    </ExperienceDescription>
                    {exp.achievements && exp.achievements.length > 0 && (
                      <AchievementsList>
                        {Array.isArray(exp.achievements) 
                          ? exp.achievements.map((achievement, i) => (
                              <AchievementItem key={i}>{achievement}</AchievementItem>
                            ))
                          : exp.achievements.split(/[.;]\s*/).filter(a => a.trim()).map((achievement, i) => (
                              <AchievementItem key={i}>{achievement}</AchievementItem>
                            ))
                        }
                      </AchievementsList>
                    )}
                  </ExperienceContent>
                </ExperienceItem>
              ))}
            </ExperienceGrid>
          </Section>
        )}

        {education.length > 0 && (
          <Section>
            <SectionTitle>Education</SectionTitle>
            <EducationGrid>
              {education.map((edu, index) => (
                <EducationItem key={index}>
                  <EducationMeta>
                    <EducationDate>{edu.year || edu.period}</EducationDate>
                  </EducationMeta>
                  <EducationContent>
                    <EducationDegree>{edu.degree || edu.course}</EducationDegree>
                    <EducationSchool>{edu.institution || edu.school}</EducationSchool>
                  </EducationContent>
                </EducationItem>
              ))}
            </EducationGrid>
          </Section>
        )}

        {skills.length > 0 && (
          <Section>
            <SectionTitle>Skills</SectionTitle>
            <SkillsContainer>
              {skills.map((skill, index) => (
                <SkillTag key={index}>{skill.name}</SkillTag>
              ))}
            </SkillsContainer>
          </Section>
        )}

        {languages.length > 0 && (
          <Section>
            <SectionTitle>Languages</SectionTitle>
            <ItemsGrid>
              {languages.map((lang, index) => (
                <GridItem key={index}>
                  <span>{lang.name}</span>
                  {lang.level && <span>{lang.level}</span>}
                </GridItem>
              ))}
            </ItemsGrid>
          </Section>
        )}

        {certifications.length > 0 && (
          <Section>
            <SectionTitle>Certifications</SectionTitle>
            <ItemsGrid>
              {certifications.map((cert, index) => (
                <GridItem key={index}>
                  <span>{cert.name}</span>
                  {cert.date && <span>{cert.date}</span>}
                </GridItem>
              ))}
            </ItemsGrid>
          </Section>
        )}
      </Content>
    </CVContainer>
  );
};

export default MinimalistProTemplate;
