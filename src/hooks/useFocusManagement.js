import { useRef, useEffect } from 'react';

const useFocusManagement = (shouldFocus = true) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (shouldFocus && elementRef.current) {
      elementRef.current.focus();
    }
  }, [shouldFocus]);

  return elementRef;
};

export default useFocusManagement;
