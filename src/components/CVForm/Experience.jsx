import { useState, useEffect } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import RichTextMenuBar from "../common/RichTextMenuBar";
import {
  commonRules,
  focusField,
  validateForm,
} from "../../utils/formValidation";
import { sharedStyles } from "../../utils/styling";
import Notification from "../common/Notification";
import axiosInstance from "../../api/axios"; 
import { FaPlus, FaMinus, FaMagic } from 'react-icons/fa';

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
];

const Experience = ({ data, updateData }) => {
  const [experiences, setExperiences] = useState(data || []);
  const [expandedId, setExpandedId] = useState(null);
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
  const [editIndex, setEditIndex] = useState(-1);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [improving, setImproving] = useState(false);
  const [improvedText, setImprovedText] = useState("");
  const [improvingField, setImprovingField] = useState("");
  const [progress, setProgress] = useState(0);
  const [currentlyImproving, setCurrentlyImproving] = useState({ index: -1, field: null });

  const descriptionEditor = useEditor({
    extensions: [StarterKit],
    content: currentExperience.job_description || '',
    onUpdate: ({ editor }) => {
      handleInputChange('job_description', editor.getHTML());
    },
  });

  const achievementsEditor = useEditor({
    extensions: [StarterKit],
    content: currentExperience.achievements || '',
    onUpdate: ({ editor }) => {
      handleInputChange('achievements', editor.getHTML());
    },
  });

  useEffect(() => {
    if (descriptionEditor && currentExperience.job_description !== descriptionEditor.getHTML()) {
      descriptionEditor.commands.setContent(currentExperience.job_description || '');
    }
    if (achievementsEditor && currentExperience.achievements !== achievementsEditor.getHTML()) {
      achievementsEditor.commands.setContent(currentExperience.achievements || '');
    }
  }, [currentExperience, descriptionEditor, achievementsEditor]);

  const handleInputChange = (field, value) => {
    setCurrentExperience((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

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

  const handleImprove = async (field, content) => {
    if (!content?.trim()) {
      setNotification({
        type: "error",
        message: "Please enter some text to improve"
      });
      return;
    }

    setImprovingField(field);
    setImproving(true);
    setProgress(0);
    setNotification({
      type: "info",
      message: `Improving ${field === 'job_description' ? 'job description' : 'achievements'}...`
    });

    // Start progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + (90 - prev) * 0.1;
      });
    }, 1000);

    try {
      const response = await axiosInstance.post(
        '/api/cv_writer/cv/improve_summary/',
        { 
          summary: content,
          type: field === 'job_description' ? 'job_description' : 'achievement'
        },
        { timeout: 120000 }
      );

      if (response.data && response.data.improved) {
        setProgress(100);
        setImprovedText(response.data.improved);
        setNotification({
          type: "success",
          message: "Review and accept the improved version if you like it."
        });
      }
    } catch (err) {
      console.error('API Error:', err);
      let errorMessage = "Failed to improve text. Please try again.";
      
      if (err.response?.status === 401) {
        errorMessage = "Your session has expired. Please log in again.";
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return;
      }
      
      setNotification({
        type: "error",
        message: errorMessage
      });
    } finally {
      clearInterval(progressInterval);
      setImproving(false);
    }
  };

  const handleAcceptImprovement = () => {
    const updatedExperience = { ...currentExperience };
    updatedExperience[improvingField] = improvedText;
    setCurrentExperience(updatedExperience);
    setImprovedText("");
    setImprovingField("");
    setNotification({
      type: "success",
      message: "Improvement accepted!"
    });
  };

  const handleDiscardImprovement = () => {
    setImprovedText("");
    setImprovingField("");
    setNotification(null);
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
                          toggleExpand(index)
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
                              <div 
                                className="prose max-w-none text-gray-700" 
                                dangerouslySetInnerHTML={{ __html: exp.job_description }}
                              />
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Achievements:</span>{" "}
                              <div 
                                className="prose max-w-none text-gray-700" 
                                dangerouslySetInnerHTML={{ __html: exp.achievements }}
                              />
                            </p>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium">Job Description</label>
                                <button
                                  onClick={() => handleImprove('job_description', exp.job_description)}
                                  disabled={improving || !exp.job_description.trim()}
                                  className={`flex items-center space-x-1 px-2 py-1 rounded text-sm ${
                                    improving || !exp.job_description.trim()
                                      ? 'bg-gray-300 cursor-not-allowed'
                                      : 'bg-blue-500 text-white hover:bg-blue-600'
                                  }`}
                                >
                                  <FaMagic className="w-4 h-4" />
                                  <span>Improve</span>
                                </button>
                              </div>
                              <div 
                                className="prose max-w-none text-gray-700" 
                                dangerouslySetInnerHTML={{ __html: exp.job_description }}
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium">Key Achievements</label>
                                <button
                                  onClick={() => handleImprove('achievements', exp.achievements)}
                                  disabled={improving || !exp.achievements.trim()}
                                  className={`flex items-center space-x-1 px-2 py-1 rounded text-sm ${
                                    improving || !exp.achievements.trim()
                                      ? 'bg-gray-300 cursor-not-allowed'
                                      : 'bg-blue-500 text-white hover:bg-blue-600'
                                  }`}
                                >
                                  <FaMagic className="w-4 h-4" />
                                  <span>Improve</span>
                                </button>
                              </div>
                              <div 
                                className="prose max-w-none text-gray-700" 
                                dangerouslySetInnerHTML={{ __html: exp.achievements }}
                              />
                            </div>
                            {improving && currentlyImproving.index === index && (
                              <div className="mt-4">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                  <div
                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                                <div className="text-sm text-gray-600 mt-1 text-center">
                                  {progress < 100 ? 'Improving...' : 'Complete!'}
                                </div>
                              </div>
                            )}
                            {improvedText && currentlyImproving.index === index && (
                              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                                <h4 className="font-medium text-green-800 mb-2">Improved Version:</h4>
                                <p className="text-gray-800 whitespace-pre-wrap">{improvedText}</p>
                                <div className="mt-4 flex space-x-4">
                                  <button
                                    onClick={handleAcceptImprovement}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={handleDiscardImprovement}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                  >
                                    Discard
                                  </button>
                                </div>
                              </div>
                            )}
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
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Description
                    </label>
                    <div className="prose max-w-none">
                      <RichTextMenuBar editor={descriptionEditor} />
                      <EditorContent
                        editor={descriptionEditor}
                        className={`${sharedStyles.textareaStyle} min-h-[150px] focus:outline-none ${
                          errors.job_description ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.job_description && (
                      <p className="mt-1 text-sm text-red-500">{errors.job_description}</p>
                    )}
                    {!improvedText && improvingField !== 'job_description' && (
                      <button
                        onClick={() => handleImprove('job_description', descriptionEditor.getText())}
                        className={`${sharedStyles.buttonGhost} mt-2`}
                        disabled={improving}
                      >
                        Improve with AI
                      </button>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Key Achievements
                    </label>
                    <div className="prose max-w-none">
                      <RichTextMenuBar editor={achievementsEditor} />
                      <EditorContent
                        editor={achievementsEditor}
                        className={`${sharedStyles.textareaStyle} min-h-[150px] focus:outline-none ${
                          errors.achievements ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    {errors.achievements && (
                      <p className="mt-1 text-sm text-red-500">{errors.achievements}</p>
                    )}
                    {!improvedText && improvingField !== 'achievements' && (
                      <button
                        onClick={() => handleImprove('achievements', achievementsEditor.getText())}
                        className={`${sharedStyles.buttonGhost} mt-2`}
                        disabled={improving}
                      >
                        Improve with AI
                      </button>
                    )}
                  </div>

                  {improving && currentlyImproving.index === -1 && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-600 mt-1 text-center">
                        {progress < 100 ? 'Improving...' : 'Complete!'}
                      </div>
                    </div>
                  )}

                  {improvedText && currentlyImproving.index === -1 && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                      <h4 className="font-medium text-green-800 mb-2">Improved Version:</h4>
                      <p className="text-gray-800 whitespace-pre-wrap">{improvedText}</p>
                      <div className="mt-4 flex space-x-4">
                        <button
                          onClick={handleAcceptImprovement}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={handleDiscardImprovement}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Discard
                        </button>
                      </div>
                    </div>
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
