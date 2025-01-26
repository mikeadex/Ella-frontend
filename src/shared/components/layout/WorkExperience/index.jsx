import styled from 'styled-components';
import { Section } from '../../common/Section';
import { H3, H4, Text } from '../../common/Typography';

const ExperienceItem = styled.div`
  margin-bottom: var(--spacing-xl);

  &:last-child {
    margin-bottom: 0;
  }
`;

const JobTitle = styled(H3)`
  font-size: 1.1em;
  font-weight: 600;
  color: var(--secondary-color);
  margin-bottom: var(--spacing-xs);
`;

const EmployerInfo = styled(Text)`
  font-size: 0.95em;
  color: var(--text-light);
  margin-bottom: var(--spacing-xs);
  
  span {
    &::before {
      content: "•";
      margin: 0 var(--spacing-xs);
    }
  }
`;

const Year = styled(Text)`
  font-size: 0.9em;
  color: var(--accent-color);
  margin-bottom: var(--spacing-md);
`;

const StyledList = styled.ul`
  list-style: none;
  margin-bottom: var(--spacing-lg);
`;

const ListItem = styled.li`
  position: relative;
  padding-left: var(--spacing-lg);
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  font-size: 0.95em;
  color: var(--text-light);

  i {
    position: absolute;
    left: 0;
    top: 4px;
    color: var(--accent-color);
    font-size: 0.8em;
  }
`;

const AchievementsSection = styled.div`
  margin-top: var(--spacing-md);
`;

const AchievementsTitle = styled(H4)`
  font-size: 1em;
  font-weight: 600;
  color: var(--secondary-color);
  margin-bottom: var(--spacing-sm);
`;

const AchievementsList = styled.ul`
  list-style: none;
`;

const AchievementItem = styled.li`
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  font-size: 0.95em;
  color: var(--text-light);
`;

const AchievementBullet = styled.span`
  color: var(--accent-color);
`;

export const WorkExperience = ({ experiences = [], onAdd }) => (
    <Section title="Work Experience" onAdd={onAdd}>
        {experiences?.map((exp, index) => (
            <ExperienceItem key={index}>
                <JobTitle>{exp.title}</JobTitle>
                <EmployerInfo>
                    {exp.company}
                    <span>{exp.location}</span>
                </EmployerInfo>
                <Year>{exp.period}</Year>
                {exp.responsibilities && (
                    <StyledList>
                        {exp.responsibilities.map((resp, idx) => (
                            <ListItem key={idx}>
                                <i className="fa-solid fa-check-double" />
                                {resp}
                            </ListItem>
                        ))}
                    </StyledList>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                    <AchievementsSection>
                        <AchievementsTitle>Key Achievements</AchievementsTitle>
                        <AchievementsList>
                            {exp.achievements.map((achievement, idx) => (
                                <AchievementItem key={idx}>
                                    <AchievementBullet>•</AchievementBullet>
                                    {achievement}
                                </AchievementItem>
                            ))}
                        </AchievementsList>
                    </AchievementsSection>
                )}
            </ExperienceItem>
        ))}
    </Section>
);