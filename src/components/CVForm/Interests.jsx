import { useState } from "react";
import { commonRules, focusField, validateForm } from "../../utils/formValidation";
import Notification from "../common/Notification";
import { sharedStyles } from "../../utils/styling";
import { INTEREST_CATEGORIES } from "../../utils/constants";

const Interests = ({ data, updateData }) => {
  const [interests, setInterests] = useState(data || []);
  const [currentInterest, setCurrentInterest] = useState({
    name: "",
    description: "",
    isCustom: false,
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const validationRules = {
    name: { required: true, label: "Interest Name" },
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCurrentInterest((prev) => ({
      ...prev,
      [id]: value,
      isCustom: true,
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

  const handleAddInterest = (interestName = currentInterest.name) => {
    if (!interestName.trim()) {
      setNotification({
        type: "error",
        message: "Please enter an interest",
      });
      return;
    }

    // Check if interest already exists
    if (interests.some((interest) => interest.name.toLowerCase() === interestName.toLowerCase())) {
      setNotification({
        type: "error",
        message: "This interest has already been added",
      });
      return;
    }

    // Add the new interest
    const newInterest = {
      name: interestName,
      description: currentInterest.description,
      category: selectedCategory || "Other",
      isCustom: currentInterest.isCustom,
    };

    const updatedInterests = [...interests, newInterest];
    setInterests(updatedInterests);
    updateData(updatedInterests, false); // Pass false to prevent auto-navigation

    // Reset the form
    setCurrentInterest({
      name: "",
      description: "",
      isCustom: false,
    });
    setErrors({});
    setNotification({
      type: "success",
      message: "Interest added successfully!",
    });
  };

  const handleDeleteInterest = (index) => {
    const updatedInterests = interests.filter((_, i) => i !== index);
    setInterests(updatedInterests);
    updateData(updatedInterests, false); // Pass false to prevent auto-navigation
    setNotification({
      type: "success",
      message: "Interest deleted successfully!",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (interests.length === 0) {
      setNotification({
        type: "error",
        message: "Please add at least one interest",
      });
      return;
    }

    updateData(interests, true); // Pass true to allow navigation on final submit
    setNotification({
      type: "success",
      message: "Interests saved successfully!",
    });
  };

  const filteredInterests = INTEREST_CATEGORIES.reduce((acc, category) => {
    if (!selectedCategory || selectedCategory === category.name) {
      const filtered = category.interests.filter((interest) =>
        interest.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filtered.length > 0) {
        acc.push({
          ...category,
          interests: filtered,
        });
      }
    }
    return acc;
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6">
      {notification && (
        <Notification {...notification} onClose={() => setNotification(null)} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
        <div className={sharedStyles.experienceCard}>
          <div className="bg-sky-950 text-white p-4 rounded-t-lg">
            <h3 className="text-lg font-semibold">Interests & Hobbies</h3>
          </div>

          <div className="p-6">
            {/* List of added interests */}
            {interests.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-4">Added Interests</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {interests.map((interest, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 relative group border border-gray-200"
                    >
                      <button
                        type="button"
                        onClick={() => handleDeleteInterest(index)}
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
                        <h5 className="font-medium">{interest.name}</h5>
                        {interest.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {interest.description}
                          </p>
                        )}
                        {interest.category && (
                          <p className="text-xs text-gray-500 mt-1">
                            {interest.category}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search and Filter */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={sharedStyles.inputStyle}
                  >
                    <option value="">All Categories</option>
                    {INTEREST_CATEGORIES.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="search"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Search Interests
                  </label>
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={sharedStyles.inputStyle}
                    placeholder="Search for interests..."
                  />
                </div>
              </div>

              {/* Interest Suggestions */}
              {filteredInterests.length > 0 && (
                <div className="border rounded-lg divide-y">
                  {filteredInterests.map((category) => (
                    <div key={category.name} className="p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {category.name}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {category.interests.map((interest) => (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => {
                              setCurrentInterest((prev) => ({
                                ...prev,
                                name: interest,
                                isCustom: false,
                              }));
                              handleAddInterest(interest);
                            }}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 text-gray-700"
                          >
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Custom Interest Input */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-medium mb-4">Add Custom Interest</h4>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Interest Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={currentInterest.name}
                    onChange={handleChange}
                    className={`${sharedStyles.inputStyle} ${
                      errors.name ? sharedStyles.errorBorder : ""
                    }`}
                    placeholder="e.g., Origami"
                  />
                  {errors.name && (
                    <p className={sharedStyles.error}>{errors.name[0]}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    value={currentInterest.description}
                    onChange={handleChange}
                    rows={3}
                    className={sharedStyles.inputStyle}
                    placeholder="Brief description of your interest..."
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => handleAddInterest()}
                    className={sharedStyles.buttonSuccess}
                  >
                    Add Custom Interest
                  </button>
                </div>
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

export default Interests;