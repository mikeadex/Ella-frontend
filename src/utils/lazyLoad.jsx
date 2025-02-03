import React, { Suspense } from 'react';

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
  </div>
);

export function lazyLoad(importFunc) {
  const LazyComponent = React.lazy(importFunc);

  return function LazyLoadWrapper(props) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Example usage:
// export const LazyComponent = lazyLoad(() => import('./Component'));
