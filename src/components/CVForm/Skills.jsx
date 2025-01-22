import { useState } from "react";
import { SKILL_CATEGORIES } from "../../utils/constants";
import { sharedStyles } from "../../utils/styling";
import Notification from "../common/Notification";

const Skills = ({ data, onUpdate, onNext, onPrev }) => {
  const [skills, setSkills] = useState(data || []);
  const [currentSkill, setCurrentSkill] = useState({
    name: "",
    category: "",
    proficiency: 3, // 1-5 scale
    isCustom: false,
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const proficiencyLevels = [
    { value: 1, label: "Beginner" },
    { value: 2, label: "Elementary" },
    { value: 3, label: "Intermediate" },
    { value: 4, label: "Advanced" },
    { value: 5, label: "Expert" },
  ];

  const handleAddSkill = (skillName = currentSkill.name) => {
    if (!skillName.trim()) {
      setNotification({
        type: "error",
        message: "Please enter a skill name",
      });
      return;
    }

    if (skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) {
      setNotification({
        type: "error",
        message: "This skill has already been added",
      });
      return;
    }

    const newSkill = {
      id: Date.now(),
      name: skillName,
      category: currentSkill.category || selectedCategory || "Other",
      proficiency: currentSkill.proficiency,
      isCustom: currentSkill.isCustom,
    };

    setSkills((prev) => [...prev, newSkill]);
    setCurrentSkill({
      name: "",
      category: selectedCategory,
      proficiency: 3,
      isCustom: false,
    });
    setNotification({
      type: "success",
      message: "Skill added successfully!",
    });
  };

  const handleRemoveSkill = (id) => {
    setSkills((prev) => prev.filter((skill) => skill.id !== id));
    setNotification({
      type: "success",
      message: "Skill removed successfully!",
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
    onUpdate(skills);
    onNext();
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

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6">
      {notification && (
        <Notification {...notification} onClose={() => setNotification(null)} />
      )}

      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="card">
          <div className="card-header bg-primary-600">
            <h3 className="text-lg font-semibold text-white">Skills</h3>
          </div>

          <div className="card-body">
            <div className="space-y-6">
              {/* Skills List */}
              {skills.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {skill.name}
                        </h4>
                        <div className="mt-1 flex items-center">
                          <div className="flex-1">
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-blue-600 rounded-full"
                                style={{
                                  width: `${(skill.proficiency / 5) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                          <span className="ml-2 text-xs text-gray-500">
                            {
                              proficiencyLevels.find(
                                (l) => l.value === skill.proficiency
                              )?.label
                            }
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveSkill(skill.id)}
                        className="ml-4 text-gray-400 hover:text-red-500"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Skills Form */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label htmlFor="category" className="form-label">
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
                    <label htmlFor="search" className="form-label">
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
                              onClick={() => handleAddSkill(skill)}
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
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label htmlFor="customSkill" className="form-label">
                        Custom Skill
                      </label>
                      <input
                        type="text"
                        id="customSkill"
                        value={currentSkill.name}
                        onChange={(e) =>
                          setCurrentSkill((prev) => ({
                            ...prev,
                            name: e.target.value,
                            isCustom: true,
                          }))
                        }
                        className={sharedStyles.inputStyle}
                        placeholder="Enter a custom skill..."
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor="proficiency" className="form-label">
                        Proficiency
                      </label>
                      <select
                        id="proficiency"
                        value={currentSkill.proficiency}
                        onChange={(e) =>
                          setCurrentSkill((prev) => ({
                            ...prev,
                            proficiency: Number(e.target.value),
                          }))
                        }
                        className={sharedStyles.inputStyle}
                      >
                        {proficiencyLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddSkill()}
                    className={`${sharedStyles.buttonSuccess} w-full`}
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
            type="button"
            onClick={onPrev}
            className={sharedStyles.buttonSecondary}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={sharedStyles.buttonPrimary}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Skills;