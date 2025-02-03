import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../context/ThemeContext';
import { sharedStyles } from '../../utils/styling';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import EducationFormModal from './Education/EducationFormModal';
import { toastStyles } from '../../utils/formValidation';

const Education = ({ data, updateData, errors }) => {
  const { isDark } = useTheme();
  const [educationList, setEducationList] = useState(data || []);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);

  useEffect(() => {
    if (data) {
      setEducationList(data);
    }
  }, [data]);

  const handleAddEducation = (newEducation) => {
    const updatedEducation = [...educationList, newEducation];
    setEducationList(updatedEducation);
    updateData(updatedEducation);
    setIsModalOpen(false);
  };

  const handleUpdateEducation = (index, updatedEducation) => {
    const updatedList = educationList.map((edu, i) =>
      i === index ? updatedEducation : edu
    );
    setEducationList(updatedList);
    updateData(updatedList);
  };

  const handleDeleteEducation = (index) => {
    const updatedEducation = educationList.filter((_, i) => i !== index);
    setEducationList(updatedEducation);
    updateData(updatedEducation);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const handleToggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleEditEducation = (education, index) => {
    setEditingEducation({ ...education, index });
    setIsModalOpen(true);
  };

  const handleSaveEdit = (updatedEducation) => {
    const index = editingEducation.index;
    handleUpdateEducation(index, updatedEducation);
    setEditingEducation(null);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEducation(null);
  };

  return (
    <div className={`${sharedStyles.card} ${isDark ? 'dark:bg-gray-900 dark:border-yellow-500/30 dark:shadow-yellow-500/20' : ''}`}>
      <div className={`${sharedStyles.cardHeader} ${isDark ? 'dark:bg-gradient-to-r dark:from-yellow-900/40 dark:to-orange-900/40 dark:border-b dark:border-yellow-500/30' : ''}`}>
        <h2 className={`text-xl font-semibold ${isDark ? 'dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-yellow-400 dark:to-orange-400' : ''}`}>
          Education <span className="text-red-500">*</span>
        </h2>
      </div>
      
      <div className={`${sharedStyles.cardBody} ${isDark ? 'dark:bg-black' : ''}`}>
        {educationList.length === 0 ? (
          <>
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
                    d="M12 14l9-5-9-5-9 5 9 5m0 0l9-5-9-5-9 5 9 5m0 0v6"
                  />
                </svg>
              </div>
              <h3 className={`text-lg font-medium mb-2 
                ${isDark ? 'dark:text-yellow-400' : 'text-gray-900'}`}
              >
                Education Required
              </h3>
              <p className={`text-sm mb-4 
                ${isDark ? 'dark:text-gray-400' : 'text-gray-600'}`}
              >
                Adding your education history is essential for your CV. Here's why:
              </p>
              <ul className={`text-sm space-y-2 mb-4 text-left mx-auto max-w-md
                ${isDark ? 'dark:text-gray-400' : 'text-gray-600'}`}
              >
                <li className="flex items-start">
                  <span className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}>•</span>
                  <span>Demonstrates your academic qualifications and knowledge foundation</span>
                </li>
                <li className="flex items-start">
                  <span className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}>•</span>
                  <span>Shows continuous learning and dedication to personal development</span>
                </li>
                <li className="flex items-start">
                  <span className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}>•</span>
                  <span>Required by most employers for entry-level to senior positions</span>
                </li>
                <li className="flex items-start">
                  <span className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}>•</span>
                  <span>Helps validate your expertise in your chosen field</span>
                </li>
              </ul>
              <div 
                className="mt-4 p-3 rounded-lg text-left text-sm"
                style={toastStyles.warning.style}
                role="alert"
              >
                <span className="mr-2" role="img" aria-label="warning">
                  {toastStyles.warning.icon}
                </span>
                At least one education entry is required to proceed
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className={`flex items-center justify-center w-full p-3 rounded-md border-2 border-dashed
                ${isDark 
                  ? 'dark:border-yellow-500/30 dark:text-yellow-400 hover:dark:border-yellow-400 hover:dark:text-yellow-300' 
                  : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700'
                } transition-colors duration-200`}
            >
              <FaPlus className="mr-2" />
              Add Education
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {educationList.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-4"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {edu.degree} in {edu.field_of_study}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {edu.school_name} • {edu.start_date} - {edu.current ? 'Present' : edu.end_date}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleEditEducation(edu, index)}
                          className={`p-1.5 rounded-full transition-colors duration-200
                            ${isDark 
                              ? 'text-yellow-400 hover:bg-yellow-400/10' 
                              : 'text-gray-600 hover:bg-gray-100'}`}
                          aria-label="Edit education"
                        >
                          <FaPencilAlt className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEducation(index)}
                          className={`p-1.5 rounded-full transition-colors duration-200
                            ${isDark 
                              ? 'text-red-400 hover:bg-red-400/10' 
                              : 'text-red-600 hover:bg-red-50'}`}
                          aria-label="Delete education"
                        >
                          <FaTrashAlt className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleExpand(index)}
                      className="mt-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {expandedIndex === index ? 'Show Less' : 'Show More'}
                    </button>
                    {expandedIndex === index && edu.achievements && (
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-900 dark:text-gray-100">Achievements</h5>
                        <div className="mt-1 text-sm text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: edu.achievements }} />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              onClick={() => setIsModalOpen(true)}
              className={`mt-4 flex items-center justify-center w-full p-3 rounded-md border-2 border-dashed
                ${isDark 
                  ? 'dark:border-yellow-500/30 dark:text-yellow-400 hover:dark:border-yellow-400 hover:dark:text-yellow-300' 
                  : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700'
                } transition-colors duration-200`}
            >
              <FaPlus className="mr-2" />
              Add Education
            </button>
          </div>
        )}

        {errors?.education && (
          <div 
            className="mt-4 p-3 rounded-lg text-sm flex items-center"
            style={toastStyles.error.style}
            role="alert"
          >
            <span className="mr-2" role="img" aria-label="error">
              {toastStyles.error.icon}
            </span>
            {errors.education}
          </div>
        )}

        <EducationFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={editingEducation ? handleSaveEdit : handleAddEducation}
          initialData={editingEducation || undefined}
        />
      </div>
    </div>
  );
};

Education.propTypes = {
  data: PropTypes.array,
  updateData: PropTypes.func.isRequired,
  errors: PropTypes.object
};

export default Education;
