import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLinkedin, 
  faGithub, 
  faTwitter, 
  faFacebook, 
  faInstagram, 
  faBehance, 
  faDribbble 
} from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const SocialMediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--spacing-sm);
  width: 100%;
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background-color: var(--surface-color);
  color: var(--text-light);
  text-decoration: none;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-sm);
    border-color: var(--accent-color);
    color: var(--accent-color);
  }
`;

const SocialIcon = styled(FontAwesomeIcon)`
  font-size: 1.2em;
`;

const PlatformName = styled.span`
  font-size: 0.9em;
  font-weight: 500;
`;

const socialIcons = {
  'LinkedIn': faLinkedin,
  'GitHub': faGithub,
  'Twitter': faTwitter,
  'Facebook': faFacebook,
  'Instagram': faInstagram,
  'Behance': faBehance,
  'Dribbble': faDribbble,
  'Portfolio': faGlobe
};

export const SocialMedia = ({ socialMedia = [] }) => {
  const getIcon = (platform) => {
    return socialIcons[platform] || faGlobe;
  };

  return (
    <SocialMediaGrid>
      {socialMedia.map((social, index) => (
        <SocialLink 
          key={index} 
          href={social.url} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <SocialIcon icon={getIcon(social.platform)} />
          <PlatformName>{social.platform}</PlatformName>
        </SocialLink>
      ))}
    </SocialMediaGrid>
  );
};
