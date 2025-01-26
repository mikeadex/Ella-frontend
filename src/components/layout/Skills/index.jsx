import styled from 'styled-components';

const SkillsGrid = styled.div`
  display: grid;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) 0;
`;

const SkillItem = styled.div`
  background: var(--surface-color);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-md);
    border-color: var(--accent-light);
  }
`;

const SkillName = styled.div`
  font-size: 0.9em;
  font-weight: 500;
  color: var(--secondary-color);
  display: flex;
  justify-content: space-between;
  align-items: center;

  &::after {
    content: "${props => props.$level}%";
    font-size: 0.85em;
    font-weight: 400;
    color: var(--text-light);
  }
`;

const SkillLevel = styled.div`
  height: 6px;
  background: var(--border-color);
  border-radius: 100px;
  overflow: hidden;
  position: relative;
`;

const SkillProgress = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: ${props => props.$progress}%;
  background: linear-gradient(
    to right,
    var(--accent-color),
    var(--accent-light)
  );
  border-radius: 100px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 1;
    }
  }

  ${SkillItem}:hover & {
    animation: pulse 1.5s infinite;
  }
`;

export const Skills = ({ skills = [], onAdd }) => (
    <SkillsGrid>
        {skills.map((skill, index) => (
            <SkillItem key={index}>
                <SkillName $level={skill.level}>
                    {skill.name}
                </SkillName>
                <SkillLevel>
                    <SkillProgress $progress={skill.level} />
                </SkillLevel>
            </SkillItem>
        ))}
    </SkillsGrid>
);