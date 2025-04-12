import React from 'react';
import './styles.css';

const StartupTemplate = ({ data, className = '' }) => {
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

  // Create a filtered contacts array to remove duplicates
  const filteredContacts = contacts.filter(contact => {
    if (profile?.email && contact.value === profile.email) return false;
    if (profile?.phone && contact.value === profile.phone) return false;
    return true;
  });

  // Helper function to map icon names to emoji
  const getIconEmoji = (iconName) => {
    const iconMap = {
      'envelope': '📧',
      'phone': '📱',
      'map-marker': '📍',
      'globe': '🌐',
      'linkedin': '💼',
      'github': '💻',
      'twitter': '🐦'
    };
    return iconMap[iconName] || '•';
  };

  return (
    <div className={`startup-template ${className}`}>
      <header className="startup-header">
        <div className="startup-profile">
          {profile?.photo && (
            <div className="startup-avatar">
              <img src={profile.photo} alt={profile?.name || 'Profile'} />
            </div>
          )}
          <div className="startup-name-role">
            <h1>{profile?.name || 'Full Name'}</h1>
            <h2>{profile?.title || 'Professional Title'}</h2>
          </div>
        </div>
        
        <div className="startup-tagline">
          {professionalSummary && (
            <p>{typeof professionalSummary === 'string' ? professionalSummary : (professionalSummary.summary || '')}</p>
          )}
        </div>
        
        <div className="startup-contact-bar">
          {profile?.email && (
            <div className="startup-contact-item">
              <span className="startup-icon">📧</span>
              <span>{profile.email}</span>
            </div>
          )}
          {profile?.phone && (
            <div className="startup-contact-item">
              <span className="startup-icon">📱</span>
              <span>{profile.phone}</span>
            </div>
          )}
          {filteredContacts.map((contact, index) => (
            <div key={index} className="startup-contact-item">
              <span className="startup-icon">{contact.icon ? getIconEmoji(contact.icon) : '•'}</span>
              <span>{contact.value || ''}</span>
            </div>
          ))}
        </div>
      </header>

      <main className="startup-content">
        <div className="startup-main-column">
          {workExperience?.length > 0 && (
            <section className="startup-section">
              <h3 className="startup-section-title">Experience</h3>
              <div className="startup-timeline">
                {workExperience.map((job, index) => (
                  <div key={index} className="startup-timeline-item">
                    <div className="startup-timeline-marker"></div>
                    <div className="startup-timeline-content">
                      <div className="startup-job-header">
                        <h4>{typeof job === 'object' ? (job.title || 'Position') : 'Position'}</h4>
                        <span className="startup-date">
                          {typeof job === 'object' ? 
                            `${job.startDate || 'Start'} - ${job.endDate || 'Present'}` : 
                            'Date Range'}
                        </span>
                      </div>
                      <div className="startup-company-name">
                        {typeof job === 'object' ? (job.company || 'Company') : 'Company'}
                      </div>
                      <p className="startup-job-description">
                        {typeof job === 'object' && typeof job.description === 'string' ? 
                          job.description : 
                          ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {education?.length > 0 && (
            <section className="startup-section">
              <h3 className="startup-section-title">Education</h3>
              <div className="startup-education-list">
                {education.map((edu, index) => (
                  <div key={index} className="startup-education-item">
                    <h4>{typeof edu === 'object' ? (edu.degree || 'Degree') : 'Degree'}</h4>
                    <div className="startup-edu-details">
                      <span className="startup-institution">
                        {typeof edu === 'object' ? (edu.institution || 'Institution') : 'Institution'}
                      </span>
                      <span className="startup-date">
                        {typeof edu === 'object' ? 
                          `${edu.startDate || 'Start'} - ${edu.endDate || 'Present'}` : 
                          'Date Range'}
                      </span>
                    </div>
                    {typeof edu === 'object' && edu.description && 
                      <p>{typeof edu.description === 'string' ? edu.description : ''}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="startup-sidebar">
          {skills?.length > 0 && (
            <section className="startup-section">
              <h3 className="startup-section-title">Skills</h3>
              <div className="startup-skills-container">
                {skills.map((skill, index) => {
                  // Handle both string and object skill formats
                  if (typeof skill === 'string') {
                    return (
                      <div key={index} className="startup-skill-item">
                        <div className="startup-skill-info">
                          <span className="startup-skill-name">{skill}</span>
                          <span className="startup-skill-level">Intermediate</span>
                        </div>
                        <div className="startup-skill-bar">
                          <div className="startup-skill-progress" style={{ width: '50%' }}></div>
                        </div>
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
                    <div key={index} className="startup-skill-item">
                      <div className="startup-skill-info">
                        <span className="startup-skill-name">{skill.name || ''}</span>
                        <span className="startup-skill-level">{skill.level || ''}</span>
                      </div>
                      <div className="startup-skill-bar">
                        <div className="startup-skill-progress" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          
          {languages?.length > 0 && (
            <section className="startup-section">
              <h3 className="startup-section-title">Languages</h3>
              <div className="startup-languages-list">
                {languages.map((language, index) => (
                  <div key={index} className="startup-language-item">
                    <span className="startup-language-name">
                      {typeof language === 'string' ? language : 
                       typeof language === 'object' ? (language.name || '') : ''}
                    </span>
                    {typeof language === 'object' && language.level && (
                      <span className="startup-language-level">{language.level}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {interests?.length > 0 && (
            <section className="startup-section">
              <h3 className="startup-section-title">Interests</h3>
              <div className="startup-interests-list">
                {interests.map((interest, index) => (
                  <span key={index} className="startup-interest-tag">
                    {typeof interest === 'string' ? interest : 
                     typeof interest === 'object' ? (interest.name || '') : ''}
                  </span>
                ))}
              </div>
            </section>
          )}
        </aside>
      </main>
    </div>
  );
};

export default StartupTemplate;
