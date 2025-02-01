// transformCVData.js

// Helper function to convert skill level to percentage
const convertSkillLevel = (level) => {
  const levels = {
    'Beginner': 25,
    'Intermediate': 50,
    'Advanced': 75,
    'Expert': 90
  };
  return levels[level] || '';
};

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  } catch {
    return 'N/A';
  }
};

import { getSocialIcon } from './socialIconUtils';
import { getCountryCode } from './countryUtils';

export const transformCVData = (cvData) => {
  if (!cvData) return null;

  const interests = cvData.interests?.map(interest => ({
    id: interest.id,
    name: interest.name
  })) || [];

  const languages = cvData.languages?.map(lang => ({
    id: lang.id,
    language: lang.language,
    proficiency: lang.proficiency || 'Not Specified'
  })) || [];

  const certifications = cvData.certifications?.map(cert => ({
    id: cert.id,
    name: cert.name || 'Certification',
    issuer: cert.issuing_organization || 'Unknown Organization',
    year: formatDate(cert.date_obtained),
    url: null  // Add URL if available in future
  })) || [];

  const profile = {
    name: `${cvData.first_name || ''} ${cvData.last_name || ''}`.trim(),
    profession: cvData.title || 'Professional',
    image: cvData.profile_image || 'https://placehold.co/150x150',
    socials: cvData.social_media?.map(social => ({
      platform: social.platform,
      username: social.url,
      icon: getSocialIcon(social.platform),
      url: social.url
    })) || []
  };

  const contacts = [
    cvData.contact_number && {
      type: 'phone',
      value: cvData.contact_number,
      icon: 'phone'
    },
    cvData.email && {
      type: 'email',
      value: cvData.email,
      url: `mailto:${cvData.email}`,
      icon: 'at'
    },
    (cvData.city || cvData.country) && {
      type: 'location',
      value: [
        cvData.city, 
        cvData.country ? `(${getCountryCode(cvData.country) || cvData.country})` : ''
      ].filter(Boolean).join(', '),
      icon: 'location-dot'
    }
  ].filter(Boolean);

  const education = cvData.education?.map(edu => ({
    degree: edu.degree,
    institution: edu.school_name,
    year: `${formatDate(edu.start_date)} - ${formatDate(edu.end_date)}`,
    location: edu.field_of_study,
    details: edu.description || ''
  })) || [];

  const skills = cvData.skills?.map(skill => ({
    name: skill.name,
    proficiency: skill.proficiency || 'Intermediate'
  })) || [];

  const professionalSummary = cvData.professional_summary || cvData.professional_summary?.summary || '';

  const workExperience = cvData.experiences?.map(exp => ({
    job_title: exp.job_title,
    company_name: exp.company_name,
    job_description: exp.job_description,
    achievements: exp.achievements,
    period: `${formatDate(exp.start_date)} - ${formatDate(exp.end_date)}`,
    location: [exp.city, getCountryCode(exp.country)].filter(Boolean).join(', ')
  })) || [];

  const socialMedia = cvData.social_media?.map(social => ({
    platform: social.platform,
    url: social.url,
    icon: getSocialIcon(social.platform)
  })) || [];

  return {
    profile,
    contacts,
    education,
    skills,
    professionalSummary,
    workExperience,
    certifications,
    socialMedia,
    interestsAndLanguages: { interests, languages }
  };
};

export default transformCVData;