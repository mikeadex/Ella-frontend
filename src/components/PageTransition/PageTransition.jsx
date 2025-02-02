import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const PageTransition = () => {
  const dotsRef = useRef([]);

  useEffect(() => {
    const dots = dotsRef.current;
    const tl = gsap.timeline({
      repeat: -1,
      defaults: { 
        ease: "elastic.out(1, 0.3)"
      }
    });

    // Reset dots position
    gsap.set(dots, { y: 0 });

    // Create bounce animation for each dot
    dots.forEach((dot, i) => {
      tl.to(dot, {
        y: -20,
        duration: 0.5,
        ease: "power2.out"
      }, i * 0.2)
      .to(dot, {
        y: 0,
        duration: 0.8,
      }, ">-0.3");
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      <div className="absolute inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-[2px]" />
      <div className="flex space-x-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            ref={el => dotsRef.current[i] = el}
            className="w-3 h-3 bg-indigo-600 dark:bg-indigo-400 rounded-full"
            style={{
              filter: 'brightness(1.1) contrast(1.1)',
              boxShadow: '0 0 10px rgba(79, 70, 229, 0.3)'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PageTransition;
