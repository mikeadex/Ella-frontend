import { useState } from "react";
import { SUMMARY_TEMPLATES, SUMMARY_TIPS } from "../../utils/constants";
import { sharedStyles } from "../../utils/styling";
import Notification from "../common/Notification";

const ProfessionalSummary = ({ data, updateData }) => {
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

    updateData(summary);
    setNotification({
      type: "success",
      message: "Professional summary saved successfully!",
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
            <h3 className="text-lg font-semibold">
              Professional Summary
            </h3>
          </div>

          <div className={sharedStyles.cardBody}>
            {showTips && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <h4 className="text-blue-800 font-medium mb-2">Writing Tips</h4>
                  <button
                    type="button"
                    onClick={() => setShowTips(false)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Hide
                  </button>
                </div>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                  {SUMMARY_TIPS.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="summary"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Professional Summary *
                  </label>
                  <span className="text-sm text-gray-500">
                    {wordCount} words {wordCount < 30 && "(minimum 30)"}
                  </span>
                </div>
                <textarea
                  id="summary"
                  rows={8}
                  value={summary}
                  onChange={handleSummaryChange}
                  className={sharedStyles.textareaStyle}
                  placeholder="Write a compelling summary of your professional background, skills, and career objectives..."
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="text-sky-950 hover:text-blue-700 text-sm font-medium"
                >
                  {showTemplates ? "Hide Templates" : "Need inspiration? View Templates"}
                </button>

                {showTemplates && (
                  <div className="mt-3 space-y-3">
                    {SUMMARY_TEMPLATES.map((template, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                        onClick={() => handleTemplateSelect(template.template)}
                      >
                        <h5 className="text-sm font-medium text-gray-700 mb-1">{template.title}</h5>
                        <p className="text-sm text-gray-600">{template.template}</p>
                      </div>
                    ))}
                  </div>
                )}
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

export default ProfessionalSummary;