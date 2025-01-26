import styled from 'styled-components';

export const Card = styled.div`
  background: ${props => props.theme.cards.background};
  border-radius: ${props => props.theme.cards.borderRadius};
  box-shadow: ${props => props.theme.cards.shadow};
  padding: var(--spacing-lg);
  transition: ${props => props.theme.cards.transition};
  
  &:hover {
    transform: ${props => props.theme.cards.hoverTransform};
    box-shadow: var(--box-shadow-lg);
  }
`;