import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import { FaMagic } from 'react-icons/fa';
import { ProgressBar, ImprovedVersion } from '../../common/AIImprovement';

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
];

const VALIDATION_RULES = {
  company_name: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  job_title: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  job_description: {
    required: true,
    minLength: 10,
    maxLength: 2000,
  },
  achievements: {
    required: true,
    minLength: 10,
    maxLength: 2000,
  },
  start_date: {
    required: true,
    isDate: true,
  },
  end_date: {
    required: (formData) => !formData.current,
    isDate: true,
    isAfter: 'start_date',
  },
};

const validateField = (name, value, formData) => {
  const rules = VALIDATION_RULES[name];
  if (!rules) return null;

  const errors = [];

  if (rules.required) {
    const isRequired = typeof rules.required === 'function' 
      ? rules.required(formData) 
      : rules.required;

    if (isRequired && (!value || value.trim() === '')) {
      errors.push('This field is required');
    }
  }

  if (value) {
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`Must be at least ${rules.minLength} characters`);
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`Must be no more than ${rules.maxLength} characters`);
    }

    if (rules.isDate) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        errors.push('Please enter a valid date');
      }
    }

    if (rules.isAfter && formData[rules.isAfter]) {
      const startDate = new Date(formData[rules.isAfter]);
      const endDate = new Date(value);
      if (endDate < startDate) {
        errors.push('End date must be after start date');
      }
    }
  }

  return errors.length > 0 ? errors : null;
};

const ExperienceFormModal = ({ 
  isOpen, 
  onClose, 
  onSave,
  initialData = {
    company_name: "",
    job_title: "",
    job_description: "",
    employment_type: "Full-time",
    achievements: "",
    start_date: "",
    end_date: "",
    current: false,
  }
}) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [improving, setImproving] = useState(false);
  const [improvedText, setImprovedText] = useState("");
  const [improvingField, setImprovingField] = useState("");
  const [progress, setProgress] = useState(0);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (!modalRef.current || !contentRef.current) return;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' }
    });

    if (isOpen) {
      tl.fromTo(modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );

      tl.fromTo(contentRef.current,
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4 },
        '-=0.1'
      );
    }

    return () => tl.kill();
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    Object.keys(VALIDATION_RULES).forEach(fieldName => {
      const fieldErrors = validateField(fieldName, formData[fieldName], formData);
      if (fieldErrors) {
        newErrors[fieldName] = fieldErrors;
      }
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData(prev => {
      const newData = {
        ...prev,
        [id]: fieldValue,
        ...(id === 'current' && fieldValue ? { end_date: '' } : {})
      };

      // Validate the changed field
      const fieldErrors = validateField(id, fieldValue, newData);
      if (fieldErrors) {
        setErrors(prev => ({ ...prev, [id]: fieldErrors }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[id];
          return newErrors;
        });
      }

      return newData;
    });
  };

  const handleBlur = (e) => {
    const { id } = e.target;
    setTouched(prev => ({ ...prev, [id]: true }));
    
    const fieldErrors = validateField(id, formData[id], formData);
    if (fieldErrors) {
      setErrors(prev => ({ ...prev, [id]: fieldErrors }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(VALIDATION_RULES).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all fields
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      // Focus the first field with an error
      const firstErrorField = document.getElementById(Object.keys(formErrors)[0]);
      if (firstErrorField) {
        firstErrorField.focus();
      }
      return;
    }

    onSave(formData);
  };

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: onClose
    });

    tl.to(contentRef.current, {
      y: 40,
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: 'power3.inOut'
    });

    tl.to(modalRef.current, {
      opacity: 0,
      duration: 0.2
    }, '-=0.1');
  };

  const handleImprove = async (field) => {
    const content = formData[field];
    if (!content?.trim()) return;

    setImprovingField(field);
    setImproving(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const response = await fetch('/api/improve', {
        method: 'POST',
        body: JSON.stringify({ text: content, type: field }),
      });
      const data = await response.json();
      setImprovedText(data.improved_text);
    } catch (error) {
      console.error('Failed to improve text:', error);
    } finally {
      clearInterval(interval);
      setImproving(false);
    }
  };

  const handleUseImproved = () => {
    setFormData(prev => ({
      ...prev,
      [improvingField]: improvedText
    }));
    setImprovedText("");
    setImprovingField("");
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-hidden"
      onClick={(e) => e.target === modalRef.current && handleClose()}
    >
      <div
        ref={contentRef}
        className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col"
      >
        <div className="p-6 flex-shrink-0 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {initialData ? 'Edit Experience' : 'Add Experience'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} id="experienceForm" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-1 w-full border rounded-lg shadow-sm p-2 dark:bg-gray-700 dark:text-white
                    ${errors.company_name && touched.company_name
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600'
                    }`}
                />
                {errors.company_name && touched.company_name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.company_name[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="job_title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Title *
                </label>
                <input
                  type="text"
                  id="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-1 w-full border rounded-lg shadow-sm p-2 dark:bg-gray-700 dark:text-white
                    ${errors.job_title && touched.job_title
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600'
                    }`}
                />
                {errors.job_title && touched.job_title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.job_title[0]}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="employment_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Employment Type
              </label>
              <select
                id="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2"
              >
                {EMPLOYMENT_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-1 w-full border rounded-lg shadow-sm p-2 dark:bg-gray-700 dark:text-white
                    ${errors.start_date && touched.start_date
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600'
                    }`}
                />
                {errors.start_date && touched.start_date && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.start_date[0]}</p>
                )}
              </div>

              <div>
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date *
                </label>
                <div className="mt-1 space-y-2">
                  <input
                    type="date"
                    id="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={formData.current}
                    className={`w-full border rounded-lg shadow-sm p-2 dark:bg-gray-700 dark:text-white
                      ${errors.end_date && touched.end_date
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600'
                      } disabled:opacity-50`}
                  />
                  {errors.end_date && touched.end_date && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.end_date[0]}</p>
                  )}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="current"
                      checked={formData.current}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="current" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      I currently work here
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="job_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Job Description *
                </label>
                <button
                  type="button"
                  onClick={() => handleImprove('job_description')}
                  className="inline-flex items-center px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <FaMagic className="mr-1" />
                  Improve
                </button>
              </div>
              <textarea
                id="job_description"
                value={formData.job_description}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
                className={`mt-1 w-full border rounded-lg shadow-sm p-2 dark:bg-gray-700 dark:text-white
                  ${errors.job_description && touched.job_description
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600'
                  }`}
              />
              {errors.job_description && touched.job_description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.job_description[0]}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="achievements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Key Achievements *
                </label>
                <button
                  type="button"
                  onClick={() => handleImprove('achievements')}
                  className="inline-flex items-center px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <FaMagic className="mr-1" />
                  Improve
                </button>
              </div>
              <textarea
                id="achievements"
                value={formData.achievements}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
                className={`mt-1 w-full border rounded-lg shadow-sm p-2 dark:bg-gray-700 dark:text-white
                  ${errors.achievements && touched.achievements
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600'
                  }`}
              />
              {errors.achievements && touched.achievements && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.achievements[0]}</p>
              )}
            </div>
          </form>
        </div>

        <div className="p-6 flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="experienceForm"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            >
              {initialData ? 'Save Changes' : 'Add Experience'}
            </button>
          </div>
        </div>
      </div>

      {improving && <ProgressBar progress={progress} />}
      
      {improvedText && !improving && (
        <ImprovedVersion
          content={improvedText}
          onUse={handleUseImproved}
          title={`Improved ${improvingField === 'job_description' ? 'Job Description' : 'Achievements'}`}
        />
      )}
    </div>
  );
};

ExperienceFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialData: PropTypes.object
};

export default ExperienceFormModal;
