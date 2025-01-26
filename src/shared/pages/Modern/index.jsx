import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { modernTheme } from '../../styles/theme/modern';
import { Container } from '../../components/modern/Layout/Container';
import { ModernHeader } from '../../components/modern/Header/ModernHeader';
import { ModernSection } from '../../components/modern/Section/ModernSection';
import { ModernEducation } from '../../components/modern/Education/ModernEducation';
import { FloatingContact } from "../../components/common/FloatingContact";
import { ModernWorkExperience } from '../../components/modern/WorkExperience/ModernWorkExperience';
import { Skills } from "../../components/layout/Skills";
import { ModernProfessionalProfiles } from '../../components/modern/ProfessionalProfiles/ModernProfessionalProfiles';

const ResumeContent = styled.main`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
`;

const Modern = ({ data }) => {
    const { profile, contacts, education, skills, professionalSummary, workExperience, socialProfiles } = data;

    return (
        <ThemeProvider theme={modernTheme}>
            <Container>
                <ModernHeader
                    name={profile.name}
                    title={profile.title}
                    contacts={contacts}
                />
                <ResumeContent>
                    <ModernSection title="Professional Summary">
                        <p>{professionalSummary.text}</p>
                    </ModernSection>

                    <ModernSection title="Work Experience">
                        <ModernWorkExperience experiences={workExperience} />
                    </ModernSection>

                    <ModernSection title="Education">
                        <ModernEducation education={education} />
                    </ModernSection>

                    <ModernSection title="Skills">
                        <Skills skills={skills} />
                    </ModernSection>

                    <ModernSection title="Professional Profiles">
                        <ModernProfessionalProfiles profiles={socialProfiles} />
                    </ModernSection>
                </ResumeContent>
                <FloatingContact contacts={contacts} />
            </Container>
        </ThemeProvider>
    );
};

export default Modern;