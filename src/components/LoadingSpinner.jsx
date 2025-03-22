import React from 'react';
import PropTypes from 'prop-types';

const sizeClasses = {
  small: 'w-5 h-5',
  medium: 'w-8 h-8',
  large: 'w-12 h-12',
};

const colorClasses = {
  primary: 'border-blue-600',
  white: 'border-white',
  gray: 'border-gray-300',
};

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary', 
  className = '',
  fullScreen = false 
}) => {
  const spinnerClass = `
    animate-spin rounded-full border-t-transparent border-2
    ${sizeClasses[size] || sizeClasses.medium}
    ${colorClasses[color] || colorClasses.primary}
    ${className}
  `;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
        <div className={spinnerClass}></div>
      </div>
    );
  }

  return <div className={spinnerClass}></div>;
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'white', 'gray']),
  className: PropTypes.string,
  fullScreen: PropTypes.bool,
};

export default LoadingSpinner;
