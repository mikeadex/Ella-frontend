import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    title: 'Simplified',
    description: 'Upload your existing CV or tell Ella about yourself',
    accent: '#4F46E5',
    rotation: -5
  },
  {
    title: 'Creative',
    description: 'Rewrite your CV in one click of a button! Interesting?',
    accent: '#7C3AED',
    rotation: 0
  },
  {
    title: 'Responsive',
    description: 'Now your CV wont be boring! ATS ready, Employer review on the go',
    accent: '#2563EB',
    rotation: 5
  }
];

const AnimatedCards = () => {
  const cardsRef = useRef([]);
  const containerRef = useRef(null);
  const ctaRef = useRef(null);
  const counterRef = useRef(null);
  const counterValueRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const cardElements = cardsRef.current;
    const cta = ctaRef.current;
    const counter = counterRef.current;
    const counterValue = counterValueRef.current;

    // Reset any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(st => st.kill());
    gsap.set(cardElements, { clearProps: 'all' });

    // Create scroll animations for each card
    cardElements.forEach((card, index) => {
      const rotation = cards[index].rotation;
      
      // Initial state
      gsap.set(card, {
        y: 150,
        rotation: rotation,
        opacity: 0,
        transformOrigin: 'center center'
      });

      // Scroll animation
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 15%',
          scrub: 2,
          toggleActions: 'play none none reverse'
        },
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 2.5,
        ease: 'power2.inOut'
      });

      // Parallax effect on scroll
      ScrollTrigger.create({
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.to(card, {
            y: progress * 30,
            duration: 0.5,
            ease: 'power1.inOut'
          });
        }
      });

      // Hover animation
      const content = card.querySelector('.card-content');
      const hoverTl = gsap.timeline({ 
        paused: true,
        defaults: {
          duration: 0.6,
          ease: 'power2.out'
        }
      });
      
      hoverTl
        .to(card, {
          y: '-=30',
          scale: 1.03,
          boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
        })
        .to(content, {
          y: -8,
          duration: 0.4
        }, 0);

      // Add hover listeners with slower transitions
      card.addEventListener('mouseenter', () => {
        hoverTl.timeScale(0.8).play();
      });
      card.addEventListener('mouseleave', () => {
        hoverTl.timeScale(1.2).reverse();
      });
    });

    // CTA Animation
    gsap.set(cta, {
      clearProps: 'all',
      opacity: 1,
      y: 0,
      backgroundColor: '#ffffff'
    });

    // CTA scroll trigger
    ScrollTrigger.create({
      trigger: cta,
      start: 'top 90%',
      onEnter: () => {
        gsap.fromTo(cta,
          {
            y: 30,
            opacity: 0,
            backgroundColor: '#ffffff'
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            backgroundColor: '#ffffff'
          }
        );
      }
    });

    // CTA Hover Animation
    const ctaHoverTl = gsap.timeline({ paused: true });
    ctaHoverTl
      .to(cta, {
        scale: 1.02,
        duration: 0.4,
        ease: 'power2.out',
        backgroundColor: '#ffffff'
      })
      .to(cta.querySelector('.cta-arrow'), {
        x: 5,
        duration: 0.3,
        ease: 'power2.out'
      }, 0);

    cta.addEventListener('mouseenter', () => ctaHoverTl.play());
    cta.addEventListener('mouseleave', () => ctaHoverTl.reverse());

    // Counter Animation
    const animateValue = (start, end, duration) => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        counterValue.textContent = currentValue.toLocaleString();
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    // Counter scroll trigger
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 80%',
      onEnter: () => {
        gsap.fromTo(counter,
          {
            y: 50,
            opacity: 0
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            onComplete: () => animateValue(0, 25000, 2000)
          }
        );
      }
    });

  }, []);

  return (
    <div ref={containerRef} className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-12">
          {cards.map((card, index) => (
            <div
              key={card.title}
              ref={el => cardsRef.current[index] = el}
              className="w-full md:w-[280px] h-[420px] bg-white rounded-2xl shadow-sm transition-shadow cursor-pointer perspective-1000"
              style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            >
              <div className="card-content h-full p-8 flex flex-col">
                {/* Top Accent Bar */}
                <div 
                  className="absolute top-0 left-0 right-0 h-2 rounded-t-2xl"
                  style={{ background: card.accent }}
                />
                
                {/* Icon */}
                <div 
                  className="w-16 h-16 mb-8 rounded-2xl"
                  style={{ 
                    background: `linear-gradient(135deg, ${card.accent}15, ${card.accent}30)`,
                    border: `1px solid ${card.accent}20`
                  }}
                />

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <h3 
                    className="text-2xl font-semibold mb-4 text-slate-900"
                    style={{ color: card.accent }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-slate-600 mb-6">
                    {card.description}
                  </p>
                  
                  {/* Preview Frame */}
                  <div 
                    className="flex-1 rounded-lg bg-slate-50 p-4"
                    style={{ 
                      border: `1px solid ${card.accent}20`,
                      background: `linear-gradient(135deg, white, ${card.accent}05)`
                    }}
                  >
                    <div className="w-full h-2 bg-slate-200 rounded mb-2" />
                    <div className="w-3/4 h-2 bg-slate-200 rounded mb-4" />
                    <div className="space-y-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-full h-1 bg-slate-200 rounded" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <button
            ref={ctaRef}
            onClick={() => window.location.href = '/cv-writer/write'}
            className="relative inline-flex items-center px-10 py-5 text-xl font-bold text-indigo-600 bg-white rounded-xl transition-all duration-300 hover:text-indigo-700 border border-indigo-100"
            style={{
              boxShadow: '0 4px 20px rgba(79, 70, 229, 0.15)',
              backgroundColor: '#ffffff'
            }}
          >
            <span className="opacity-100">Get Started Now</span>
            <svg 
              className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-1 opacity-100 cta-arrow" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 8l4 4m0 0l-4 4m4-4H3" 
              />
            </svg>
          </button>
          <div 
            ref={counterRef}
            className="mt-8 text-slate-600 text-lg"
          >
            <span>Join </span>
            {/* <span 
              ref={counterValueRef}
              className="font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-transparent bg-clip-text"
            >
              0
            </span> */}
            <span> professionals who trust Ella</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedCards;
