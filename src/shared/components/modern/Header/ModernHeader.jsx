// src/components/modern/Header/ModernHeader.jsx
import styled from 'styled-components';

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
  font-size: ${props => props.theme.header.professionSize};
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

const ContactList = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
  margin-top: var(--spacing-lg);
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-light);
  
  i {
    color: var(--accent-color);
    font-size: 1.1em;
  }
`;

export const ModernHeader = ({ name, profession, contacts }) => (
  <HeaderWrapper>
    <HeaderContent>
      <div>
        <Name>{name}</Name>
        <Profession>{profession}</Profession>
      </div>
      <ContactList>
        {contacts.map((contact, index) => (
          <ContactItem key={index}>
            <i className={`fa-solid fa-${contact.icon}`} />
            <span>{contact.value}</span>
          </ContactItem>
        ))}
      </ContactList>
    </HeaderContent>
  </HeaderWrapper>
);