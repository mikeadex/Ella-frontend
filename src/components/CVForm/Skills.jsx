import { useState } from "react";
import { commonRules, focusField, validateForm } from "../../utils/formValidation";
import Notification from "../common/Notification";
import { sharedStyles } from "../../utils/styling";
import { SKILL_CATEGORIES } from "../../utils/constants";

const Skills = ({ data, updateData }) => {
  const [skills, setSkills] = useState(data || []);
  const [currentSkill, setCurrentSkill] = useState({
    name: "",
    proficiency: "Intermediate",
    isCustom: false,
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const validationRules = {
    name: { required: true, label: "Skill Name" },
    proficiency: { required: true, label: "Proficiency Level" },
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCurrentSkill((prev) => ({
      ...prev,
      [id]: value,
      isCustom: true,
    }));

    // Clear error for the field being edited
    if (errors[id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleAddSkill = (skillName = currentSkill.name) => {
    if (!skillName.trim()) {
      setNotification({
        type: "error",
        message: "Please enter a skill name",
      });
      return;
    }

    // Check if skill already exists
    if (skills.some((skill) => skill.name.toLowerCase() === skillName.toLowerCase())) {
      setNotification({
        type: "error",
        message: "This skill has already been added",
      });
      return;
    }

    // Add the new skill
    const newSkill = {
      name: skillName,
      proficiency: currentSkill.proficiency,
      category: selectedCategory || "Other",
      isCustom: currentSkill.isCustom,
    };

    const updatedSkills = [...skills, newSkill];
    setSkills(updatedSkills);
    updateData(updatedSkills, false); // Pass false to prevent auto-navigation

    // Reset the form
    setCurrentSkill({
      name: "",
      proficiency: "Intermediate",
      isCustom: false,
    });
    setErrors({});
    setNotification({
      type: "success",
      message: "Skill added successfully!",
    });
  };

  const handleDeleteSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    updateData(updatedSkills, false); // Pass false to prevent auto-navigation
    setNotification({
      type: "success",
      message: "Skill deleted successfully!",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (skills.length === 0) {
      setNotification({
        type: "error",
        message: "Please add at least one skill",
      });
      return;
    }

    updateData(skills, true); // Pass true to allow navigation on final submit
    setNotification({
      type: "success",
      message: "Skills saved successfully!",
    });
  };

  const filteredSkills = SKILL_CATEGORIES.reduce((acc, category) => {
    if (!selectedCategory || selectedCategory === category.name) {
      const filtered = category.skills.filter((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
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

  const proficiencyLevels = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
  ];

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6">
      {notification && (
        <Notification {...notification} onClose={() => setNotification(null)} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
        <div className={sharedStyles.experienceCard}>
          <div className="bg-sky-950 text-white p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold">Skills</h3>
          </div>

          <div className="p-6">
            {/* List of added skills */}
            {skills.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-4">Added Skills</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 relative group border border-gray-200"
                    >
                      <button
                        type="button"
                        onClick={() => handleDeleteSkill(index)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <div>
                        <h5 className="font-medium">{skill.name}</h5>
                        <p className="text-sm text-gray-600">
                          {skill.proficiency}
                        </p>
                        {skill.category && (
                          <p className="text-xs text-gray-500 mt-1">
                            {skill.category}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search and Filter */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={sharedStyles.inputStyle}
                  >
                    <option value="">All Categories</option>
                    {SKILL_CATEGORIES.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Search Skills
                  </label>
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={sharedStyles.inputStyle}
                    placeholder="Search for skills..."
                  />
                </div>
              </div>

              {/* Skill Suggestions */}
              {filteredSkills.length > 0 && (
                <div className="border rounded-lg divide-y">
                  {filteredSkills.map((category) => (
                    <div key={category.name} className="p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {category.name}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => {
                              setCurrentSkill((prev) => ({
                                ...prev,
                                name: skill,
                                isCustom: false,
                              }));
                              handleAddSkill(skill);
                            }}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-700"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Custom Skill Input */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-medium mb-4">Add Custom Skill</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Skill Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={currentSkill.name}
                      onChange={handleChange}
                      className={`${sharedStyles.inputStyle} ${
                        errors.name ? sharedStyles.errorBorder : ""
                      }`}
                      placeholder="e.g., Project Management"
                    />
                    {errors.name && (
                      <p className={sharedStyles.error}>{errors.name[0]}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="proficiency"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Proficiency Level *
                    </label>
                    <select
                      id="proficiency"
                      value={currentSkill.proficiency}
                      onChange={handleChange}
                      className={`${sharedStyles.inputStyle} ${
                        errors.proficiency ? sharedStyles.errorBorder : ""
                      }`}
                    >
                      {proficiencyLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                    {errors.proficiency && (
                      <p className={sharedStyles.error}>
                        {errors.proficiency[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => handleAddSkill()}
                    className={sharedStyles.buttonSuccess}
                  >
                    Add Custom Skill
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className={sharedStyles.buttonPrimary}
          >
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default Skills;