import { useMemo } from 'react';

const useMemoizedFormData = (data, dependencies = []) => {
  return useMemo(() => {
    if (!data) return null;
    
    // Deep clone the data to prevent reference issues
    return JSON.parse(JSON.stringify(data));
  }, [data, ...dependencies]);
};

export default useMemoizedFormData;
