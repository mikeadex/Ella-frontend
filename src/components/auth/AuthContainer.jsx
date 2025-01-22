import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--white);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
`;

const Title = styled.h1`
  color: var(--text-color);
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const Message = styled.p`
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
`;

const Alert = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  font-weight: 500;
  background-color: ${props => 
    props.type === 'error' ? 'rgba(220, 53, 69, 0.1)' :
    props.type === 'success' ? 'rgba(40, 167, 69, 0.1)' : 'transparent'};
  color: ${props => 
    props.type === 'error' ? 'var(--error)' :
    props.type === 'success' ? 'var(--success)' : 'inherit'};
  border: 1px solid ${props => 
    props.type === 'error' ? 'var(--error)' :
    props.type === 'success' ? 'var(--success)' : 'transparent'};
`;

const AuthContainer = ({ title, message, alert, children }) => {
  return (
    <Container>
      {title && <Title>{title}</Title>}
      {message && <Message>{message}</Message>}
      {alert && (
        <Alert type={alert.type}>
          {alert.message}
        </Alert>
      )}
      {children}
    </Container>
  );
};

export default AuthContainer;
