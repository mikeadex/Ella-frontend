// src/components/modern/Education/ModernEducation.jsx
import styled from 'styled-components';

const EducationTimeline = styled.div`
  position: relative;
  padding-left: 140px;
  
  &::before {
    content: '';
    position: absolute;
    left: 120px;
    top: 8px;
    bottom: 0;
    width: 2px;
    background-color: var(--border-color);
  }

  @media (max-width: 768px) {
    padding-left: 40px;
    
    &::before {
      left: 20px;
    }
  }

  @media (max-width: 480px) {
    padding-left: 20px;
    
    &::before {
      left: 10px;
    }
  }
`;

const EducationItem = styled.div`
  position: relative;
  margin-bottom: var(--spacing-xl);

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    padding-top: 30px; 
  }
`;

const TimelineDot = styled.div`
  position: absolute;
  left: -26px;
  top: 8px;
  width: 12px;
  height: 12px;
  background-color: var(--accent-color);
  border-radius: 50%;
  border: 2px solid var(--background-color);
  z-index: 1;

  @media (max-width: 768px) {
    left: -16px;
    top: 4px;
    }
`;

const EducationYear = styled.div`
  position: absolute;
  left: -140px;
  top: 4px;
  width: 100px;
  color: var(--text-light);
  font-weight: 500;
  text-align: right;

  @media (max-width: 768px) {
    left: 0;
    top: 0;
    padding-left: var(--spacing-lg); 
    text-align: left;
    font-size: 0.9em;
    color: var(--accent-color);
    font-weight: 600;
  }
`;

const EducationContent = styled.div`
  padding: var(--spacing-lg);
  background: var(--surface-color);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(10px);
    border-color: var(--accent-color);
  }

  @media (max-width: 768px) {
    margin-top: var(--spacing-md);
  }
`;

const Degree = styled.h3`
  font-size: 1.15em;
  font-weight: 600;
  color: var(--secondary-color);
  margin-bottom: var(--spacing-xs);
`;

const Institution = styled.span`
  display: block;
  color: var(--accent-color);
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
`;

const Location = styled.p`
  color: var(--text-light);
  font-size: 0.9em;
  margin-bottom: var(--spacing-md);
`;

const HighlightsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
`;

const HighlightItem = styled.span`
  background-color: var(--surface-color);
  color: var(--text-light);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: 0.9em;
  border: 1px solid var(--border-color);
`;

// Helper function to extract highlights from details
const extractHighlights = (details) => {
    if (!details) return [];
    return details.split('. ').filter(item => item.length > 0);
};

export const ModernEducation = ({ educationList = [] }) => (
    <EducationTimeline>
        {educationList.map((edu, index) => (
            <EducationItem key={index}>
                <TimelineDot />
                <EducationYear>{edu?.year?.split('-')[0]}</EducationYear>
                <EducationContent>
                    <Degree>{edu?.degree}</Degree>
                    <Institution>{edu?.institution}</Institution>
                    <Location>{edu?.location}</Location>
                    <HighlightsList>
                        {extractHighlights(edu?.details).map((highlight, idx) => (
                            <HighlightItem key={idx}>{highlight}</HighlightItem>
                        ))}
                    </HighlightsList>
                </EducationContent>
            </EducationItem>
        ))}
    </EducationTimeline>
);