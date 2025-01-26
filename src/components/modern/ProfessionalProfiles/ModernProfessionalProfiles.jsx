// src/components/modern/ProfessionalProfiles/ModernProfessionalProfiles.jsx
import styled from 'styled-components';

const ProfilesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
`;

const ProfileIcon = styled.i`
  font-size: 1.25em;
  color: var(--text-light);
  margin-right: var(--spacing-md);
  transition: all 0.2s ease;
  z-index: 1;
`;

const ProfileName = styled.h3`
  font-size: 0.95em;
  font-weight: 600;
  color: var(--secondary-color);
  margin-bottom: 2px;
  transition: color 0.2s ease;
  letter-spacing: 0.5px;
`;

const ProfileItem = styled.a`
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background: transparent;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--accent-color);
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: 0;
  }

  &:hover {
    border-color: var(--accent-color);
    transform: translateY(-2px);

    &::before {
      opacity: 0.05;
    }

    ${ProfileIcon} {
      transform: scale(1.1);
      color: var(--accent-color);
    }

    ${ProfileName} {
      color: var(--accent-color);
    }
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
  z-index: 1;
`;

const ProfileUrl = styled.span`
  font-size: 0.85em;
  color: var(--text-light);
  opacity: 0.8;
  display: block;
`;

export const ModernProfessionalProfiles = ({ socials = [] }) => {
    console.log('Socials:', socials); // Debug log
    return (
        <ProfilesGrid>
            {socials.map((social, index) => (
                <ProfileItem
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${social.platform} profile`}
                >
                    <ProfileIcon className={social.icon} aria-hidden="true" />
                    <ProfileInfo>
                        <ProfileName>{social.platform}</ProfileName>
                        <ProfileUrl>{social.username}</ProfileUrl>
                    </ProfileInfo>
                </ProfileItem>
            ))}
        </ProfilesGrid>
    );
};