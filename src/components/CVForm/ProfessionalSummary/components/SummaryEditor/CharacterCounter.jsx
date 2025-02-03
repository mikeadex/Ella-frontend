import React from 'react';
import PropTypes from 'prop-types';

const CharacterCounter = ({ current, limit }) => {
  const isOverLimit = current > limit;

  return (
    <div 
      className="flex justify-end text-sm"
      aria-live="polite"
    >
      <span className={isOverLimit ? 'text-red-600' : 'text-gray-500'}>
        {current}/{limit} characters
        {isOverLimit && (
          <span className="ml-2 font-medium">
            Character limit exceeded
          </span>
        )}
      </span>
    </div>
  );
};

CharacterCounter.propTypes = {
  current: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired
};

export default CharacterCounter;
