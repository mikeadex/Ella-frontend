import { useState, useEffect } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { SUMMARY_TEMPLATES, SUMMARY_TIPS } from "../../utils/constants";
import { sharedStyles } from "../../utils/styling";
import Notification from "../common/Notification";
import axiosInstance from "../../api/axios";
import RichTextMenuBar from "../common/RichTextMenuBar";

const ProfessionalSummary = ({ data, updateData }) => {
  const [notification, setNotification] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [improving, setImproving] = useState(false);
  const [improvedSummary, setImprovedSummary] = useState("");
  const [progress, setProgress] = useState(0);

  const editor = useEditor({
    extensions: [StarterKit],
    content: data || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      setWordCount(text.trim().split(/\s+/).filter(Boolean).length);
      updateData(html); // Update parent component with HTML content
    },
  });

  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    if (editor && data) {
      editor.commands.setContent(data);
    }
  }, [data, editor]);

  const handleTemplateSelect = (template) => {
    if (editor) {
      editor.commands.setContent(template);
      updateData(editor.getHTML()); // Update parent with HTML content
    }
    setShowTemplates(false);
    setNotification({
      type: "success",
      message: "Template applied! Replace the placeholders with your information.",
    });
  };

  const handleImprove = async () => {
    if (!editor) return;

    const content = editor.getText();
    if (!content.trim()) {
      setNotification({
        type: "error",
        message: "Please enter a summary first",
      });
      return;
    }

    if (wordCount < 20) {
      setNotification({
        type: "error",
        message: "Please enter at least 20 words for better improvement results.",
      });
      return;
    }

    setImproving(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + (90 - prev) * 0.1;
      });
    }, 1000);

    setNotification({
      type: "info",
      message: "AI is analyzing and improving your summary...",
    });

    try {
      const response = await axiosInstance.post(
        "/api/cv_writer/cv/improve_summary/",
        { summary: content },
        { timeout: 120000 }
      );

      if (response.data && response.data.improved) {
        setProgress(100);
        setImprovedSummary(response.data.improved);
        setNotification({
          type: "success",
          message: "Summary improved! Review and accept if you like it.",
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("API Error:", err);
      setNotification({
        type: "error",
        message: err.response?.data?.error || "Failed to improve summary. Please try again.",
      });
    } finally {
      clearInterval(progressInterval);
      setImproving(false);
    }
  };

  const handleAccept = () => {
    if (editor) {
      editor.commands.setContent(improvedSummary);
      updateData(editor.getHTML()); // Update parent with HTML content
    }
    setImprovedSummary("");
    setNotification({
      type: "success",
      message: "Improved summary applied!",
    });
  };

  const handleDiscard = () => {
    setImprovedSummary("");
    setNotification({
      type: "info",
      message: "Improvements discarded.",
    });
  };

  // Return true if the summary is valid
  const validate = () => {
    if (!editor) return false;
    const text = editor.getText().trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    
    if (!text) {
      setNotification({
        type: "error",
        message: "Please enter a professional summary",
      });
      return false;
    }
    
    if (wordCount < 20) {
      setNotification({
        type: "error",
        message: "Please enter at least 20 words in your professional summary",
      });
      return false;
    }
    
    return true;
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 py-6">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className={sharedStyles.card}>
        <div className={sharedStyles.cardHeader}>
          <h3 className="text-lg font-semibold">Professional Summary</h3>
        </div>

        <div className={sharedStyles.cardBody}>
          {/* Tips Section */}
          {showTips && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="text-blue-800 font-medium mb-2">Writing Tips</h4>
                <button
                  onClick={() => setShowTips(false)}
                  className={sharedStyles.buttonGhost}
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

          {!showTips && (
            <button
              onClick={() => setShowTips(true)}
              className={`${sharedStyles.buttonGhost} mb-4`}
            >
              Show Writing Tips
            </button>
          )}

          {/* Summary Input */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Your Professional Summary
                </label>
                <span className="text-sm text-gray-500">
                  {wordCount} words {wordCount < 20 && "(minimum 20)"}
                </span>
              </div>
              <div className="prose max-w-none">
                <RichTextMenuBar editor={editor} />
                <EditorContent 
                  editor={editor} 
                  className={`${sharedStyles.textareaStyle} min-h-[200px] focus:outline-none`}
                />
              </div>
            </div>

            {/* Template and Improve Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className={sharedStyles.buttonOutline}
              >
                {showTemplates ? "Hide Templates" : "View Templates"}
              </button>

              {!improvedSummary && (
                <button
                  onClick={handleImprove}
                  disabled={improving}
                  className={sharedStyles.buttonPrimary}
                >
                  {improving ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Improving... {Math.round(progress)}%
                    </div>
                  ) : (
                    "Improve with AI"
                  )}
                </button>
              )}
            </div>

            {/* Templates Section */}
            {showTemplates && (
              <div className="mt-4 space-y-4">
                <p className="text-sm text-gray-600 mb-2">
                  Select a template below and customize it by replacing the [placeholders] with your information:
                </p>
                {SUMMARY_TEMPLATES.map((template, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-md font-medium text-gray-800">
                        {template.title}
                      </h4>
                      <button
                        onClick={() => handleTemplateSelect(template.template)}
                        className={`${sharedStyles.buttonGhost} text-sm`}
                      >
                        Use Template
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">{template.template}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Improved Summary Section */}
            {improvedSummary && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="text-green-800 font-medium mb-2">Improved Version</h4>
                <p className="text-sm text-gray-700 mb-4">{improvedSummary}</p>
                <div className="flex space-x-4">
                  <button
                    onClick={handleAccept}
                    className={sharedStyles.buttonSuccess}
                  >
                    Accept Changes
                  </button>
                  <button
                    onClick={handleDiscard}
                    className={sharedStyles.buttonGhost}
                  >
                    Discard Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSummary;