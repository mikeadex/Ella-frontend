import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCamera, 
  faCode, 
  faRobot, 
  faShieldAlt, 
  faGlobeEurope, 
  faLanguage 
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

// Styled components for interests and languages
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

const InterestsGrid = styled.div.attrs(props => {
  const attrs = {};
  if (props.itemcount) attrs['data-itemcount'] = props.itemcount;
  return attrs;
})`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--spacing-md);
  width: 100%;
  padding: var(--spacing-md);

  @media (max-width: 768px) {
    grid-template-columns: ${props => 
      props.itemcount === 1 
        ? '1fr' 
        : 'repeat(auto-fill, minmax(120px, 1fr))'
    };
    gap: var(--spacing-lg);
    row-gap: var(--spacing-lg);
    column-gap: var(--spacing-md);
    justify-content: center;
    align-items: stretch;
  }
`;

const InterestCard = styled.div.attrs(props => {
  const attrs = {};
  if (props.issingleitem) attrs['data-issingleitem'] = props.issingleitem;
  return attrs;
})`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 15px;
  padding: var(--spacing-md);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 150px;
  max-width: 200px;
  width: 100%;
  
  @media (max-width: 768px) {
    margin: var(--spacing-md);
    width: calc(100% - 2 * var(--spacing-md));
    max-width: 250px;

    ${props => props.issingleitem && `
      transform: scale(1.1);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
      z-index: 10;
      margin: var(--spacing-lg);
    `}
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

const InterestIcon = styled(FontAwesomeIcon)`
  font-size: 2.5em;
  color: var(--accent-color);
  margin-bottom: var(--spacing-sm);
`;

const InterestName = styled.span`
  font-size: var(--font-size-medium);
  color: var(--text-primary);
  text-align: center;
`;

const LanguageList = styled.div.attrs(props => {
  const attrs = {};
  if (props.itemcount) attrs['data-itemcount'] = props.itemcount;
  return attrs;
})`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  width: 100%;
  padding: var(--spacing-md);

  @media (max-width: 768px) {
    ${props => props.itemcount === 1 && `
      justify-content: center;
      width: 100%;
    `}
    gap: var(--spacing-lg);
    justify-content: center;
  }
`;

const LanguageCard = styled.div.attrs(props => {
  const attrs = {};
  if (props.issingleitem) attrs['data-issingleitem'] = props.issingleitem;
  return attrs;
})`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 15px;
  padding: var(--spacing-sm) var(--spacing-md);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: auto;
  max-width: 250px;
  
  @media (max-width: 768px) {
    margin: var(--spacing-md);
    width: calc(100% - 2 * var(--spacing-md));
    max-width: 300px;

    ${props => props.issingleitem && `
      transform: scale(1.1);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
      z-index: 10;
      margin: var(--spacing-lg);
    `}
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

const LanguageIcon = styled(FontAwesomeIcon)`
  font-size: 1.5em;
  color: var(--accent-color);
  margin-right: var(--spacing-sm);
`;

const LanguageDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const LanguageName = styled.span`
  font-size: var(--font-size-medium);
  color: var(--text-primary);
`;

const LanguageProficiency = styled.span`
  font-size: var(--font-size-small);
  color: var(--text-secondary);
`;

// Map of interest names to icons
const interestIcons = {
  'Photography': faCamera,
  'Programming': faCode,
  'Robotics': faRobot,
  'Cybersecurity': faShieldAlt,
  'Web Development': faGlobeEurope
};

export const ModernInterestsAndLanguages = ({ 
  interests = [], 
  languages = [] 
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        {/* Interests Section */}
        {interests.length > 0 && (
          <>
            <SectionTitle>
              <FontAwesomeIcon icon={faGlobeEurope} />
              Interests
            </SectionTitle>
            <InterestsGrid itemcount={interests.length}>
              {interests.map((interest) => (
                <InterestCard 
                  key={interest.id} 
                  issingleitem={interests.length === 1 ? 'true' : 'false'}
                >
                  <InterestIcon 
                    icon={interestIcons[interest.name] || faGlobeEurope} 
                  />
                  <InterestName>{interest.name}</InterestName>
                </InterestCard>
              ))}
            </InterestsGrid>
          </>
        )}

        {/* Languages Section */}
        {languages.length > 0 && (
          <>
            <SectionTitle>
              <FontAwesomeIcon icon={faLanguage} />
              Languages
            </SectionTitle>
            <LanguageList itemcount={languages.length}>
              {languages.map((lang) => (
                <LanguageCard 
                  key={lang.id}
                  issingleitem={languages.length === 1 ? 'true' : 'false'}
                >
                  <LanguageIcon icon={faLanguage} />
                  <LanguageDetails>
                    <LanguageName>{lang.language}</LanguageName>
                    <LanguageProficiency>{lang.proficiency}</LanguageProficiency>
                  </LanguageDetails>
                </LanguageCard>
              ))}
            </LanguageList>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};
