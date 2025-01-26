// src/components/modern/Layout/Container.jsx
import styled from 'styled-components';

export const Container = styled.div`
  width: 1000px;
  margin: 0 auto;
  padding: var(--spacing-xl);
  background: var(--background-color);
  
  @media (max-width: 1024px) {
    width: 100%;
    max-width: 1000px;
  }
  
  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;