import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import AnimatedCVGraphic from '../AnimatedCVGraphic';

// Register MotionPath Plugin
gsap.registerPlugin(MotionPathPlugin);

const HeroMid = ({ 
  title, 
  subtitle, 
  ctaText, 
  ctaLink, 
  imageSrc 
}) => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const pathRef = useRef(null);
  const path2Ref = useRef(null);
  const path3Ref = useRef(null);
  const dotRef = useRef(null);
  const dot2Ref = useRef(null);
  const dot3Ref = useRef(null);
  const cvGraphicRef = useRef(null);
  const heroWrapRef = useRef(null);

  useEffect(() => {
    const subtitle = subtitleRef.current;
    const path = pathRef.current;
    const path2 = path2Ref.current;
    const path3 = path3Ref.current;
    const dot = dotRef.current;
    const dot2 = dot2Ref.current;
    const dot3 = dot3Ref.current;
    const cvGraphic = cvGraphicRef.current;
    const heroWrap = heroWrapRef.current;

    // Animate connection paths
    const createPathAnimation = (path, dot, delay = 0, duration = 3, speed = 1) => {
      const tl = gsap.timeline({ 
        repeat: -1, 
        yoyo: true,
        delay: delay
      });
      
      tl.fromTo(dot, {
        motionPath: {
          path: path,
          align: path,
          alignOrigin: [0.5, 0.5]
        },
        duration: duration / speed,
        ease: 'power1.inOut'
      }, {
        motionPath: {
          path: path,
          align: path,
          alignOrigin: [0.5, 0.5]
        },
        duration: duration / speed,
        ease: 'power1.inOut',
        repeat: 1,
        yoyo: true
      });

      return tl;
    };

    // Create animations for all three paths with different characteristics
    const masterTimeline = gsap.timeline({ repeat: -1 });

    // First path - slowest
    const path1Animation = createPathAnimation(path, dot, 0, 3, 0.5);
    
    // Second path - medium speed, delayed start
    const path2Animation = createPathAnimation(path2, dot2, 1, 3, 1);
    
    // Third path - fastest, most delayed
    const path3Animation = createPathAnimation(path3, dot3, 2, 3, 1.5);

    // Subtle hover effect for subtitle
    gsap.fromTo(subtitle, 
      { scale: 1 },
      { 
        scale: 1.02, 
        duration: 0.5, 
        ease: 'power1.inOut',
        paused: true,
        scrollTrigger: {
          trigger: subtitle,
          start: 'top center',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  // Split the title into words, potentially allowing manual line breaks
  const titleWords = title.split(' ');
  const processedTitle = titleWords.map((word, index) => 
    word.startsWith('@') ? (
      <span key={index} className="text-blue-600">
        {word.slice(1)}{' '}
      </span>
    ) : (
      <React.Fragment key={index}>{word}{' '}</React.Fragment>
    )
  );

  return (
    <div className="wrapper w-[1200px] mx-auto">
      <div className="container px-5 mx-auto">
        <div 
          ref={heroWrapRef}
          className="hero-wrap flex justify-center w-full relative"
        >
          <div className="hero-text w-[65%] relative z-30">
            <h1 
              ref={titleRef}
              className="text-[6.5rem] font-medium leading-[0.95] text-black tracking-tighter"
            >
              {processedTitle}
            </h1>
            
            <h2 
              ref={subtitleRef}
              className="text-[4.2rem] font-bold text-black leading-none"
            >
              AI Powered
            </h2>
            
            <div className="flex-grow"></div>
            
            <div className="mt-auto">
              <p className="text-xl text-black mb-6 mt-12">
                {subtitle}
              </p>
              
              <Link 
                to={ctaLink} 
                className="inline-block px-8 py-3 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-black transition-colors"
              >
                {ctaText}
              </Link>
            </div>
          </div>
          
          <div 
            ref={cvGraphicRef}
            className="hero-assets w-[35%] flex justify-center items-center relative z-20"
          >
            <AnimatedCVGraphic />
          </div>

          {/* Connecting Path and Animated Dot */}
          <svg 
            className="absolute top-0 left-[-300px] w-full h-full pointer-events-none z-40"
            viewBox="0 0 1200 800"
          >
            {/* First Path */}
            {/* <path 
              ref={pathRef}
              d="M680,320 L1150,320"
              fill="none"
              stroke="rgba(0,0,0,0.4)"
              strokeWidth="3"
              strokeDasharray="10,5"
            />
            <circle 
              ref={dotRef}
              cx="0" 
              cy="0" 
              r="6" 
              fill="rgba(0,0,0,0.4)"
            /> */}

            {/* Second Path */}
            <path 
              ref={path2Ref}
              d="M680,240 
                 C750,200 850,280 900,240 
                 S1050,200 1150,200"
              fill="none"
              stroke="rgba(0,0,0,0.4)"
              strokeWidth="3"
              strokeDasharray="10,5"
            />
            <circle 
              ref={dot2Ref}
              cx="0" 
              cy="0" 
              r="6" 
              fill="rgba(0,0,0,0.4)"
            />

            {/* Third Path */}
            {/* <path 
              ref={path3Ref}
              d="M680,360 L1150,360"
              fill="none"
              stroke="rgba(0,0,0,0.4)"
              strokeWidth="3"
              strokeDasharray="10,5"
            />
            <circle 
              ref={dot3Ref}
              cx="0" 
              cy="0" 
              r="6" 
              fill="rgba(0,0,0,0.4)"
            /> */}
          </svg>
        </div>
      </div>
    </div>
  );
};

HeroMid.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  ctaText: PropTypes.string.isRequired,
  ctaLink: PropTypes.string.isRequired,
  imageSrc: PropTypes.string
};

export default HeroMid;
