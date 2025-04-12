import React from 'react';
import './styles.css';

const NordicTemplate = ({ data, className = '' }) => {
  // Update data structure to match other templates
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

  // Create a filtered contacts array to remove duplicates
  const filteredContacts = contacts.filter(contact => {
    if (profile?.email && contact.value === profile.email) return false;
    if (profile?.phone && contact.value === profile.phone) return false;
    return true;
  });

  // Helper function to map icon names to characters
  const getIconChar = (iconName) => {
    const iconMap = {
      'envelope': '✉',
      'phone': '✆',
      'map-marker': '◎',
      'globe': '🌐',
      'linkedin': '💼',
      'github': '💻',
      'twitter': '🐦'
    };
    return iconMap[iconName] || '•';
  };

  return (
    <div className={`nordic-template ${className}`}>
      <header className="nordic-header">
        <div className="nordic-intro">
          <h1>{profile?.name || 'Full Name'}</h1>
          <h2>{profile?.title || 'Professional Title'}</h2>
          {professionalSummary && (
            <div className="nordic-summary">
              <p>{typeof professionalSummary === 'string' ? professionalSummary : 
                  (professionalSummary.summary || '')}</p>
            </div>
          )}
        </div>
      </header>
      
      <div className="nordic-container">
        <aside className="nordic-sidebar">
          <div className="nordic-contact">
            {profile?.email && (
              <div className="nordic-contact-item">
                <span className="nordic-contact-label">Email</span>
                <span className="nordic-contact-value">{profile.email}</span>
              </div>
            )}
            
            {profile?.phone && (
              <div className="nordic-contact-item">
                <span className="nordic-contact-label">Phone</span>
                <span className="nordic-contact-value">{profile.phone}</span>
              </div>
            )}
            
            {filteredContacts.map((contact, index) => (
              <div key={index} className="nordic-contact-item">
                <span className="nordic-contact-label">
                  {contact.label || contact.icon || 'Contact'}
                </span>
                <span className="nordic-contact-value">{contact.value || ''}</span>
              </div>
            ))}
          </div>
          
          {skills?.length > 0 && (
            <div className="nordic-section">
              <h3 className="nordic-section-title">Skills</h3>
              <div className="nordic-skills">
                {skills.map((skill, index) => {
                  // Handle both string and object skill formats
                  if (typeof skill === 'string') {
                    return (
                      <div key={index} className="nordic-skill">
                        <span className="nordic-skill-name">{skill}</span>
                      </div>
                    );
                  }
                  
                  // Convert proficiency/level to percentage
                  let percentage = 50;
                  if (skill.level) {
                    if (typeof skill.level === 'number') {
                      percentage = Math.min(Math.max(skill.level, 0), 100);
                    } else {
                      const proficiencyMap = {
                        beginner: 25,
                        intermediate: 50,
                        advanced: 75,
                        expert: 100
                      };
                      percentage = proficiencyMap[typeof skill.level === 'string' ? skill.level.toLowerCase() : ''] || 50;
                    }
                  }
                  
                  return (
                    <div key={index} className="nordic-skill">
                      <span className="nordic-skill-name">{skill.name || ''}</span>
                      <div className="nordic-skill-bar">
                        <div className="nordic-skill-level" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {languages?.length > 0 && (
            <div className="nordic-section">
              <h3 className="nordic-section-title">Languages</h3>
              <div className="nordic-languages">
                {languages.map((language, index) => (
                  <div key={index} className="nordic-language">
                    <span className="nordic-language-name">
                      {typeof language === 'string' ? language : 
                       typeof language === 'object' ? (language.name || '') : ''}
                    </span>
                    {typeof language === 'object' && language.level && (
                      <span className="nordic-language-level">{language.level}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {interests?.length > 0 && (
            <div className="nordic-section">
              <h3 className="nordic-section-title">Interests</h3>
              <div className="nordic-interests">
                {interests.map((interest, index) => (
                  <span key={index} className="nordic-interest">
                    {typeof interest === 'string' ? interest : 
                     typeof interest === 'object' ? (interest.name || '') : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
        
        <main className="nordic-main">
          {workExperience?.length > 0 && (
            <div className="nordic-section">
              <h3 className="nordic-section-title">Experience</h3>
              <div className="nordic-experience">
                {workExperience.map((job, index) => (
                  <div key={index} className="nordic-experience-item">
                    <div className="nordic-experience-header">
                      <h4 className="nordic-role">
                        {typeof job === 'object' ? (job.title || 'Position') : 'Position'}
                      </h4>
                      <div className="nordic-company">
                        {typeof job === 'object' ? (job.company || 'Company') : 'Company'}
                      </div>
                      <div className="nordic-duration">
                        {typeof job === 'object' ? 
                          `${job.startDate || 'Start'} - ${job.endDate || 'Present'}` : 
                          'Date Range'}
                      </div>
                    </div>
                    <div className="nordic-experience-description">
                      <p>{typeof job === 'object' && typeof job.description === 'string' ? 
                          job.description : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {education?.length > 0 && (
            <div className="nordic-section">
              <h3 className="nordic-section-title">Education</h3>
              <div className="nordic-education">
                {education.map((edu, index) => (
                  <div key={index} className="nordic-education-item">
                    <div className="nordic-education-header">
                      <h4 className="nordic-degree">
                        {typeof edu === 'object' ? (edu.degree || 'Degree') : 'Degree'}
                      </h4>
                      <div className="nordic-school">
                        {typeof edu === 'object' ? (edu.institution || 'Institution') : 'Institution'}
                      </div>
                      <div className="nordic-duration">
                        {typeof edu === 'object' ? 
                          `${edu.startDate || 'Start'} - ${edu.endDate || 'Present'}` : 
                          'Date Range'}
                      </div>
                    </div>
                    {typeof edu === 'object' && edu.description && (
                      <div className="nordic-education-description">
                        <p>{typeof edu.description === 'string' ? edu.description : ''}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default NordicTemplate;
