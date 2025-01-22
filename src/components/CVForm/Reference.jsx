import { useState } from "react";
import { REFERENCE_TYPES } from "../../utils/constants";
import { sharedStyles } from "../../utils/styling";
import Notification from "../common/Notification";

const Reference = ({ data, onUpdate, onNext, onPrev }) => {
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
      type: currentReference.type,
    };

    console.log("Adding new reference:", newReference);
    setReferences((prev) => [...prev, newReference]);

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
    setReferences((prev) => prev.filter((ref) => ref.id !== id));
    setNotification({
      type: "success",
      message: "Reference removed successfully!",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Ensure all references have required fields
    const hasAllRequiredFields = references.every(
      (ref) => ref.name && ref.title && ref.company && ref.type && ref.email
    );

    if (!hasAllRequiredFields) {
      setNotification({
        type: "error",
        message:
          "All references must have name, title, company, type, and email",
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
      type: ref.type,
    }));

    console.log("Submitting formatted references:", formattedReferences);
    onUpdate(formattedReferences);
    onNext();
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6">
      {notification && (
        <Notification {...notification} onClose={() => setNotification(null)} />
      )}

      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="card">
          <div className="card-header bg-primary-600">
            <h3 className="text-lg font-semibold text-white">References</h3>
          </div>

          <div className="card-body">
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
                          Type: {ref.type}
                        </p>
                      </div>
                      <button
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
          </div>
        </div>

        <div className="card">
          <div className="card-header bg-secondary-600">
            <h3 className="text-lg font-semibold text-white">Add Reference</h3>
          </div>

          <div className="card-body">
            <form onSubmit={handleAddReference} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="form-label">
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
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="title" className="form-label">
                    Job Title *
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
                      errors.title ? "border-red-500" : ""
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="company" className="form-label">
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
                      errors.company ? "border-red-500" : ""
                    }`}
                  />
                  {errors.company && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.company}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="type" className="form-label">
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
                      errors.type ? "border-red-500" : ""
                    }`}
                  >
                    {REFERENCE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-500">{errors.type}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="form-label">
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
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="form-label">
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
                      errors.phone ? "border-red-500" : ""
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  Add Reference
                </button>
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

export default Reference;
