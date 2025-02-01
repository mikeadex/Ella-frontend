import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCertificate, 
  faAward, 
  faGraduationCap, 
  faLink 
} from '@fortawesome/free-solid-svg-icons';

// Theme consistent with other modern components
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
  }
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  width: 100%;
  background-color: var(--background-secondary);
  padding: var(--spacing-lg);
  border-radius: 15px;
`;

const SectionTitle = styled.h2`
  font-size: var(--font-size-large);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const CertificationGrid = styled.div.attrs(props => {
  const attrs = {};
  if (props.itemcount) attrs['data-itemcount'] = props.itemcount;
  return attrs;
})`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);

  @media (max-width: 768px) {
    grid-template-columns: ${props => 
      props.itemcount === 1 
        ? '1fr' 
        : 'repeat(auto-fill, minmax(200px, 1fr))'
    };
  }
`;

const CertificationCard = styled.div.attrs(props => {
  const attrs = {};
  if (props.issingleitem) attrs['data-issingleitem'] = props.issingleitem;
  return attrs;
})`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 15px;
  padding: var(--spacing-md);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    ${props => props.issingleitem && `
      transform: scale(1.1);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
      z-index: 10;
    `}
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

const CertificationIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  font-size: 2em;
  color: var(--accent-color-light);
  opacity: 0.5;
`;

const CertificationDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const CertificationName = styled.h3`
  font-size: var(--font-size-medium);
  color: var(--text-primary);
  margin: 0;
`;

const CertificationIssuer = styled.p`
  font-size: var(--font-size-small);
  color: var(--text-secondary);
  margin: 0;
`;

const CertificationMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-sm);
`;

const CertificationYear = styled.span`
  font-size: var(--font-size-small);
  color: var(--text-secondary);
`;

const CertificationLink = styled.a`
  color: var(--accent-color);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-small);
  transition: color 0.3s ease;

  &:hover {
    color: var(--accent-color-light);
  }
`;

// Map of certification icons based on name or type
const certificationIcons = {
  'AWS': faAward,
  'Google': faGraduationCap,
  'Microsoft': faAward,
  'default': faCertificate
};

export const ModernCertifications = ({ 
  certifications = [] 
}) => {
  // Function to get appropriate icon
  const getIcon = (name) => {
    const iconKey = Object.keys(certificationIcons).find(key => 
      name.toLowerCase().includes(key.toLowerCase())
    );
    return certificationIcons[iconKey] || certificationIcons.default;
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        {certifications.length > 0 && (
          <>
            <SectionTitle>
              <FontAwesomeIcon icon={faCertificate} />
              Certifications
            </SectionTitle>
            <CertificationGrid itemcount={certifications.length}>
              {certifications.map((cert) => (
                <CertificationCard 
                  key={cert.id}
                  issingleitem={certifications.length === 1 ? 'true' : 'false'}
                >
                  <CertificationIcon 
                    icon={getIcon(cert.name || cert.issuer)} 
                  />
                  <CertificationDetails>
                    <CertificationName>{cert.name}</CertificationName>
                    <CertificationIssuer>{cert.issuer}</CertificationIssuer>
                    <CertificationMeta>
                      <CertificationYear>{cert.year}</CertificationYear>
                      {cert.url && (
                        <CertificationLink 
                          href={cert.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <FontAwesomeIcon icon={faLink} />
                          View
                        </CertificationLink>
                      )}
                    </CertificationMeta>
                  </CertificationDetails>
                </CertificationCard>
              ))}
            </CertificationGrid>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};
