import React from 'react';
import ModularCVParserPreview from './components/CVParserPreview';

/**
 * This is a wrapper component that imports our modular implementation
 * It maintains backward compatibility while using the new modular structure
 */
const CVParserPreview = (props) => {
  return <ModularCVParserPreview {...props} />;
};

export default CVParserPreview;
