import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaPlus, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { sharedStyles } from '../../utils/styling';
import LanguageFormModal from './Language/LanguageFormModal';

const Language = ({ data, updateData }) => {
  const { isDark } = useTheme();
  const [languages, setLanguages] = useState(data || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState(null);

  useEffect(() => {
    if (data) {
      setLanguages(data);
    }
  }, [data]);

  const handleAddLanguage = (newLanguage) => {
    const updatedLanguages = [...languages, newLanguage];
    setLanguages(updatedLanguages);
    updateData(updatedLanguages);
    setIsModalOpen(false);
  };

  const handleEditLanguage = (language, index) => {
    setEditingLanguage({ ...language, index });
    setIsModalOpen(true);
  };

  const handleSaveEdit = (updatedLanguage) => {
    const updatedLanguages = [...languages];
    updatedLanguages[editingLanguage.index] = updatedLanguage;
    setLanguages(updatedLanguages);
    updateData(updatedLanguages);
    setIsModalOpen(false);
    setEditingLanguage(null);
  };

  const handleDeleteLanguage = (index) => {
    const updatedLanguages = languages.filter((_, i) => i !== index);
    setLanguages(updatedLanguages);
    updateData(updatedLanguages);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLanguage(null);
  };

  const getProficiencyColor = (level) => {
    if (isDark) {
      return {
        Native: 'bg-yellow-400',
        Fluent: 'bg-yellow-400/80',
        Advanced: 'bg-yellow-400/60',
        Intermediate: 'bg-yellow-400/40',
        Basic: 'bg-yellow-400/20'
      }[level] || 'bg-yellow-400/20';
    }
    return {
      Native: 'bg-blue-500',
      Fluent: 'bg-blue-400',
      Advanced: 'bg-blue-300',
      Intermediate: 'bg-blue-200',
      Basic: 'bg-blue-100'
    }[level] || 'bg-blue-100';
  };

  return (
    <div className={`${sharedStyles.card} ${isDark ? 'dark:bg-gray-900 dark:border-yellow-500/30 dark:shadow-yellow-500/20' : ''}`}>
      <div className={`${sharedStyles.cardHeader} ${isDark ? 'dark:bg-gradient-to-r dark:from-yellow-900/40 dark:to-orange-900/40 dark:border-b dark:border-yellow-500/30' : ''}`}>
        <h2 className={`text-xl font-semibold ${isDark ? 'dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-yellow-400 dark:to-orange-400' : ''}`}>
          Languages
        </h2>
      </div>

      <div className={`${sharedStyles.cardBody} ${isDark ? 'dark:bg-black' : ''}`}>
        {languages.length === 0 ? (
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
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
            </div>
            <h3 className={`text-lg font-medium mb-2 
              ${isDark ? 'dark:text-yellow-400' : 'text-gray-900'}`}
            >
              Add Your Language Skills
            </h3>
            <p className={`text-sm mb-4 
              ${isDark ? 'dark:text-gray-400' : 'text-gray-600'}`}
            >
              Language skills can significantly enhance your CV by:
            </p>
            <ul className={`text-sm space-y-2 mb-4 text-left mx-auto max-w-md
              ${isDark ? 'dark:text-gray-400' : 'text-gray-600'}`}
            >
              <li className="flex items-start">
                <span className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}>•</span>
                <span>Opening doors to international opportunities</span>
              </li>
              <li className="flex items-start">
                <span className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}>•</span>
                <span>Demonstrating cultural awareness and adaptability</span>
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
              {languages.map((language, index) => (
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
                        {language.name}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {language.proficiency}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditLanguage(language, index)}
                        className={`p-1.5 rounded-full transition-colors duration-200
                          ${isDark 
                            ? 'text-yellow-400 hover:bg-yellow-400/10' 
                            : 'text-gray-600 hover:bg-gray-100'}`}
                        aria-label="Edit language"
                      >
                        <FaPencilAlt className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteLanguage(index)}
                        className={`p-1.5 rounded-full transition-colors duration-200
                          ${isDark 
                            ? 'text-red-400 hover:bg-red-400/10' 
                            : 'text-red-600 hover:bg-red-50'}`}
                        aria-label="Delete language"
                      >
                        <FaTrashAlt className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className={`h-1.5 rounded-full overflow-hidden 
                    ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
                  >
                    <div
                      className={`h-full rounded-full ${getProficiencyColor(language.proficiency)}`}
                      style={{ width: '100%' }}
                    />
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
          Add Language
        </button>

        <LanguageFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={editingLanguage ? handleSaveEdit : handleAddLanguage}
          initialData={editingLanguage || undefined}
        />
      </div>
    </div>
  );
};

Language.propTypes = {
  data: PropTypes.array,
  updateData: PropTypes.func.isRequired
};

export default Language;