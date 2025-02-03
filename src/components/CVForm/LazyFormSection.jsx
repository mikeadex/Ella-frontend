import React, { Suspense } from 'react';
import LoadingSection from './LoadingSection';
import FormSectionErrorBoundary from './FormSectionErrorBoundary';

const LazyFormSection = ({ component: Component, sectionKey, ...props }) => {
  return (
    <FormSectionErrorBoundary sectionKey={sectionKey}>
      <Suspense fallback={<LoadingSection />}>
        <Component {...props} />
      </Suspense>
    </FormSectionErrorBoundary>
  );
};

export default LazyFormSection;
