import { useEffect } from 'react';

const useKeyboardShortcuts = (shortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if the user is typing in an input or textarea
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable
      ) {
        // Only handle save shortcut in input fields
        if (!(event.metaKey && event.key === 's')) {
          return;
        }
      }

      // Handle shortcuts
      shortcuts.forEach(({ key, metaKey, shiftKey, ctrlKey, handler }) => {
        if (
          event.key.toLowerCase() === key.toLowerCase() &&
          !!event.metaKey === !!metaKey &&
          !!event.shiftKey === !!shiftKey &&
          !!event.ctrlKey === !!ctrlKey
        ) {
          event.preventDefault();
          handler(event);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

export default useKeyboardShortcuts;
