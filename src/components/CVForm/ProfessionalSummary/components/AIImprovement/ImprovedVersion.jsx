import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';

const ImprovedVersion = ({ content, onUse }) => {
  const modalRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!modalRef.current || !contentRef.current) return;

    // Create a timeline for the modal animation
    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' }
    });

    // Fade in backdrop
    tl.fromTo(modalRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4 }
    );

    // Fade and scale in content
    tl.fromTo(contentRef.current,
      { y: 40, opacity: 0, scale: 0.95 },
      { 
        y: 0, 
        opacity: 1,
        scale: 1,
        duration: 0.5,
        onComplete: () => {
          // Add a subtle scale bounce effect
          gsap.to(contentRef.current, {
            scale: 1.02,
            duration: 0.15,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1
          });
        }
      },
      '-=0.2'
    );

    // Cleanup
    return () => {
      tl.kill();
    };
  }, []);

  const handleClose = () => {
    // Create exit animation
    const tl = gsap.timeline({
      onComplete: onUse
    });

    tl.to(contentRef.current, {
      y: 40,
      opacity: 0,
      scale: 0.95,
      duration: 0.4,
      ease: 'power3.inOut'
    });

    tl.to(modalRef.current, {
      opacity: 0,
      duration: 0.3
    }, '-=0.2');
  };

  if (!content) return null;

  return (
    <div
      ref={modalRef}
      className="improved-version-modal fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === modalRef.current && handleClose()}
    >
      <div
        ref={contentRef}
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Improved Version
            </h3>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-6">
            {content}
          </p>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Use This Version
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ImprovedVersion.propTypes = {
  content: PropTypes.string,
  onUse: PropTypes.func.isRequired
};

export default ImprovedVersion;
