import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../context/ThemeContext';
import { sharedStyles } from '../../utils/styling';
import { FaPlus, FaTimes } from 'react-icons/fa';
import SkillsFormModal from './Skills/SkillsFormModal';
import { motion, AnimatePresence } from 'framer-motion';
import { toastStyles } from '../../utils/formValidation';

const Skills = ({ data, updateData, errors }) => {
  const { isDark } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skills, setSkills] = useState(data || []);

  useEffect(() => {
    if (data) {
      setSkills(data);
    }
  }, [data]);

  const handleAddSkills = (newSkills) => {
    const updatedSkills = [...skills, ...newSkills];
    if (updatedSkills.length > 12) {
      // Show error in modal
      return false;
    }
    setSkills(updatedSkills);
    updateData(updatedSkills);
    setIsModalOpen(false);
    return true;
  };

  const handleRemoveSkill = (indexToRemove) => {
    const updatedSkills = skills.filter((_, index) => index !== indexToRemove);
    setSkills(updatedSkills);
    updateData(updatedSkills);
  };

  return (
    <div className={`${sharedStyles.card} ${isDark ? 'dark:bg-gray-900 dark:border-yellow-500/30 dark:shadow-yellow-500/20' : ''}`}>
      <div className={`${sharedStyles.cardHeader} ${isDark ? 'dark:bg-gradient-to-r dark:from-yellow-900/40 dark:to-orange-900/40 dark:border-b dark:border-yellow-500/30' : ''}`}>
        <h2 className={`text-xl font-semibold ${isDark ? 'dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-yellow-400 dark:to-orange-400' : ''}`}>
          Skills <span className="text-red-500">*</span>
          <span className={`ml-2 text-sm font-normal ${isDark ? 'text-yellow-500/60' : 'text-gray-500'}`}>
            (2-12 skills required)
          </span>
        </h2>
      </div>
      
      <div className={`${sharedStyles.cardBody} ${isDark ? 'dark:bg-black' : ''}`}>
        {skills.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            <AnimatePresence>
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`group relative aspect-square p-4 rounded-lg flex flex-col items-center justify-center text-center
                    ${isDark 
                      ? 'bg-gray-800 border border-yellow-500/30 hover:border-yellow-400/50' 
                      : 'bg-gray-50 border border-gray-200 hover:border-gray-300'} 
                    transition-colors duration-200`}
                >
                  <span className={`text-sm font-medium mb-1 
                    ${isDark ? 'text-yellow-400' : 'text-gray-700'}`}
                  >
                    {skill.name}
                  </span>
                  {skill.category && (
                    <span className={`text-xs 
                      ${isDark ? 'text-yellow-500/60' : 'text-gray-500'}`}
                    >
                      {skill.category}
                    </span>
                  )}
                  <button
                    onClick={() => handleRemoveSkill(index)}
                    className={`absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity
                      ${isDark
                        ? 'hover:bg-red-400/10 text-red-400'
                        : 'hover:bg-red-50 text-red-500'}`}
                    aria-label={`Remove ${skill.name}`}
                    disabled={skills.length <= 2}
                    title={skills.length <= 2 ? "At least 2 skills are required" : undefined}
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                  {skill.proficiency && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className={`h-1 rounded-full overflow-hidden 
                        ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
                      >
                        <div
                          className={`h-full rounded-full 
                            ${isDark ? 'bg-yellow-400' : 'bg-blue-500'}`}
                          style={{ width: `${(parseInt(skill.proficiency) / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className={`mb-6 p-6 rounded-lg text-center border-2 border-dashed
            ${isDark 
              ? 'dark:border-yellow-500/20 dark:bg-gray-800/50' 
              : 'border-gray-200 bg-gray-50'}`}
          >
            <h3 className={`text-lg font-medium mb-2 
              ${isDark ? 'dark:text-yellow-400' : 'text-gray-900'}`}
            >
              Add Your Key Skills
            </h3>
            <p className={`text-sm mb-4 
              ${isDark ? 'dark:text-gray-400' : 'text-gray-600'}`}
            >
              Skills are crucial for catching employers' attention. They:
            </p>
            <ul className={`text-sm space-y-2 mb-4 text-left mx-auto max-w-md
              ${isDark ? 'dark:text-gray-400' : 'text-gray-600'}`}
            >
              <li className="flex items-start">
                <span className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}>•</span>
                <span>Help your CV pass through Applicant Tracking Systems (ATS)</span>
              </li>
              <li className="flex items-start">
                <span className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}>•</span>
                <span>Showcase your professional capabilities at a glance</span>
              </li>
              <li className="flex items-start">
                <span className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}>•</span>
                <span>Match you with relevant job requirements</span>
              </li>
              <li className="flex items-start">
                <span className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}>•</span>
                <span>Highlight both technical and soft skills valuable to employers</span>
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
              Add between 2 and 12 skills that match your target job descriptions
            </div>
          </div>
        )}

        <button
          onClick={() => setIsModalOpen(true)}
          disabled={skills.length >= 12}
          className={`flex items-center justify-center w-full p-3 rounded-md border-2 border-dashed
            ${isDark 
              ? 'dark:border-yellow-500/30 dark:text-yellow-400 hover:dark:border-yellow-400 hover:dark:text-yellow-300' 
              : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700'
            } ${skills.length >= 12 ? 'opacity-50 cursor-not-allowed' : ''} transition-colors duration-200`}
        >
          <FaPlus className="mr-2" />
          {skills.length >= 12 ? 'Maximum skills reached' : 'Add Skills'}
        </button>

        {errors?.skills && (
          <div 
            className="mt-4 p-3 rounded-lg text-sm flex items-center"
            style={toastStyles.error.style}
            role="alert"
          >
            <span className="mr-2" role="img" aria-label="error">
              {toastStyles.error.icon}
            </span>
            {errors.skills}
          </div>
        )}

        <SkillsFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddSkills}
          existingSkills={skills}
          maxSkills={12}
        />
      </div>
    </div>
  );
};

Skills.propTypes = {
  data: PropTypes.array,
  updateData: PropTypes.func.isRequired,
  errors: PropTypes.object
};

export default Skills;