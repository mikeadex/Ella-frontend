import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../../context/ThemeContext';
import { sharedStyles } from '../../../utils/styling';
import Modal from '../../Modal/Modal';

const PROFICIENCY_LEVELS = [
  'Native',
  'Fluent',
  'Advanced',
  'Intermediate',
  'Basic'
];

const LanguageFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    proficiency: 'Intermediate'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Language Details">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="name" 
            className={`block text-sm font-medium mb-1 ${isDark ? 'dark:text-yellow-300' : 'text-gray-700'}`}
          >
            Language <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`${sharedStyles.inputStyle} ${isDark ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' : ''}`}
            placeholder="e.g., English, Spanish, French"
          />
        </div>

        <div>
          <label 
            htmlFor="proficiency" 
            className={`block text-sm font-medium mb-1 ${isDark ? 'dark:text-yellow-300' : 'text-gray-700'}`}
          >
            Proficiency Level <span className="text-red-500">*</span>
          </label>
          <select
            id="proficiency"
            name="proficiency"
            value={formData.proficiency}
            onChange={handleChange}
            required
            className={`${sharedStyles.inputStyle} ${isDark ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' : ''}`}
          >
            {PROFICIENCY_LEVELS.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-md border ${isDark 
              ? 'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-md ${isDark
              ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
              : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

LanguageFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialData: PropTypes.object
};

export default LanguageFormModal;
