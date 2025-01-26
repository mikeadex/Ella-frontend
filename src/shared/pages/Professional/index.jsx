// src/pages/Professional/index.jsx
import { ProfileSection } from "../../components/layout/ProfileSection";
import { ContactInfo } from "../../components/layout/ContactInfo";
import { Education } from "../../components/layout/Education";
import { Skills } from "../../components/layout/Skills";
import { ProfessionalSummary } from "../../components/layout/ProfessionalSummary";
import { WorkExperience } from "../../components/layout/WorkExperience";
import { FloatingContact } from "../../components/common/FloatingContact";

const Professional = ({ data }) => {
    const { profile, contacts, education, skills, professionalSummary, workExperience } = data;
    console.log('Work Experience:', workExperience); // Debug log

    return (
        <div className="container">
            <ProfileSection {...profile} />
            <main className="resume-content">
                <aside className="sidebar">
                    <div className="contact-section">
                        <ContactInfo contacts={contacts} />
                    </div>
                    <div className="education-section">
                        <Education educationList={education} />
                    </div>
                    <div className="skills-section">
                        <Skills skills={skills} />
                    </div>
                </aside>
                <div className="main-content">
                    <div className="summary-section">
                        <ProfessionalSummary summary={professionalSummary.text} />
                    </div>
                    <div className="experience-section">
                        <WorkExperience experiences={workExperience} />
                    </div>
                </div>
            </main>
            <FloatingContact contacts={contacts} />
        </div>
    );
};

export default Professional;