import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { SKILL_CATEGORIES } from '../../../utils/constants';
import { 
  FaSearch, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaChevronDown, 
  FaChevronUp 
} from 'react-icons/fa';

const SkillsFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [skill, setSkill] = useState({
    name: '',
    proficiency: 'Intermediate',
    category: '',
    isCustom: false,
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Soft Skills');
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);
  const [isSkillsExpanded, setIsSkillsExpanded] = useState(true);

  useEffect(() => {
    if (initialData) {
      setSkill(initialData);
      // If editing an existing skill, pre-select it
      setSelectedSkills(initialData.name ? [initialData.name] : []);
    } else {
      setSkill({
        name: '',
        proficiency: 'Intermediate',
        category: '',
        isCustom: false,
      });
      setSelectedSkills([]);
    }
  }, [initialData, isOpen]);

  const proficiencyLevels = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Expert',
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSkill((prev) => ({
      ...prev,
      [id]: value,
      isCustom: id === 'name' ? true : prev.isCustom,
    }));
  };

  const handleSkillSelect = (skillName, category) => {
    setSelectedSkills((prev) => 
      prev.includes(skillName)
        ? prev.filter((s) => s !== skillName)
        : [...prev, skillName]
    );

    // Update the category if it's not set
    if (!skill.category) {
      setSkill(prev => ({
        ...prev,
        category: category
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If multiple skills are selected, create an array of skill objects
    const skillsToSave = selectedSkills.length > 0 
      ? selectedSkills.map(skillName => ({
          name: skillName,
          proficiency: skill.proficiency,
          category: skill.category || 'Other',
          isCustom: false
        }))
      : [{
          name: skill.name,
          proficiency: skill.proficiency,
          category: skill.category || 'Other',
          isCustom: skill.isCustom
        }];

    // Validate skills
    const validSkills = skillsToSave.filter(s => s.name.trim() !== '');

    if (validSkills.length === 0) {
      alert('Please select or enter a skill name');
      return;
    }

    // Always pass an array to onSave
    onSave(validSkills);

    // Reset the modal state
    setSelectedSkills([]);
    setSkill({
      name: '',
      proficiency: 'Intermediate',
      category: '',
      isCustom: false,
    });
    setSearchTerm('');
    onClose();
  };

  const filteredSkills = SKILL_CATEGORIES.reduce((acc, category) => {
    if (!selectedCategory || selectedCategory === category.name) {
      const filtered = category.skills.filter((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filtered.length > 0) {
        acc.push({
          ...category,
          skills: filtered,
        });
      }
    }
    return acc;
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-md mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-2xl shadow-2xl outline-none dark:bg-gray-800 focus:outline-none max-h-[90vh] overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b border-solid rounded-t border-blueGray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-500 to-purple-600">
            <h3 className="text-xl font-bold text-white">
              {initialData ? 'Edit Skills' : 'Add Skills'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-white opacity-70 hover:opacity-100"
            >
              <FaTimesCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="relative flex-auto p-4 overflow-y-auto">
            <div className="space-y-4">
              {/* Selected Skills Display */}
              {selectedSkills.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((selectedSkill) => (
                      <div 
                        key={selectedSkill} 
                        className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                      >
                        {selectedSkill}
                        <button
                          type="button"
                          onClick={() => handleSkillSelect(selectedSkill, '')}
                          className="ml-2 text-indigo-500 hover:text-indigo-700"
                        >
                          <FaTimesCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Skill Input */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={skill.name}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter a custom skill"
                  />
                </div>

                <div>
                  <label htmlFor="proficiency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Proficiency Level
                  </label>
                  <select
                    id="proficiency"
                    value={skill.proficiency}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {proficiencyLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Skill Search */}
              <div className="relative mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Search and Select Skills
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search skills..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
                  className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                >
                  <span>
                    {selectedCategory ? `Category: ${selectedCategory}` : 'All Categories'}
                  </span>
                  {isCategoryExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {isCategoryExpanded && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('');
                        setIsCategoryExpanded(false);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        selectedCategory === ''
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      All Skills
                    </button>
                    {SKILL_CATEGORIES.map((category) => (
                      <button
                        key={category.name}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(category.name);
                          setIsCategoryExpanded(false);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                          selectedCategory === category.name
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Skill Selection */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsSkillsExpanded(!isSkillsExpanded)}
                  className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                >
                  <span>Select Skills</span>
                  {isSkillsExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {isSkillsExpanded && (
                  <div className="mt-2 grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {filteredSkills.map((category) => (
                      <React.Fragment key={category.name}>
                        {category.skills.map((skillName) => (
                          <button
                            key={skillName}
                            type="button"
                            onClick={() => handleSkillSelect(skillName, category.name)}
                            className={`px-3 py-2 text-sm rounded-md transition-all duration-200 flex items-center justify-between ${
                              selectedSkills.includes(skillName)
                                ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <span>{skillName}</span>
                            {selectedSkills.includes(skillName) && (
                              <FaCheckCircle className="ml-2 text-indigo-600" />
                            )}
                          </button>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-bold text-white uppercase rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Save Skills
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

SkillsFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default SkillsFormModal;
