import React from 'react';
import './style.css';

const ModernTemplate2 = () => {
  return (
    <div className="container">
      <header className="resume-header">
        <div className="header-content">
          <div className="profile-section">
            <div className="profile-info">
              <div className="name-title">
                <h1>Sarah Anderson</h1>
                <p className="profession">Senior UX Designer</p>
              </div>
              <div className="contact-info">
                <div className="contact-item">
                  <i className="fa-solid fa-phone" aria-hidden="true"></i>
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <i className="fa-solid fa-envelope" aria-hidden="true"></i>
                  <span>sarah.anderson@email.com</span>
                </div>
                <div className="contact-item">
                  <i className="fa-solid fa-location-dot" aria-hidden="true"></i>
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="resume-content">
        <div className="main-content">
          <section className="summary-section">
            <div className="section-header">
              <h2>Professional Summary</h2>
              <button className="add-button" aria-label="Edit summary">
                <i className="fa-solid fa-circle-plus"></i>
              </button>
            </div>
            <p className="summary">
              Award-winning Senior UX Designer with 8+ years of experience creating innovative digital experiences.
            </p>
          </section>

          <section className="education">
            <div className="section-header">
              <h2>Education</h2>
              <button className="add-button" aria-label="Add education">
                <i className="fa-solid fa-circle-plus"></i>
              </button>
            </div>
            <div className="education-timeline">
              <div className="education-item">
                <div className="timeline-dot"></div>
                <div className="education-year">2017</div>
                <div className="education-content">
                  <h3 className="degree">Master of Fine Arts in Design</h3>
                  <span className="school">Rhode Island School of Design</span>
                  <p className="specialization">UX Design & Interactive Systems</p>
                  <div className="education-highlights">
                    <span className="highlight-item">Graduate Research Fellow</span>
                    <span className="highlight-item">Best Thesis Award</span>
                    <span className="highlight-item">3.95 GPA</span>
                  </div>
                </div>
              </div>
              {/* Add more education items */}
            </div>
          </section>

          <section className="experience">
            <div className="section-header">
              <h2>Experience</h2>
              <button className="add-button" aria-label="Add experience">
                <i className="fa-solid fa-circle-plus"></i>
              </button>
            </div>
            {/* Add experience items */}
          </section>
        </div>

        <aside className="resume-sidebar">
          <section className="skills" aria-labelledby="skills-heading">
            <div className="section-header">
              <h2 id="skills-heading">Technical Skills</h2>
              <button className="add-button" aria-label="Add skill">
                <i className="fa-solid fa-circle-plus" aria-hidden="true"></i>
              </button>
            </div>
            <div className="skills-grid" role="list">
              <div className="skill-item" role="listitem">
                <span className="skill-name">User Interface Design</span>
                <div 
                  className="skill-level" 
                  role="progressbar" 
                  aria-valuenow="95" 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                >
                  <div className="skill-progress" style={{ width: '95%' }} aria-hidden="true"></div>
                </div>
                <span className="skill-keywords" aria-hidden="true">
                  UI/UX, Wireframing, Prototyping, User-Centered Design
                </span>
              </div>
              {/* Add more skill items */}
            </div>
          </section>

          <section className="social-section" aria-labelledby="social-heading">
            <div className="section-header">
              <h2 id="social-heading">Professional Profiles</h2>
              <button className="add-button" aria-label="Add social profile">
                <i className="fa-solid fa-circle-plus" aria-hidden="true"></i>
              </button>
            </div>
            <div className="social-grid" role="list">
              <a 
                href="https://linkedin.com/in/sarahanderson" 
                className="social-link" 
                role="listitem" 
                aria-label="LinkedIn Profile - Sarah Anderson"
              >
                <i className="fab fa-linkedin" aria-hidden="true"></i>
                <div className="link-details">
                  <span className="platform">LinkedIn</span>
                  <span className="username">linkedin.com/in/sarahanderson</span>
                </div>
              </a>
              {/* Add more social links */}
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
};

export default ModernTemplate2;
