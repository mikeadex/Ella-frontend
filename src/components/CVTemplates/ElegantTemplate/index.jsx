import React from 'react';
import './styles.css';

const ElegantTemplate = ({ data, className = '' }) => {
  // Fix data structure mapping to match other templates
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

  // Helper function to render section if data exists
  const renderSection = (title, content) => {
    if (!content) return null;
    return (
      <div className="elegant-section">
        <h2 className="elegant-section-title">{title}</h2>
        {content}
      </div>
    );
  };

  // Helper for skills rendering with levels
  const renderSkill = (skill) => {
    const levelMap = {
      beginner: 1,
      intermediate: 2,
      advanced: 3,
      expert: 4
    };
    
    // Support both string and object skill formats
    if (typeof skill === 'string') {
      return (
        <div key={skill} className="elegant-skill">
          <span className="elegant-skill-name">{skill}</span>
          <div className="elegant-skill-level">
            {[...Array(4)].map((_, i) => (
              <span 
                key={i} 
                className={`elegant-skill-dot ${i < 2 ? 'filled' : ''}`} 
              />
            ))}
          </div>
        </div>
      );
    }
    
    const level = skill.level ? 
      (typeof skill.level === 'number' ? 
        Math.min(Math.max(Math.floor(skill.level / 25), 0), 4) : 
        levelMap[skill.level?.toLowerCase()] || 2) : 
      2;
    
    return (
      <div key={skill.name} className="elegant-skill">
        <span className="elegant-skill-name">{skill.name}</span>
        <div className="elegant-skill-level">
          {[...Array(4)].map((_, i) => (
            <span 
              key={i} 
              className={`elegant-skill-dot ${i < level ? 'filled' : ''}`} 
            />
          ))}
        </div>
      </div>
    );
  };

  // Create a filtered contacts array to remove duplicates
  const filteredContacts = contacts.filter(contact => {
    if (profile?.email && contact.value === profile.email) return false;
    if (profile?.phone && contact.value === profile.phone) return false;
    return true;
  });

  return (
    <div className={`elegant-template ${className}`}>
      <div className="elegant-header">
        <div className="elegant-name-title">
          <h1>{profile?.name || 'Full Name'}</h1>
          <h2>{profile?.title || 'Professional Title'}</h2>
        </div>
        <div className="elegant-contact">
          {profile?.email && (
            <div className="elegant-contact-item">
              <span className="elegant-contact-icon">✉</span>
              <span>{profile.email}</span>
            </div>
          )}
          {profile?.phone && (
            <div className="elegant-contact-item">
              <span className="elegant-contact-icon">☏</span>
              <span>{profile.phone}</span>
            </div>
          )}
          {filteredContacts.map((contact, index) => (
            <div key={index} className="elegant-contact-item">
              <span className="elegant-contact-icon">
                {contact.icon === 'globe' ? '◎' : 
                 contact.icon === 'map-marker' ? '⌘' : '•'}
              </span>
              <span>{contact.value || ''}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="elegant-body">
        <div className="elegant-main">
          {professionalSummary && (
            <div className="elegant-summary">
              <h2 className="elegant-section-title">Professional Summary</h2>
              <p>{typeof professionalSummary === 'string' ? professionalSummary : (professionalSummary.summary || '')}</p>
            </div>
          )}

          {workExperience?.length > 0 && (
            <div className="elegant-section">
              <h2 className="elegant-section-title">Experience</h2>
              <div className="elegant-experience">
                {workExperience.map((job, index) => (
                  <div key={index} className="elegant-experience-item">
                    <div className="elegant-experience-header">
                      <h3>{typeof job === 'object' ? (job.title || '') : 'Position'}</h3>
                      <div className="elegant-experience-company">
                        <span className="elegant-company">{typeof job === 'object' ? (job.company || '') : 'Company'}</span>
                        <span className="elegant-dates">
                          {typeof job === 'object' ? 
                            `${job.startDate || 'Start'} - ${job.endDate || 'Present'}` : 
                            'Date Range'}
                        </span>
                      </div>
                    </div>
                    <p className="elegant-description">
                      {typeof job === 'object' && typeof job.description === 'string' ? 
                        job.description : 
                        ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education?.length > 0 && renderSection(
            "Education",
            <div className="elegant-education">
              {education.map((edu, index) => (
                <div key={index} className="elegant-education-item">
                  <div className="elegant-education-header">
                    <h3>{typeof edu === 'object' ? (edu.degree || '') : 'Degree'}</h3>
                    <div className="elegant-school-dates">
                      <span className="elegant-school">{typeof edu === 'object' ? (edu.institution || '') : 'Institution'}</span>
                      <span className="elegant-dates">
                        {typeof edu === 'object' ? 
                          `${edu.startDate || ''} - ${edu.endDate || 'Present'}` : 
                          'Date Range'}
                      </span>
                    </div>
                  </div>
                  {typeof edu === 'object' && edu.description && 
                    <p className="elegant-description">{edu.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="elegant-sidebar">
          {skills?.length > 0 && renderSection(
            "Skills",
            <div className="elegant-skills">
              {skills.map((skill, index) => renderSkill(skill))}
            </div>
          )}

          {languages?.length > 0 && renderSection(
            "Languages",
            <div className="elegant-languages">
              {languages.map((language, index) => (
                <div key={index} className="elegant-language-item">
                  <span className="elegant-language-name">
                    {typeof language === 'string' ? language : 
                     typeof language === 'object' ? (language.name || '') : ''}
                  </span>
                  {typeof language === 'object' && language.level && 
                    <span className="elegant-language-level">{language.level}</span>}
                </div>
              ))}
            </div>
          )}

          {interests?.length > 0 && renderSection(
            "Interests",
            <div className="elegant-interests">
              {interests.map((interest, index) => (
                <span key={index} className="elegant-interest-item">
                  {typeof interest === 'string' ? interest : 
                   typeof interest === 'object' ? (interest.name || '') : ''}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElegantTemplate;
