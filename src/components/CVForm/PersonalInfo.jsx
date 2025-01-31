import { useState } from "react";
import { commonRules, focusField, validateForm } from "../../utils/formValidation";
import Notification from "../common/Notification";
import { sharedStyles } from "../../utils/styling";

const PersonalInfo = ({ data, updateData }) => {
  const [formData, setFormData] = useState({
    first_name: data?.first_name || "",
    last_name: data?.last_name || "",
    email: data?.email || "",
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
    email: { ...commonRules.email, label: 'Email'},
    address: { required: true, label: 'Address'},
    city: { required: true, label: 'City'},
    country: { required: true, label: 'Country'},
    contact_number: {...commonRules.phone, label: 'Contact Number'},
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const newFormData = {
      ...formData,
      [id]: value,
    };
    setFormData(newFormData);

    // Clear error for the field being edited
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }

    // Update parent component
    updateData(newFormData);
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6">
      {notification && (
        <Notification
          {...notification}
          onClose={() => setNotification(null)}
        />
      )}

      <form className="space-y-6" noValidate>
        <div className="grid grid-cols-1 gap-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
                  {errors.first_name[0]}
                </p>
              )}
            </div>

            <div>
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
                  {errors.last_name[0]}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={`${sharedStyles.inputStyle} ${errors.email ? sharedStyles.errorBorder : ''}`}
            />
            {errors.email && (
              <p className={sharedStyles.error}>
                {errors.email[0]}
              </p>
            )}
          </div>

          <div>
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
                {errors.address[0]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
                  {errors.city[0]}
                </p>
              )}
            </div>

            <div>
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
                  {errors.country[0]}
                </p>
              )}
            </div>
          </div>

          <div>
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
                {errors.contact_number[0]}
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;
