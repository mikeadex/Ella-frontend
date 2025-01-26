// src/components/modern/Section/ModernSection.jsx
import styled from 'styled-components';

const SectionWrapper = styled.section`
  margin-bottom: var(--spacing-xl);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  
  h2 {
    font-size: 1.25em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--accent-color);
  }
`;

export const ModernSection = ({ title, onAdd, children }) => (
    <SectionWrapper>
        <SectionHeader>
            <h2>{title}</h2>
            {onAdd && (
                <button className="add-button" onClick={onAdd}>
                    <i className="fa-solid fa-circle-plus" />
                </button>
            )}
        </SectionHeader>
        {children}
    </SectionWrapper>
);