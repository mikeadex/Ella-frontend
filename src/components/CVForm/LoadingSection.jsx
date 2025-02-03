import React from 'react';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Skeleton = styled.div`
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #f7f7f7 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  height: ${props => props.height || '1rem'};
  margin-bottom: ${props => props.mb || '0.5rem'};
  width: ${props => props.width || '100%'};

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const LoadingSection = () => {
  return (
    <LoadingContainer role="progressbar" aria-label="Loading form section">
      <Skeleton height="2rem" width="60%" mb="2rem" />
      <Skeleton height="3rem" mb="1rem" />
      <Skeleton height="3rem" mb="1rem" />
      <Skeleton height="3rem" mb="1rem" />
      <Skeleton height="5rem" />
    </LoadingContainer>
  );
};

export default LoadingSection;
