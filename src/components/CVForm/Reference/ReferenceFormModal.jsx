import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../../context/ThemeContext';
import { sharedStyles } from '../../../utils/styling';
import Modal from '../../Modal/Modal';
import { REFERENCE_TYPES } from '../../../utils/constants';

const ReferenceFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const { isDark } = useTheme();
  const [reference, setReference] = useState(initialData || {
    name: '',
    title: '',
    company: '',
    email: '',
    phone: '',
    reference_type: 'Professional'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReference(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!reference.name.trim() || !reference.title.trim() || 
        !reference.company.trim() || !reference.email.trim() || 
        !reference.reference_type) {
      return;
    }

    // Email validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(reference.email)) {
      return;
    }

    // Phone validation (if provided)
    if (reference.phone && !/^\+?[\d\s-]{10,}$/.test(reference.phone)) {
      return;
    }

    onSave({
      ...reference,
      id: initialData?.id || Date.now()
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Reference' : 'Add Reference'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label 
              htmlFor="name" 
              className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-yellow-300' : 'text-gray-700'
              }`}
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={reference.name}
              onChange={handleChange}
              required
              className={`${sharedStyles.inputStyle} ${
                isDark 
                  ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' 
                  : ''
              }`}
              placeholder="e.g. John Smith"
            />
          </div>

          <div>
            <label 
              htmlFor="title" 
              className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-yellow-300' : 'text-gray-700'
              }`}
            >
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={reference.title}
              onChange={handleChange}
              required
              className={`${sharedStyles.inputStyle} ${
                isDark 
                  ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' 
                  : ''
              }`}
              placeholder="e.g. Senior Manager"
            />
          </div>
        </div>

        <div>
          <label 
            htmlFor="company" 
            className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-yellow-300' : 'text-gray-700'
            }`}
          >
            Company <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={reference.company}
            onChange={handleChange}
            required
            className={`${sharedStyles.inputStyle} ${
              isDark 
                ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' 
                : ''
            }`}
            placeholder="e.g. Tech Corp Ltd."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label 
              htmlFor="email" 
              className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-yellow-300' : 'text-gray-700'
              }`}
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={reference.email}
              onChange={handleChange}
              required
              className={`${sharedStyles.inputStyle} ${
                isDark 
                  ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' 
                  : ''
              }`}
              placeholder="e.g. john@company.com"
            />
          </div>

          <div>
            <label 
              htmlFor="phone" 
              className={`block text-sm font-medium mb-1 ${
                isDark ? 'text-yellow-300' : 'text-gray-700'
              }`}
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={reference.phone}
              onChange={handleChange}
              className={`${sharedStyles.inputStyle} ${
                isDark 
                  ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' 
                  : ''
              }`}
              placeholder="e.g. +1 234 567 8900"
            />
          </div>
        </div>

        <div>
          <label 
            htmlFor="reference_type" 
            className={`block text-sm font-medium mb-1 ${
              isDark ? 'text-yellow-300' : 'text-gray-700'
            }`}
          >
            Reference Type <span className="text-red-500">*</span>
          </label>
          <select
            id="reference_type"
            name="reference_type"
            value={reference.reference_type}
            onChange={handleChange}
            required
            className={`${sharedStyles.inputStyle} ${
              isDark 
                ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' 
                : ''
            }`}
          >
            {REFERENCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-md border ${
              isDark 
                ? 'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-md ${
              isDark
                ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {initialData ? 'Save Changes' : 'Add Reference'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

ReferenceFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialData: PropTypes.object
};

export default ReferenceFormModal;
