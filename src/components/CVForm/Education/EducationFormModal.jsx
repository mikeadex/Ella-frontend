import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { commonRules, validateForm, focusField } from '../../../utils/formValidation';

const EducationFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [education, setEducation] = useState({
    school_name: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    current: false,
    achievements: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setEducation(initialData);
    } else {
      setEducation({
        school_name: '',
        degree: '',
        field_of_study: '',
        start_date: '',
        end_date: '',
        current: false,
        achievements: '',
      });
    }
  }, [initialData, isOpen]);

  const validationRules = {
    school_name: { required: true, label: 'School Name' },
    degree: { required: true, label: 'Degree' },
    field_of_study: { required: true, label: 'Field of Study' },
    start_date: { required: true, label: 'Start Date' },
    end_date: { required: !education.current, label: 'End Date' },
    achievements: { required: false, label: 'Achievements' },
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setEducation((prev) => ({
      ...prev,
      [id]: fieldValue,
      ...(id === 'current' && fieldValue ? { end_date: '' } : {}),
    }));

    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { errors: validationErrors, firstErrorField } = validateForm(
      education,
      validationRules
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      focusField(firstErrorField);
      return;
    }

    onSave(education);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="relative w-full max-w-2xl mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none dark:bg-gray-800 focus:outline-none">
          <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {initialData ? 'Edit Education' : 'Add Education'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-5 focus:outline-none"
            >
              <span className="block w-6 h-6 text-2xl text-black bg-transparent opacity-5 focus:outline-none">
                ×
              </span>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="relative flex-auto p-6 overflow-y-auto max-h-[80vh]">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label htmlFor="school_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  School Name
                </label>
                <input
                  type="text"
                  id="school_name"
                  value={education.school_name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.school_name ? 'border-red-500' : ''
                  }`}
                />
                {errors.school_name && (
                  <p className="mt-1 text-xs text-red-500">{errors.school_name[0]}</p>
                )}
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="degree" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Degree
                </label>
                <input
                  type="text"
                  id="degree"
                  value={education.degree}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.degree ? 'border-red-500' : ''
                  }`}
                />
                {errors.degree && (
                  <p className="mt-1 text-xs text-red-500">{errors.degree[0]}</p>
                )}
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="field_of_study" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Field of Study
                </label>
                <input
                  type="text"
                  id="field_of_study"
                  value={education.field_of_study}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.field_of_study ? 'border-red-500' : ''
                  }`}
                />
                {errors.field_of_study && (
                  <p className="mt-1 text-xs text-red-500">{errors.field_of_study[0]}</p>
                )}
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </label>
                <input
                  type="date"
                  id="start_date"
                  value={education.start_date}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.start_date ? 'border-red-500' : ''
                  }`}
                />
                {errors.start_date && (
                  <p className="mt-1 text-xs text-red-500">{errors.start_date[0]}</p>
                )}
              </div>
              <div className="sm:col-span-1">
                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date
                </label>
                <input
                  type="date"
                  id="end_date"
                  value={education.end_date}
                  onChange={handleChange}
                  disabled={education.current}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.end_date ? 'border-red-500' : ''
                  } ${education.current ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                {errors.end_date && (
                  <p className="mt-1 text-xs text-red-500">{errors.end_date[0]}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="current"
                    checked={education.current}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="current" className="ml-2 block text-sm text-gray-900 dark:text-white">
                    I currently study here
                  </label>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="achievements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Achievements (Optional)
                </label>
                <textarea
                  id="achievements"
                  value={education.achievements}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-gray-600 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-indigo-500 active:bg-indigo-600 hover:shadow-lg focus:outline-none"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

EducationFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default EducationFormModal;
