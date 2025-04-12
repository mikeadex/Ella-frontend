import React, { useState, useEffect } from 'react';
import './CVTemplateRenderer.css';
import TemplateSelector from './TemplateSelector';
import { exportToPDF } from '../../utils/pdfExport';

// Import existing templates
import ExecutiveTemplate from './ExecutiveTemplate';
import CreativeTemplate from './CreativeTemplate';
import MinimalistProTemplate from './MinimalistProTemplate';
import TechFocusTemplate from './TechFocusTemplate';

// Import new templates
import ElegantTemplate from './ElegantTemplate';
import StartupTemplate from './StartupTemplate';
import NordicTemplate from './NordicTemplate';
import CorporateTemplate from './CorporateTemplate';
import PortfolioTemplate from './PortfolioTemplate';

const CVTemplateRenderer = ({ cvData }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('executive');
  const [isExporting, setIsExporting] = useState(false);
  
  useEffect(() => {
    // Load the selected template from localStorage or default to 'executive'
    const savedTemplate = localStorage.getItem('selectedCVTemplate');
    if (savedTemplate) {
      setSelectedTemplate(savedTemplate);
    }
  }, []);

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    localStorage.setItem('selectedCVTemplate', templateId);
  };

  const renderTemplate = () => {
    // Add the 'for-print' class when exporting
    const printClass = isExporting ? 'for-print' : '';
    
    // Custom style to enforce width constraint
    const wrapperStyle = {
      maxWidth: '900px',
      width: '100%',
      margin: '0 auto'
    };
    
    switch(selectedTemplate) {
      case 'executive':
        return (
          <div style={wrapperStyle}>
            <ExecutiveTemplate data={cvData} className={printClass} />
          </div>
        );
      case 'creative':
        return (
          <div style={wrapperStyle}>
            <CreativeTemplate data={cvData} className={printClass} />
          </div>
        );
      case 'minimalistPro':
        return (
          <div style={wrapperStyle}>
            <MinimalistProTemplate data={cvData} className={printClass} />
          </div>
        );
      case 'techFocus':
        return (
          <div style={wrapperStyle}>
            <TechFocusTemplate data={cvData} className={printClass} />
          </div>
        );
      // New templates
      case 'elegant':
        return (
          <div style={wrapperStyle}>
            <ElegantTemplate data={cvData} className={printClass} />
          </div>
        );
      case 'startup':
        return (
          <div style={wrapperStyle}>
            <StartupTemplate data={cvData} className={printClass} />
          </div>
        );
      case 'nordic':
        return (
          <div style={wrapperStyle}>
            <NordicTemplate data={cvData} className={printClass} />
          </div>
        );
      case 'corporate':
        return (
          <div style={wrapperStyle}>
            <CorporateTemplate data={cvData} className={printClass} />
          </div>
        );
      case 'portfolio':
        return (
          <div style={wrapperStyle}>
            <PortfolioTemplate data={cvData} className={printClass} />
          </div>
        );
      default:
        return (
          <div style={wrapperStyle}>
            <ExecutiveTemplate data={cvData} className={printClass} />
          </div>
        );
    }
  };
  
  const handleExportPDF = async () => {
    setIsExporting(true);
    
    try {
      // Delay to make sure the PDF class is applied before export
      setTimeout(async () => {
        const templateElement = document.getElementById('cv-template-container');
        if (templateElement) {
          await exportToPDF(templateElement, `${selectedTemplate}-cv-template.pdf`);
        }
        setIsExporting(false);
      }, 100);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      setIsExporting(false);
    }
  };
  
  return (
    <div className="cv-template-renderer">
      <div className="template-controls">
        <TemplateSelector 
          selectedTemplate={selectedTemplate}
          onSelectTemplate={handleTemplateSelect}
        />
      </div>
      
      <div className="template-preview-container">
        <div className="template-preview" id="cv-template-container" style={{maxWidth: '900px', width: '100%', margin: '0 auto'}}>
          {renderTemplate()}
        </div>
      </div>
      
      <div className="floating-export-actions">
        <button 
          className="floating-export-btn pdf" 
          onClick={handleExportPDF}
          title="Export to PDF"
          disabled={isExporting}
        >
          📄
        </button>
        <button 
          className="floating-export-btn print" 
          onClick={() => window.print()}
          title="Print CV"
        >
          🖨️
        </button>
      </div>
    </div>
  );
};

export default CVTemplateRenderer;
