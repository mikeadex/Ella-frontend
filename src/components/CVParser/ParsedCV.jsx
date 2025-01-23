    // /frontend/src/components/CVParser/ParsedCV.jsx
import React from 'react';

const ParsedCV = ({ data }) => {
  if (!data) return null;

  const sections = [
    { title: 'Professional Summary', key: 'professional_summary' },
    { title: 'Education', key: 'education' },
    { title: 'Experience', key: 'experience' },
    { title: 'Skills', key: 'skills' },
    { title: 'Languages', key: 'languages' },
    { title: 'Certifications', key: 'certifications' },
    { title: 'References', key: 'references' },
    { title: 'Social Media', key: 'social_media' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Parsed CV Data</h2>
      
      {sections.map(({ title, key }) => (
        <div key={key} className="mb-6">
          <h3 className="text-xl font-semibold mb-3">{title}</h3>
          <div className="bg-white shadow rounded-lg p-4">
            {Array.isArray(data[key]) ? (
              <ul className="space-y-2">
                {data[key].map((item, index) => (
                  <li key={index} className="border-b pb-2">
                    {Object.entries(item).map(([k, v]) => (
                      <div key={k} className="text-sm">
                        <span className="font-medium">{k}: </span>
                        {v}
                      </div>
                    ))}
                  </li>
                ))}
              </ul>
            ) : (
              <p>{data[key]}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParsedCV;