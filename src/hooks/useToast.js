import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const useToast = () => {
  const showToast = useCallback((message, type = 'default') => {
    switch (type) {
      case 'success':
        toast.success(message, {
          duration: 3000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: '#FFFFFF',
          },
        });
        break;
      case 'error':
        toast.error(message, {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: '#FFFFFF',
          },
        });
        break;
      case 'warning':
        toast(message, {
          duration: 3000,
          position: 'top-right',
          icon: '⚠️',
          style: {
            background: '#F59E0B',
            color: '#FFFFFF',
          },
        });
        break;
      default:
        toast(message, {
          duration: 2000,
          position: 'top-right',
        });
    }
  }, []);

  return { showToast };
}; 