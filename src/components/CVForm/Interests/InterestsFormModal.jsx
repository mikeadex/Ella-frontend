import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';
import { sharedStyles } from '../../../utils/styling';
import Modal from '../../Modal/Modal';

const InterestsFormModal = ({ isOpen, onClose, onSave, categories, initialData }) => {
  const { isDark } = useTheme();
  const [interest, setInterest] = useState({
    name: '',
    description: '',
    category: '',
    isCustom: false
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (initialData) {
      setInterest(initialData);
      setSelectedCategory(initialData.category || '');
    } else {
      setInterest({
        name: '',
        description: '',
        category: '',
        isCustom: false
      });
      setSelectedCategory('');
    }
    setSearchTerm('');
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInterest(prev => ({
      ...prev,
      [name]: value,
      isCustom: name === 'name' ? true : prev.isCustom
    }));
  };

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setInterest(prev => ({
      ...prev,
      category: categoryName,
      isCustom: false
    }));
  };

  const handleInterestSelect = (interestName) => {
    setInterest(prev => ({
      ...prev,
      name: interestName,
      category: selectedCategory,
      isCustom: false
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!interest.name.trim()) return;

    const finalInterest = {
      ...interest,
      category: interest.category || (interest.isCustom ? 'Other' : '')
    };

    onSave(finalInterest);
  };

  const filteredInterests = selectedCategory 
    ? categories.find(cat => cat.name === selectedCategory)?.interests.filter(
        interest => interest.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    : [];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Interest' : 'Add Interest'}
    >
      <div className="space-y-4">
        {/* Category Selection */}
        <div>
          <h4 className={`text-sm font-medium mb-2 ${isDark ? 'text-yellow-300' : 'text-gray-700'}`}>
            Select Interest Category
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {categories.map((category) => (
              <button
                key={category.name}
                type="button"
                onClick={() => handleCategorySelect(category.name)}
                className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  selectedCategory === category.name
                    ? isDark 
                      ? 'bg-yellow-500 text-black'
                      : 'bg-blue-600 text-white'
                    : isDark
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search Interests */}
        {selectedCategory && (
          <div>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${selectedCategory} interests...`}
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                  isDark 
                    ? 'bg-black border-yellow-500/50 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-yellow-400/50' 
                    : 'border-gray-300 focus:ring-blue-500'
                } focus:outline-none focus:ring-2`}
              />
              <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDark ? 'text-yellow-500/50' : 'text-gray-400'
              }`} />
            </div>
          </div>
        )}

        {/* Prepopulated Interests */}
        {selectedCategory && filteredInterests.length > 0 && (
          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {filteredInterests.map((interestName) => (
              <button
                key={interestName}
                type="button"
                onClick={() => handleInterestSelect(interestName)}
                className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  interest.name === interestName
                    ? isDark 
                      ? 'bg-yellow-500 text-black'
                      : 'bg-blue-600 text-white'
                    : isDark
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {interestName}
              </button>
            ))}
          </div>
        )}

        {/* Custom Interest Form */}
        <form onSubmit={handleSubmit}>
          <div>
            <label 
              htmlFor="name" 
              className={`block text-sm font-medium mb-1 ${isDark ? 'text-yellow-300' : 'text-gray-700'}`}
            >
              Interest Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={interest.name}
              onChange={handleChange}
              required
              className={`${sharedStyles.inputStyle} ${
                isDark 
                  ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' 
                  : ''
              }`}
              placeholder="Enter interest name or select from above"
            />
          </div>

          <div className="mt-4">
            <label 
              htmlFor="description" 
              className={`block text-sm font-medium mb-1 ${isDark ? 'text-yellow-300' : 'text-gray-700'}`}
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={interest.description}
              onChange={handleChange}
              rows={3}
              className={`${sharedStyles.inputStyle} ${
                isDark 
                  ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' 
                  : ''
              }`}
              placeholder="Optional: Add more details about your interest"
            />
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
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

InterestsFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    interests: PropTypes.arrayOf(PropTypes.string).isRequired
  })).isRequired,
  initialData: PropTypes.object
};

export default InterestsFormModal;
