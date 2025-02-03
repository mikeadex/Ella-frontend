import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { sharedStyles } from '../../../utils/styling';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { toastStyles } from '../../../utils/formValidation';

import SummaryEditor from './components/SummaryEditor';
import { ImproveButton, ProgressBar, ImprovedVersion } from './components/AIImprovement';
import WritingTips from './components/WritingTips';

import useAIImprovement from './hooks/useAIImprovement';
import useSummaryValidation from './hooks/useSummaryValidation';

const ProfessionalSummary = ({ data, updateData, errors }) => {
  const { isDark } = useTheme();
  const [summary, setSummary] = useState(data?.text || '');
  const [showTips, setShowTips] = useState(false);
  const [touched, setTouched] = useState(false);

  // Custom hooks for AI improvement and validation
  const {
    improving,
    improvedSummary,
    progress,
    error: aiError,
    improveSummary,
    resetImprovement
  } = useAIImprovement();

  const {
    error: validationError,
    validateSummary,
    clearError
  } = useSummaryValidation();

  useEffect(() => {
    if (data) {
      setSummary(typeof data === 'string' ? data : data.text || '');
    }
  }, [data]);

  const handleChange = (e) => {
    const newSummary = e.target.value;
    setSummary(newSummary);
    clearError();
    resetImprovement();
    updateData(newSummary);
  };

  const handleBlur = () => {
    setTouched(true);
    validateSummary(summary);
  };

  const handleImprove = async () => {
    if (validateSummary(summary)) {
      try {
        await improveSummary(summary);
      } catch (err) {
        console.error('Error in handleImprove:', err);
      }
    }
  };

  const handleUseImproved = () => {
    gsap.to(".improved-version-modal", {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        updateData(improvedSummary);
        resetImprovement();
      }
    });
  };

  const showError = touched && (validationError || aiError || errors?.summary);
  const errorMessage = validationError || aiError || errors?.summary;
  const errorStyle = toastStyles.error.style;

  return (
    <div className={`${sharedStyles.card} ${isDark ? 'dark:bg-gray-900 dark:border-yellow-500/30 dark:shadow-yellow-500/20' : ''}`}>
      <div className={`${sharedStyles.cardHeader} ${isDark ? 'dark:bg-gradient-to-r dark:from-yellow-900/40 dark:to-orange-900/40 dark:border-b dark:border-yellow-500/30' : ''}`}>
        <h2 className={`text-xl font-semibold ${isDark ? 'dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-yellow-400 dark:to-orange-400' : ''}`}>Professional Summary</h2>
      </div>
      
      <div className={`${sharedStyles.cardBody} ${isDark ? 'dark:bg-black' : ''}`}>
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="summary" 
              className={`block text-sm font-medium mb-1 ${isDark ? 'dark:text-yellow-300' : 'text-gray-700'}`}
            >
              Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              id="summary"
              value={summary}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
              className={`${sharedStyles.inputStyle} min-h-[120px] resize-y
                ${isDark ? 'dark:bg-black dark:border-yellow-500/50 dark:text-white dark:placeholder-gray-500 dark:focus:border-yellow-400 dark:focus:ring-yellow-400/50' : ''}
                ${showError ? (isDark ? 'dark:border-red-500' : 'border-red-500') : ''}`}
              placeholder="Write a brief summary of your professional background and key strengths..."
            />
            <AnimatePresence mode="wait">
              {showError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 flex items-center p-3 rounded-lg"
                  style={errorStyle}
                  role="alert"
                >
                  <span className="mr-2" role="img" aria-label="error">
                    {toastStyles.error.icon}
                  </span>
                  <p className="text-sm font-medium">{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>
            {/* <p className={`mt-2 text-sm ${isDark ? 'dark:text-gray-400' : 'text-gray-500'}`}>
              Write 2-4 sentences about your career highlights and key skills. Make it engaging and relevant to the job you're applying for.
            </p> */}
          </div>
          
          {improving && <ProgressBar progress={progress} />}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-start gap-2 sm:gap-4">
            <ImproveButton
              onClick={handleImprove}
              disabled={improving || !summary?.trim()}
            />
            <WritingTips
              isVisible={showTips}
              onToggle={() => setShowTips(!showTips)}
            />
          </div>
          {improvedSummary && (
            <ImprovedVersion
              content={improvedSummary}
              onUse={handleUseImproved}
            />
          )}
        </div>
      </div>
    </div>
  );
};

ProfessionalSummary.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      text: PropTypes.string
    })
  ]),
  updateData: PropTypes.func.isRequired,
  errors: PropTypes.object
};

export default ProfessionalSummary;
