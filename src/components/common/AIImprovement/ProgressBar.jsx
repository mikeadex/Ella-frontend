import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';

const ProgressBar = ({ progress }) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const progressRef = useRef(null);
  const percentageRef = useRef(null);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const progressTweenRef = useRef(null);

  useEffect(() => {
    if (!modalRef.current || !contentRef.current) return;

    // Initial animation for modal
    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' }
    });

    // Fade in backdrop
    tl.fromTo(modalRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 }
    );

    // Slide and fade in content
    tl.fromTo(contentRef.current,
      { y: 40, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5 },
      '-=0.2'
    );

    return () => {
      tl.kill();
      if (progressTweenRef.current) {
        progressTweenRef.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    // Kill any existing tween
    if (progressTweenRef.current) {
      progressTweenRef.current.kill();
    }

    // Create new tween for smooth progress animation
    progressTweenRef.current = gsap.to({
      value: animatedProgress
    }, {
      value: progress,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: function() {
        const currentValue = Math.round(this.targets()[0].value);
        setAnimatedProgress(currentValue);
        
        if (progressRef.current) {
          progressRef.current.style.width = `${currentValue}%`;
        }
        if (percentageRef.current) {
          percentageRef.current.textContent = currentValue;
        }
      }
    });

    return () => {
      if (progressTweenRef.current) {
        progressTweenRef.current.kill();
      }
    };
  }, [progress]);

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm"
    >
      <div
        ref={contentRef}
        className="w-full max-w-lg mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Improving Text
          </h3>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span ref={percentageRef} className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              0
            </span>
            <span className="text-gray-600 dark:text-gray-400">%</span>
          </div>
        </div>

        <div className="relative h-3 overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-full">
          <div
            ref={progressRef}
            className="absolute top-0 left-0 h-full bg-indigo-500 dark:bg-indigo-400 rounded-full transition-all duration-300"
            style={{ width: '0%' }}
            role="progressbar"
            aria-valuenow={animatedProgress}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center animate-pulse">
          Our AI is enhancing your text...
        </div>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number.isRequired
};

export default ProgressBar;
