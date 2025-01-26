import styled from 'styled-components';

const ExperienceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
`;

const ExperienceItem = styled.div`
  padding: var(--spacing-xl);
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: var(--accent-color);
    box-shadow: var(--box-shadow-lg);
  }
`;

const JobTitle = styled.h3`
  font-size: 1.25em;
  font-weight: 600;
  color: var(--secondary-color);
  margin-bottom: var(--spacing-xs);
`;

const EmployerInfo = styled.p`
  color: var(--accent-color);
  font-weight: 500;
  margin-bottom: var(--spacing-md);
  font-size: 0.95em;
`;

const JobDescription = styled.p`
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
`;

const AchievementsSection = styled.div`
  margin-top: var(--spacing-lg);
`;

const AchievementsTitle = styled.h4`
  font-size: 1em;
  font-weight: 600;
  color: var(--secondary-color);
  margin-bottom: var(--spacing-md);
`;

const AchievementsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const AchievementItem = styled.li`
  display: flex;
  gap: var(--spacing-sm);
  color: var(--text-light);
  line-height: 1.6;
`;

const AchievementBullet = styled.span`
  color: var(--accent-color);
  font-size: 1.2em;
  line-height: 1.4;
`;

export const ModernWorkExperience = ({ experiences = [] }) => (
    <ExperienceList>
        {experiences.map((exp, index) => (
            <ExperienceItem key={index}>
                <JobTitle>{exp.title}</JobTitle>
                <EmployerInfo>
                    {exp.company} | {exp.period} | {exp.location}
                </EmployerInfo>
                <JobDescription>{exp.description}</JobDescription>
                <AchievementsSection>
                    <AchievementsTitle>Key Achievements</AchievementsTitle>
                    <AchievementsList>
                        {exp.responsibilities && exp.responsibilities.map((achievement, idx) => (
                            <AchievementItem key={idx}>
                                <AchievementBullet>•</AchievementBullet>
                                {achievement}
                            </AchievementItem>
                        ))}
                    </AchievementsList>
                </AchievementsSection>
            </ExperienceItem>
        ))}
    </ExperienceList>
);