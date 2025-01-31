import styled from "styled-components";

const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  laptop: '1024px'
};

export const H1 = styled.h1`
  font-size: 3.5em;
  font-weight: 800;
  background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: var(--spacing-xs);
  line-height: 1.2;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 2.8em;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 2em;
  }
`;

export const H2 = styled.h2`
  font-size: 1.25em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--accent-color);
`;

export const H3 = styled.h3`
  font-size: 1.15em;
  font-weight: 600;
  color: var(--secondary-color);
`;

export const H4 = styled.h4`
  font-size: 1.05em;
  font-weight: 600;
  color: var(--secondary-color);
`;

export const Text = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: var(--spacing-sm);
  color: var(--secondary-color);
`;