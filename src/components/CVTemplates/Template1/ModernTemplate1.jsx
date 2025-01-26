import React from 'react';
import './style.css';

const ModernTemplate1 = () => {
  return (
    <div className="container">
      <header className="resume-header">
        <div className="header-content">
          <div className="profile-section">
            <div className="profile-image">
              <img src="profile-image.jpg" alt="Profile" />
            </div>
            <div className="profile-info">
              <div className="name-title">
                <h1>John Doe</h1>
                <p className="profession">Senior Technology Executive</p>
              </div>
              <div className="social-links">
                <a href="#" className="social-link">
                  <i className="fab fa-linkedin"></i>
                  <div className="link-details">
                    <span className="platform">LinkedIn</span>
                    <span className="username">@johndoe</span>
                  </div>
                </a>
                {/* Add more social links as needed */}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="resume-content">
        <aside className="resume-sidebar">
          <section className="contact">
            <div className="section-header">
              <h2>Contact</h2>
              <button className="add-button" aria-label="Add contact">
                <i className="fa-solid fa-circle-plus"></i>
              </button>
            </div>
            <ul className="contact-list">
              <li className="contact-item">
                <i className="fa-solid fa-phone" aria-hidden="true"></i>
                <span>+1 (555) 123-4567</span>
              </li>
              {/* Add more contact items */}
            </ul>
          </section>

          <section className="education">
            <div className="section-header">
              <h2>Education</h2>
              <button className="add-button" aria-label="Add education">
                <i className="fa-solid fa-circle-plus"></i>
              </button>
            </div>
            <div className="education-grid">
              <div className="education-item">
                <div className="education-header">
                  <div className="education-main">
                    <h3>Master of Business Administration</h3>
                    <h4>Harvard Business School</h4>
                    <div className="education-meta">
                      <div className="meta-row">
                        <span className="education-year">2018 - 2020</span>
                      </div>
                      <div className="meta-row">
                        <span className="education-location">Cambridge, MA</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="education-details">
                  Specialized in Strategic Management and Leadership. Graduated with honors.
                </p>
              </div>
            </div>
          </section>

          <section className="skills">
            <div className="section-header">
              <h2>Skills</h2>
              <button className="add-button" aria-label="Add skill">
                <i className="fa-solid fa-circle-plus"></i>
              </button>
            </div>
            <div className="skills-grid">
              <div className="skill-item">
                <span className="skill-name">HTML</span>
                <div className="skill-level">
                  <div className="skill-progress" style={{ width: '95%' }}></div>
                </div>
              </div>
              {/* Add more skill items */}
            </div>
          </section>
        </aside>

        <div className="main-content">
          <section className="summary-section">
            <div className="section-header">
              <h2>Professional Summary</h2>
              <button className="add-button" aria-label="Edit summary">
                <i className="fa-solid fa-circle-plus"></i>
              </button>
            </div>
            <p className="summary">
              Visionary and results-driven Senior Executive with over 15 years of leadership experience.
            </p>
          </section>

          <section className="experience">
            <div className="section-header">
              <h2>Experience</h2>
              <button className="add-button" aria-label="Add experience">
                <i className="fa-solid fa-circle-plus"></i>
              </button>
            </div>
            <div className="experience-item">
              <h3 className="job-title">Chief Operations Officer (COO)</h3>
              <p className="employer-info">
                TechCorp Solutions | 2020 - Present | New York, NY
              </p>
              <p className="job-description">
                Led digital transformation initiatives across the organization.
              </p>
              <div className="achievements-section">
                <h4 className="achievements-title">Key Achievements</h4>
                <ul className="achievements-list">
                  <li className="achievement-item">
                    <span className="achievement-bullet">•</span>
                    Recipient of the Telecom Industry Leader Award (2022)
                  </li>
                  {/* Add more achievements */}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ModernTemplate1;
