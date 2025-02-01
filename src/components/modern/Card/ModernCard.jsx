import styled from 'styled-components';

const defaultTheme = {
  cards: {
    background: 'var(--background-light)',
    borderRadius: 'var(--border-radius-md)',
    shadow: 'var(--box-shadow-md)',
    transition: 'all 0.3s ease',
    hoverTransform: 'translateY(-5px)'
  }
};

export const Card = styled.div`
  background: ${props => 
    (props.theme && props.theme.cards && props.theme.cards.background) || 
    defaultTheme.cards.background
  };
  border-radius: ${props => 
    (props.theme && props.theme.cards && props.theme.cards.borderRadius) || 
    defaultTheme.cards.borderRadius
  };
  box-shadow: ${props => 
    (props.theme && props.theme.cards && props.theme.cards.shadow) || 
    defaultTheme.cards.shadow
  };
  padding: var(--spacing-lg);
  transition: ${props => 
    (props.theme && props.theme.cards && props.theme.cards.transition) || 
    defaultTheme.cards.transition
  };
  
  &:hover {
    transform: ${props => 
      (props.theme && props.theme.cards && props.theme.cards.hoverTransform) || 
      defaultTheme.cards.hoverTransform
    };
    box-shadow: var(--box-shadow-lg);
  }
`;