import styled from 'styled-components';

const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  laptop: '1024px'
};

const LinkWrapper = styled.a`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: ${props => props.variant === 'icon' ? 'var(--spacing-sm)' : 'var(--spacing-md) var(--spacing-lg)'};
  border-radius: ${props => props.variant === 'icon' ? '50%' : 'var(--border-radius-md)'};
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  position: relative;
  overflow: hidden;
  width: ${props => props.variant === 'icon' ? '40px' : 'auto'};
  height: ${props => props.variant === 'icon' ? '40px' : 'auto'};
  justify-content: ${props => props.variant === 'icon' ? 'center' : 'flex-start'};

  @media (max-width: ${breakpoints.tablet}) {
    padding: ${props => props.variant === 'icon' ? 'var(--spacing-xs)' : 'var(--spacing-sm) var(--spacing-md)'};
    width: ${props => props.variant === 'icon' ? '36px' : 'auto'};
    height: ${props => props.variant === 'icon' ? '36px' : 'auto'};
  }

  @media (max-width: ${breakpoints.mobile}) {
    flex: ${props => props.variant === 'icon' ? '0 0 auto' : '1'};
    min-width: ${props => props.variant === 'icon' ? 'auto' : '140px'};
  }

  &:hover {
    transform: translateY(-2px);
    background: var(--background-color);
    border-color: var(--accent-light);
    box-shadow: var(--box-shadow-md);
  }

  i {
    font-size: ${props => props.variant === 'icon' ? '1.4rem' : '1.2rem'};
    color: var(--accent-color);

    @media (max-width: ${breakpoints.mobile}) {
      font-size: ${props => props.variant === 'icon' ? '1.2rem' : '1rem'};
    }
  }
`;

const LinkDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media (max-width: ${breakpoints.mobile}) {
    gap: 1px;
  }
`;

const Platform = styled.span`
  font-weight: 600;
  font-size: 0.75em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--secondary-color);

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.7em;
  }
`;

const Username = styled.span`
  font-size: 0.75em;
  font-weight: 400;
  color: var(--text-light);

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 0.7em;
  }
`;

export const SocialLink = ({ platform, username, icon, url, variant = 'full' }) => (
  <LinkWrapper href={url} target="_blank" rel="noopener noreferrer" variant={variant}>
    <i className={`fab fa-${icon}`} aria-hidden="true" />
    {variant === 'full' && (
      <LinkDetails>
        <Platform>{platform}</Platform>
        <Username>{username}</Username>
      </LinkDetails>
    )}
  </LinkWrapper>
);