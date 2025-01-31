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
  if (!dateString) return 'Present';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

// Helper function to get social media icon
const getSocialIcon = (platform) => {
  const icons = {
    'LinkedIn': 'linkedin',
    'GitHub': 'github',
    'Twitter': 'twitter',
    'Facebook': 'facebook',
    'Instagram': 'instagram',
    'Portfolio': 'globe',
    'Behance': 'behance',
    'Dribbble': 'dribbble'
  };
  return icons[platform] || 'link';
};

export const transformCVData = (cvData) => {
  if (!cvData) return null;

  return {
    profile: {
      name: `${cvData.first_name || ''} ${cvData.last_name || ''}`.trim(),
      profession: cvData.title || 'Professional',
      image: cvData.profile_image || 'https://placehold.co/150x150',
      socials: cvData.social_media?.map(social => ({
        platform: social.platform,
        username: social.url,
        icon: getSocialIcon(social.platform),
        url: social.url
      })) || []
    },
    contacts: [
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
      (cvData.address || cvData.city || cvData.country) && {
        type: 'location',
        value: [cvData.address, cvData.city, cvData.country].filter(Boolean).join(', '),
        icon: 'location-dot'
      }
    ].filter(Boolean),
    education: cvData.education?.map(edu => ({
      degree: edu.degree,
      institution: edu.school_name,
      year: `${formatDate(edu.start_date)} - ${formatDate(edu.end_date)}`,
      location: edu.field_of_study,
      details: edu.description || ''
    })) || [],
    skills: cvData.skills?.map(skill => ({
      name: skill.skill_name,
      level: convertSkillLevel(skill.skill_level)
    })) || [],
    professionalSummary: cvData.professional_summary?.summary || '',
    workExperience: cvData.experience?.map(exp => ({
      title: exp.job_title,
      company: exp.company_name,
      location: '',
      period: `${formatDate(exp.start_date)} - ${formatDate(exp.end_date)}`,
      responsibilities: exp.job_description?.split('\n').filter(Boolean) || [],
      achievements: exp.achievements?.split('\n').filter(Boolean) || []
    })) || [],
    languages: cvData.languages?.map(lang => ({
      name: lang.language_name,
      level: convertSkillLevel(lang.language_level)
    })) || [],
    certifications: cvData.certifications?.map(cert => ({
      name: cert.certificate_name,
      issuer: '',
      date: formatDate(cert.certificate_date),
      url: cert.certificate_link
    })) || [],
    interests: cvData.interests?.map(interest => ({
      name: interest.name,
      icon: 'circle'
    })) || []
  };
};

export default transformCVData;