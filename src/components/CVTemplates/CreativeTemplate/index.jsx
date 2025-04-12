import React from 'react';
import styled from 'styled-components';
import './styles.css';

// Main container with color accent
const CVContainer = styled.div`
  font-family: 'Poppins', sans-serif;
  max-width: 210mm;
  margin: 0 auto;
  background: #ffffff;
  color: #333;
  line-height: 1.6;
  display: grid;
  grid-template-columns: 30% 70%;
  overflow: hidden;
  position: relative;

  /* Apply special styles when printing */
  &.for-print {
    @media print {
      width: 210mm;
      height: auto;
      padding: 0;
      margin: 0;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    display: block;
  }
`;

// Sidebar column with accent color
const Sidebar = styled.aside`
  background-color: #344055;
  color: #fff;
  padding: 40px 25px;
  height: 100%;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 30px 20px;
  }

  @media (max-width: 480px) {
    padding: 20px 15px;
  }
`;

// Name banner at the top
const NameBanner = styled.div`
  background-color: #4a90e2;
  padding: 15px 25px;
  margin: -40px -25px 30px;
  text-align: center;

  @media (max-width: 768px) {
    margin: -30px -20px 25px;
  }

  @media (max-width: 480px) {
    margin: -20px -15px 20px;
    padding: 12px 15px;
  }
`;

const Name = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.05em;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Profession = styled.h2`
  font-size: 16px;
  font-weight: 400;
  margin: 5px 0 0;
  color: rgba(255, 255, 255, 0.85);

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

// Profile image with rounded border
const ProfileImage = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 25px;
  border: 4px solid #4a90e2;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 480px) {
    width: 120px;
    height: 120px;
    margin: 0 auto 20px;
  }
`;

// Contact information section
const ContactInfo = styled.div`
  margin-bottom: 30px;

  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const ContactTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 480px) {
    font-size: 15px;
    margin: 0 0 10px;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;

  i {
    margin-right: 12px;
    opacity: 0.8;
    width: 18px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

// Skills section styling
const SkillsSection = styled.div`
  margin-bottom: 30px;

  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const SkillsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SkillItem = styled.div`
  margin-bottom: 5px;
`;

const SkillName = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 14px;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const SkillBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
`;

const SkillLevel = styled.div`
  height: 100%;
  width: ${props => props.level || '80%'};
  background-color: #4a90e2;
  border-radius: 3px;
`;

// Language styling
const LanguageItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const LanguageName = styled.span`
  font-size: 14px;
`;

const LanguageLevel = styled.span`
  font-size: 13px;
  opacity: 0.8;
`;

// Main content area
const MainContent = styled.main`
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 35px;

  @media (max-width: 768px) {
    padding: 30px;
  }

  @media (max-width: 480px) {
    padding: 25px 20px;
    gap: 25px;
  }
`;

// Section styling for main content
const Section = styled.section`
  margin-bottom: 0;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px;
  color: #344055;
  position: relative;
  padding-bottom: 10px;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 50px;
    height: 3px;
    background-color: #4a90e2;
  }

  @media (max-width: 480px) {
    font-size: 16px;
    margin: 0 0 15px;
  }
`;

const SummaryContent = styled.p`
  font-size: 15px;
  color: #555;
  margin: 0;
  line-height: 1.6;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

// Experience item styling
const ExperienceItem = styled.div`
  position: relative;
  margin-bottom: 25px;
  padding-left: 20px;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 8px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #4a90e2;
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const ExperienceTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 5px;
  color: #333;

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const ExperienceSubtitle = styled.div`
  font-size: 15px;
  color: #555;
  margin-bottom: 5px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const ExperienceDate = styled.div`
  font-size: 14px;
  color: #777;
  margin-bottom: 10px;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const ExperienceDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

// Education item styling
const EducationItem = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const EducationTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 5px;
  color: #333;

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const EducationSubtitle = styled.div`
  font-size: 15px;
  color: #555;
  margin-bottom: 5px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const EducationDate = styled.div`
  font-size: 14px;
  color: #777;
  margin-bottom: 5px;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const EducationDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  
  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

// Tag styling for interests and skills in main section
const TagsGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Tag = styled.span`
  background-color: rgba(74, 144, 226, 0.1);
  color: #4a90e2;
  border-radius: 15px;
  padding: 5px 12px;
  font-size: 14px;
  
  @media (max-width: 480px) {
    font-size: 13px;
    padding: 4px 10px;
  }
`;

/**
 * Creative CV Template - Modern and visually appealing layout
 * Best for designers, creative professionals, and digital marketers
 */
const CreativeTemplate = ({ data }) => {
  const {
    profile,
    contacts = [],
    professionalSummary,
    education = [],
    workExperience = [],
    skills = [],
    languages = [],
    interests = []
  } = data || {};

  // Filter out duplicate contact items
  const filteredContacts = contacts.filter(contact => {
    if (profile?.email && contact.value === profile.email) return false;
    if (profile?.phone && contact.value === profile.phone) return false;
    return true;
  });

  return (
    <CVContainer id="creative-cv-template" className="creative-template">
      <Sidebar>
        <NameBanner>
          <Name>{profile?.name || 'Full Name'}</Name>
          <Profession>{profile?.title || 'Professional Title'}</Profession>
        </NameBanner>
        
        {profile?.photo && (
          <ProfileImage>
            <img src={profile.photo} alt={profile.name || 'Profile'} />
          </ProfileImage>
        )}
        
        <ContactInfo>
          <ContactTitle>Contact</ContactTitle>
          {profile?.email && (
            <ContactItem>
              <i className="fa fa-envelope"></i>
              <span>{profile.email}</span>
            </ContactItem>
          )}
          {profile?.phone && (
            <ContactItem>
              <i className="fa fa-phone"></i>
              <span>{profile.phone}</span>
            </ContactItem>
          )}
          {filteredContacts.map((contact, index) => (
            <ContactItem key={index}>
              {contact.icon && <i className={`fa fa-${contact.icon}`}></i>}
              <span>{contact.value}</span>
            </ContactItem>
          ))}
        </ContactInfo>
        
        {skills.length > 0 && (
          <SkillsSection>
            <ContactTitle>Skills</ContactTitle>
            <SkillsList>
              {skills.slice(0, 6).map((skill, index) => (
                <SkillItem key={index}>
                  <SkillName>
                    <span>{typeof skill === 'string' ? skill : skill.name}</span>
                    {typeof skill === 'object' && skill.level && (
                      <span>{typeof skill.level === 'number' ? `${skill.level}%` : skill.level}</span>
                    )}
                  </SkillName>
                  <SkillBar>
                    <SkillLevel level={typeof skill === 'object' && typeof skill.level === 'number' ? `${skill.level}%` : '80%'} />
                  </SkillBar>
                </SkillItem>
              ))}
            </SkillsList>
          </SkillsSection>
        )}
        
        {languages.length > 0 && (
          <SkillsSection>
            <ContactTitle>Languages</ContactTitle>
            {languages.map((lang, index) => (
              <LanguageItem key={index}>
                <LanguageName>{typeof lang === 'string' ? lang : lang.name}</LanguageName>
                {typeof lang === 'object' && lang.level && <LanguageLevel>{lang.level}</LanguageLevel>}
              </LanguageItem>
            ))}
          </SkillsSection>
        )}
      </Sidebar>
      
      <MainContent>
        {professionalSummary && (
          <Section>
            <SectionTitle>About Me</SectionTitle>
            <SummaryContent>
              {typeof professionalSummary === 'string' 
                ? professionalSummary 
                : (professionalSummary.summary || '')}
            </SummaryContent>
          </Section>
        )}
        
        {workExperience.length > 0 && (
          <Section>
            <SectionTitle>Experience</SectionTitle>
            {workExperience.map((item, index) => (
              <ExperienceItem key={index}>
                <ExperienceTitle>
                  {typeof item === 'object' ? (item.title || 'Position') : 'Position'}
                </ExperienceTitle>
                <ExperienceSubtitle>
                  {typeof item === 'object' ? (item.company || 'Company') : 'Company'}
                </ExperienceSubtitle>
                <ExperienceDate>
                  {typeof item === 'object' ? 
                    `${item.startDate || 'Start'} - ${item.endDate || 'Present'}` : 
                    'Date Range'}
                </ExperienceDate>
                <ExperienceDescription>
                  {typeof item === 'object' && typeof item.description === 'string' ? 
                    item.description : 
                    'Job description'}
                </ExperienceDescription>
              </ExperienceItem>
            ))}
          </Section>
        )}
        
        {education.length > 0 && (
          <Section>
            <SectionTitle>Education</SectionTitle>
            {education.map((item, index) => (
              <EducationItem key={index}>
                <EducationTitle>
                  {typeof item === 'object' ? (item.degree || 'Degree') : 'Degree'}
                </EducationTitle>
                <EducationSubtitle>
                  {typeof item === 'object' ? (item.institution || 'Institution') : 'Institution'}
                </EducationSubtitle>
                <EducationDate>
                  {typeof item === 'object' ? 
                    `${item.startDate || 'Start'} - ${item.endDate || 'End'}` : 
                    'Date Range'}
                </EducationDate>
                {typeof item === 'object' && item.description && (
                  <EducationDescription>{item.description}</EducationDescription>
                )}
              </EducationItem>
            ))}
          </Section>
        )}
        
        {interests.length > 0 && (
          <Section>
            <SectionTitle>Interests</SectionTitle>
            <TagsGroup>
              {interests.map((interest, index) => (
                <Tag key={index}>
                  {typeof interest === 'string' ? interest : interest.name}
                </Tag>
              ))}
            </TagsGroup>
          </Section>
        )}
      </MainContent>
    </CVContainer>
  );
};

export default CreativeTemplate;
