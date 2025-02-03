import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaPlus, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { sharedStyles } from '../../utils/styling';
import CertificationFormModal from './Certification/CertificationFormModal';

const Certification = ({ data, updateData }) => {
  const { isDark } = useTheme();
  const [certifications, setCertifications] = useState(data || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState(null);

  useEffect(() => {
    if (data) {
      setCertifications(data);
    }
  }, [data]);

  const handleAddCertification = (newCertification) => {
    const updatedCertifications = [...certifications, newCertification];
    setCertifications(updatedCertifications);
    updateData(updatedCertifications);
    setIsModalOpen(false);
  };

  const handleEditCertification = (certification, index) => {
    setEditingCertification({ ...certification, index });
    setIsModalOpen(true);
  };

  const handleSaveEdit = (updatedCertification) => {
    const updatedCertifications = [...certifications];
    updatedCertifications[editingCertification.index] = updatedCertification;
    setCertifications(updatedCertifications);
    updateData(updatedCertifications);
    setIsModalOpen(false);
    setEditingCertification(null);
  };

  const handleDeleteCertification = (index) => {
    const updatedCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(updatedCertifications);
    updateData(updatedCertifications);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCertification(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short'
    }).format(date);
  };

  return (
    <div className={`${sharedStyles.card} ${isDark ? 'dark:bg-gray-900 dark:border-yellow-500/30 dark:shadow-yellow-500/20' : ''}`}>
      <div className={`${sharedStyles.cardHeader} ${isDark ? 'dark:bg-gradient-to-r dark:from-yellow-900/40 dark:to-orange-900/40 dark:border-b dark:border-yellow-500/30' : ''}`}>
        <h2 className={`text-xl font-semibold ${isDark ? 'dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-yellow-400 dark:to-orange-400' : ''}`}>
          Certifications
        </h2>
      </div>

      <div className={`${sharedStyles.cardBody} ${isDark ? 'dark:bg-black' : ''}`}>
        {certifications.length === 0 ? (
          <div className={`mb-6 p-6 rounded-lg text-center border-2 border-dashed
            ${isDark 
              ? 'dark:border-yellow-500/20 dark:bg-gray-800/50' 
              : 'border-gray-200 bg-gray-50'}`}
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full
              ${isDark ? 'bg-yellow-500/10' : 'bg-blue-50'}`}
            >
              <svg
                className={`w-6 h-6 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className={`text-lg font-medium mb-2 
              ${isDark ? 'dark:text-yellow-400' : 'text-gray-900'}`}
            >
              Add Your Certifications
            </h3>
            <p className={`text-sm mb-4 
              ${isDark ? 'dark:text-gray-400' : 'text-gray-600'}`}
            >
              Certifications can enhance your CV by:
            </p>
            <ul className={`text-sm space-y-2 mb-4 text-left mx-auto max-w-md
              ${isDark ? 'dark:text-gray-400' : 'text-gray-600'}`}
            >
              <li className="flex items-start">
                <span className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}>•</span>
                <span>Validating your technical skills and expertise</span>
              </li>
              <li className="flex items-start">
                <span className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}>•</span>
                <span>Demonstrating commitment to professional development</span>
              </li>
              <li className="flex items-start">
                <span className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}>•</span>
                <span>Setting you apart from other candidates</span>
              </li>
            </ul>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <AnimatePresence>
              {certifications.map((certification, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`relative p-4 rounded-lg border
                    ${isDark 
                      ? 'bg-gray-800 border-yellow-500/30 hover:border-yellow-400/50' 
                      : 'bg-white border-gray-200 hover:border-gray-300'} 
                    transition-colors duration-200`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`font-medium ${isDark ? 'text-yellow-400' : 'text-gray-900'}`}>
                        {certification.name}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {certification.issuer}
                      </p>
                      <div className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {formatDate(certification.issueDate)}
                        {certification.expiryDate && ` - ${formatDate(certification.expiryDate)}`}
                      </div>
                      {certification.credentialId && (
                        <div className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          ID: {certification.credentialId}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCertification(certification, index)}
                        className={`p-1.5 rounded-full transition-colors duration-200
                          ${isDark 
                            ? 'text-yellow-400 hover:bg-yellow-400/10' 
                            : 'text-gray-600 hover:bg-gray-100'}`}
                        aria-label="Edit certification"
                      >
                        <FaPencilAlt className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCertification(index)}
                        className={`p-1.5 rounded-full transition-colors duration-200
                          ${isDark 
                            ? 'text-red-400 hover:bg-red-400/10' 
                            : 'text-red-600 hover:bg-red-50'}`}
                        aria-label="Delete certification"
                      >
                        <FaTrashAlt className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center justify-center w-full p-3 rounded-md border-2 border-dashed
            ${isDark 
              ? 'dark:border-yellow-500/30 dark:text-yellow-400 hover:dark:border-yellow-400 hover:dark:text-yellow-300' 
              : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700'
            } transition-colors duration-200`}
        >
          <FaPlus className="mr-2" />
          Add Certification
        </button>

        <CertificationFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={editingCertification ? handleSaveEdit : handleAddCertification}
          initialData={editingCertification || undefined}
        />
      </div>
    </div>
  );
};

Certification.propTypes = {
  data: PropTypes.array,
  updateData: PropTypes.func.isRequired
};

export default Certification;