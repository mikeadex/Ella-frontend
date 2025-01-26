import styled from 'styled-components';

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--surface-color);
  border-radius: var(--border-radius-sm);
  font-size: 0.9rem;
  color: var(--primary-color);
  margin: var(--spacing-xs);
  
  &:hover {
    background: var(--border-color);
  }
`;

export const BadgeGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: calc(-1 * var(--spacing-xs));
`;