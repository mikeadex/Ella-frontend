import { useState } from "react";
import { commonRules, focusField, validateForm } from "../../utils/formValidation";
import Notification from "../common/Notification";
import { sharedStyles } from "../../utils/styling";

const PersonalInfo = ({ data, updateData }) => {
  const [formData, setFormData] = useState({
    first_name: data?.first_name || "",
    last_name: data?.last_name || "",
    address: data?.address || "",
    city: data?.city || "",
    country: data?.country || "",
    contact_number: data?.contact_number || "",
  });

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  const validationRules = {
    first_name: { ...commonRules.name, label: 'First Name'},
    last_name: { ...commonRules.name, label: 'Last Name'},
    address: { required: true, label: 'Address'},
    city: { required: true, label: 'City'},
    country: { required: true, label: 'Country'},
    contact_number: {...commonRules.phone, label: 'Contact Number'},
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    // Clear error for the field being edited
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    const { errors: validationErrors, firstErrorField } = validateForm(formData, validationRules);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setNotification({
        type: 'error',
        message: validationErrors[firstErrorField][0]
      });
      focusField(firstErrorField);
      return;
    }

    // if validation passes
    updateData(formData);
    setNotification({
      type: 'success',
      message: 'Personal information saved successfully!'
    });
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
        <Notification
          {...notification}
          onClose={() => setNotification(null)}
        />
      )}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
        <div className="card">
          <div className="card-header bg-primary-600">
            <h3 className="text-lg font-semibold text-white">
              Personal Information
            </h3>
          </div>

          <div className="card-body">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <div className="w-full">
                  <label htmlFor="first_name" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`${sharedStyles.inputStyle} ${errors.first_name ? sharedStyles.errorBorder : ''}`}
                  />
                  {errors.first_name && (
                    <p className={sharedStyles.error}>
                      {errorIcon}
                      {errors.first_name[0]}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label htmlFor="last_name" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`${sharedStyles.inputStyle} ${errors.last_name ? sharedStyles.errorBorder : ''}`}
                  />
                  {errors.last_name && (
                    <p className={sharedStyles.error}>
                      {errorIcon}
                      {errors.last_name[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-full">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`${sharedStyles.inputStyle} ${errors.address ? sharedStyles.errorBorder : ''}`}
                />
                {errors.address && (
                  <p className={sharedStyles.error}>
                    {errorIcon}
                    {errors.address[0]}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <div className="w-full">
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`${sharedStyles.inputStyle} ${errors.city ? sharedStyles.errorBorder : ''}`}
                  />
                  {errors.city && (
                    <p className={sharedStyles.error}>
                      {errorIcon}
                      {errors.city[0]}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label htmlFor="country" className="form-label">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`${sharedStyles.inputStyle} ${errors.country ? sharedStyles.errorBorder : ''}`}
                  />
                  {errors.country && (
                    <p className={sharedStyles.error}>
                      {errorIcon}
                      {errors.country[0]}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label htmlFor="contact_number" className="form-label">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    id="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    className={`${sharedStyles.inputStyle} ${errors.contact_number ? sharedStyles.errorBorder : ''}`}
                  />
                  {errors.contact_number && (
                    <p className={sharedStyles.error}>
                      {errorIcon}
                      {errors.contact_number[0]}
                    </p>
                  )}
                </div>

                
              </div>
            </div>
          </div>


          <div className="card-footer">
            <div className={sharedStyles.actionButtons}>
              <button type="submit" className={sharedStyles.buttonPrimary}>
                Next
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;
