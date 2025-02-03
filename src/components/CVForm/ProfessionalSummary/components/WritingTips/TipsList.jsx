import React from 'react';

const tips = [
  'Keep it concise and focused on your key achievements',
  'Use action verbs and quantify results when possible',
  "Tailor it to the job you're applying for",
  'Highlight your unique value proposition',
  'Avoid clichés and generic statements',
  'Include relevant keywords from the job description',
  'Focus on your most recent and relevant experience',
  'Proofread for grammar and spelling errors',
  'Use present tense for current roles, past tense for previous ones',
  'Make it easy to read with clear, simple language'
];

const TipsList = () => (
  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
      Writing Tips
    </h4>
    <ul className="space-y-2 list-disc list-inside text-sm text-emerald-700 dark:text-emerald-300">
      {tips.map((tip, index) => (
        <li key={index} className="leading-relaxed">
          {tip}
        </li>
      ))}
    </ul>
  </div>
);

export default TipsList;
