import styled from 'styled-components';
import { H2 } from '../Typography';
import { IconButton } from '../Button';

const SectionWrapper = styled.section`
  margin-bottom: var(--spacing-xl);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--border-color);
`;

const SectionTitle = styled(H2)`
  font-size: 1.25em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--accent-color);
`;

const AddButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  color: var(--accent-color);
  opacity: 0.8;
  transition: all 0.2s ease;
  padding: 0;
  box-shadow: none;

  &:hover {
    opacity: 1;
    border: none;
}
`;

const SectionContent = styled.div`
  ${props => props.$grid && `
    display: grid;
    gap: var(--spacing-md);
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  `}
`;

export const Section = ({
  title,
  children,
  onAdd,
  gridLayout = false,
  className
}) => (
  <SectionWrapper className={className}>
    <SectionHeader>
      <SectionTitle>{title}</SectionTitle>
      {onAdd && (
        <AddButton onClick={onAdd} aria-label={`Add ${title}`} className="add-button">
          <i className="fa-solid fa-circle-plus" />
        </AddButton>
      )}
    </SectionHeader>
    <SectionContent $grid={gridLayout}>
      {children}
    </SectionContent>
  </SectionWrapper>
);