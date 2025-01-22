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

const Experience = ({ data, onUpdate, onNext, onPrev }) => {
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

    const { errors: validationErrors, firstErrorField } = validateForm(
      currentExperience,
      validationRules
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      focusField(firstErrorField);
      setNotification({
        type: "error",
        message: "Please fill in all required fields correctly.",
      });
      return;
    }

    setExperiences((prev) => [...prev, { ...currentExperience, id: Date.now() }]);

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

    setNotification({
      type: "success",
      message: "Experience added successfully!",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (experiences.length === 0) {
      setNotification({
        type: "error",
        message: "Please add at least one experience.",
      });
      return;
    }

    onUpdate(experiences);
    onNext();
  };

  const handleRemove = (id) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id));
    setNotification({
      type: "success",
      message: "Experience removed successfully!",
    });
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6">
      {notification && (
        <Notification {...notification} onClose={() => setNotification(null)} />
      )}

      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="card">
          <div className="card-header bg-primary-600">
            <h3 className="text-lg font-semibold text-white">Experience List</h3>
          </div>

          <div className="card-body">
            {experiences.length > 0 ? (
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <div className="p-4 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-lg font-medium text-gray-900 truncate">
                          {exp.job_title}
                        </h4>
                        <p className="text-sm text-gray-600">{exp.company_name}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleExpand(exp.id)}
                          className="text-gray-400 hover:text-gray-600"
                          aria-label={expandedId === exp.id ? "Show less" : "Show more"}
                        >
                          <svg
                            className={`h-5 w-5 transform transition-transform ${
                              expandedId === exp.id ? "rotate-180" : ""
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
                          onClick={() => handleRemove(exp.id)}
                          className="text-red-600 hover:text-red-800"
                          aria-label="Remove experience"
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
                    {expandedId === exp.id && (
                      <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <svg
                              className="h-4 w-4 mr-1"
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
                              {exp.start_date} - {exp.current ? "Present" : exp.end_date}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{exp.employment_type}</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <h5 className="text-sm font-medium text-gray-900">Description</h5>
                          <p className="mt-1 text-sm text-gray-600">{exp.job_description}</p>
                        </div>
                        <div className="mt-3">
                          <h5 className="text-sm font-medium text-gray-900">Achievements</h5>
                          <p className="mt-1 text-sm text-gray-600">{exp.achievements}</p>
                        </div>
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
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-4 text-sm">No work experience added yet</p>
                <p className="text-xs text-gray-400">
                  Add your work experience below
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header bg-secondary-600">
            <h3 className="text-lg font-semibold text-white">Add Experience</h3>
          </div>

          <div className="card-body">
            <form onSubmit={handleAddExperience} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <div className="w-full">
                  <label htmlFor="company_name" className="form-label">
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
                    placeholder="Enter company name"
                  />
                  {errors.company_name && (
                    <p className={sharedStyles.error}>
                      {errors.company_name}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label htmlFor="job_title" className="form-label">
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
                    placeholder="Enter job title"
                  />
                  {errors.job_title && (
                    <p className={sharedStyles.error}>
                      {errors.job_title}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label htmlFor="employment_type" className="form-label">
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
                      {errors.employment_type}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label htmlFor="start_date" className="form-label">
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
                      {errors.start_date}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label htmlFor="end_date" className="form-label">
                    End Date {!currentExperience.current && "*"}
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    value={currentExperience.end_date}
                    onChange={handleChange}
                    disabled={currentExperience.current}
                    className={`${sharedStyles.inputStyle} ${
                      errors.end_date ? sharedStyles.errorBorder : ""
                    }`}
                  />
                  {errors.end_date && (
                    <p className={sharedStyles.error}>
                      {errors.end_date}
                    </p>
                  )}
                </div>

                <div className="w-full col-span-2">
                  <div className="flex items-center mt-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="current"
                        checked={currentExperience.current}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      <span className="ml-3 text-sm font-medium text-gray-900">I currently work here</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="job_description" className="form-label">
                    Job Description *
                  </label>
                  <textarea
                    id="job_description"
                    value={currentExperience.job_description}
                    onChange={handleChange}
                    rows="4"
                    className={`${sharedStyles.inputStyle} ${
                      errors.job_description ? sharedStyles.errorBorder : ""
                    }`}
                    placeholder="Describe your responsibilities and key accomplishments..."
                  />
                  {errors.job_description && (
                    <p className={sharedStyles.error}>
                      {errors.job_description}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="achievements" className="form-label">
                    Key Achievements *
                  </label>
                  <textarea
                    id="achievements"
                    value={currentExperience.achievements}
                    onChange={handleChange}
                    rows="4"
                    className={`${sharedStyles.inputStyle} ${
                      errors.achievements ? sharedStyles.errorBorder : ""
                    }`}
                    placeholder="List your key achievements and contributions..."
                  />
                  {errors.achievements && (
                    <p className={sharedStyles.error}>
                      {errors.achievements}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    Add Experience
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onPrev}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Experience;
