import { useState } from "react";
import { REFERENCE_TYPES } from "../../utils/constants";
import { sharedStyles } from "../../utils/styling";
import Notification from "../common/Notification";

const Reference = ({ data, updateData }) => {
  const [references, setReferences] = useState(data || []);
  const [currentReference, setCurrentReference] = useState({
    name: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    type: "Professional",
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const validateReference = () => {
    const newErrors = {};
    if (!currentReference.name.trim()) newErrors.name = "Name is required";
    if (!currentReference.title.trim()) newErrors.title = "Title is required";
    if (!currentReference.company.trim())
      newErrors.company = "Company is required";
    if (!currentReference.type) newErrors.type = "Reference type is required";
    if (!currentReference.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(currentReference.email)
    ) {
      newErrors.email = "Invalid email address";
    }
    if (
      currentReference.phone &&
      !/^\+?[\d\s-]{10,}$/.test(currentReference.phone)
    ) {
      newErrors.phone = "Invalid phone number";
    }
    return newErrors;
  };

  const handleAddReference = (e) => {
    e.preventDefault();
    const validationErrors = validateReference();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setNotification({
        type: "error",
        message: "Please fix the errors before adding the reference",
      });
      return;
    }

    const newReference = {
      id: Date.now(),
      name: currentReference.name.trim(),
      title: currentReference.title.trim(),
      company: currentReference.company.trim(),
      email: currentReference.email.trim(),
      phone: currentReference.phone.trim(),
      reference_type: currentReference.type,
    };

    const updatedReferences = [...references, newReference];
    setReferences(updatedReferences);
    updateData(updatedReferences, false); // Pass false to prevent auto-navigation

    setCurrentReference({
      name: "",
      title: "",
      company: "",
      email: "",
      phone: "",
      type: "Professional",
    });

    setErrors({});
    setNotification({
      type: "success",
      message: "Reference added successfully!",
    });
  };

  const handleRemoveReference = (id) => {
    const updatedReferences = references.filter((ref) => ref.id !== id);
    setReferences(updatedReferences);
    updateData(updatedReferences, false); // Pass false to prevent auto-navigation
    setNotification({
      type: "success",
      message: "Reference removed successfully!",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (references.length === 0) {
      setNotification({
        type: "error",
        message: "Please add at least one reference",
      });
      return;
    }

    // Ensure all references have required fields
    const hasAllRequiredFields = references.every(
      (ref) => ref.name && ref.title && ref.company && ref.reference_type && ref.email
    );

    if (!hasAllRequiredFields) {
      setNotification({
        type: "error",
        message:
          "All references must have name, title, company, reference type, and email",
      });
      return;
    }

    // Format references for submission
    const formattedReferences = references.map((ref) => ({
      name: ref.name,
      title: ref.title,
      company: ref.company,
      email: ref.email,
      phone: ref.phone || "",
      reference_type: ref.reference_type,
    }));

    updateData(formattedReferences, true); // Pass true to allow navigation on final submit
    setNotification({
      type: "success",
      message: "References saved successfully!",
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
            <h3 className="text-lg font-semibold">References</h3>
          </div>

          <div className={sharedStyles.cardBody}>
            {references.length > 0 ? (
              <div className="space-y-4">
                {references.map((ref) => (
                  <div
                    key={ref.id}
                    className="bg-white shadow rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium">{ref.name}</h4>
                        <p className="text-gray-600">{ref.title}</p>
                        <p className="text-gray-600">{ref.company}</p>
                        <p className="text-sm text-gray-500">{ref.email}</p>
                        {ref.phone && (
                          <p className="text-sm text-gray-500">{ref.phone}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          Type: {ref.reference_type}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveReference(ref.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No references added yet</p>
              </div>
            )}

            {/* Add new reference form */}
            <div className="border-t pt-6 mt-6">
              <h4 className="text-lg font-medium mb-4">Add New Reference</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={currentReference.name}
                    onChange={(e) =>
                      setCurrentReference((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className={`${sharedStyles.inputStyle} ${
                      errors.name ? sharedStyles.errorBorder : ""
                    }`}
                  />
                  {errors.name && (
                    <p className={sharedStyles.error}>{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={currentReference.title}
                    onChange={(e) =>
                      setCurrentReference((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className={`${sharedStyles.inputStyle} ${
                      errors.title ? sharedStyles.errorBorder : ""
                    }`}
                  />
                  {errors.title && (
                    <p className={sharedStyles.error}>{errors.title}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Company *
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={currentReference.company}
                    onChange={(e) =>
                      setCurrentReference((prev) => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                    className={`${sharedStyles.inputStyle} ${
                      errors.company ? sharedStyles.errorBorder : ""
                    }`}
                  />
                  {errors.company && (
                    <p className={sharedStyles.error}>{errors.company}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Reference Type *
                  </label>
                  <select
                    id="type"
                    value={currentReference.type}
                    onChange={(e) =>
                      setCurrentReference((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                    className={`${sharedStyles.inputStyle} ${
                      errors.type ? sharedStyles.errorBorder : ""
                    }`}
                  >
                    {REFERENCE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className={sharedStyles.error}>{errors.type}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={currentReference.email}
                    onChange={(e) =>
                      setCurrentReference((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className={`${sharedStyles.inputStyle} ${
                      errors.email ? sharedStyles.errorBorder : ""
                    }`}
                  />
                  {errors.email && (
                    <p className={sharedStyles.error}>{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={currentReference.phone}
                    onChange={(e) =>
                      setCurrentReference((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className={`${sharedStyles.inputStyle} ${
                      errors.phone ? sharedStyles.errorBorder : ""
                    }`}
                  />
                  {errors.phone && (
                    <p className={sharedStyles.error}>{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleAddReference}
                  className={sharedStyles.buttonSuccess}
                >
                  Add Reference
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

export default Reference;
