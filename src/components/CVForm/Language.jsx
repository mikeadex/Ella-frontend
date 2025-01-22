import { useState } from "react";
import { LANGUAGES, LANGUAGE_PROFICIENCY } from "../../utils/constants";
import { sharedStyles } from "../../utils/styling";
import Notification from "../common/Notification";

const Language = ({ data, onUpdate, onNext, onPrev }) => {
  const [languages, setLanguages] = useState(data || []);
  const [currentLanguage, setCurrentLanguage] = useState({
    name: "",
    proficiency: "intermediate",
    isCustom: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);

  const handleAddLanguage = () => {
    if (!currentLanguage.name) {
      setNotification({
        type: "error",
        message: "Please select a language",
      });
      return;
    }

    if (languages.some((l) => l.name.toLowerCase() === currentLanguage.name.toLowerCase())) {
      setNotification({
        type: "error",
        message: "This language has already been added",
      });
      return;
    }

    const newLanguage = {
      id: Date.now(),
      name: currentLanguage.name,
      proficiency: currentLanguage.proficiency,
      isCustom: currentLanguage.isCustom,
    };

    setLanguages((prev) => [...prev, newLanguage]);
    setCurrentLanguage({
      name: "",
      proficiency: "intermediate",
      isCustom: false,
    });
    setNotification({
      type: "success",
      message: "Language added successfully!",
    });
  };

  const handleRemoveLanguage = (id) => {
    setLanguages((prev) => prev.filter((lang) => lang.id !== id));
    setNotification({
      type: "success",
      message: "Language removed successfully!",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(languages);
    onNext();
  };

  const filteredLanguages = LANGUAGES.filter((lang) =>
    lang.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProficiencyColor = (proficiency) => {
    switch (proficiency) {
      case "native":
        return "bg-green-500";
      case "fluent":
        return "bg-blue-500";
      case "advanced":
        return "bg-indigo-500";
      case "intermediate":
        return "bg-yellow-500";
      case "basic":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6">
      {notification && (
        <Notification {...notification} onClose={() => setNotification(null)} />
      )}

      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="card">
          <div className="card-header bg-primary-600">
            <h3 className="text-lg font-semibold text-white">Languages</h3>
          </div>

          <div className="card-body">
            {/* Language List */}
            {languages.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Your Languages
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  {languages.map((lang) => (
                    <div
                      key={lang.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {lang.name}
                        </h4>
                        <div className="mt-1 flex items-center">
                          <div className="flex-1">
                            <div className="h-2 bg-gray-200 rounded-full">
                              <div
                                className={`h-2 rounded-full ${getProficiencyColor(
                                  lang.proficiency
                                )}`}
                                style={{
                                  width: `${
                                    ((LANGUAGE_PROFICIENCY.findIndex(
                                      (p) => p.value === lang.proficiency
                                    ) +
                                      1) /
                                      LANGUAGE_PROFICIENCY.length) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                          <span className="ml-2 text-xs text-gray-500">
                            {
                              LANGUAGE_PROFICIENCY.find(
                                (p) => p.value === lang.proficiency
                              )?.label
                            }
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveLanguage(lang.id)}
                        className="ml-4 text-gray-400 hover:text-red-500"
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
                  ))}
                </div>
              </div>
            )}

            {/* Add Language Form */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="language" className="form-label">
                    Language
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="language"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={sharedStyles.inputStyle}
                      placeholder="Search for a language..."
                      autoComplete="off"
                    />
                    {searchTerm && filteredLanguages.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
                        {filteredLanguages.map((lang) => (
                          <button
                            key={lang}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            onClick={() => {
                              setCurrentLanguage((prev) => ({
                                ...prev,
                                name: lang,
                              }));
                              setSearchTerm("");
                            }}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <label htmlFor="proficiency" className="form-label">
                    Proficiency
                  </label>
                  <select
                    id="proficiency"
                    value={currentLanguage.proficiency}
                    onChange={(e) =>
                      setCurrentLanguage((prev) => ({
                        ...prev,
                        proficiency: e.target.value,
                      }))
                    }
                    className={sharedStyles.inputStyle}
                  >
                    {LANGUAGE_PROFICIENCY.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label} - {level.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Language Input */}
              {!filteredLanguages.includes(currentLanguage.name) &&
                currentLanguage.name && (
                  <div className="text-sm text-gray-500">
                    Custom language: "{currentLanguage.name}"
                  </div>
                )}

              <button
                type="button"
                onClick={handleAddLanguage}
                className={`${sharedStyles.buttonSuccess} w-full`}
              >
                Add Language
              </button>
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

export default Language;