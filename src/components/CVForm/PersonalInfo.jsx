import { useState, useEffect } from "react";
import { commonRules, focusField, validateField } from "../../utils/formValidation";
import Notification from "../common/Notification";
import { sharedStyles } from "../../utils/styling";
import { useTheme } from "../../context/ThemeContext";

const PersonalInfo = ({ data, updateData, errors: propErrors }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    email: data?.email || "",
    phone: data?.phone || "",
    address: data?.address || "",
    city: data?.city || "",
    country: data?.country || "",
  });

  // Sync with parent data when it changes
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setFormData(prevData => ({
        ...prevData,
        ...data
      }));
    }
  }, [data]);

  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  // Sync with parent errors when they change
  useEffect(() => {
    if (propErrors && Object.keys(propErrors).length > 0) {
      setErrors(propErrors);
    }
  }, [propErrors]);

  const validationRules = {
    firstName: { ...commonRules.name, label: 'First Name'},
    lastName: { ...commonRules.name, label: 'Last Name'},
    email: { ...commonRules.email, label: 'Email'},
    phone: {...commonRules.phone, label: 'Phone Number'},
    address: { required: true, label: 'Address'},
    city: { required: true, label: 'City'},
    country: { required: true, label: 'Country'},
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    
    const newFormData = {
      ...formData,
      [id]: value,
    };
    
    setFormData(newFormData);

    // Validate the changed field immediately
    const fieldRules = validationRules[id];
    if (fieldRules) {
      const fieldErrors = validateField(value, fieldRules.label || id, fieldRules);
      setErrors(prev => ({
        ...prev,
        [id]: fieldErrors.length > 0 ? fieldErrors[0] : null
      }));
    }

    // Update parent component
    updateData(newFormData);
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    const fieldRules = validationRules[id];
    if (fieldRules) {
      const fieldErrors = validateField(value, fieldRules.label || id, fieldRules);
      setErrors(prev => ({
        ...prev,
        [id]: fieldErrors.length > 0 ? fieldErrors[0] : null
      }));
    }
  };

  return (
    <div className={`${sharedStyles.card} ${isDark ? 'dark:bg-gray-900 dark:border-yellow-500/30 dark:shadow-yellow-500/20' : ''}`}>
      <div className={`${sharedStyles.cardHeader} ${isDark ? 'dark:bg-gradient-to-r dark:from-yellow-900/40 dark:to-orange-900/40 dark:border-b dark:border-yellow-500/30' : ''}`}>
        <h2 className={`text-xl font-semibold ${isDark ? 'dark:bg-clip-text dark:bg-gradient-to-r dark:from-yellow-400 dark:to-orange-400' : ''}`}>Personal Information</h2>
      </div>
      
      <div className={`${sharedStyles.cardBody} ${isDark ? 'dark:bg-black' : ''}`}>
        {notification && (
          <Notification
            {...notification}
            onClose={() => setNotification(null)}
          />
        )}

        <form className="space-y-4" noValidate>
          {/* Name Section - Full width on mobile, side by side on tablet+ */}
          <div className="space-y-4 sm:flex sm:space-x-4 sm:space-y-0">
            <div className="flex-1">
              <label htmlFor="firstName" className={`block text-sm font-medium mb-1 ${isDark ? 'dark:text-yellow-300' : 'text-gray-700'}`}>
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${sharedStyles.inputStyle} ${errors.firstName ? sharedStyles.errorBorder : ''} 
                  ${isDark ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' : ''}`}
                placeholder="Enter your first name"
                aria-invalid={errors.firstName ? "true" : "false"}
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
              />
              {errors.firstName && (
                <div 
                  id="firstName-error" 
                  className={`${sharedStyles.error} ${isDark ? 'dark:bg-red-950 dark:border-red-500/50 dark:text-red-300' : ''} animate-fadeIn`} 
                  role="alert"
                >
                  <svg 
                    className={`${sharedStyles.errorIcon} ${isDark ? 'dark:text-red-400' : ''}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  <span className="flex-1">{errors.firstName}</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <label htmlFor="lastName" className={`block text-sm font-medium mb-1 ${isDark ? 'dark:text-yellow-300' : 'text-gray-700'}`}>
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${sharedStyles.inputStyle} ${errors.lastName ? sharedStyles.errorBorder : ''} 
                  ${isDark ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' : ''}`}
                placeholder="Enter your last name"
                aria-invalid={errors.lastName ? "true" : "false"}
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
              />
              {errors.lastName && (
                <div 
                  id="lastName-error" 
                  className={`${sharedStyles.error} ${isDark ? 'dark:bg-red-950 dark:border-red-500/50 dark:text-red-300' : ''} animate-fadeIn`} 
                  role="alert"
                >
                  <svg 
                    className={`${sharedStyles.errorIcon} ${isDark ? 'dark:text-red-400' : ''}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  <span className="flex-1">{errors.lastName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4 sm:flex sm:space-x-4 sm:space-y-0">
            <div className="flex-1">
              <label htmlFor="email" className={`block text-sm font-medium mb-1 ${isDark ? 'dark:text-yellow-300' : 'text-gray-700'}`}>
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${sharedStyles.inputStyle} ${errors.email ? sharedStyles.errorBorder : ''} 
                  ${isDark ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' : ''}`}
                placeholder="your.email@example.com"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <div 
                  id="email-error" 
                  className={`${sharedStyles.error} ${isDark ? 'dark:bg-red-950 dark:border-red-500/50 dark:text-red-300' : ''} animate-fadeIn`} 
                  role="alert"
                >
                  <svg 
                    className={`${sharedStyles.errorIcon} ${isDark ? 'dark:text-red-400' : ''}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  <span className="flex-1">{errors.email}</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <label htmlFor="phone" className={`block text-sm font-medium mb-1 ${isDark ? 'dark:text-yellow-300' : 'text-gray-700'}`}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${sharedStyles.inputStyle} ${errors.phone ? sharedStyles.errorBorder : ''} 
                  ${isDark ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' : ''}`}
                placeholder="+1 (234) 567-8900"
                aria-invalid={errors.phone ? "true" : "false"}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && (
                <div 
                  id="phone-error" 
                  className={`${sharedStyles.error} ${isDark ? 'dark:bg-red-950 dark:border-red-500/50 dark:text-red-300' : ''} animate-fadeIn`} 
                  role="alert"
                >
                  <svg 
                    className={`${sharedStyles.errorIcon} ${isDark ? 'dark:text-red-400' : ''}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  <span className="flex-1">{errors.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <div>
              <label htmlFor="address" className={`block text-sm font-medium mb-1 ${isDark ? 'dark:text-yellow-300' : 'text-gray-700'}`}>
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`${sharedStyles.inputStyle} ${errors.address ? sharedStyles.errorBorder : ''} 
                  ${isDark ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' : ''}`}
                placeholder="Enter your street address"
                aria-invalid={errors.address ? "true" : "false"}
                aria-describedby={errors.address ? "address-error" : undefined}
              />
              {errors.address && (
                <div 
                  id="address-error" 
                  className={`${sharedStyles.error} ${isDark ? 'dark:bg-red-950 dark:border-red-500/50 dark:text-red-300' : ''} animate-fadeIn`} 
                  role="alert"
                >
                  <svg 
                    className={`${sharedStyles.errorIcon} ${isDark ? 'dark:text-red-400' : ''}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  <span className="flex-1">{errors.address}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className={`block text-sm font-medium mb-1 ${isDark ? 'dark:text-yellow-300' : 'text-gray-700'}`}>
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${sharedStyles.inputStyle} ${errors.city ? sharedStyles.errorBorder : ''} 
                    ${isDark ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' : ''}`}
                  placeholder="Enter your city"
                  aria-invalid={errors.city ? "true" : "false"}
                  aria-describedby={errors.city ? "city-error" : undefined}
                />
                {errors.city && (
                  <div 
                    id="city-error" 
                    className={`${sharedStyles.error} ${isDark ? 'dark:bg-red-950 dark:border-red-500/50 dark:text-red-300' : ''} animate-fadeIn`} 
                    role="alert"
                  >
                    <svg 
                      className={`${sharedStyles.errorIcon} ${isDark ? 'dark:text-red-400' : ''}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <span className="flex-1">{errors.city}</span>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="country" className={`block text-sm font-medium mb-1 ${isDark ? 'dark:text-yellow-300' : 'text-gray-700'}`}>
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="country"
                  value={formData.country}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${sharedStyles.inputStyle} ${errors.country ? sharedStyles.errorBorder : ''} 
                    ${isDark ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' : ''}`}
                  placeholder="Enter your country"
                  aria-invalid={errors.country ? "true" : "false"}
                  aria-describedby={errors.country ? "country-error" : undefined}
                />
                {errors.country && (
                  <div 
                    id="country-error" 
                    className={`${sharedStyles.error} ${isDark ? 'dark:bg-red-950 dark:border-red-500/50 dark:text-red-300' : ''} animate-fadeIn`} 
                    role="alert"
                  >
                    <svg 
                      className={`${sharedStyles.errorIcon} ${isDark ? 'dark:text-red-400' : ''}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <span className="flex-1">{errors.country}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfo;
