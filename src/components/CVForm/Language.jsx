import { useState } from "react";
import { commonRules, focusField, validateForm } from "../../utils/formValidation";
import Notification from "../common/Notification";
import { sharedStyles } from "../../utils/styling";

const Language = ({ data, updateData }) => {
  const [languages, setLanguages] = useState(data || []);
  const [currentLanguage, setCurrentLanguage] = useState({
    name: "",
    proficiency: "Intermediate",
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  const validationRules = {
    name: { required: true, label: "Language Name" },
    proficiency: { required: true, label: "Proficiency Level" },
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCurrentLanguage((prev) => ({
      ...prev,
      [id]: value,
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

  const handleAddLanguage = (e) => {
    e.preventDefault();

    // Validate the current language
    const { errors: validationErrors, firstErrorField } = validateForm(
      currentLanguage,
      validationRules
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setNotification({
        type: "error",
        message: validationErrors[firstErrorField][0],
      });
      focusField(firstErrorField);
      return;
    }

    // Check if language already exists
    if (languages.some((lang) => lang.name.toLowerCase() === currentLanguage.name.toLowerCase())) {
      setNotification({
        type: "error",
        message: "This language has already been added",
      });
      return;
    }

    // Add the new language
    const updatedLanguages = [...languages, currentLanguage];
    setLanguages(updatedLanguages);
    updateData(updatedLanguages, false); // Pass false to prevent auto-navigation

    // Reset the form
    setCurrentLanguage({
      name: "",
      proficiency: "Intermediate",
    });
    setErrors({});
    setNotification({
      type: "success",
      message: "Language added successfully!",
    });
  };

  const handleDeleteLanguage = (index) => {
    const updatedLanguages = languages.filter((_, i) => i !== index);
    setLanguages(updatedLanguages);
    updateData(updatedLanguages, false); // Pass false to prevent auto-navigation
    setNotification({
      type: "success",
      message: "Language deleted successfully!",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (languages.length === 0) {
      setNotification({
        type: "error",
        message: "Please add at least one language",
      });
      return;
    }

    updateData(languages, true); // Pass true to allow navigation on final submit
    setNotification({
      type: "success",
      message: "Languages saved successfully!",
    });
  };

  const proficiencyLevels = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Native/Bilingual",
  ];

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6">
      {notification && (
        <Notification {...notification} onClose={() => setNotification(null)} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
        <div className={sharedStyles.experienceCard}>
          <div className="bg-sky-950 text-white p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold">Languages</h3>
          </div>

          <div className="p-6">
            {/* List of added languages */}
            {languages.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-4">Added Languages</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {languages.map((language, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 relative group border border-gray-200"
                    >
                      <button
                        type="button"
                        onClick={() => handleDeleteLanguage(index)}
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
                        <h5 className="font-medium">{language.name}</h5>
                        <p className="text-sm text-gray-600">
                          {language.proficiency}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add new language form */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium mb-4">Add New Language</h4>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Language Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={currentLanguage.name}
                    onChange={handleChange}
                    className={`${sharedStyles.inputStyle} ${
                      errors.name ? sharedStyles.errorBorder : ""
                    }`}
                    placeholder="e.g., English, Spanish, French"
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
                    value={currentLanguage.proficiency}
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

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleAddLanguage}
                  className={sharedStyles.buttonSuccess}
                >
                  Add Language
                </button>
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

export default Language;