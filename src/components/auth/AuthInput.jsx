import React from 'react';
import styled from 'styled-components';

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  ${props => props.error && `
    border-color: var(--error);
  `}
`;

const ErrorMessage = styled.span`
  color: var(--error);
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
`;

const AuthInput = ({ label, error, ...props }) => {
  return (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <Input error={error} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormGroup>
  );
};

export default AuthInput;
