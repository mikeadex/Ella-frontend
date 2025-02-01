import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
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
import { faGlobe, faEnvelope, faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons';

const theme = {
  colors: {
    primary: '#333333',
    secondary: '#666666',
    accent: '#3498db',
    'accent-color': '#3498db',
    'accent-color-light': 'rgba(52, 152, 219, 0.1)',
    text: {
      primary: '#333333',
      secondary: '#666666',
      light: '#777777'
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F5F5F5'
    }
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSize: {
      small: '0.8rem',
      medium: '1rem',
      large: '1.2rem'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  header: {
    nameGradient: 'linear-gradient(to right, #000000, #434343)',
    professionSize: {
      default: '1.2em',
      tablet: '1.1em',
      mobile: '1em'
    },
    professionWeight: 500
  }
};

const HeaderWrapper = styled.header`
  margin-bottom: var(--spacing-2xl);
  text-align: center;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
`;

const Name = styled.h1`
  font-size: 3.5em;
  font-weight: 800;
  background: ${props => props.theme.header.nameGradient};
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: var(--spacing-xs);

  @media (max-width: 768px) {
    font-size: 2.8em;
  }

  @media (max-width: 480px) {
    font-size: 2.2em;
  }
`;

const Profession = styled.p`
  font-size: ${props => props.theme.header.professionSize.default};
  font-weight: ${props => props.theme.header.professionWeight};
  color: var(--secondary-color);
  margin: 0;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: ${props => props.theme.header.professionSize.tablet};
  }

  @media (max-width: 480px) {
    font-size: ${props => props.theme.header.professionSize.mobile};
  }
`;

const ContactContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
  margin-top: var(--spacing-lg);
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: var(--spacing-sm);
    margin-top: var(--spacing-md);
  }
`;

const ContactList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: var(--spacing-sm);
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-light);
  
  .contact-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5em;
    height: 2.5em;
    border-radius: 15%;
    background-color: var(--accent-color-light);
    transition: all 0.3s ease;
    cursor: pointer;

    @media (max-width: 768px) {
      width: 3.5em;
      height: 3.5em;
      background-color: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    &:hover {
      background-color: var(--accent-color);
      
      @media (max-width: 768px) {
        background-color: var(--accent-color);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
      }
    }
  }

  .contact-icon {
    font-size: 1.2em;
    color: var(--accent-color);
    transition: color 0.3s ease;

    @media (max-width: 768px) {
      font-size: 1.5em;
      color: var(--accent-color);
    }

    .contact-icon-wrapper:hover & {
      color: white;
    }
  }

  .contact-text {
    @media (max-width: 768px) {
      display: none;
    }
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: var(--accent-color);
    }
  }
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  
  .social-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5em;
    height: 2.5em;
    border-radius: 15%;
    background-color: var(--accent-color-light);
    transition: all 0.3s ease;
    cursor: pointer;

    @media (max-width: 768px) {
      width: 3.5em;
      height: 3.5em;
      background-color: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    &:hover {
      background-color: var(--accent-color);
      
      @media (max-width: 768px) {
        background-color: var(--accent-color);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
      }
    }
  }

  .social-icon {
    font-size: 1.5em;
    color: var(--accent-color);
    transition: color 0.3s ease;

    @media (max-width: 768px) {
      font-size: 1.5em;
      color: var(--accent-color);
    }

    .social-icon-wrapper:hover & {
      color: white;
    }
  }

  .social-text {
    @media (max-width: 768px) {
      display: none;
    }
  }

  &:hover {
    color: var(--secondary-color);
  }
`;

const SocialLinkText = styled.span`
  font-size: 0.8em;
  margin-left: var(--spacing-xs);
`;

const ContactText = styled.span`
  font-size: 0.8em;
  margin-left: var(--spacing-xs);
`;

const LocationModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: var(--spacing-lg);
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  z-index: 1000;
  text-align: center;
  max-width: 90%;
  width: 300px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const CloseButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: var(--accent-color);
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

const contactIcons = {
  'email': faEnvelope,
  'phone': faPhone,
  'location': faLocationDot
};

export const ModernHeader = ({ 
  name, 
  profession, 
  contacts = [], 
  socialMedia = [] 
}) => {
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Function to handle mobile interactions
  const handleMobileInteraction = (contact) => {
    // Check if on mobile device
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) return;

    switch(contact.type) {
      case 'phone':
        window.location.href = `tel:${contact.value.replace(/\s+/g, '')}`;
        break;
      case 'location':
        setCurrentLocation(contact.value);
        setLocationModalOpen(true);
        break;
      default:
        break;
    }
  };

  // Combine contacts and social media into a single row
  const combinedLinks = [
    ...contacts.map(contact => {
      // Special handling for phone number to make it dialable
      if (contact.type === 'phone') {
        return {
          ...contact,
          url: `tel:${contact.value.replace(/\s+/g, '')}`,
          type: 'phone'
        };
      }
      // Special handling for location to show full address
      if (contact.type === 'location') {
        return {
          ...contact,
          value: contact.value || 'Location not specified',
          type: 'location'
        };
      }
      return contact;
    }).map(contact => ({
      ...contact,
      icon: contactIcons[contact.type] || faLocationDot
    })),
    ...socialMedia.map(social => ({
      ...social,
      type: 'social',
      icon: socialIcons[social.platform] || faGlobe
    }))
  ];

  return (
    <ThemeProvider theme={theme}>
      <HeaderWrapper>
        <HeaderContent>
          <div>
            <Name>{name}</Name>
            <Profession>{profession}</Profession>
          </div>
          <ContactContainer>
            {combinedLinks.length > 0 && (
              <ContactList>
                {combinedLinks.map((link, index) => (
                  link.type !== 'social' ? (
                    <ContactItem 
                      key={index} 
                      onClick={() => handleMobileInteraction(link)}
                    >
                      <div className="contact-icon-wrapper">
                        <FontAwesomeIcon 
                          icon={link.icon} 
                          className="contact-icon"
                        />
                      </div>
                      <ContactText className="contact-text">
                        {link.url ? (
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            {link.value}
                          </a>
                        ) : (
                          link.value
                        )}
                      </ContactText>
                    </ContactItem>
                  ) : (
                    <SocialLink 
                      key={index} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title={link.platform}
                    >
                      <div className="social-icon-wrapper">
                        <FontAwesomeIcon 
                          icon={link.icon} 
                          className="social-icon"
                        />
                      </div>
                      <SocialLinkText className="social-text">
                        {link.platform}
                      </SocialLinkText>
                    </SocialLink>
                  )
                ))}
              </ContactList>
            )}
          </ContactContainer>
        </HeaderContent>
      </HeaderWrapper>

      {/* Location Modal */}
      {locationModalOpen && (
        <ModalOverlay onClick={() => setLocationModalOpen(false)}>
          <LocationModal onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setLocationModalOpen(false)}>
              ×
            </CloseButton>
            <h3>Location</h3>
            <p>{currentLocation}</p>
          </LocationModal>
        </ModalOverlay>
      )}
    </ThemeProvider>
  );
};