import React from 'react';
import './styles.css';

const MinimalistTemplate = ({ data }) => {
  const {
    personalInfo,
    professionalSummary,
    experience,
    education,
    skills,
    certifications,
    languages,
    interests,
    references,
    socialMedia
  } = data;

  return (
    <div className="minimalist-cv">
      {/* Sidebar */}
      <aside className="minimalist-sidebar">
        <div className="profile-section">
          <h1>{personalInfo?.first_name}<br />{personalInfo?.last_name}</h1>
        </div>

        <div className="contact-section">
          <h2>Contact</h2>
          <ul>
            <li>{personalInfo?.email}</li>
            <li>{personalInfo?.contact_number}</li>
            <li>{personalInfo?.address}</li>
            <li>{personalInfo?.city}, {personalInfo?.country}</li>
          </ul>
        </div>

        {skills?.length > 0 && (
          <div className="skills-section">
            <h2>Skills</h2>
            <ul>
              {skills.map((skill, index) => (
                <li key={index}>
                  <span>{skill.skill_name}</span>
                  <div className="skill-bar">
                    <div 
                      className="skill-level"
                      style={{ 
                        width: `${
                          skill.skill_level === 'Beginner' ? '33%' :
                          skill.skill_level === 'Intermediate' ? '66%' :
                          '100%'
                        }`
                      }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {languages?.length > 0 && (
          <div className="languages-section">
            <h2>Languages</h2>
            <ul>
              {languages.map((lang, index) => (
                <li key={index}>
                  {lang.language_name} - {lang.language_level}
                </li>
              ))}
            </ul>
          </div>
        )}

        {socialMedia?.length > 0 && (
          <div className="social-section">
            <h2>Connect</h2>
            <ul>
              {socialMedia.map((social, index) => (
                <li key={index}>
                  <a href={social.url} target="_blank" rel="noopener noreferrer">
                    {social.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="minimalist-main">
        {professionalSummary && (
          <section className="summary-section">
            <h2>Professional Summary</h2>
            <p>{professionalSummary}</p>
          </section>
        )}

        {experience?.length > 0 && (
          <section className="experience-section">
            <h2>Experience</h2>
            {experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <div className="timeline">
                  <span>{exp.start_date} - {exp.current ? 'Present' : exp.end_date}</span>
                </div>
                <div className="content">
                  <h3>{exp.job_title}</h3>
                  <h4>{exp.company_name}</h4>
                  <p>{exp.job_description}</p>
                  {exp.achievements && (
                    <ul className="achievements">
                      {exp.achievements.split('\n').map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {education?.length > 0 && (
          <section className="education-section">
            <h2>Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="timeline">
                  <span>{edu.start_date} - {edu.current ? 'Present' : edu.end_date}</span>
                </div>
                <div className="content">
                  <h3>{edu.degree}</h3>
                  <h4>{edu.school_name}</h4>
                  <p>{edu.field_of_study}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {certifications?.length > 0 && (
          <section className="certifications-section">
            <h2>Certifications</h2>
            <div className="certifications-grid">
              {certifications.map((cert, index) => (
                <div key={index} className="certification-item">
                  <h3>{cert.certificate_name}</h3>
                  <p>{cert.issuer}</p>
                  <span>{cert.certificate_date}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {interests?.length > 0 && (
          <section className="interests-section">
            <h2>Interests</h2>
            <div className="interests-list">
              {interests.map((interest, index) => (
                <span key={index} className="interest-tag">
                  {interest.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {references?.length > 0 && (
          <section className="references-section">
            <h2>References</h2>
            <div className="references-grid">
              {references.map((ref, index) => (
                <div key={index} className="reference-item">
                  <h3>{ref.name}</h3>
                  <p>{ref.title} at {ref.company}</p>
                  <p>{ref.email}</p>
                  {ref.phone && <p>{ref.phone}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default MinimalistTemplate;
