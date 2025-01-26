import { useState } from "react";
import { commonRules, focusField, validateForm } from "../../utils/formValidation";
import Notification from "../common/Notification";
import { sharedStyles } from "../../utils/styling";

const Certification = ({ data, updateData }) => {
  const [certifications, setCertifications] = useState(data || []);
  const [currentCertification, setCurrentCertification] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    credentialId: "",
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  const validationRules = {
    name: { required: true, label: "Certification Name" },
    issuer: { required: true, label: "Issuer" },
    issueDate: { required: true, label: "Issue Date" },
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

    // Validate the current certification
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

    // Add the new certification
    const updatedCertifications = [...certifications, currentCertification];
    setCertifications(updatedCertifications);
    updateData(updatedCertifications, false); // Pass false to prevent auto-navigation

    // Reset the form
    setCurrentCertification({
      name: "",
      issuer: "",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
    });
    setErrors({});
    setNotification({
      type: "success",
      message: "Certification added successfully!",
    });
  };

  const handleDeleteCertification = (index) => {
    const updatedCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(updatedCertifications);
    updateData(updatedCertifications, false); // Pass false to prevent auto-navigation
    setNotification({
      type: "success",
      message: "Certification deleted successfully!",
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

    updateData(certifications, true); // Pass true to allow navigation on final submit
    setNotification({
      type: "success",
      message: "Certifications saved successfully!",
    });
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6">
      {notification && (
        <Notification {...notification} onClose={() => setNotification(null)} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
        <div className={sharedStyles.experienceCard}>
          <div className="bg-sky-950 text-white p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold">Certifications</h3>
          </div>

          <div className="p-6">
            {/* List of added certifications */}
            {certifications.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-4">Added Certifications</h4>
                <div className="grid grid-cols-1 gap-4">
                  {certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 relative group border border-gray-200"
                    >
                      <button
                        type="button"
                        onClick={() => handleDeleteCertification(index)}
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
                        <h5 className="font-medium">{cert.name}</h5>
                        <p className="text-sm text-gray-600">
                          {cert.issuer}
                        </p>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>Issued: {cert.issueDate}</p>
                          {cert.expiryDate && (
                            <p>Expires: {cert.expiryDate}</p>
                          )}
                          {cert.credentialId && (
                            <p>Credential ID: {cert.credentialId}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add new certification form */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-medium mb-4">Add New Certification</h4>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Certification Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={currentCertification.name}
                    onChange={handleChange}
                    className={`${sharedStyles.inputStyle} ${
                      errors.name ? sharedStyles.errorBorder : ""
                    }`}
                    placeholder="e.g., AWS Solutions Architect"
                  />
                  {errors.name && (
                    <p className={sharedStyles.error}>{errors.name[0]}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="issuer"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Issuer *
                  </label>
                  <input
                    type="text"
                    id="issuer"
                    value={currentCertification.issuer}
                    onChange={handleChange}
                    className={`${sharedStyles.inputStyle} ${
                      errors.issuer ? sharedStyles.errorBorder : ""
                    }`}
                    placeholder="e.g., Amazon Web Services"
                  />
                  {errors.issuer && (
                    <p className={sharedStyles.error}>{errors.issuer[0]}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="issueDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    id="issueDate"
                    value={currentCertification.issueDate}
                    onChange={handleChange}
                    className={`${sharedStyles.inputStyle} ${
                      errors.issueDate ? sharedStyles.errorBorder : ""
                    }`}
                  />
                  {errors.issueDate && (
                    <p className={sharedStyles.error}>{errors.issueDate[0]}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="expiryDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    id="expiryDate"
                    value={currentCertification.expiryDate}
                    onChange={handleChange}
                    className={sharedStyles.inputStyle}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="credentialId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Credential ID (Optional)
                  </label>
                  <input
                    type="text"
                    id="credentialId"
                    value={currentCertification.credentialId}
                    onChange={handleChange}
                    className={sharedStyles.inputStyle}
                    placeholder="e.g., ABC123XYZ"
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleAddCertification}
                  className={sharedStyles.buttonSuccess}
                >
                  Add Certification
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

export default Certification;