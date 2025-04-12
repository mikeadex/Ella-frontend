import React from 'react';
import styled from 'styled-components';
import './styles.css';

// Main container for the Executive template
const CVContainer = styled.div`
  font-family: 'Georgia', serif;
  max-width: 210mm;
  margin: 0 auto;
  background: #ffffff;
  color: #333;
  line-height: 1.6;

  /* Apply special styles when printing */
  &.for-print {
    @media print {
      width: 210mm;
      height: auto;
      padding: 0;
      margin: 0;
    }
  }
`;

// Header section with name and title
const Header = styled.header`
  text-align: center;
  padding: 30px 40px;
  border-bottom: 2px solid #c9a050;
`;

const Name = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #15334f;
  margin: 0 0 5px;
  letter-spacing: 0.05em;
`;

const Profession = styled.h2`
  font-size: 18px;
  font-weight: 400;
  color: #777;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

// Contact information row
const ContactInfo = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
  font-size: 14px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

// Main content section
const Content = styled.main`
  padding: 30px 40px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    display: flex;
    flex-direction: column-reverse;
  }

  @media print {
    grid-template-columns: 1fr 2fr;
    page-break-after: avoid;
  }
`;

// Left column for skills, education, etc.
const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  
  @media (max-width: 768px) {
    margin-top: 30px;
  }
`;

// Right column for professional experience
const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

// Section component with title
const Section = styled.section`
  margin-bottom: 25px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #15334f;
  margin: 0 0 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #c9a050;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// Skills section
const SkillsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const SkillItem = styled.li`
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
`;

const SkillName = styled.span`
  font-weight: 500;
  margin-bottom: 4px;
`;

const SkillBar = styled.div`
  height: 5px;
  background-color: #e9e9e9;
  border-radius: 2px;
  overflow: hidden;
`;

const SkillLevel = styled.div`
  height: 100%;
  background-color: #c9a050;
  width: ${(props) => props.level || '0%'};
`;

// Education component
const EducationItem = styled.div`
  margin-bottom: 15px;
`;

const Degree = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 5px;
  color: #15334f;
`;

const School = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const Year = styled.div`
  font-size: 14px;
  color: #777;
`;

// Experience component
const ExperienceItem = styled.div`
  margin-bottom: 20px;
  position: relative;
`;

const JobTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 5px;
  color: #15334f;
`;

const CompanyInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const Company = styled.div`
  font-weight: 500;
`;

const Period = styled.div`
  color: #777;
  font-size: 14px;
`;

const Description = styled.p`
  margin: 0 0 10px;
  font-size: 14px;
  line-height: 1.6;
`;

const AchievementsList = styled.ul`
  padding-left: 20px;
  margin: 10px 0;
`;

const AchievementItem = styled.li`
  margin-bottom: 5px;
  font-size: 14px;
`;

// Languages & Certifications
const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const GridItem = styled.div`
  font-size: 14px;
  padding: 8px 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

/**
 * Executive CV Template - Professional, traditional layout 
 * optimized for senior executives and management positions
 */
const ExecutiveTemplate = ({ data }) => {
  const {
    profile,
    contacts = [],
    professionalSummary,
    education = [],
    workExperience = [],
    skills = [],
    certifications = [],
    languages = [],
    interests = []
  } = data || {};

  // Filter out any email/phone contact items if they are directly available in profile
  const filteredContacts = contacts.filter(contact => {
    if (profile?.email && contact.value === profile.email) return false;
    if (profile?.phone && contact.value === profile.phone) return false;
    return true;
  });

  return (
    <CVContainer id="executive-cv-template" className="executive-template">
      <Header>
        <Name>{profile?.name || 'Full Name'}</Name>
        <Profession>{profile?.title || 'Professional Title'}</Profession>
        <ContactInfo>
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
        </ContactInfo>
      </Header>

      <Content>
        <LeftColumn>
          {skills.length > 0 && (
            <Section>
              <SectionTitle>Skills</SectionTitle>
              <SkillsList>
                {skills.map((skill, index) => (
                  <SkillItem key={index}>
                    <SkillName>{skill.name}</SkillName>
                    <SkillBar>
                      <SkillLevel level={`${skill.level || 80}%`} />
                    </SkillBar>
                  </SkillItem>
                ))}
              </SkillsList>
            </Section>
          )}

          {(languages.length > 0 || certifications.length > 0) && (
            <Section>
              <SectionTitle>{languages.length > 0 ? 'Languages' : 'Certifications'}</SectionTitle>
              <ItemsGrid>
                {languages.map((lang, index) => (
                  <GridItem key={index}>
                    {lang.name} {lang.level && `- ${lang.level}`}
                  </GridItem>
                ))}
                {certifications.map((cert, index) => (
                  <GridItem key={index}>
                    {cert.name}
                  </GridItem>
                ))}
              </ItemsGrid>
            </Section>
          )}
          
          {interests.length > 0 && (
            <Section>
              <SectionTitle>Interests</SectionTitle>
              <ItemsGrid>
                {interests.map((interest, index) => (
                  <GridItem key={index}>
                    {interest.name || interest}
                  </GridItem>
                ))}
              </ItemsGrid>
            </Section>
          )}
        </LeftColumn>

        <RightColumn>
          {professionalSummary && (
            <Section>
              <SectionTitle>Professional Summary</SectionTitle>
              <Description>{professionalSummary}</Description>
            </Section>
          )}
          
          {workExperience.length > 0 && (
            <Section>
              <SectionTitle>Professional Experience</SectionTitle>
              {workExperience.map((exp, index) => (
                <ExperienceItem key={index}>
                  <JobTitle>{exp.job_title || exp.title}</JobTitle>
                  <CompanyInfo>
                    <Company>{exp.company_name || exp.company}</Company>
                    <Period>{exp.period || `${exp.start_date} - ${exp.end_date || 'Present'}`}</Period>
                  </CompanyInfo>
                  <Description>{exp.job_description || exp.description}</Description>
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
                </ExperienceItem>
              ))}
            </Section>
          )}

          {education.length > 0 && (
            <Section>
              <SectionTitle>Education</SectionTitle>
              {education.map((edu, index) => (
                <EducationItem key={index}>
                  <Degree>{edu.degree || edu.course}</Degree>
                  <School>{edu.institution || edu.school}</School>
                  <Year>{edu.year || edu.period}</Year>
                </EducationItem>
              ))}
            </Section>
          )}
        </RightColumn>
      </Content>
    </CVContainer>
  );
};

export default ExecutiveTemplate;
