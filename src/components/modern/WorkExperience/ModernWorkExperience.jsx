import styled from 'styled-components';
import DOMPurify from 'dompurify';

const ExperienceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const ExperienceItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const JobTitle = styled.h3`
  font-size: 1.1em;
  font-weight: 600;
  color: var(--text-dark);
  margin: 0;
`;

const EmployerInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-light);
  font-size: 0.9em;
`;

const Period = styled.span`
  color: var(--text-light);
  &:before {
    content: "•";
    margin: 0 0.5em;
  }
`;

const Location = styled.span`
  color: var(--text-light);
  &:before {
    content: "•";
    margin: 0 0.5em;
  }
`;

const JobDescription = styled.p`
  font-size: 0.95em;
  color: var(--text-light);
  line-height: 1.6;
  margin: 0.5em 0;
`;

export const ModernWorkExperience = ({ experiences = [] }) => {
    console.log('ModernWorkExperience received:', experiences);
    
    if (!experiences || experiences.length === 0) {
        console.warn('No experiences provided to ModernWorkExperience');
        return null;
    }

    return (
        <ExperienceList>
            {experiences.map((exp, index) => {
                console.log(`Experience ${index}:`, exp);
                
                // Validate required fields
                if (!exp.title || !exp.company) {
                    console.warn(`Skipping experience ${index} due to missing title or company`, exp);
                    return null;
                }

                return (
                    <ExperienceItem key={index}>
                        <JobTitle>{exp.title}</JobTitle>
                        <EmployerInfo>
                            {exp.company} 
                            {exp.period && <Period>{exp.period}</Period>} 
                            {exp.location && <Location>{exp.location}</Location>}
                        </EmployerInfo>
                        {exp.description && <JobDescription>{exp.description}</JobDescription>}
                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                          <div className="mt-2">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Key Achievements
                            </h4>
                            <div 
                              className="pl-4 space-y-1"
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(`
                                  <ul class="list-disc text-sm text-gray-600 dark:text-gray-400">
                                    ${exp.responsibilities.map(achievement => 
                                      `<li>${achievement.replace(/<\/?p>/g, '')}</li>`
                                    ).join('')}
                                  </ul>
                                `)
                              }}
                            />
                          </div>
                        )}
                    </ExperienceItem>
                );
            })}
        </ExperienceList>
    );
};