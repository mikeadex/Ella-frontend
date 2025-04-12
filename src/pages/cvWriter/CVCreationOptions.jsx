import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { FaFileUpload, FaEdit, FaArrowRight } from 'react-icons/fa';

// Helper to prevent isDark from being forwarded to DOM elements
const shouldForwardProp = prop => prop !== 'isDark';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 1rem 2rem;

  @media (min-width: 640px) {
    padding: 5rem 1.5rem 2rem;
  }
`;

const Header = styled.div.withConfig({
  shouldForwardProp
})`
  margin: 1rem 0 2rem;
  text-align: center;
  position: relative;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  &::after {
    content: '';
    position: absolute;
    bottom: -1rem;
    left: 0;
    right: 0;
    height: 1px;
    background: ${props => props.isDark 
      ? 'linear-gradient(90deg, transparent, rgba(250, 204, 21, 0.2), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent)'
    };
  }
`;

const Title = styled.h1.withConfig({
  shouldForwardProp
})`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${props => props.isDark ? '#fbbf24' : 'var(--text-color)'};
`;

const Subtitle = styled.p.withConfig({
  shouldForwardProp
})`
  font-size: 1.1rem;
  color: ${props => props.isDark ? 'rgba(250, 204, 21, 0.6)' : 'var(--text-secondary)'};
  margin-bottom: 2rem;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 3rem auto;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const OptionCard = styled.div.withConfig({
  shouldForwardProp
})`
  flex: 1;
  background: ${props => props.isDark ? 'rgba(30, 41, 59, 0.5)' : 'white'};
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border-color: ${props => props.isDark ? '#fbbf24' : '#3b82f6'};
  }
`;

const IconContainer = styled.div.withConfig({
  shouldForwardProp
})`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: ${props => props.isDark ? '#fbbf24' : '#3b82f6'};
`;

const OptionTitle = styled.h2.withConfig({
  shouldForwardProp
})`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.isDark ? '#fbbf24' : 'var(--text-color)'};
`;

const OptionDescription = styled.p.withConfig({
  shouldForwardProp
})`
  font-size: 1rem;
  color: ${props => props.isDark ? 'rgba(250, 204, 21, 0.6)' : 'var(--text-secondary)'};
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const Button = styled.button.withConfig({
  shouldForwardProp
})`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.isDark 
    ? 'linear-gradient(to right, #fbbf24, #f59e0b)' 
    : 'linear-gradient(to right, #3b82f6, #1d4ed8)'
  };
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
`;

function CVCreationOptions() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  
  const handleOptionClick = (option) => {
    if (option === 'upload') {
      navigate('/cv-writer/upload');
    } else if (option === 'create') {
      navigate('/cv-writer/create');
    }
  };
  
  return (
    <Container>
      <Header isDark={isDark}>
        <Title isDark={isDark}>Create Your Professional CV</Title>
        <Subtitle isDark={isDark}>
          Choose how you'd like to start building your professional CV
        </Subtitle>
      </Header>
      
      <OptionsContainer>
        <OptionCard 
          isDark={isDark} 
          onClick={() => handleOptionClick('upload')}
        >
          <IconContainer isDark={isDark}>
            <FaFileUpload />
          </IconContainer>
          <OptionTitle isDark={isDark}>Upload Existing CV</OptionTitle>
          <OptionDescription isDark={isDark}>
            Already have a CV? Upload your existing document and we'll help you improve it.
            We support PDF, Word, and text formats.
          </OptionDescription>
          <Button isDark={isDark}>
            Upload CV <FaArrowRight />
          </Button>
        </OptionCard>
        
        <OptionCard 
          isDark={isDark}
          onClick={() => handleOptionClick('create')}
        >
          <IconContainer isDark={isDark}>
            <FaEdit />
          </IconContainer>
          <OptionTitle isDark={isDark}>Create From Scratch</OptionTitle>
          <OptionDescription isDark={isDark}>
            Start with a blank slate and build your CV step by step with our
            guided form and professional templates.
          </OptionDescription>
          <Button isDark={isDark}>
            Start Creating <FaArrowRight />
          </Button>
        </OptionCard>
      </OptionsContainer>
    </Container>
  );
}

export default CVCreationOptions;
