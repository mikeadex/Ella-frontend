import React, { useState, useCallback, memo, lazy, useEffect } from "react";
import styled from "styled-components";
import { useCVForm } from "../../context/CVFormContext";
import useKeyboardShortcuts from "../../hooks/useKeyboardShortcuts";
import useMemoizedFormData from "../../hooks/useMemoizedFormData";
import LazyFormSection from "./LazyFormSection";
import LoadingSection from "./LoadingSection"; // Assuming LoadingSection is defined in this file

// Lazy load all form sections
const PersonalInfo = lazy(() => import("./PersonalInfo.jsx"));
const ProfessionalSummary = lazy(() => import("./ProfessionalSummary/ProfessionalSummary.jsx"));
const Experience = lazy(() => import("./Experience.jsx"));
const Education = lazy(() => import("./Education.jsx"));
const Skills = lazy(() => import("./Skills.jsx"));
const Language = lazy(() => import("./Language.jsx"));
const Certification = lazy(() => import("./Certification.jsx"));
const Interests = lazy(() => import("./Interests.jsx"));
const SocialMedia = lazy(() => import("./SocialMedia.jsx"));
const Reference = lazy(() => import("./Reference.jsx"));
const CVPreview = lazy(() => import("./CVPreview.jsx"));

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Navigation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 0 1rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    padding: 0;
  }
`;

const Button = styled.button`
  background-color: #4F46E5;
  color: white;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  transition: all 0.2s;

  @media (min-width: 640px) {
    width: auto;
    min-width: 120px;
    padding: 0.75rem 1.5rem;
  }

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

const CVFormContainer = memo(({ onSubmit, onCVCreated, initialValues, isEditing }) => {
  const [step, setStep] = useState(1);
  const { 
    state, 
    updateSection, 
    setErrors, 
    clearErrors,
    undo,
    redo,
    canUndo,
    canRedo
  } = useCVForm();

  // Initialize form with passed values when available
  useEffect(() => {
    if (initialValues) {
      console.log('Initializing form with data:', initialValues);
      
      // Update each section with its initial values
      Object.keys(initialValues).forEach(section => {
        if (initialValues[section] !== undefined) {
          updateSection(section, initialValues[section]);
        }
      });
    }
  }, [initialValues, updateSection]);

  // Ensure state is available before rendering
  if (!state || !state.personalInfo) {
    return <LoadingSection />;
  }

  const steps = [
    {
      id: 1,
      key: 'personalInfo',
      // title: 'Personal Information',
      component: PersonalInfo,
      validate: (data = {}) => {
        console.log('Validating personalInfo:', data);
        const errors = {};
        if (!data.firstName?.trim()) {
          console.log('firstName is empty');
          errors.firstName = 'First name is required';
        }
        if (!data.lastName?.trim()) {
          console.log('lastName is empty');
          errors.lastName = 'Last name is required';
        }
        if (!data.email?.trim()) {
          console.log('email is empty');
          errors.email = 'Email is required';
        }
        
        const hasErrors = Object.keys(errors).length > 0;
        console.log('Validation errors:', errors);
        
        if (hasErrors) {
          setErrors('personalInfo', errors);
          return false;
        }
        return true;
      }
    },
    {
      id: 2,
      key: 'professionalSummary',
      // title: 'Professional Summary',
      component: ProfessionalSummary,
      validate: (data) => {
        console.log('Validating professionalSummary:', data);
        const errors = {};
        
        // Handle both string and object cases
        const summary = typeof data === 'string' ? data : data?.summary || '';
        
        if (!summary.trim()) {
          console.log('summary is empty');
          errors.summary = 'Professional summary is required';
        } else if (summary.length > 2000) {
          console.log('summary is too long');
          errors.summary = 'Professional summary must be less than 2000 characters';
        }
        
        const hasErrors = Object.keys(errors).length > 0;
        console.log('Validation errors:', errors);
        
        if (hasErrors) {
          setErrors('professionalSummary', errors);
          return false;
        }
        return true;
      }
    },
    { 
      id: 3,
      key: 'experience',
      // title: 'Experience',
      component: Experience,
      validate: (data = []) => {
        console.log('Validating experience:', data);
        const errors = {};
        
        if (!Array.isArray(data) || data.length === 0) {
          errors.experience = 'At least one work experience entry is required';
          setErrors('experience', errors);
          return false;
        }

        return true;
      }
    },
    { 
      id: 4,
      key: 'education',
      // title: 'Education',
      component: Education,
      validate: (data = []) => {
        console.log('Validating education:', data);
        const errors = {};
        
        if (!Array.isArray(data) || data.length === 0) {
          errors.education = 'At least one education entry is required';
          setErrors('education', errors);
          return false;
        }

        return true;
      }
    },
    { 
      id: 5,
      key: 'skills',
      component: Skills,
      validate: (data = []) => {
        console.log('Validating skills:', data);
        const errors = {};
        
        if (!Array.isArray(data)) {
          errors.skills = 'Skills must be a list';
          setErrors('skills', errors);
          return false;
        }

        if (data.length < 2) {
          errors.skills = 'Please add at least 2 skills';
          setErrors('skills', errors);
          return false;
        }

        if (data.length > 12) {
          errors.skills = 'Maximum of 12 skills allowed';
          setErrors('skills', errors);
          return false;
        }

        return true;
      }
    },
    { 
      id: 6,
      key: 'language',
      // title: 'Languages',
      component: Language,
      validate: () => true
    },
    { 
      id: 7,
      key: 'certification',
      // title: 'Certifications',
      component: Certification,
      validate: () => true
    },
    { 
      id: 8,
      key: 'interests',
      // title: 'Interests',
      component: Interests,
      validate: () => true
    },
    { 
      id: 9,
      key: 'reference',
      // title: 'References',
      component: Reference,
      validate: () => true
    },
    { 
      id: 10,
      key: 'socialMedia',
      component: SocialMedia,
      validate: (data = {}) => {
        console.log('Validating socialMedia:', data);
        
        if (typeof data !== 'object' || Array.isArray(data)) {
          console.log('socialMedia is not an object');
          const errors = { socialMedia: 'Invalid social media data format' };
          setErrors('socialMedia', errors);
          return false;
        }
        
        return true;
      }
    },
    { 
      id: 11,
      key: 'preview',
      title: 'Preview',
      component: CVPreview,
      validate: () => true
    }
  ];

  const currentStep = steps.find(s => s.id === step) || steps[0];
  const currentStepData = state[currentStep.key] || {};
  const memoizedData = useMemoizedFormData(currentStepData, [currentStep.key]);

  const handleNext = useCallback(() => {
    console.log('handleNext called', { 
      currentStep, 
      currentStepData: state[currentStep.key],
      state
    });
    
    if (currentStep.validate(state[currentStep.key])) {
      console.log('Validation passed, moving to next step');
      setStep(prevStep => {
        const nextStep = Math.min(prevStep + 1, steps.length);
        console.log('Setting next step:', nextStep);
        return nextStep;
      });
      clearErrors(currentStep.key);
    } else {
      console.log('Validation failed');
    }
  }, [currentStep, state, steps.length, clearErrors]);

  const handlePrevious = useCallback(() => {
    setStep(prevStep => Math.max(prevStep - 1, 1));
    clearErrors(currentStep.key);
  }, [currentStep.key, clearErrors]);

  const handleSubmit = useCallback(() => {
    const isValid = steps.every(step => step.validate(state[step.key]));
    if (isValid) {
      // Support both prop names for backward compatibility
      if (onSubmit) {
        onSubmit(state);
      } else if (onCVCreated) {
        onCVCreated(state);
      }
    }
  }, [state, steps, onSubmit, onCVCreated]);

  useKeyboardShortcuts([
    {
      key: 'ArrowRight',
      ctrl: true,
      action: handleNext,
      description: 'Next section'
    },
    {
      key: 'ArrowLeft',
      ctrl: true,
      action: handlePrevious,
      description: 'Previous section'
    }
  ]);

  // Prefetch next section when user is on current section for more than 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      const nextStep = steps.find(s => s.id === step + 1);
      if (nextStep) {
        const nextComponent = nextStep.component;
        // Trigger prefetch by accessing the component
        nextComponent.preload?.();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [step, steps]);

  return (
    <FormContainer
      role="main"
      aria-label="CV Form"
    >
      <div role="navigation" aria-label="Form Progress">
        <StepTitle>{currentStep.title}</StepTitle>
        
        <ProgressBar
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax={steps.length}
          aria-valuenow={step}
          aria-label={`Step ${step} of ${steps.length}`}
        >
          <Progress step={step} total={steps.length} />
        </ProgressBar>
      </div>

      {/* <div 
        className="mb-4 text-sm text-gray-500"
        role="region"
        aria-label="Keyboard Shortcuts"
      >
        <span className="font-medium">Keyboard shortcuts: </span>
        <kbd className="px-2 py-1 mx-1 bg-gray-100 border rounded" aria-label="Command S">⌘S</kbd>
        <span aria-hidden="true">Save,</span>
        <kbd className="px-2 py-1 mx-1 bg-gray-100 border rounded" aria-label="Command Z">⌘Z</kbd>
        <span aria-hidden="true">Undo,</span>
        <kbd className="px-2 py-1 mx-1 bg-gray-100 border rounded" aria-label="Command Shift Z">⌘⇧Z</kbd>
        <span aria-hidden="true">Redo,</span>
        <kbd className="px-2 py-1 mx-1 bg-gray-100 border rounded" aria-label="Command Right Arrow">⌘→</kbd>
        <span aria-hidden="true">Next,</span>
        <kbd className="px-2 py-1 mx-1 bg-gray-100 border rounded" aria-label="Command Left Arrow">⌘←</kbd>
        <span aria-hidden="true">Previous</span>
      </div> */}

      <div role="form">
        <LazyFormSection
          component={currentStep.component}
          sectionKey={currentStep.key}
          data={memoizedData}
          updateData={(newData) => updateSection(currentStep.key, newData)}
          errors={state.errors[currentStep.key] || {}}
        />
      </div>

      <Navigation role="navigation" aria-label="Form Navigation">
        <div className="order-2 sm:order-1">
          <Button
            onClick={handlePrevious}
            disabled={step === 1}
            aria-label="Previous Section"
            aria-disabled={step === 1}
          >
            Previous
          </Button>
        </div>
        
        <div className="order-1 sm:order-2">
          {step < steps.length ? (
            <Button 
              onClick={handleNext}
              aria-label="Next Section"
              type="button"
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              aria-label="Submit Form"
              type="submit"
            >
              Submit
            </Button>
          )}
        </div>
      </Navigation>

      {state.lastSaved && (
        <div 
          className="mt-2 text-sm text-gray-500 text-center"
          role="status"
          aria-live="polite"
        >
          Last saved: {new Date(state.lastSaved).toLocaleTimeString()}
        </div>
      )}
    </FormContainer>
  );
});

CVFormContainer.displayName = 'CVFormContainer';

export default CVFormContainer;
