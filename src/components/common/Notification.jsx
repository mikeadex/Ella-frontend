import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { toastStyles } from '../../utils/formValidation';

const Notification = ({ message, type = 'error', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const style = toastStyles[type]?.style || toastStyles.error.style;
  const icon = toastStyles[type]?.icon || toastStyles.error.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return createPortal(
    <div
      className="fixed top-4 right-4 flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 max-w-md"
      style={style}
      role="alert"
    >
      <span className="mr-2" role="img" aria-label={type}>
        {icon}
      </span>
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="ml-4 text-current opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>,
    document.body
  );
};

export default Notification;
