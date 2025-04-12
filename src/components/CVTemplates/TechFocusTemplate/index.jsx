import React from 'react';
import styled from 'styled-components';
import './styles.css';

// Main container with gradient header
const CVContainer = styled.div`
  font-family: 'Roboto', sans-serif;
  max-width: 210mm;
  margin: 0 auto;
  background: #ffffff;
  color: #333;
  line-height: 1.6;
  overflow: hidden;

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

// Header with gradient background
const Header = styled.header`
  background: linear-gradient(135deg, #2c5282 0%, #3182ce 100%);
  color: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const HeaderTop = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const HeaderInfo = styled.div`
  margin-bottom: 20px;
`;

const Name = styled.h1`
  font-size: 42px;
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.02em;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
`;

const Profession = styled.h2`
  font-size: 20px;
  font-weight: 400;
  margin: 5px 0 0;
  opacity: 0.9;
`;

// Contact information
const ContactInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 14px;
  margin-top: 20px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  padding: 6px 12px;
  border-radius: 20px;
  backdrop-filter: blur(5px);
  
  i {
    opacity: 0.9;
  }
`;

// Tech skills indicators
const TechBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
`;

const TechBadge = styled.div`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 5px 12px;
  border-radius: 4px;
  font-size: 13px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

// Main content divided in sections
const Content = styled.main`
  /* Clean up excess styling */
`;

// Section component with border and shadow
const Section = styled.section`
  margin-bottom: 30px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #edf2f7;
`;

const SectionHeader = styled.div`
  padding: 15px 25px;
  background: #f8fafc;
  border-bottom: 1px solid #edf2f7;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #2c5282;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 10px;
  
  i {
    opacity: 0.7;
    font-size: 18px;
  }
`;

const SectionContent = styled.div`
  padding: 20px 25px;
`;

// Summary text
const Summary = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: #4a5568;
`;

// Experience timeline
const Timeline = styled.div`
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    bottom: 0;
    width: 2px;
    background-color: #e2e8f0;
  }
`;

const TimelineItem = styled.div`
  position: relative;
  padding-left: 25px;
  margin-bottom: 25px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:before {
    content: '';
    position: absolute;
    left: -4px;
    top: 8px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #3182ce;
    border: 2px solid #fff;
    z-index: 1;
  }
`;

const TimelineHeader = styled.div`
  margin-bottom: 10px;
`;

const TimelineTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 5px;
`;

const TimelineMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #718096;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 2px;
  }
`;

const Company = styled.span`
  font-weight: 500;
`;

const Period = styled.span``;

const TimelineContent = styled.div``;

const Description = styled.p`
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

// Education grid
const EducationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const EducationCard = styled.div`
  background: #f8fafc;
  border-radius: 6px;
  padding: 15px;
  border: 1px solid #edf2f7;
`;

const EducationDegree = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 5px;
`;

const EducationSchool = styled.div`
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 5px;
`;

const EducationYear = styled.div`
  font-size: 14px;
  color: #718096;
`;

// Skills grid
const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
`;

const SkillCard = styled.div`
  background: #f8fafc;
  border-radius: 6px;
  padding: 15px;
  border: 1px solid #edf2f7;
`;

const SkillName = styled.div`
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 8px;
`;

const SkillBar = styled.div`
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
`;

const SkillLevel = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #3182ce 0%, #63b3ed 100%);
  width: ${(props) => props.level || '0%'};
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
  align-items: center;
  font-size: 14px;
  padding: 10px 15px;
  background-color: #f8fafc;
  border-radius: 6px;
  border: 1px solid #edf2f7;
`;

/**
 * TechFocus CV Template - Modern tech-oriented layout
 * optimized for IT and digital professionals
 */
const TechFocusTemplate = ({ data }) => {
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

  // Extract top skills for the header
  const topSkills = skills.slice(0, 5).map(skill => typeof skill === 'string' ? skill : skill.name);

  // Filter out duplicate contact items
  const filteredContacts = contacts.filter(contact => {
    if (profile?.email && contact.value === profile.email) return false;
    if (profile?.phone && contact.value === profile.phone) return false;
    return true;
  });

  return (
    <CVContainer id="tech-focus-cv-template" className="tech-focus-template">
      <Header>
        <HeaderTop>
          <HeaderInfo>
            <Name>{profile?.name || 'Full Name'}</Name>
            <Profession>{profile?.title || 'Professional Title'}</Profession>
          </HeaderInfo>
          
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
        </HeaderTop>
        
        {topSkills.length > 0 && (
          <TechBadges>
            {topSkills.map((skill, index) => (
              <TechBadge key={index}>{skill}</TechBadge>
            ))}
          </TechBadges>
        )}
      </Header>

      <Content>
        {professionalSummary && (
          <Section>
            <SectionHeader>
              <SectionTitle>
                <i className="fa fa-user-circle"></i>
                Professional Summary
              </SectionTitle>
            </SectionHeader>
            <SectionContent>
              <Summary>{professionalSummary}</Summary>
            </SectionContent>
          </Section>
        )}

        {workExperience.length > 0 && (
          <Section>
            <SectionHeader>
              <SectionTitle>
                <i className="fa fa-briefcase"></i>
                Professional Experience
              </SectionTitle>
            </SectionHeader>
            <SectionContent>
              <Timeline>
                {workExperience.map((exp, index) => (
                  <TimelineItem key={index}>
                    <TimelineHeader>
                      <TimelineTitle>{exp.job_title || exp.title}</TimelineTitle>
                      <TimelineMeta>
                        <Company>{exp.company_name || exp.company}</Company>
                        <Period>
                          {exp.period || `${exp.start_date || ''} - ${exp.end_date || 'Present'}`}
                        </Period>
                      </TimelineMeta>
                    </TimelineHeader>
                    <TimelineContent>
                      <Description>
                        {exp.job_description || exp.description}
                      </Description>
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
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </SectionContent>
          </Section>
        )}

        {skills.length > 0 && (
          <Section>
            <SectionHeader>
              <SectionTitle>
                <i className="fa fa-code"></i>
                Technical Skills
              </SectionTitle>
            </SectionHeader>
            <SectionContent>
              <SkillsGrid>
                {skills.map((skill, index) => (
                  <SkillCard key={index}>
                    <SkillName>{typeof skill === 'string' ? skill : skill.name}</SkillName>
                    <SkillBar>
                      <SkillLevel level={`${typeof skill.level === 'number' ? skill.level : 80}%`} />
                    </SkillBar>
                  </SkillCard>
                ))}
              </SkillsGrid>
            </SectionContent>
          </Section>
        )}

        {education.length > 0 && (
          <Section>
            <SectionHeader>
              <SectionTitle>
                <i className="fa fa-graduation-cap"></i>
                Education
              </SectionTitle>
            </SectionHeader>
            <SectionContent>
              <EducationGrid>
                {education.map((edu, index) => (
                  <EducationCard key={index}>
                    <EducationDegree>{edu.degree || edu.course}</EducationDegree>
                    <EducationSchool>{edu.institution || edu.school}</EducationSchool>
                    <EducationYear>{edu.year || edu.period}</EducationYear>
                  </EducationCard>
                ))}
              </EducationGrid>
            </SectionContent>
          </Section>
        )}

        {(languages.length > 0 || certifications.length > 0) && (
          <Section>
            <SectionHeader>
              <SectionTitle>
                <i className="fa fa-certificate"></i>
                {languages.length > 0 && certifications.length > 0 
                  ? 'Languages & Certifications' 
                  : languages.length > 0 ? 'Languages' : 'Certifications'}
              </SectionTitle>
            </SectionHeader>
            <SectionContent>
              <ItemsGrid>
                {languages.map((lang, index) => (
                  <GridItem key={index}>
                    <span>{lang.name}</span>
                    {lang.level && <span>{lang.level}</span>}
                  </GridItem>
                ))}
                {certifications.map((cert, index) => (
                  <GridItem key={index}>
                    <span>{cert.name}</span>
                    {cert.date && <span>{cert.date}</span>}
                  </GridItem>
                ))}
              </ItemsGrid>
            </SectionContent>
          </Section>
        )}
      </Content>
    </CVContainer>
  );
};

export default TechFocusTemplate;
