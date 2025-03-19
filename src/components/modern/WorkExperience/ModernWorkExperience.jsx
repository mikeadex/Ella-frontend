import styled from 'styled-components';
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';

const ExperienceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ExperienceItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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
  margin-bottom: 0.5rem;
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

const JobDescription = styled.div`
  font-size: 0.95em;
  color: var(--text-light);
  line-height: 1.6;
  margin: 0;

  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
  }

  li {
    position: relative;
    padding-left: 1.5em;
    margin-bottom: 0.75em;

    &:last-child {
      margin-bottom: 0;
    }

    &:before {
      content: "•";
      position: absolute;
      left: 0;
      color: var(--text-light);
    }
  }

  p {
    margin: 0;
  }
`;

const formatDescription = (description) => {
  if (!description) return '';
  
  // Split into lines and clean up
  const lines = description.split('\n')
    .map(line => line.trim())
    .filter(line => line)
    .map(line => {
      // Remove any existing bullet points or dashes
      line = line.replace(/^[•\-*]\s*/, '');
      // Remove any markdown bold syntax
      line = line.replace(/\*\*(.*?)\*\*/g, '$1');
      return line;
    });
    
  // Format each line as a list item
  const formattedLines = lines.map(line => `- ${line}`);
  
  return formattedLines.join('\n');
};

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

                const formattedDescription = formatDescription(exp.description);

                return (
                    <ExperienceItem key={index}>
                        <JobTitle>{exp.title}</JobTitle>
                        <EmployerInfo>
                            {exp.company} 
                            {exp.period && <Period>{exp.period}</Period>} 
                            {exp.location && <Location>{exp.location}</Location>}
                        </EmployerInfo>
                        {formattedDescription && (
                            <JobDescription>
                                <ReactMarkdown>{formattedDescription}</ReactMarkdown>
                            </JobDescription>
                        )}
                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                            <JobDescription>
                                <ul>
                                    {exp.responsibilities.map((achievement, i) => (
                                        <li key={i}>{achievement.replace(/<\/?p>/g, '')}</li>
                                    ))}
                                </ul>
                            </JobDescription>
                        )}
                    </ExperienceItem>
                );
            })}
        </ExperienceList>
    );
};