// Form validation utility functions
export const validateField = (value, fieldName, rules = {}) => {
  const errors = [];

  if (rules.required && !value?.trim()) {
    errors.push(`${fieldName} is required`);
  }

  if (rules.minLength && value?.length < rules.minLength) {
    errors.push(`${fieldName} must be at least ${rules.minLength} characters`);
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    errors.push(rules.patternMessage || `${fieldName} format is invalid`);
  }

  return errors;
};

export const validateForm = (formData, validationRules) => {
  const errors = {};
  let firstErrorField = null;

  for (const fieldName in validationRules) {
    const value = formData[fieldName];
    const rules = validationRules[fieldName];
    const fieldErrors = validateField(value, rules.label || fieldName, rules);

    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors;
      if (!firstErrorField) {
        firstErrorField = fieldName;
      }
    }
  }

  return { errors, firstErrorField };
};

export const focusField = (fieldName) => {
  const element = document.getElementById(fieldName);
  if (element) {
    element.focus();
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

// Common validation rules
export const commonRules = {
  name: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s-']+$/,
    patternMessage: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  },
  phone: {
    required: true,
    pattern: /^\+?[\d\s-()]+$/,
    patternMessage: 'Please enter a valid phone number',
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    patternMessage: 'Please enter a valid email address',
  },
};

// Toast notification styles
export const toastStyles = {
  error: {
    style: {
      background: '#FEE2E2',
      color: '#991B1B',
      border: '1px solid #F87171',
    },
    icon: '⚠️',
  },
  success: {
    style: {
      background: '#ECFDF5',
      color: '#065F46',
      border: '1px solid #34D399',
    },
    icon: '✓',
  },
  warning: {
    style: {
      background: '#FFFBEB',
      color: '#92400E',
      border: '1px solid #FBBF24',
    },
    icon: '⚠️',
  },
};
