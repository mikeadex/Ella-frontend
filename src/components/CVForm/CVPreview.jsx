import React, { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import DOMPurify from 'dompurify';
import { modernTheme } from '../../styles/theme/modern';
import { Container } from '../modern/Layout/Container';
import { ModernHeader } from '../modern/Header/ModernHeader';
import { ModernSection } from '../modern/Section/ModernSection';
import { ModernEducation } from '../modern/Education/ModernEducation';
import { ModernWorkExperience } from '../modern/WorkExperience/ModernWorkExperience';
import { Skills } from '../layout/Skills';
import { SocialMedia } from '../layout/SocialMedia';
import { ModernInterestsAndLanguages } from '../modern/InterestsAndLanguages/ModernInterestsAndLanguages';
import { ModernCertifications } from '../modern/Certifications/ModernCertifications';
import { Dialog } from '@headlessui/react';
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axiosInstance from '../../api/axios';

const ResumeContent = styled.main`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
`;

const Summary = styled.p`
  font-size: 1em;
  line-height: 1.8;
  color: var(--text-light);

  @media (max-width: 768px) {
    font-size: 0.95em;
    line-height: 1.6;
  }

  @media (max-width: 480px) {
    font-size: 0.9em;
    line-height: 1.5;
  }
`;

const EditButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  border-radius: 50%;
  background: var(--bg-light);
  border: 1px solid var(--border-color);
  color: var(--text-dark);
  opacity: 0.3;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    opacity: 1;
    background: var(--primary-color);
    color: white;
    transform: scale(1.05);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    opacity: 0.6;  /* More visible on mobile by default */
  }
`;

const SectionWrapper = styled.div`
  position: relative;

  &:hover ${EditButton} {
    opacity: 1;
  }
`;

const CVPreview = ({ cvData, loading, error }) => {
  const [editingSection, setEditingSection] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    console.log('CVData in Preview:', cvData);
    console.log('Work Experience:', cvData?.workExperience);
  }, [cvData]);

  const handleEdit = (section, data) => {
    setEditingSection(section);
    setEditingData(data);
    setIsEditing(true);
  };

  const handleUpdate = async (sectionType, data) => {
    try {
      let endpoint;
      let method;
      let payload = { ...data };

      switch (sectionType) {
        case 'profile':
          endpoint = `/api/cv_writer/cv/${cvData.id}/`;
          method = 'put';
          break;
        case 'education':
          endpoint = data.id 
            ? `/api/cv_writer/education/${data.id}/`
            : '/api/cv_writer/education/';
          method = data.id ? 'put' : 'post';
          payload.cv = cvData.id;
          break;
        case 'experience':
          endpoint = data.id 
            ? `/api/cv_writer/experience/${data.id}/`
            : '/api/cv_writer/experience/';
          method = data.id ? 'put' : 'post';
          payload.cv = cvData.id;
          break;
        case 'skills':
          endpoint = data.id 
            ? `/api/cv_writer/skill/${data.id}/`
            : '/api/cv_writer/skill/';
          method = data.id ? 'put' : 'post';
          payload.cv = cvData.id;
          break;
        default:
          throw new Error('Invalid section type');
      }

      await axiosInstance[method](endpoint, payload);
      // Refresh the page to get updated data
      window.location.reload();
    } catch (err) {
      console.error('Error updating section:', err);
    } finally {
      setIsEditing(false);
      setEditingSection(null);
      setEditingData(null);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={modernTheme}>
        <Container>
          <div>Loading...</div>
        </Container>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={modernTheme}>
        <Container>
          <div>Error: {error}</div>
        </Container>
      </ThemeProvider>
    );
  }

  if (!cvData) {
    return (
      <ThemeProvider theme={modernTheme}>
        <Container>
          <div>No CV data available</div>
        </Container>
      </ThemeProvider>
    );
  }

  const { 
    profile, 
    contacts, 
    education, 
    skills, 
    professionalSummary, 
    workExperience,
    socialMedia,
    interestsAndLanguages = { interests: [], languages: [] },
    certifications = []
  } = cvData;

  const { 
    interests = interestsAndLanguages.interests, 
    languages = interestsAndLanguages.languages 
  } = interestsAndLanguages;

  return (
    <ThemeProvider theme={modernTheme}>
      <Container>
        <SectionWrapper>
          <EditButton onClick={() => handleEdit('profile', profile)}>
            <PencilIcon className="h-5 w-5" />
          </EditButton>
          <ModernHeader 
            name={profile?.name} 
            profession={profile?.profession}
            contacts={[
              ...(profile?.email ? [{ icon: 'envelope', value: profile.email }] : []),
              ...(profile?.contact_number ? [{
                icon: 'phone', 
                value: profile.contact_number
              }] : []),
              ...(contacts || [])
            ]}
            socialMedia={socialMedia}
          />
        </SectionWrapper>

        <ResumeContent>
          <MainContent>
            {professionalSummary && (
              <SectionWrapper>
                <EditButton onClick={() => handleEdit('summary', { summary: professionalSummary })}>
                  <PencilIcon className="h-5 w-5" />
                </EditButton>
                <ModernSection title="Professional Summary">
                  <Summary 
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(professionalSummary) 
                    }} 
                  />
                </ModernSection>
              </SectionWrapper>
            )}

            {education && education.length > 0 && (
              <SectionWrapper>
                <EditButton onClick={() => handleEdit('education', education)}>
                  <PencilIcon className="h-5 w-5" />
                </EditButton>
                <ModernSection title="Education">
                  <ModernEducation educationList={education} />
                </ModernSection>
              </SectionWrapper>
            )}

            {workExperience && workExperience.length > 0 && (
              <SectionWrapper>
                <EditButton onClick={() => handleEdit('experience', workExperience)}>
                  <PencilIcon className="h-5 w-5" />
                </EditButton>
                <ModernSection title="Work Experience">
                  <ModernWorkExperience 
                    experiences={workExperience.map(exp => ({
                      title: exp.job_title,
                      company: exp.company_name,
                      description: exp.job_description,
                      responsibilities: Array.isArray(exp.achievements) 
                        ? exp.achievements 
                        : exp.achievements?.split(/[.;]\s*/).filter(a => a.trim()) || [],
                      period: exp.period,
                      location: exp.location
                    }))} 
                  />
                </ModernSection>
              </SectionWrapper>
            )}

            {certifications.length > 0 && (
              <SectionWrapper>
                <EditButton onClick={() => handleEdit('certifications', certifications)}>
                  <PencilIcon className="h-5 w-5" />
                </EditButton>
                <ModernSection title="Certifications">
                  <ModernCertifications certifications={certifications} />
                </ModernSection>
              </SectionWrapper>
            )}

            {skills && skills.length > 0 && (
              <SectionWrapper>
                <EditButton onClick={() => handleEdit('skills', skills)}>
                  <PencilIcon className="h-5 w-5" />
                </EditButton>
                <ModernSection title="Skills">
                  <Skills skills={skills} />
                </ModernSection>
              </SectionWrapper>
            )}

            {(interests.length > 0 || languages.length > 0) && (
              <SectionWrapper>
                <EditButton onClick={() => handleEdit('interests-languages', { interests, languages })}>
                  <PencilIcon className="h-5 w-5" />
                </EditButton>
                <ModernSection title="Interests and Languages">
                  <ModernInterestsAndLanguages 
                    interests={interests}
                    languages={languages}
                  />
                </ModernSection>
              </SectionWrapper>
            )}
          </MainContent>
        </ResumeContent>

        <Dialog
          open={isEditing}
          onClose={() => setIsEditing(false)}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <div className="flex min-h-screen items-center justify-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 p-6">
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Edit {editingSection}
              </Dialog.Title>

              {/* Render form fields based on section type */}
              {/* You'll need to implement the specific form fields for each section */}
              {/* This is where you'll connect with your existing form components */}
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdate(editingSection, editingData)}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default CVPreview;
