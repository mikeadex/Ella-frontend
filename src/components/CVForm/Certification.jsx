import { useState } from "react";
import {
  commonRules,
  focusField,
  validateForm,
} from "../../utils/formValidation";
import Notification from "../common/Notification";
import { sharedStyles } from "../../utils/styling";

const Certification = ({ data, onUpdate, onNext, onPrev }) => {
  const [certifications, setCertifications] = useState(data || []);
  const [currentCertification, setCurrentCertification] = useState({
    certification_name: "",
    certification_date: "",
    certification_link: "",
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const validationRules = {
    certification_name: { required: true, label: "Certification Name" },
    certification_date: { required: true, label: "Certification Date" },
    certification_link: { required: true, label: "Certification Link", type: "url" },
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCurrentCertification((prev) => ({
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

  const handleAddCertification = (e) => {
    e.preventDefault();

    // Validate current certification
    const { errors: validationErrors, firstErrorField } = validateForm(
      currentCertification,
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

    const newCertifications = [...certifications, { ...currentCertification, id: Date.now() }];
    setCertifications(newCertifications);
    onUpdate(newCertifications);

    // Reset form
    setCurrentCertification({
      certification_name: "",
      certification_date: "",
      certification_link: "",
    });
    setNotification({
      type: "success",
      message: "Certification added successfully!",
    });
  };

  const handleRemoveCertification = (id) => {
    const newCertifications = certifications.filter((cert) => cert.id !== id);
    setCertifications(newCertifications);
    onUpdate(newCertifications);
    setNotification({
      type: "success",
      message: "Certification removed successfully!",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (certifications.length === 0) {
      setNotification({
        type: "error",
        message: "Please add at least one certification",
      });
      return;
    }
    onUpdate(certifications);
    onNext();
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
            <h3 className="text-lg font-semibold text-white">Certification List</h3>
          </div>

          <div className="card-body divide-y divide-gray-200">
            {certifications.length > 0 ? (
              <div className={sharedStyles.educationList}>
                {certifications.map((cert) => (
                  <div key={cert.id} className={sharedStyles.educationCard}>
                    <div className="relative p-4 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className={sharedStyles.educationTitle} title={cert.certification_name}>
                          {cert.certification_name}
                        </h4>
                        <p className={sharedStyles.educationSubtitle}>
                          {new Date(cert.certification_date).toLocaleDateString()}
                        </p>
                        <a
                          href={cert.certification_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 text-sm inline-block mt-1"
                        >
                          View Certificate →
                        </a>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => toggleExpand(cert.id)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label={expandedId === cert.id ? "Show less" : "Show more"}
                        >
                          <svg
                            className={`h-5 w-5 transform transition-transform ${
                              expandedId === cert.id ? "rotate-180" : ""
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
                          onClick={() => handleRemoveCertification(cert.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove certification"
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
                    {expandedId === cert.id && (
                      <div className="p-4 bg-gray-50">
                        <form className="space-y-4">
                          <div>
                            <label className={sharedStyles.label}>
                              Certification Name
                            </label>
                            <input
                              type="text"
                              value={cert.certification_name}
                              className={sharedStyles.input}
                              disabled
                            />
                          </div>
                          <div>
                            <label className={sharedStyles.label}>
                              Certification Date
                            </label>
                            <input
                              type="date"
                              value={cert.certification_date}
                              className={sharedStyles.input}
                              disabled
                            />
                          </div>
                          <div>
                            <label className={sharedStyles.label}>
                              Certification Link
                            </label>
                            <input
                              type="url"
                              value={cert.certification_link}
                              className={sharedStyles.input}
                              disabled
                            />
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No certifications added yet. Add your first certification below.
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header bg-primary-600">
            <h3 className="text-lg font-semibold text-white">Add New Certification</h3>
          </div>

          <div className="card-body">
            <form onSubmit={handleAddCertification} className="space-y-4">
              <div>
                <label htmlFor="certification_name" className={sharedStyles.label}>
                  Certification Name
                </label>
                <input
                  type="text"
                  id="certification_name"
                  value={currentCertification.certification_name}
                  onChange={handleChange}
                  className={`${sharedStyles.input} ${
                    errors.certification_name ? "border-red-500" : ""
                  }`}
                  placeholder="e.g., AWS Solutions Architect"
                />
                {errors.certification_name && (
                  <p className={sharedStyles.errorText}>{errors.certification_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="certification_date" className={sharedStyles.label}>
                  Certification Date
                </label>
                <input
                  type="date"
                  id="certification_date"
                  value={currentCertification.certification_date}
                  onChange={handleChange}
                  className={`${sharedStyles.input} ${
                    errors.certification_date ? "border-red-500" : ""
                  }`}
                />
                {errors.certification_date && (
                  <p className={sharedStyles.errorText}>{errors.certification_date}</p>
                )}
              </div>

              <div>
                <label htmlFor="certification_link" className={sharedStyles.label}>
                  Certification Link
                </label>
                <input
                  type="url"
                  id="certification_link"
                  value={currentCertification.certification_link}
                  onChange={handleChange}
                  className={`${sharedStyles.input} ${
                    errors.certification_link ? "border-red-500" : ""
                  }`}
                  placeholder="https://example.com/certification"
                />
                {errors.certification_link && (
                  <p className={sharedStyles.errorText}>{errors.certification_link}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button type="submit" className={sharedStyles.buttonPrimary}>
                  Add Certification
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex justify-between">
          <button onClick={onPrev} className={sharedStyles.buttonSecondary}>
            Previous
          </button>
          <button
            onClick={handleSubmit}
            className={sharedStyles.buttonSuccess}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Certification;