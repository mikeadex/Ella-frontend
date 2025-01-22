import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.secondary ? 'var(--white)' : 'var(--primary-color)'};
  color: ${props => props.secondary ? 'var(--primary-color)' : 'var(--white)'};
  text-decoration: none;
  border-radius: 6px;
  border: ${props => props.secondary ? '2px solid var(--primary-color)' : 'none'};
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
  margin: 0.5rem;

  &:hover {
    background-color: ${props => props.secondary ? 'var(--primary-color)' : 'var(--primary-dark)'};
    color: var(--white);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const AuthButton = ({ children, secondary, ...props }) => {
  return (
    <StyledButton secondary={secondary} {...props}>
      {children}
    </StyledButton>
  );
};

export default AuthButton;
