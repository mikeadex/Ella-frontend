import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaPlus, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { sharedStyles } from '../../utils/styling';
import ReferenceFormModal from './Reference/ReferenceFormModal';

const Reference = ({ data, updateData }) => {
  const { isDark } = useTheme();
  const [references, setReferences] = useState(data || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReference, setEditingReference] = useState(null);

  useEffect(() => {
    if (data) {
      setReferences(data);
    }
  }, [data]);

  const handleAddReference = (newReference) => {
    const updatedReferences = [...references, newReference];
    setReferences(updatedReferences);
    updateData(updatedReferences);
    setIsModalOpen(false);
  };

  const handleEditReference = (reference) => {
    setEditingReference(reference);
    setIsModalOpen(true);
  };

  const handleSaveEdit = (updatedReference) => {
    const updatedReferences = references.map(ref => 
      ref.id === updatedReference.id ? updatedReference : ref
    );
    setReferences(updatedReferences);
    updateData(updatedReferences);
    setIsModalOpen(false);
    setEditingReference(null);
  };

  const handleDeleteReference = (id) => {
    const updatedReferences = references.filter(ref => ref.id !== id);
    setReferences(updatedReferences);
    updateData(updatedReferences);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReference(null);
  };

  return (
    <div className={`${sharedStyles.card} ${isDark ? 'dark:bg-gray-900 dark:border-yellow-500/30 dark:shadow-yellow-500/20' : ''}`}>
      <div className={`${sharedStyles.cardHeader} ${isDark ? 'dark:bg-gradient-to-r dark:from-yellow-900/40 dark:to-orange-900/40 dark:border-b dark:border-yellow-500/30' : ''}`}>
        <h2 className={`text-xl font-semibold ${isDark ? 'dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-yellow-400 dark:to-orange-400' : ''}`}>
          References
        </h2>
      </div>

      <div className={`${sharedStyles.cardBody} ${isDark ? 'dark:bg-black' : ''}`}>
        {references.length === 0 ? (
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className={`text-lg font-medium mb-2 
              ${isDark ? 'dark:text-yellow-400' : 'text-gray-900'}`}
            >
              Add Your References
            </h3>
            <p className={`text-sm mb-4 
              ${isDark ? 'dark:text-gray-400' : 'text-gray-600'}`}
            >
              References can strengthen your application by:
            </p>
            <ul className={`text-sm space-y-2 mb-4 text-left mx-auto max-w-md
              ${isDark ? 'dark:text-gray-400' : 'text-gray-600'}`}
            >
              <li className="flex items-start">
                <span className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}>•</span>
                <span>Validating your work experience and skills</span>
              </li>
              <li className="flex items-start">
                <span className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}>•</span>
                <span>Providing insights into your work ethic</span>
              </li>
              <li className="flex items-start">
                <span className={`mr-2 ${isDark ? 'text-yellow-400' : 'text-blue-500'}`}>•</span>
                <span>Adding credibility to your achievements</span>
              </li>
            </ul>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <AnimatePresence>
              {references.map((reference) => (
                <motion.div
                  key={reference.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`relative p-4 rounded-lg border
                    ${isDark 
                      ? 'bg-gray-800 border-yellow-500/30 hover:border-yellow-400/50' 
                      : 'bg-white border-gray-200 hover:border-gray-300'} 
                    transition-colors duration-200`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <h3 className={`font-medium ${isDark ? 'text-yellow-400' : 'text-gray-900'}`}>
                        {reference.name}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {reference.title}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {reference.company}
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {reference.email}
                        </p>
                        {reference.phone && (
                          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            {reference.phone}
                          </p>
                        )}
                        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {reference.reference_type}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditReference(reference)}
                        className={`p-1.5 rounded-full transition-colors duration-200
                          ${isDark 
                            ? 'text-yellow-400 hover:bg-yellow-400/10' 
                            : 'text-gray-600 hover:bg-gray-100'}`}
                        aria-label="Edit reference"
                      >
                        <FaPencilAlt className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteReference(reference.id)}
                        className={`p-1.5 rounded-full transition-colors duration-200
                          ${isDark 
                            ? 'text-red-400 hover:bg-red-400/10' 
                            : 'text-red-600 hover:bg-red-50'}`}
                        aria-label="Delete reference"
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
          Add Reference
        </button>

        <ReferenceFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={editingReference ? handleSaveEdit : handleAddReference}
          initialData={editingReference}
        />
      </div>
    </div>
  );
};

Reference.propTypes = {
  data: PropTypes.array,
  updateData: PropTypes.func.isRequired
};

export default Reference;
