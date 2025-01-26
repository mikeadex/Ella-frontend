import React, { useState } from "react";
import styled from "styled-components";
import PersonalInfo from "./PersonalInfo";
import ProfessionalSummary from "./ProfessionalSummary";
import Experience from "./Experience";
import Education from "./Education";
import Skills from "./Skills";
import Language from "./Language";
import Reference from "./Reference";
import SocialMedia from "./SocialMedia";
import Certification from "./Certification";
import Interests from "./Interests";

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
        const required = ['first_name', 'last_name', 'email'];
        return required.every(field => data[field] && data[field].trim() !== '');
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
    }
  ];

  const handleUpdateData = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNextStep = () => {
    const currentStepData = formData[steps[step - 1].key];
    if (steps[step - 1].validate(currentStepData)) {
      setStep(prev => Math.min(prev + 1, steps.length));
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

      <CurrentStepComponent
        data={formData[steps[step - 1].key]}
        updateData={handleUpdateData}
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
          disabled={step === 1}
        >
          {step === steps.length ? 'Finish' : 'Next'}
        </Button>
      </Navigation>
    </FormContainer>
  );
};

export default CVFormContainer;
