import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const AnimatedCVGraphic = () => {
  const containerRef = useRef(null);
  const xLineRef = useRef(null);
  const yLineRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const xLine = xLineRef.current;
    const yLine = yLineRef.current;

    // Subtle CV container animation
    const containerTl = gsap.timeline({ repeat: -1 });
    containerTl.fromTo(container, 
      { 
        scale: 0.95, 
        rotateX: -5,
        transformOrigin: 'center center'
      },
      {
        scale: 1,
        rotateX: 0,
        duration: 2,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true
      }
    );

    // X-Axis (Horizontal) Gradient Line Animation
    const xAxisTl = gsap.timeline({ repeat: -1 });
    xAxisTl.to(xLine, {
      duration: 5,
      ease: 'power1.inOut',
      keyframes: [
        { 
          left: '-100%', 
          width: '100%',
          background: 'linear-gradient(to right, transparent, rgba(106, 17, 203, 0.3), rgba(37, 117, 252, 0.3), transparent)'
        },
        { 
          left: '100%', 
          width: '100%',
          background: 'linear-gradient(to right, transparent, rgba(37, 117, 252, 0.3), rgba(106, 17, 203, 0.3), transparent)'
        }
      ]
    });

    // Y-Axis (Vertical) Gradient Line Animation
    const yAxisTl = gsap.timeline({ repeat: -1 });
    yAxisTl.to(yLine, {
      duration: 5,
      ease: 'power1.inOut',
      keyframes: [
        { 
          top: '-100%', 
          height: '100%',
          background: 'linear-gradient(to bottom, transparent, rgba(106, 17, 203, 0.3), rgba(37, 117, 252, 0.3), transparent)'
        },
        { 
          top: '100%', 
          height: '100%',
          background: 'linear-gradient(to bottom, transparent, rgba(37, 117, 252, 0.3), rgba(106, 17, 203, 0.3), transparent)'
        }
      ]
    });

    return () => {
      containerTl.kill();
      xAxisTl.kill();
      yAxisTl.kill();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-[400px] h-[600px] bg-white rounded-[17px] shadow-lg overflow-hidden -ml-[100px] mt-[100px]"
    >
      {/* CV Content Mockup */}
      <div className="p-8 pt-16">
        <div className="h-16 bg-gray-200 mb-6 rounded"></div>
        <div className="h-6 bg-gray-100 mb-3 rounded w-3/4"></div>
        <div className="h-6 bg-gray-100 mb-3 rounded"></div>
        <div className="h-6 bg-gray-100 mb-6 rounded w-5/6"></div>
        
        <div className="h-16 bg-gray-200 mb-6 rounded"></div>
        <div className="h-6 bg-gray-100 mb-3 rounded w-2/3"></div>
        <div className="h-6 bg-gray-100 mb-3 rounded"></div>
        <div className="h-6 bg-gray-100 mb-6 rounded w-5/6"></div>
      </div>

      {/* Animated X-Axis Gradient Line */}
      <div 
        ref={xLineRef}
        className="absolute bottom-0 -left-full w-full h-1 z-10"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(106, 17, 203, 0.3), rgba(37, 117, 252, 0.3), transparent)',
          boxShadow: '0 0 5px rgba(106, 17, 203, 0.2)'
        }}
      />

      {/* Animated Y-Axis Gradient Line */}
      <div 
        ref={yLineRef}
        className="absolute right-0 -top-full w-1 h-full z-10"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(106, 17, 203, 0.3), rgba(37, 117, 252, 0.3), transparent)',
          boxShadow: '0 0 5px rgba(106, 17, 203, 0.2)'
        }}
      />
    </div>
  );
};

export default AnimatedCVGraphic;
