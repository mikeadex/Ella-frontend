import React from 'react';
import './styles.css';

const PortfolioTemplate = ({ data, className = '' }) => {
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
    <div className={`portfolio-template ${className}`}>
      <div className="portfolio-sidebar">
        <div className="portfolio-profile">
          {profile?.photo && (
            <div className="portfolio-image">
              <img src={profile.photo} alt={profile?.name || 'Profile'} />
            </div>
          )}
          <div className="portfolio-name">
            <h1>{profile?.name || 'Full Name'}</h1>
            <div className="portfolio-title">{profile?.title || 'Professional Title'}</div>
          </div>
        </div>
        
        <div className="portfolio-contact">
          {profile?.email && (
            <div className="portfolio-contact-item">
              <div className="portfolio-contact-icon">✉</div>
              <div className="portfolio-contact-text">{profile.email}</div>
            </div>
          )}
          {profile?.phone && (
            <div className="portfolio-contact-item">
              <div className="portfolio-contact-icon">✆</div>
              <div className="portfolio-contact-text">{profile.phone}</div>
            </div>
          )}
          {filteredContacts.map((contact, index) => (
            <div key={index} className="portfolio-contact-item">
              <div className="portfolio-contact-icon">{contact.icon ? getIconChar(contact.icon) : '•'}</div>
              <div className="portfolio-contact-text">{contact.value || ''}</div>
            </div>
          ))}
        </div>
        
        {skills?.length > 0 && (
          <div className="portfolio-section">
            <h2 className="portfolio-section-title">Skills</h2>
            <div className="portfolio-skills">
              {skills.map((skill, index) => {
                // Handle both string and object skill formats
                if (typeof skill === 'string') {
                  return (
                    <div key={index} className="portfolio-skill">
                      <div className="portfolio-skill-name">{skill}</div>
                      <div className="portfolio-skill-level">
                        <div className="portfolio-skill-dots">
                          <span className="portfolio-skill-dot active"></span>
                          <span className="portfolio-skill-dot active"></span>
                          <span className="portfolio-skill-dot"></span>
                          <span className="portfolio-skill-dot"></span>
                          <span className="portfolio-skill-dot"></span>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                // Convert proficiency to dots (0-5)
                let activeDots = 3; // Default
                if (skill.level) {
                  if (typeof skill.level === 'number') {
                    // Convert percentage to 0-5 scale
                    activeDots = Math.round((skill.level / 100) * 5);
                  } else {
                    const proficiencyMap = {
                      beginner: 1,
                      intermediate: 2,
                      advanced: 4,
                      expert: 5
                    };
                    activeDots = proficiencyMap[typeof skill.level === 'string' ? skill.level.toLowerCase() : ''] || 3;
                  }
                }
                
                return (
                  <div key={index} className="portfolio-skill">
                    <div className="portfolio-skill-name">{skill.name || ''}</div>
                    <div className="portfolio-skill-level">
                      <div className="portfolio-skill-dots">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`portfolio-skill-dot ${i < activeDots ? 'active' : ''}`}
                          ></span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {languages?.length > 0 && (
          <div className="portfolio-section">
            <h2 className="portfolio-section-title">Languages</h2>
            <div className="portfolio-languages">
              {languages.map((language, index) => {
                // Handle both string and object language formats
                const langName = typeof language === 'string' ? language : 
                                 typeof language === 'object' ? (language.name || '') : '';
                const langLevel = typeof language === 'object' && language.level ? language.level : '';
                
                return (
                  <div key={index} className="portfolio-language">
                    <div className="portfolio-language-name">{langName}</div>
                    {langLevel && <div className="portfolio-language-level">{langLevel}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {interests?.length > 0 && (
          <div className="portfolio-section">
            <h2 className="portfolio-section-title">Interests</h2>
            <div className="portfolio-interests">
              {interests.map((interest, index) => (
                <span key={index} className="portfolio-interest">
                  {typeof interest === 'string' ? interest : 
                   typeof interest === 'object' ? (interest.name || '') : ''}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="portfolio-main">
        {professionalSummary && (
          <div className="portfolio-section">
            <h2 className="portfolio-section-title">About Me</h2>
            <div className="portfolio-text">
              {typeof professionalSummary === 'string' ? professionalSummary : 
              (professionalSummary.summary || '')}
            </div>
          </div>
        )}
        
        {workExperience?.length > 0 && (
          <div className="portfolio-section">
            <h2 className="portfolio-section-title">Experience</h2>
            <div className="portfolio-timeline">
              {workExperience.map((job, index) => (
                <div key={index} className="portfolio-timeline-item">
                  <div className="portfolio-timeline-header">
                    <h3 className="portfolio-timeline-title">
                      {typeof job === 'object' ? (job.title || 'Position') : 'Position'}
                    </h3>
                    <div className="portfolio-timeline-subtitle">
                      {typeof job === 'object' ? (job.company || 'Company') : 'Company'}
                    </div>
                    <div className="portfolio-timeline-period">
                      {typeof job === 'object' ? 
                        `${job.startDate || 'Start'} - ${job.endDate || 'Present'}` : 
                        'Date Range'}
                    </div>
                  </div>
                  <div className="portfolio-timeline-content">
                    {typeof job === 'object' && typeof job.description === 'string' ? 
                      job.description : 
                      ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {education?.length > 0 && (
          <div className="portfolio-section">
            <h2 className="portfolio-section-title">Education</h2>
            <div className="portfolio-timeline">
              {education.map((edu, index) => (
                <div key={index} className="portfolio-timeline-item">
                  <div className="portfolio-timeline-header">
                    <h3 className="portfolio-timeline-title">
                      {typeof edu === 'object' ? (edu.degree || 'Degree') : 'Degree'}
                    </h3>
                    <div className="portfolio-timeline-subtitle">
                      {typeof edu === 'object' ? (edu.institution || 'Institution') : 'Institution'}
                    </div>
                    <div className="portfolio-timeline-period">
                      {typeof edu === 'object' ? 
                        `${edu.startDate || 'Start'} - ${edu.endDate || 'Present'}` : 
                        'Date Range'}
                    </div>
                  </div>
                  {typeof edu === 'object' && edu.description && (
                    <div className="portfolio-timeline-content">
                      {typeof edu.description === 'string' ? edu.description : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioTemplate;
