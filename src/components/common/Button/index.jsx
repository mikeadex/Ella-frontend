import styled from 'styled-components';

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  border: none;
  background: var(--accent-color);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: var(--accent-light);
  }

  &.icon-only {
    padding: var(--spacing-xs);
  }
`;

export const IconButton = styled(Button)`
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 50%;
  
  i {
    font-size: 1rem;
  }
`;