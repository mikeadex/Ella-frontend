import React from 'react';
import './styles.css';
import { generateQRCode, formatPortfolioUrl } from '../../../utils/qrCodeUtils';

const CorporateTemplate = ({ data, className = '' }) => {
  // Data structure mapping to match other templates
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

  // Find portfolio URL in contacts
  const portfolioContact = contacts.find(contact => 
    contact.label?.toLowerCase().includes('portfolio') || 
    contact.label?.toLowerCase().includes('website') ||
    contact.icon === 'globe'
  );
  
  const portfolioUrl = portfolioContact?.value || profile?.website || '';
  const formattedPortfolioUrl = formatPortfolioUrl(portfolioUrl);
  
  // Generate QR code if portfolio URL exists
  const qrCodeUrl = portfolioUrl ? generateQRCode(portfolioUrl, 120) : '';

  return (
    <div className={`corporate-template ${className}`}>
      <div className="corporate-main-content">
        <header className="corporate-header">
          <div className="corporate-personal">
            <h1 className="corporate-name">{profile?.name || 'Hello. I\'m John Doe,'}</h1>
            <div className="corporate-tagline">
              I Love What I Do<br />
              Because I'm Passionate<br />
              About It.
            </div>
          </div>
          
          {qrCodeUrl && (
            <div className="corporate-qr-section">
              <div className="corporate-portfolio-badge">
                <span>B</span>
              </div>
              <img 
                src={qrCodeUrl} 
                alt="Portfolio QR Code" 
                className="corporate-qr-code" 
              />
              <div className="corporate-portfolio-url">
                Portfolio
                <div>{formattedPortfolioUrl}</div>
              </div>
            </div>
          )}
        </header>
        
        <div className="corporate-content-wrapper">
          <div className="corporate-left">
            {professionalSummary && (
              <section className="corporate-section">
                <div className="corporate-text">
                  {typeof professionalSummary === 'string' ? professionalSummary : 
                  (professionalSummary.summary || '')}
                </div>
              </section>
            )}
            
            <section className="corporate-contact-section">
              <h3 className="corporate-section-title">CONTACT</h3>
              <div className="corporate-contact-list">
                {profile?.address && (
                  <div className="corporate-contact-item">
                    {profile.address}
                  </div>
                )}
                {profile?.city && profile?.country && (
                  <div className="corporate-contact-item">
                    {profile.city}{profile.state ? `, ${profile.state}` : ''} {profile.country}
                  </div>
                )}
                {profile?.phone && (
                  <div className="corporate-contact-item">
                    Phone: {profile.phone}
                  </div>
                )}
                {profile?.email && (
                  <div className="corporate-contact-item">
                    Email: {profile.email}
                  </div>
                )}
                {profile?.website && (
                  <div className="corporate-contact-item">
                    Web: {formatPortfolioUrl(profile.website)}
                  </div>
                )}
                {filteredContacts.map((contact, index) => (
                  <div key={index} className="corporate-contact-item">
                    {contact.label && `${contact.label}: `}{contact.value || ''}
                  </div>
                ))}
              </div>
            </section>
            
            {education?.length > 0 && (
              <section className="corporate-section">
                <h3 className="corporate-section-title">EDUCATION</h3>
                <div className="corporate-timeline">
                  {education.map((edu, index) => (
                    <div key={index} className="corporate-timeline-item">
                      {typeof edu === 'object' && (edu.startDate || edu.endDate) && (
                        <div className="corporate-edu-years">
                          {edu.startDate || ''} - {edu.endDate || ''}
                        </div>
                      )}
                      <div className="corporate-edu-details">
                        <div className="corporate-edu-degree">
                          {typeof edu === 'object' ? (edu.degree || 'The Degree of Your Study') : 'Degree'}
                        </div>
                        <div className="corporate-edu-institution">
                          {typeof edu === 'object' ? (edu.institution || 'Your Institution Name') : 'Institution'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {skills?.length > 0 && (
              <section className="corporate-section">
                <h3 className="corporate-section-title">SKILLS</h3>
                <div className="corporate-skills-list">
                  <ul>
                  {skills.map((skill, index) => (
                    <li key={index}>
                      {typeof skill === 'string' ? skill : (skill.name || '')}
                      {typeof skill === 'object' && skill.level && ` - ${skill.level}`}
                    </li>
                  ))}
                  </ul>
                </div>
              </section>
            )}
          </div>
          
          <div className="corporate-right">
            <div className="corporate-vertical-timeline">
              <h3 className="corporate-section-title">WORK EXPERIENCE</h3>
              {workExperience?.length > 0 && (
                <div className="corporate-experience-timeline">
                  {workExperience.map((job, index) => (
                    <div key={index} className="corporate-experience-item">
                      <div className="corporate-experience-year">
                        {typeof job === 'object' ? 
                          `${job.startDate || '2020'} - ${job.endDate || 'Present'}` : 
                          ''}
                      </div>
                      <div className="corporate-experience-content">
                        <h4 className="corporate-experience-title">
                          {typeof job === 'object' ? (job.title || 'Your Position Title') : 'Position Title'}
                        </h4>
                        <div className="corporate-experience-company">
                          {typeof job === 'object' ? (job.company || 'Company Name or Studio') : 'Company Name'} 
                          {typeof job === 'object' && job.location ? ` and ${job.location}` : ' and State'}
                        </div>
                        <div className="corporate-experience-description">
                          {typeof job === 'object' && typeof job.description === 'string' ? (
                            <p>{job.description}</p>
                          ) : (
                            <p>Praesus, num isisl reticaute aut qui qualitate eos velt sitatae volores tateatoreium quistin rene tem quis consectus fuga.</p>
                          )}
                          
                          {typeof job === 'object' && job.achievements && job.achievements.length > 0 ? (
                            <ul>
                              {job.achievements.map((achievement, i) => (
                                <li key={i}>{achievement}</li>
                              ))}
                            </ul>
                          ) : (
                            <ul>
                              <li>Ignotem fugias possequit dolupti noneent apleation naturem doleret odia</li>
                              <li>Ferepeit exerunt dolum sim in eium nature nus</li>
                              {index === workExperience.length - 1 && (
                                <>
                                  <li>Tem a vollute autem, conehen duretemle sietem corum apid excestiontem ipist verdis elicate mo</li>
                                  <li>Dolutsatio de dios commet promovis hit maxim si dit octabor unipeugd qui sum ircta</li>
                                </>
                              )}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateTemplate;
