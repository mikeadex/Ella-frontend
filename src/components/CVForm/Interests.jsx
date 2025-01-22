import { useState } from "react";
import { INTEREST_CATEGORIES } from "../../utils/constants";
import { sharedStyles } from "../../utils/styling";
import Notification from "../common/Notification";

const Interests = ({ data, onUpdate, onNext, onPrev }) => {
  const [interests, setInterests] = useState(data || []);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customInterest, setCustomInterest] = useState("");
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddInterest = (interest) => {
    if (interests.some((i) => i.name.toLowerCase() === interest.toLowerCase())) {
      setNotification({
        type: "error",
        message: "This interest has already been added",
      });
      return;
    }

    const newInterest = {
      id: Date.now(),
      name: interest,
      category: selectedCategory || "Other",
    };

    setInterests((prev) => [...prev, newInterest]);
    setNotification({
      type: "success",
      message: "Interest added successfully!",
    });
  };

  const handleAddCustomInterest = () => {
    if (!customInterest.trim()) {
      setNotification({
        type: "error",
        message: "Please enter an interest",
      });
      return;
    }

    handleAddInterest(customInterest);
    setCustomInterest("");
  };

  const handleRemoveInterest = (id) => {
    setInterests((prev) => prev.filter((interest) => interest.id !== id));
    setNotification({
      type: "success",
      message: "Interest removed successfully!",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(interests);
    onNext();
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

      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="card">
          <div className="card-header bg-primary-600">
            <h3 className="text-lg font-semibold text-white">Interests & Hobbies</h3>
          </div>

          <div className="card-body">
            {/* Selected Interests */}
            {interests.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Your Interests
                </h4>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <span
                      key={interest.id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-700"
                    >
                      {interest.name}
                      <button
                        onClick={() => handleRemoveInterest(interest.id)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        <svg
                          className="h-4 w-4"
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
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Search and Filter */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="category" className="form-label">
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
                  <label htmlFor="search" className="form-label">
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
                            onClick={() => handleAddInterest(interest)}
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
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  className={`${sharedStyles.inputStyle} flex-1`}
                  placeholder="Add a custom interest..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomInterest();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomInterest}
                  className={sharedStyles.buttonSuccess}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onPrev}
            className={sharedStyles.buttonSecondary}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={sharedStyles.buttonPrimary}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Interests;