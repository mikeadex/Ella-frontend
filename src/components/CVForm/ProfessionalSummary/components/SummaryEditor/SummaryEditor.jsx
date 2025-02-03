import React from 'react';
import PropTypes from 'prop-types';
import CharacterCounter from './CharacterCounter';
import useFocusManagement from '../../../../../hooks/useFocusManagement';

const SummaryEditor = ({ 
  value, 
  onChange, 
  error,
  characterLimit = 2000
}) => {
  const textareaRef = useFocusManagement(true);
  const isOverLimit = value.length > characterLimit;

  const handleChange = (e) => {
    console.log('SummaryEditor change:', e.target.value);
    onChange(e);
  };

  return (
    <div className="space-y-2">
      <textarea
        ref={textareaRef}
        id="summary"
        name="summary"
        rows={6}
        value={value}
        onChange={handleChange}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
          isOverLimit ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder="Write a compelling professional summary..."
        aria-describedby="summary-description"
        aria-invalid={!!error || isOverLimit}
      />
      
      <CharacterCounter 
        current={value.length} 
        limit={characterLimit} 
      />
      
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

SummaryEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  characterLimit: PropTypes.number
};

export default SummaryEditor;
