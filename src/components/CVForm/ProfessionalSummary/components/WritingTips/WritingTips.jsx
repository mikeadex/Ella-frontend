import React, { useState } from 'react';
import TipsList from './TipsList';

const WritingTips = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full sm:w-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-full sm:w-auto
          gap-2 px-4 py-2 
          text-sm font-medium rounded-lg h-10
          bg-emerald-500 text-white hover:bg-emerald-600 
          dark:bg-emerald-600 dark:hover:bg-emerald-700
          transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        Writing Tips
      </button>

      {isOpen && (
        <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
          <TipsList />
        </div>
      )}
    </div>
  );
};

export default WritingTips;
