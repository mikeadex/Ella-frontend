import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PersonalInfo from "./PersonalInfo";
import ProfessionalSummary from "./ProfessionalSummary";
import Experience from "./Experience";
import Education from "./Education";
import Skills from "./Skills";
import Language from "./Language";
import Certification from "./Certification";
import Interests from "./Interests";
import SocialMedia from "./SocialMedia";
import Reference from "./Reference";
import CVPreview from "./CVPreview";

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Navigation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: #4F46E5;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #4338CA;
  }

  &:disabled {
    background-color: #9CA3AF;
    cursor: not-allowed;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background-color: #E5E7EB;
  margin: 20px 0;
  border-radius: 2px;
`;

const Progress = styled.div`
  width: ${props => (props.step / props.total) * 100}%;
  height: 100%;
  background-color: #4F46E5;
  border-radius: 2px;
  transition: width 0.3s ease;
`;

const StepTitle = styled.h2`
  color: var(--text-color);
  text-align: center;
  margin-bottom: 2rem;
`;

const CVFormContainer = ({ onCVCreated }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {},
    professionalSummary: "",
    experience: [],
    education: [],
    skills: [],
    language: [],
    certification: [],
    interests: [],
    reference: [],
    socialMedia: [],
  });

  const steps = [
    { 
      id: 1, 
      component: PersonalInfo, 
      title: "Personal Information",
      key: "personalInfo",
      validate: (data) => {
        console.log('Validating personal info:', data);
        if (!data) return false;
        
        const required = ['first_name', 'last_name', 'email'];
        const isValid = required.every(field => {
          const hasField = data[field] && data[field].trim() !== '';
          console.log(`Field ${field}:`, { value: data[field], isValid: hasField });
          return hasField;
        });
        
        console.log('Personal Info validation result:', isValid);
        return isValid;
      }
    },
    { 
      id: 2, 
      component: ProfessionalSummary, 
      title: "Professional Summary",
      key: "professionalSummary",
      validate: (data) => data && data.trim() !== ''
    },
    { 
      id: 3, 
      component: Experience, 
      title: "Experience",
      key: "experience",
      validate: () => true
    },
    { 
      id: 4, 
      component: Education, 
      title: "Education",
      key: "education",
      validate: () => true
    },
    { 
      id: 5, 
      component: Skills, 
      title: "Skills",
      key: "skills",
      validate: () => true
    },
    { 
      id: 6, 
      component: Language, 
      title: "Languages",
      key: "language",
      validate: () => true
    },
    { 
      id: 7, 
      component: Certification, 
      title: "Certifications",
      key: "certification",
      validate: () => true
    },
    { 
      id: 8, 
      component: Interests, 
      title: "Interests",
      key: "interests",
      validate: () => true
    },
    { 
      id: 9, 
      component: Reference, 
      title: "References",
      key: "reference",
      validate: () => true
    },
    { 
      id: 10, 
      component: SocialMedia, 
      title: "Social Media",
      key: "socialMedia",
      validate: () => true
    },
    { 
      id: 11, 
      component: CVPreview, 
      title: "Preview",
      key: "preview",
      validate: () => true
    }
  ];

  const handleUpdateData = (key, value) => {
    console.log('Updating data:', { key, value });
    setFormData(prev => {
      const newData = {
        ...prev,
        [key]: value
      };
      console.log('New form data:', newData);
      return newData;
    });
  };

  const handleNextStep = () => {
    console.log('Current step:', step);
    console.log('Current form data:', formData);
    
    const currentStep = steps[step - 1];
    const currentStepData = formData[currentStep.key];
    
    console.log('Validating step:', {
      stepId: currentStep.id,
      stepTitle: currentStep.title,
      data: currentStepData
    });
    
    const isValid = currentStep.validate(currentStepData);
    console.log('Validation result:', isValid);
    
    if (isValid) {
      console.log('Moving to next step');
      setStep(prev => {
        const nextStep = Math.min(prev + 1, steps.length);
        console.log('New step:', nextStep);
        return nextStep;
      });
    } else {
      console.log('Validation failed');
    }
  };

  const handlePrevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleFormCompletion = async () => {
    try {
      await onCVCreated(formData);
    } catch (error) {
      console.error("Error creating CV:", error);
    }
  };

  const CurrentStepComponent = steps[step - 1].component;

  return (
    <FormContainer>
      <ProgressBar>
        <Progress step={step} total={steps.length} />
      </ProgressBar>

      <StepTitle>{steps[step - 1].title}</StepTitle>

      <CurrentStepComponent
        data={formData[steps[step - 1].key]}
        updateData={(value) => handleUpdateData(steps[step - 1].key, value)}
      />

      <Navigation>
        <Button 
          onClick={handlePrevStep} 
          disabled={step === 1}
        >
          Previous
        </Button>
        <Button 
          onClick={step === steps.length ? handleFormCompletion : handleNextStep}
        >
          {step === steps.length ? 'Create CV' : 'Next'}
        </Button>
      </Navigation>
    </FormContainer>
  );
};

export default CVFormContainer;
