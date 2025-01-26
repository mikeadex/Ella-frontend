import React from 'react';
import './TemplateSelector.css';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with a focus on visual hierarchy',
    preview: '/templates/modern-preview.png'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Simple and elegant layout with a sidebar for key information',
    preview: '/templates/minimalist-preview.png'
  }
];

const TemplateSelector = ({ selectedTemplate, onSelect }) => {
  return (
    <div className="template-selector">
      <h2>Choose a Template</h2>
      <div className="templates-grid">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
            onClick={() => onSelect(template.id)}
          >
            <div className="template-preview">
              <img
                src={template.preview}
                alt={`${template.name} template preview`}
                onError={(e) => {
                  e.target.src = '/templates/placeholder.png';
                }}
              />
            </div>
            <div className="template-info">
              <h3>{template.name}</h3>
              <p>{template.description}</p>
            </div>
            <div className="template-select">
              {selectedTemplate === template.id ? (
                <span className="selected-badge">Selected</span>
              ) : (
                <button className="select-button">Select</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
