import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../../context/ThemeContext';
import { sharedStyles } from '../../../utils/styling';
import Modal from '../../Modal/Modal';

const CertificationFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: ''
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
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Certification' : 'Add Certification'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="name" 
            className={`block text-sm font-medium mb-1 ${isDark ? 'dark:text-yellow-300' : 'text-gray-700'}`}
          >
            Certification Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`${sharedStyles.inputStyle} ${isDark ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' : ''}`}
            placeholder="e.g., AWS Solutions Architect"
          />
        </div>

        <div>
          <label 
            htmlFor="issuer" 
            className={`block text-sm font-medium mb-1 ${isDark ? 'dark:text-yellow-300' : 'text-gray-700'}`}
          >
            Issuer <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="issuer"
            name="issuer"
            value={formData.issuer}
            onChange={handleChange}
            required
            className={`${sharedStyles.inputStyle} ${isDark ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' : ''}`}
            placeholder="e.g., Amazon Web Services"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label 
              htmlFor="issueDate" 
              className={`block text-sm font-medium mb-1 ${isDark ? 'dark:text-yellow-300' : 'text-gray-700'}`}
            >
              Issue Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="issueDate"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              required
              className={`${sharedStyles.inputStyle} ${isDark ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' : ''}`}
            />
          </div>

          <div>
            <label 
              htmlFor="expiryDate" 
              className={`block text-sm font-medium mb-1 ${isDark ? 'dark:text-yellow-300' : 'text-gray-700'}`}
            >
              Expiry Date
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className={`${sharedStyles.inputStyle} ${isDark ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' : ''}`}
            />
          </div>
        </div>

        <div>
          <label 
            htmlFor="credentialId" 
            className={`block text-sm font-medium mb-1 ${isDark ? 'dark:text-yellow-300' : 'text-gray-700'}`}
          >
            Credential ID
          </label>
          <input
            type="text"
            id="credentialId"
            name="credentialId"
            value={formData.credentialId}
            onChange={handleChange}
            className={`${sharedStyles.inputStyle} ${isDark ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' : ''}`}
            placeholder="Enter credential verification number"
          />
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

CertificationFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialData: PropTypes.object
};

export default CertificationFormModal;
