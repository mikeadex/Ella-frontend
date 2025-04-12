import React from 'react';
import styled from 'styled-components';

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-sm);
  width: 100%;
`;

const SkillTag = styled.div`
  background-color: var(--surface-color);
  color: var(--text-light);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: 0.9em;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--box-shadow-sm);
    border-color: var(--accent-color);
  }
`;

const SkillHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SkillName = styled.span`
  font-weight: 500;
`;

const ProficiencyIndicator = styled.span`
  font-size: 0.8em;
  color: var(--accent-color);
`;

const ProficiencyBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
`;

const ProficiencyLevel = styled.div`
  height: 100%;
  background-color: var(--accent-color);
  width: ${props => props.$level || '50'}%;
  transition: width 0.5s ease-in-out;
`;

export const Skills = ({ skills = [] }) => {
  const getProficiencyPercentage = (proficiency) => {
    switch(proficiency?.toLowerCase()) {
      case 'beginner': return 25;
      case 'intermediate': return 50;
      case 'advanced': return 75;
      case 'expert': return 100;
      default: return proficiency || 50;
    }
  };

  return (
    <SkillsGrid>
      {skills.map((skill, index) => {
        // Get level from either proficiency or level property
        const levelValue = typeof skill.level === 'number' 
          ? skill.level 
          : getProficiencyPercentage(skill.proficiency);
        
        return (
          <SkillTag key={index}>
            <SkillHeader>
              <SkillName>{skill.name}</SkillName>
              {(skill.proficiency || skill.levelDisplay) && (
                <ProficiencyIndicator>
                  {skill.levelDisplay || skill.proficiency}
                </ProficiencyIndicator>
              )}
            </SkillHeader>
            <ProficiencyBar>
              <ProficiencyLevel 
                $level={levelValue} 
              />
            </ProficiencyBar>
          </SkillTag>
        );
      })}
    </SkillsGrid>
  );
};
