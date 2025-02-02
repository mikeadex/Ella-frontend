import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PageTransition from './PageTransition';

const RouteTransition = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    
    // Remove transition after animation completes
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 900); // Matches total GSAP animation duration (400ms + 100ms delay + 400ms)

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {isTransitioning && <PageTransition />}
      {children}
    </>
  );
};

export default RouteTransition;
