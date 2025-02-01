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

export const socialIcons = {
  'LinkedIn': faLinkedin,
  'GitHub': faGithub,
  'Twitter': faTwitter,
  'Facebook': faFacebook,
  'Instagram': faInstagram,
  'Behance': faBehance,
  'Dribbble': faDribbble,
  'Portfolio': faGlobe
};

export const getSocialIcon = (platform) => {
  return socialIcons[platform] || faGlobe;
};
