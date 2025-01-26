import { useState } from "react";
import { commonRules, focusField, validateForm } from "../../utils/formValidation";
import Notification from "../common/Notification";
import { sharedStyles } from "../../utils/styling";

const Education = ({ data, updateData }) => {
  const [educations, setEducations] = useState(data || []);
  const [currentEducation, setCurrentEducation] = useState({
    school_name: "",
    degree: "",
    field_of_study: "",
    start_date: "",
    end_date: "",
    current: false,
    description: "",
    achievements: "",
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const validationRules = {
    school_name: { required: true, label: "School Name" },
    degree: { required: true, label: "Degree" },
    field_of_study: { required: true, label: "Field of Study" },
    start_date: { required: true, label: "Start Date" },
    end_date: { required: !currentEducation.current, label: "End Date" },
    description: { required: true, label: "Description" },
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setCurrentEducation((prev) => ({
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

  const handleAddEducation = (e) => {
    e.preventDefault();

    // Validate the current education
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

    // Add the new education
    const updatedEducations = [...educations, currentEducation];
    setEducations(updatedEducations);
    updateData(updatedEducations, false); // Pass false to prevent auto-navigation

    // Reset the form
    setCurrentEducation({
      school_name: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      current: false,
      description: "",
      achievements: "",
    });
    setErrors({});
    setNotification({
      type: "success",
      message: "Education added successfully!",
    });
  };

  const handleDeleteEducation = (index) => {
    const updatedEducations = educations.filter((_, i) => i !== index);
    setEducations(updatedEducations);
    updateData(updatedEducations, false); // Pass false to prevent auto-navigation
    setNotification({
      type: "success",
      message: "Education deleted successfully!",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (educations.length === 0) {
      setNotification({
        type: "error",
        message: "Please add at least one education",
      });
      return;
    }

    updateData(educations, true); // Pass true to allow navigation on final submit
    setNotification({
      type: "success",
      message: "Education saved successfully!",
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
            <h3 className="text-lg font-semibold">Education</h3>
          </div>

          <div className={sharedStyles.cardBody}>
            {/* List of added educations */}
            {educations.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-4">Added Education</h4>
                <div className="space-y-4">
                  {educations.map((edu, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 relative group border border-gray-200"
                    >
                      <button
                        type="button"
                        onClick={() => handleDeleteEducation(index)}
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
                            <h5 className="font-medium">{edu.school_name}</h5>
                            <p className="text-sm text-gray-600">
                              {edu.degree} in {edu.field_of_study}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {edu.start_date} -{" "}
                            {edu.current ? "Present" : edu.end_date}
                          </div>
                        </div>
                        {expandedId === index && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm">
                              <span className="font-medium">Description:</span>{" "}
                              {edu.description}
                            </p>
                            {edu.achievements && (
                              <p className="text-sm">
                                <span className="font-medium">Achievements:</span>{" "}
                                {edu.achievements}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add new education form */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium mb-4">Add New Education</h4>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="school_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    School Name *
                  </label>
                  <input
                    type="text"
                    id="school_name"
                    value={currentEducation.school_name}
                    onChange={handleChange}
                    className={`${sharedStyles.inputStyle} ${
                      errors.school_name ? sharedStyles.errorBorder : ""
                    }`}
                  />
                  {errors.school_name && (
                    <p className={sharedStyles.error}>
                      {errors.school_name[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="degree"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Degree *
                  </label>
                  <input
                    type="text"
                    id="degree"
                    value={currentEducation.degree}
                    onChange={handleChange}
                    className={`${sharedStyles.inputStyle} ${
                      errors.degree ? sharedStyles.errorBorder : ""
                    }`}
                  />
                  {errors.degree && (
                    <p className={sharedStyles.error}>
                      {errors.degree[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="field_of_study"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Field of Study *
                  </label>
                  <input
                    type="text"
                    id="field_of_study"
                    value={currentEducation.field_of_study}
                    onChange={handleChange}
                    className={`${sharedStyles.inputStyle} ${
                      errors.field_of_study ? sharedStyles.errorBorder : ""
                    }`}
                  />
                  {errors.field_of_study && (
                    <p className={sharedStyles.error}>
                      {errors.field_of_study[0]}
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
                    value={currentEducation.start_date}
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
                      checked={currentEducation.current}
                      onChange={handleChange}
                      className="h-4 w-4 text-sky-950 focus:ring-sky-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="current"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      I am currently studying here
                    </label>
                  </div>

                  {!currentEducation.current && (
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
                        value={currentEducation.end_date}
                        onChange={handleChange}
                        min={currentEducation.start_date}
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
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description *
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={currentEducation.description}
                    onChange={handleChange}
                    className={`${sharedStyles.textareaStyle} ${
                      errors.description ? sharedStyles.errorBorder : ""
                    }`}
                    placeholder="Describe your studies, major subjects, thesis, etc..."
                  />
                  {errors.description && (
                    <p className={sharedStyles.error}>
                      {errors.description[0]}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="achievements"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Achievements
                  </label>
                  <textarea
                    id="achievements"
                    rows={4}
                    value={currentEducation.achievements}
                    onChange={handleChange}
                    className={sharedStyles.textareaStyle}
                    placeholder="List any awards, honors, or notable achievements..."
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className={sharedStyles.buttonSuccess}
                >
                  Add Education
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

export default Education;
