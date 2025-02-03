import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../context/ThemeContext';
import { sharedStyles } from '../../utils/styling';
import ExperienceFormModal from './Experience/ExperienceFormModal';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus, FaPencilAlt, FaTrashAlt, FaLightbulb } from 'react-icons/fa';
import { toastStyles } from '../../utils/formValidation';

const Experience = ({ data, updateData, errors }) => {
  const { isDark } = useTheme();
  const [experiences, setExperiences] = useState(data || []);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  useEffect(() => {
    if (data) {
      setExperiences(data);
    }
  }, [data]);

  const handleAddExperience = (newExperience) => {
    const updatedExperiences = [...experiences, newExperience];
    setExperiences(updatedExperiences);
    updateData(updatedExperiences, false);
    setIsModalOpen(false);
  };

  const handleUpdateExperience = (index, updatedExperience) => {
    const updatedExperiences = experiences.map((exp, i) =>
      i === index ? updatedExperience : exp
    );
    setExperiences(updatedExperiences);
    updateData(updatedExperiences, false);
  };

  const handleDeleteExperience = (index) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
    updateData(updatedExperiences, false);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const handleToggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleEditExperience = (experience, index) => {
    setEditingExperience({ ...experience, index });
    setIsModalOpen(true);
  };

  const handleSaveEdit = (updatedExperience) => {
    const newExperiences = [...experiences];
    newExperiences[editingExperience.index] = updatedExperience;
    setExperiences(newExperiences);
    updateData(newExperiences, false);
    setIsModalOpen(false);
    setEditingExperience(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
  };

  const renderEmptyState = () => (
    <div className="text-center py-8 px-4">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4
        ${isDark ? 'bg-yellow-400/10' : 'bg-blue-50'}`}>
        <FaLightbulb className={`w-6 h-6 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`} />
      </div>
      <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-yellow-400' : 'text-gray-900'}`}>
        Add Your Work Experience
      </h3>
      <div className={`space-y-4 max-w-lg mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        <p className="text-sm">
          Work experience is a crucial part of your CV. Don't have traditional work experience? Consider including:
        </p>
        <ul className="text-sm text-left list-disc pl-6 space-y-2">
          <li>Volunteer work or community service</li>
          <li>Freelance projects or gig work</li>
          <li>Personal projects or open-source contributions</li>
          <li>Internships or apprenticeships</li>
          <li>Academic or research projects</li>
          <li>Leadership roles in clubs or organizations</li>
        </ul>
        <div 
          className="mt-4 p-3 rounded-lg text-left text-sm"
          style={toastStyles.warning.style}
          role="alert"
        >
          <span className="mr-2" role="img" aria-label="warning">
            {toastStyles.warning.icon}
          </span>
          At least one work experience entry is required to proceed
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${sharedStyles.card} ${isDark ? 'dark:bg-gray-900 dark:border-yellow-500/30 dark:shadow-yellow-500/20' : ''}`}>
      <div className={`${sharedStyles.cardHeader} ${isDark ? 'dark:bg-gradient-to-r dark:from-yellow-900/40 dark:to-orange-900/40 dark:border-b dark:border-yellow-500/30' : ''}`}>
        <h2 className={`text-xl font-semibold ${isDark ? 'dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-yellow-400 dark:to-orange-400' : ''}`}>
          Work Experience <span className="text-red-500">*</span>
        </h2>
      </div>
      
      <div className={`${sharedStyles.cardBody} ${isDark ? 'dark:bg-black' : ''}`}>
        {experiences.length === 0 ? renderEmptyState() : (
          <AnimatePresence>
            {experiences.map((experience, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4"
              >
                <div
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {experience.job_title} at {experience.company_name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {experience.employment_type} • {experience.start_date} - {experience.current ? 'Present' : experience.end_date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleEditExperience(experience, index)}
                        className={`p-1.5 rounded-full transition-colors duration-200
                          ${isDark 
                            ? 'text-yellow-400 hover:bg-yellow-400/10' 
                            : 'text-gray-600 hover:bg-gray-100'}`}
                        aria-label="Edit experience"
                      >
                        <FaPencilAlt className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(index)}
                        className={`p-1.5 rounded-full transition-colors duration-200
                          ${isDark 
                            ? 'text-red-400 hover:bg-red-400/10' 
                            : 'text-red-600 hover:bg-red-50'}`}
                        aria-label="Delete experience"
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
                  {expandedIndex === index && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100">Job Description</h5>
                        <div className="mt-1 text-sm text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: experience.job_description }} />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100">Key Achievements</h5>
                        <div className="mt-1 text-sm text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: experience.achievements }} />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        <button
          onClick={() => setIsModalOpen(true)}
          className={`mt-4 flex items-center justify-center w-full p-3 rounded-md border-2 border-dashed
            ${isDark 
              ? 'dark:border-yellow-500/30 dark:text-yellow-400 hover:dark:border-yellow-400 hover:dark:text-yellow-300' 
              : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700'
            } transition-colors duration-200`}
        >
          <FaPlus className="mr-2" />
          Add Work Experience
        </button>

        {errors?.experience && (
          <div 
            className="mt-4 p-3 rounded-lg text-sm flex items-center"
            style={toastStyles.error.style}
            role="alert"
          >
            <span className="mr-2" role="img" aria-label="error">
              {toastStyles.error.icon}
            </span>
            {errors.experience}
          </div>
        )}

        <ExperienceFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={editingExperience ? handleSaveEdit : handleAddExperience}
          initialData={editingExperience || undefined}
        />
      </div>
    </div>
  );
};

Experience.propTypes = {
  data: PropTypes.array,
  updateData: PropTypes.func.isRequired,
  errors: PropTypes.object
};

export default Experience;
