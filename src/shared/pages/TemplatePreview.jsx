import React, { useState } from 'react';
import { resumeData } from '../data/resumeData';
import ModernTemplate from '../../components/CVTemplates/ModernTemplate';
import ProfessionalTemplate from './Professional';
import './TemplatePreview.css';

const templates = {
  modern: {
    name: 'Modern',
    description: 'A contemporary design with a creative layout, perfect for tech, design, and creative roles. Features a clean sidebar and eye-catching accent colors.',
    component: ModernTemplate,
  },
  professional: {
    name: 'Professional',
    description: 'A traditional layout with a modern touch, ideal for corporate, business, and executive positions. Emphasizes experience and achievements.',
    component: ProfessionalTemplate,
  }
};

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

  const getTemplateComponent = () => {
    const Template = templates[selectedTemplate].component;
    return selectedTemplate === 'modern' ? 
      <Template data={modernData} /> : 
      <Template data={professionalData} />;
  };

  return (
    <div className="template-preview">
      <div className="template-selector">
        {Object.entries(templates).map(([key, template]) => (
          <button
            key={key}
            className={selectedTemplate === key ? 'active' : ''}
            onClick={() => setSelectedTemplate(key)}
            title={template.description}
          >
            {template.name}
          </button>
        ))}
      </div>
      <div className="template-info">
        <p>{templates[selectedTemplate].description}</p>
      </div>
      <div className="template-container">
        {getTemplateComponent()}
      </div>
    </div>
  );
};

export default TemplatePreview;
