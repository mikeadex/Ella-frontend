// src/components/common/FloatingContact/index.jsx
import styled from 'styled-components';
import { useState } from 'react';

const FloatingWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: none;
  z-index: 1000;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`;

const FloatingButton = styled.a`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  box-shadow: var(--box-shadow-lg);
  transition: all 0.3s ease;
  transform: ${props => props.$isOpen ? 'scale(1)' : 'scale(0)'};
  opacity: ${props => props.$isOpen ? '1' : '0'};

  &.main-button {
    transform: scale(1);
    opacity: 1;
    background: var(--primary-color);
    z-index: 2;
  }

  &:hover {
    transform: ${props => props.$isOpen ? 'scale(1.1)' : 'scale(0)'};
    background: var(--accent-light);
  }

  i {
    font-size: 1.2em;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${props => props.$isOpen ? '1' : '0'};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: 999;

  @media (min-width: 769px) {
    display: none;
  }
`;

export const FloatingContact = ({ contacts }) => {
    const [isOpen, setIsOpen] = useState(false);

    const getContactUrl = (type, value) => {
        switch (type) {
            case 'phone':
                return `tel:${value.replace(/[^0-9+]/g, '')}`;
            case 'email':
                return `mailto:${value}`;
            default:
                return '#';
        }
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <FloatingWrapper>
                {contacts
                    .filter(contact => ['phone', 'email'].includes(contact.type))
                    .map((contact, index) => (
                        <FloatingButton
                            key={index}
                            href={getContactUrl(contact.type, contact.value)}
                            $isOpen={isOpen}
                            style={{
                                transitionDelay: `${index * 0.1}s`,
                                bottom: isOpen ? `${(index + 1) * 60}px` : '0'
                            }}
                        >
                            <i className={`fa-${contact.icon}`} />
                        </FloatingButton>
                    ))}
                <FloatingButton
                    as="button"
                    onClick={toggleMenu}
                    className="main-button"
                >
                    <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-address-card'}`} />
                </FloatingButton>
            </FloatingWrapper>
            <Backdrop $isOpen={isOpen} onClick={toggleMenu} />
        </>
    );
};