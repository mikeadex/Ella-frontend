import styled from 'styled-components';
import { Section } from '../../common/Section';
import { Text } from '../../common/Typography';

const EducationGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-sm) 0;
`;

const EducationItem = styled.div`
  background: var(--surface-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-md);
    border-color: var(--accent-light);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(
      to bottom,
      var(--accent-color),
      var(--accent-light)
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

const EducationHeader = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
`;

const EducationMain = styled.div`
  flex: 1;
`;

const Degree = styled.h3`
  font-size: 0.95em;
  font-weight: 500;
  color: var(--secondary-color);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1.3;
`;

const Institution = styled.h4`
  font-size: 0.9em;
  font-weight: 500;
  color: var(--accent-color);
  margin: 0 0 var(--spacing-xs) 0;
  line-height: 1.3;
`;

const EducationMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-light);
  font-size: 0.85em;
`;

const EducationDetails = styled(Text)`
  color: var(--text-light);
  line-height: 1.6;
  font-size: 0.9em;
  font-weight: 400;
`;

export const Education = ({ educationList = [], onAdd }) => (
    <Section title="Education" onAdd={onAdd}>
        <EducationGrid>
            {educationList.map((education, index) => (
                <EducationItem key={index}>
                    <EducationHeader>
                        <EducationMain>
                            <Degree>{education.degree}</Degree>
                            <Institution>{education.institution}</Institution>
                            <EducationMeta>
                                <MetaRow>
                                    <span>{education.year}</span>
                                </MetaRow>
                                <MetaRow>
                                    <span>{education.location}</span>
                                </MetaRow>
                            </EducationMeta>
                        </EducationMain>
                    </EducationHeader>
                    <EducationDetails>{education.details}</EducationDetails>
                </EducationItem>
            ))}
        </EducationGrid>
    </Section>
);