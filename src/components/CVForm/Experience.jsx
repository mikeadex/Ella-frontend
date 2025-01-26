import { useState } from "react";
import {
  commonRules,
  focusField,
  validateForm,
} from "../../utils/formValidation";
import Notification from "../common/Notification";
import { sharedStyles } from "../../utils/styling";

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
];

const Experience = ({ data, updateData }) => {
  const [experiences, setExperiences] = useState(data || []);
  const [currentExperience, setCurrentExperience] = useState({
    company_name: "",
    job_title: "",
    job_description: "",
    employment_type: "Full-time",
    achievements: "",
    start_date: "",
    end_date: "",
    current: false,
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const validationRules = {
    company_name: { required: true, label: "Company Name" },
    job_title: { required: true, label: "Job Title" },
    job_description: { required: true, label: "Job Description" },
    employment_type: { required: true, label: "Employment Type" },
    achievements: { required: true, label: "Achievements" },
    start_date: { required: true, label: "Start Date" },
    end_date: { required: !currentExperience.current, label: "End Date" },
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setCurrentExperience((prev) => ({
      ...prev,
      [id]: fieldValue,
      ...(id === 'current' && fieldValue ? { end_date: '' } : {}),
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

  const handleAddExperience = (e) => {
    e.preventDefault();

    // Validate the current experience
    const { errors: validationErrors, firstErrorField } = validateForm(
      currentExperience,
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

    // Add the new experience
    const updatedExperiences = [...experiences, currentExperience];
    setExperiences(updatedExperiences);
    updateData(updatedExperiences, false); // Pass false to prevent auto-navigation

    // Reset the form
    setCurrentExperience({
      company_name: "",
      job_title: "",
      job_description: "",
      employment_type: "Full-time",
      achievements: "",
      start_date: "",
      end_date: "",
      current: false,
    });
    setErrors({});
    setNotification({
      type: "success",
      message: "Experience added successfully!",
    });
  };

  const handleDeleteExperience = (index) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
    updateData(updatedExperiences, false); // Pass false to prevent auto-navigation
    setNotification({
      type: "success",
      message: "Experience deleted successfully!",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (experiences.length === 0) {
      setNotification({
        type: "error",
        message: "Please add at least one work experience",
      });
      return;
    }

    updateData(experiences, true); // Pass true to allow navigation on final submit
    setNotification({
      type: "success",
      message: "Work experience saved successfully!",
    });
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6">
      {notification && (
        <Notification {...notification} onClose={() => setNotification(null)} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
        <div className={sharedStyles.card}>
          <div className={sharedStyles.cardHeader}>
            <h3 className="text-lg font-semibold">Work Experience</h3>
          </div>

          <div className={sharedStyles.cardBody}>
            {/* List of added experiences */}
            {experiences.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-4">Added Experiences</h4>
                <div className="space-y-4">
                  {experiences.map((exp, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 relative group border border-gray-200"
                    >
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(index)}
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
                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          setExpandedId(expandedId === index ? null : index)
                        }
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-medium">{exp.job_title}</h5>
                            <p className="text-sm text-gray-600">
                              {exp.company_name}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {exp.start_date} -{" "}
                            {exp.current ? "Present" : exp.end_date}
                          </div>
                        </div>
                        {expandedId === index && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm">
                              <span className="font-medium">Type:</span>{" "}
                              {exp.employment_type}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Description:</span>{" "}
                              {exp.job_description}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Achievements:</span>{" "}
                              {exp.achievements}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add new experience form */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium mb-4">Add New Experience</h4>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="company_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company_name"
                    value={currentExperience.company_name}
                    onChange={handleChange}
                    className={`${sharedStyles.inputStyle} ${
                      errors.company_name ? sharedStyles.errorBorder : ""
                    }`}
                  />
                  {errors.company_name && (
                    <p className={sharedStyles.error}>
                      {errors.company_name[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="job_title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Job Title *
                  </label>
                  <input
                    type="text"
                    id="job_title"
                    value={currentExperience.job_title}
                    onChange={handleChange}
                    className={`${sharedStyles.inputStyle} ${
                      errors.job_title ? sharedStyles.errorBorder : ""
                    }`}
                  />
                  {errors.job_title && (
                    <p className={sharedStyles.error}>
                      {errors.job_title[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="employment_type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Employment Type *
                  </label>
                  <select
                    id="employment_type"
                    value={currentExperience.employment_type}
                    onChange={handleChange}
                    className={`${sharedStyles.inputStyle} ${
                      errors.employment_type ? sharedStyles.errorBorder : ""
                    }`}
                  >
                    {EMPLOYMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.employment_type && (
                    <p className={sharedStyles.error}>
                      {errors.employment_type[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="start_date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    value={currentExperience.start_date}
                    onChange={handleChange}
                    className={`${sharedStyles.inputStyle} ${
                      errors.start_date ? sharedStyles.errorBorder : ""
                    }`}
                  />
                  {errors.start_date && (
                    <p className={sharedStyles.error}>
                      {errors.start_date[0]}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="current"
                      checked={currentExperience.current}
                      onChange={handleChange}
                      className="h-4 w-4 text-sky-950 focus:ring-sky-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="current"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      I currently work here
                    </label>
                  </div>

                  {!currentExperience.current && (
                    <div>
                      <label
                        htmlFor="end_date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        End Date *
                      </label>
                      <input
                        type="date"
                        id="end_date"
                        value={currentExperience.end_date}
                        onChange={handleChange}
                        min={currentExperience.start_date}
                        className={`${sharedStyles.inputStyle} ${
                          errors.end_date ? sharedStyles.errorBorder : ""
                        }`}
                      />
                      {errors.end_date && (
                        <p className={sharedStyles.error}>
                          {errors.end_date[0]}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="job_description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Job Description *
                  </label>
                  <textarea
                    id="job_description"
                    rows={4}
                    value={currentExperience.job_description}
                    onChange={handleChange}
                    className={`${sharedStyles.textareaStyle} ${
                      errors.job_description ? sharedStyles.errorBorder : ""
                    }`}
                    placeholder="Describe your key responsibilities and duties..."
                  />
                  {errors.job_description && (
                    <p className={sharedStyles.error}>
                      {errors.job_description[0]}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="achievements"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Key Achievements *
                  </label>
                  <textarea
                    id="achievements"
                    rows={4}
                    value={currentExperience.achievements}
                    onChange={handleChange}
                    className={`${sharedStyles.textareaStyle} ${
                      errors.achievements ? sharedStyles.errorBorder : ""
                    }`}
                    placeholder="List your major achievements and contributions..."
                  />
                  {errors.achievements && (
                    <p className={sharedStyles.error}>
                      {errors.achievements[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className={sharedStyles.buttonSuccess}
                >
                  Add Experience
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

export default Experience;
