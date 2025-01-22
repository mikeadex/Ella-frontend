import { useState } from "react";
import { SUMMARY_TEMPLATES, SUMMARY_TIPS } from "../../utils/constants";
import { sharedStyles } from "../../utils/styling";
import Notification from "../common/Notification";

const ProfessionalSummary = ({ data, onUpdate, onNext, onPrev }) => {
  const [summary, setSummary] = useState(data || "");
  const [notification, setNotification] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [wordCount, setWordCount] = useState(0);

  const handleSummaryChange = (e) => {
    const text = e.target.value;
    setSummary(text);
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
  };

  const handleTemplateSelect = (template) => {
    setSummary(template);
    setShowTemplates(false);
    setNotification({
      type: "success",
      message: "Template applied! Customize it to match your experience.",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!summary.trim()) {
      setNotification({
        type: "error",
        message: "Please enter a professional summary",
      });
      return;
    }

    if (wordCount < 30) {
      setNotification({
        type: "error",
        message: "Your summary seems too short. Aim for at least 30 words.",
      });
      return;
    }

    if (wordCount > 200) {
      setNotification({
        type: "error",
        message: "Your summary is too long. Keep it under 200 words.",
      });
      return;
    }

    onUpdate(summary);
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
            <h3 className="text-lg font-semibold text-white">Professional Summary</h3>
          </div>

          <div className="card-body">
            <div className="space-y-6">
              {/* Writing Tips */}
              {showTips && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">
                      Writing Tips
                    </h4>
                    <button
                      onClick={() => setShowTips(false)}
                      className="text-blue-500 hover:text-blue-700"
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
                  <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                    {SUMMARY_TIPS.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Template Selection */}
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                >
                  <svg
                    className={`h-5 w-5 mr-1 transform transition-transform ${
                      showTemplates ? "rotate-90" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  Use a Template
                </button>

                {showTemplates && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {SUMMARY_TEMPLATES.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => handleTemplateSelect(template.template)}
                        className="text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <h4 className="font-medium text-gray-900 mb-2">
                          {template.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {template.template}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Summary Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="summary" className="form-label">
                    Your Professional Summary
                  </label>
                  <span
                    className={`text-sm ${
                      wordCount > 200
                        ? "text-red-600"
                        : wordCount < 30
                        ? "text-yellow-600"
                        : "text-gray-500"
                    }`}
                  >
                    {wordCount} words
                  </span>
                </div>
                <textarea
                  id="summary"
                  rows="6"
                  value={summary}
                  onChange={handleSummaryChange}
                  className={`${sharedStyles.inputStyle} resize-none`}
                  placeholder="Write a compelling summary of your professional background, skills, and career objectives..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Aim for 30-200 words. A great summary highlights your key
                  achievements and value proposition.
                </p>
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

export default ProfessionalSummary;