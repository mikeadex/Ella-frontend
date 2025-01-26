import React, { useState } from 'react';
import { resumeData } from '../data/resumeData';
import ModernTemplate from '../../components/CVTemplates/ModernTemplate';
import ProfessionalTemplate from './Professional';
import './TemplatePreview.css';

const transformModernData = (data) => {
  return {
    profile: {
      name: data.profile.name,
      title: data.profile.profession,
      profession: data.profile.profession,
      image: data.profile.image,
      socials: data.profile.socials.map(social => ({
        ...social,
        icon: `fa-brands fa-${social.icon}`
      }))
    },
    contacts: data.contacts.map(contact => ({
      ...contact,
      icon: `fa-solid fa-${contact.icon}`
    })),
    professionalSummary: {
      text: data.professionalSummary
    },
    workExperience: data.workExperience.map(exp => ({
      title: exp.title,
      company: exp.company,
      location: exp.location,
      period: exp.period,
      responsibilities: exp.responsibilities,
      achievements: exp.achievements
    })),
    education: data.education,
    skills: data.skills,
    certifications: [],
    languages: [],
    interests: [],
    references: []
  };
};

const transformProfessionalData = (data) => {
  return {
    profile: {
      name: data.profile.name,
      title: data.profile.profession,
      profession: data.profile.profession,
      image: data.profile.image,
      socials: data.profile.socials.map(social => ({
        ...social,
        icon: `fa-brands fa-${social.icon}`
      }))
    },
    contacts: data.contacts.map(contact => ({
      ...contact,
      icon: `fa-solid fa-${contact.icon}`
    })),
    professionalSummary: {
      text: data.professionalSummary
    },
    workExperience: data.workExperience.map(exp => ({
      title: exp.title,
      company: exp.company,
      location: exp.location,
      period: exp.period,
      responsibilities: exp.responsibilities,
      achievements: exp.achievements
    })),
    education: data.education.map(edu => ({
      degree: edu.degree,
      institution: edu.institution,
      location: edu.location,
      year: edu.year,
      details: edu.details
    })),
    skills: data.skills.map(skill => ({
      name: skill.name,
      level: skill.level
    }))
  };
};

const TemplatePreview = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const modernData = transformModernData(resumeData);
  const professionalData = transformProfessionalData(resumeData);

  console.log('Professional Data:', professionalData); // Debug log

  const templates = {
    modern: <ModernTemplate data={modernData} />,
    professional: <ProfessionalTemplate data={professionalData} />
  };

  return (
    <div className="template-preview">
      <div className="template-selector">
        <button
          className={selectedTemplate === 'modern' ? 'active' : ''}
          onClick={() => setSelectedTemplate('modern')}
        >
          Modern
        </button>
        <button
          className={selectedTemplate === 'professional' ? 'active' : ''}
          onClick={() => setSelectedTemplate('professional')}
        >
          Professional
        </button>
      </div>
      <div className="template-container">
        {templates[selectedTemplate]}
      </div>
    </div>
  );
};

export default TemplatePreview;
