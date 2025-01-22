import { useState } from "react";
import {
  commonRules,
  focusField,
  validateForm,
} from "../../utils/formValidation";
import Notification from "../common/Notification";
import { sharedStyles } from "../../utils/styling";
import {
  DEGREE_QUALIFICATIONS,
  getAllFieldsOfStudy,
} from "../../utils/constants";

const Education = ({ data, onUpdate, onNext, onPrev }) => {
  const [education, setEducation] = useState(data || []);
  const [currentEducation, setCurrentEducation] = useState({
    school_name: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    current: false,
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [fieldOptions] = useState(getAllFieldsOfStudy());
  const [expandedId, setExpandedId] = useState(null);

  const validationRules = {
    school_name: { required: true, label: "School Name" },
    degree: { required: true, label: "Degree" },
    field_of_study: { required: true, label: "Field of Study" },
    start_date: { required: true, label: "Start Date" },
    end_date: { required: !currentEducation.current, label: "End Date" },
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setCurrentEducation((prev) => ({
      ...prev,
      [id]: fieldValue,
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

  const handleAddEducation = (e) => {
    e.preventDefault();

    // Validate current education
    const { errors: validationErrors, firstErrorField } = validateForm(
      currentEducation,
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

    setEducation((prev) => [...prev, { ...currentEducation, id: Date.now() }]);
    setCurrentEducation({
      school_name: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      current: false,
      achievements: "",
    });
    setNotification({
      type: "success",
      message: "Education added successfully!",
    });
  };

  const handleRemoveEducation = (id) => {
    setEducation((prev) => prev.filter((edu) => edu.id !== id));
    setNotification({
      type: "success",
      message: "Education removed successfully!",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (education.length === 0) {
      setNotification({
        type: "error",
        message: "Please add at least one education entry",
      });
      return;
    }
    onUpdate(education);
    onNext();
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const errorIcon = (
    <svg
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6">
      {notification && (
        <Notification {...notification} onClose={() => setNotification(null)} />
      )}

      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="card">
          <div className="card-header bg-primary-600">
            <h3 className="text-lg font-semibold text-white">Education List</h3>
          </div>

          <div className="card-body divide-y divide-gray-200">
            {education.length > 0 ? (
              <div className={sharedStyles.educationList}>
                {education.map((edu) => (
                  <div key={edu.id} className={sharedStyles.educationCard}>
                    <div className="relative p-4 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4
                          className={sharedStyles.educationTitle}
                          title={edu.degree}
                        >
                          {edu.degree}
                        </h4>
                        <p
                          className={sharedStyles.educationSubtitle}
                          title={edu.school_name}
                        >
                          {edu.school_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => toggleExpand(edu.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label={
                            expandedId === edu.id ? "Show less" : "Show more"
                          }
                        >
                          <svg
                            className={`h-5 w-5 transform transition-transform ${
                              expandedId === edu.id ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleRemoveEducation(edu.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove education"
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
                    </div>
                    {expandedId === edu.id && (
                      <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                        <div className={sharedStyles.educationMeta}>
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                          <span>{edu.field_of_study}</span>
                        </div>
                        <div className={sharedStyles.educationMeta}>
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>
                            {edu.start_date} -{" "}
                            {edu.current ? "Present" : edu.end_date}
                          </span>
                        </div>
                        {edu.achievements && (
                          <div className="mt-3 text-gray-600 text-sm">
                            {edu.achievements}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <p className="mt-4 text-sm">No education added yet</p>
                <p className="text-xs text-gray-400">
                  Add your educational background below
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header bg-secondary-600">
            <h3 className="text-lg font-semibold text-white">Add Education</h3>
          </div>

          <div className="card-body">
            <form onSubmit={handleAddEducation} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <div className="w-full">
                  <label htmlFor="school_name" className="form-label">
                    School Name
                  </label>
                  <input
                    type="text"
                    id="school_name"
                    value={currentEducation.school_name}
                    onChange={handleChange}
                    className={`${sharedStyles.inputStyle} ${
                      errors.school_name ? sharedStyles.errorBorder : ""
                    }`}
                    placeholder="Enter school name"
                  />
                  {errors.school_name && (
                    <p className={sharedStyles.error}>
                      {errorIcon}
                      {errors.school_name[0]}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label htmlFor="degree" className="form-label">
                    Degree
                  </label>
                  <select
                    id="degree"
                    value={currentEducation.degree}
                    onChange={handleChange}
                    className={`${sharedStyles.inputStyle} ${
                      errors.degree ? sharedStyles.errorBorder : ""
                    }`}
                  >
                    <option value="">Select a degree</option>
                    {DEGREE_QUALIFICATIONS.map(({ value, label }) => (
                      <option key={value} value={label}>
                        {label}
                      </option>
                    ))}
                  </select>
                  {errors.degree && (
                    <p className={sharedStyles.error}>
                      {errorIcon}
                      {errors.degree[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full">
                <label htmlFor="field_of_study" className="form-label">
                  Field of Study
                </label>
                <select
                  id="field_of_study"
                  value={currentEducation.field_of_study}
                  onChange={handleChange}
                  className={`${sharedStyles.inputStyle} ${
                    errors.field_of_study ? sharedStyles.errorBorder : ""
                  }`}
                >
                  <option value="">Select field of study</option>
                  {fieldOptions.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
                {errors.field_of_study && (
                  <p className={sharedStyles.error}>
                    {errorIcon}
                    {errors.field_of_study[0]}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <div className="w-full">
                  <label htmlFor="start_date" className="form-label">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    value={currentEducation.start_date}
                    onChange={handleChange}
                    className={`${sharedStyles.inputStyle} ${
                      errors.start_date ? sharedStyles.errorBorder : ""
                    }`}
                  />
                  {errors.start_date && (
                    <p className={sharedStyles.error}>
                      {errorIcon}
                      {errors.start_date[0]}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label htmlFor="end_date" className="form-label">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    value={currentEducation.end_date}
                    onChange={handleChange}
                    disabled={currentEducation.current}
                    className={`${sharedStyles.inputStyle} ${
                      errors.end_date ? sharedStyles.errorBorder : ""
                    }`}
                  />
                  {errors.end_date && (
                    <p className={sharedStyles.error}>
                      {errorIcon}
                      {errors.end_date[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <label className="inline-flex items-center gap-3">
                  <div className="switch">
                    <input
                      type="checkbox"
                      id="current"
                      checked={currentEducation.current}
                      onChange={handleChange}
                    />
                    <span className="slider"></span>
                  </div>
                  <span>Certificate in View</span>
                </label>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center">
                  <button type="submit" className={sharedStyles.buttonSuccess}>
                    Add Education
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-sm text-gray-500">
                      Navigation
                    </span>
                  </div>
                </div>

                <div className={sharedStyles.actionButtons}>
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;
