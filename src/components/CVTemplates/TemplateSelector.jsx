import React, { useState, useEffect } from 'react';
import './TemplateSelector.css';
import { exportToPDF } from '../../utils/pdfExport';

const templates = [
  {
    id: 'executive',
    name: 'Executive',
    description: 'Professional and traditional layout ideal for management positions',
    preview: '/templates/executive-preview.png'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold, colorful design with modern styling for creative fields',
    preview: '/templates/creative-preview.png'
  },
  {
    id: 'minimalistPro',
    name: 'Minimalist Pro',
    description: 'Clean and ATS-friendly design optimized for readability',
    preview: '/templates/minimalist-pro-preview.png'
  },
  {
    id: 'techFocus',
    name: 'Tech Focus',
    description: 'Modern tech-oriented layout ideal for IT and digital professionals',
    preview: '/templates/tech-focus-preview.png'
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'A sophisticated template with elegant typography and subtle colors',
    preview: '/templates/elegant-preview.png'
  },
  {
    id: 'startup',
    name: 'Startup',
    description: 'A vibrant, modern template ideal for startups and digital roles',
    preview: '/templates/startup-preview.png'
  },
  {
    id: 'nordic',
    name: 'Nordic',
    description: 'A clean, Scandinavian-inspired design with minimalist aesthetics',
    preview: '/templates/nordic-preview.png'
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'A professional template perfect for corporate environments',
    preview: '/templates/corporate-preview.png'
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'A creative portfolio-style CV with a bold sidebar',
    preview: '/templates/portfolio-preview.png'
  }
];

const TemplateSelector = ({ onSelectTemplate, selectedTemplate }) => {
  const [localTemplate, setLocalTemplate] = useState(selectedTemplate || 'executive');

  useEffect(() => {
    // Set the initial template from localStorage or default to 'executive'
    const savedTemplate = localStorage.getItem('selectedCVTemplate') || 'executive';
    setLocalTemplate(savedTemplate);
    if (onSelectTemplate) {
      onSelectTemplate(savedTemplate);
    }
  }, []);

  const handleTemplateSelect = (template) => {
    setLocalTemplate(template);
    localStorage.setItem('selectedCVTemplate', template);
    if (onSelectTemplate) {
      onSelectTemplate(template);
    }
  };

  const handleExportPDF = () => {
    const templateElement = document.getElementById('cv-template-container');
    if (templateElement) {
      exportToPDF(templateElement, `${localTemplate}-cv-template.pdf`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="template-selector">
      <div className="selector-heading">
        <h3>Select Template Style</h3>
        <p>Choose from our professional CV templates</p>
      </div>
      
      <div className="template-options">
        {templates.map((template) => (
          <div 
            key={template.id}
            className={`template-option ${localTemplate === template.id ? 'selected' : ''}`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <div className={`template-thumbnail ${template.id}-thumb`}></div>
            <span>{template.name}</span>
          </div>
        ))}
      </div>
      
      <div className="export-actions">
        <button 
          className="export-button pdf-button" 
          onClick={handleExportPDF}
          title="Export to PDF"
        >
          <span className="button-icon">📄</span>
          <span>Export to PDF</span>
        </button>
        
        <button 
          className="export-button print-button" 
          onClick={handlePrint}
          title="Print CV"
        >
          <span className="button-icon">🖨️</span>
          <span>Print</span>
        </button>
      </div>
    </div>
  );
};

export default TemplateSelector;
