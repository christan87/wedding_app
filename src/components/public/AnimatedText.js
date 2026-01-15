/**
 * ============================================================================
 * FILE: AnimatedText.js
 * LOCATION: src/components/public/AnimatedText.js
 * PURPOSE: Reusable text component with entrance animations
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This component displays text with customizable entrance animations.
 * It can animate text when:
 * 1. The page loads (triggerOnScroll = false)
 * 2. The text scrolls into view (triggerOnScroll = true)
 * 
 * AVAILABLE ANIMATIONS:
 * =====================
 * - 'fade-in': Text fades from transparent to visible
 * - 'slide-up': Text slides up from below while fading in
 * - 'slide-down': Text slides down from above while fading in
 * - 'slide-left': Text slides in from the right while fading in
 * - 'slide-right': Text slides in from the left while fading in
 * - 'zoom-in': Text scales up from smaller while fading in
 * - 'zoom-out': Text scales down from larger while fading in
 * - 'fuzzy-slide': Each letter slides in from left with alternating blur levels
 *   (odd letters start at 50% blur, even letters start at 70% blur, all become clear)
 * - 'type': Typewriter effect where text appears as if being typed (width animates from 0 to 100%)
 * - 'pop': Text expands onto screen and contracts into place with scale animation
 * - 'none': No animation
 * 
 * DEPENDENCIES:
 * =============
 * External Libraries:
 * - react: useState, useEffect, useRef hooks for state and DOM management
 * 
 * Related Files:
 * - Similar to: src/components/public/Images/ImageDisplay.js (same animation logic)
 * - Used by: src/components/public/HeroImage.js
 * 
 * PROPS:
 * ======
 * @param {string|ReactNode} children - The text content to display
 * @param {string} animation - Animation type (default: 'fade-in')
 * @param {string} className - CSS classes for the text element (default: '')
 * @param {string} containerClassName - CSS classes for the wrapper div (default: '')
 * @param {number} delay - Milliseconds to wait before animation starts (default: 100)
 * @param {boolean} triggerOnScroll - Animate when scrolled into view (default: true)
 * @param {number} threshold - How much of text must be visible to trigger (default: 0.1)
 * @param {number} duration - Animation duration in milliseconds (default: 700)
 * @param {string} as - HTML element to render as (default: 'div')
 * 
 * USAGE EXAMPLE:
 * ==============
 * <AnimatedText
 *   animation="slide-right"
 *   className="text-4xl font-bold text-white"
 *   delay={200}
 *   duration={1000}
 *   triggerOnScroll={false}
 * >
 *   Welcome to Our Wedding
 * </AnimatedText>
 * 
 * // Fuzzy slide example (each letter animates with alternating blur)
 * <AnimatedText
 *   animation="fuzzy-slide"
 *   className="text-4xl font-bold text-white"
 *   duration={1000}
 * >
 *   January 15, 2026
 * </AnimatedText>
 * 
 * ============================================================================
 */

import { useState, useEffect, useRef } from 'react';

/**
 * ANIMATION STYLES CONFIGURATION
 * 
 * Each animation has two states:
 * - initial: The starting state (hidden/transformed)
 * - animate: The final state (visible/normal position)
 * 
 * These use Tailwind CSS classes for styling.
 * The transition between states creates the animation effect.
 */
const animationStyles = {
  // Simple fade from transparent to visible
  'fade-in': {
    initial: 'opacity-0',
    animate: 'opacity-100',
  },
  // Slide up from below (translate-y-16 = 64px down)
  'slide-up': {
    initial: 'opacity-0 translate-y-16',
    animate: 'opacity-100 translate-y-0',
  },
  // Slide down from above (-translate-y-16 = 64px up)
  'slide-down': {
    initial: 'opacity-0 -translate-y-16',
    animate: 'opacity-100 translate-y-0',
  },
  // Slide in from the right (translate-x-16 = 64px right)
  'slide-left': {
    initial: 'opacity-0 translate-x-16',
    animate: 'opacity-100 translate-x-0',
  },
  // Slide in from the left (-translate-x-16 = 64px left)
  'slide-right': {
    initial: 'opacity-0 -translate-x-16',
    animate: 'opacity-100 translate-x-0',
  },
  // Scale up from 90% size
  'zoom-in': {
    initial: 'opacity-0 scale-90',
    animate: 'opacity-100 scale-100',
  },
  // Scale down from 110% size
  'zoom-out': {
    initial: 'opacity-0 scale-110',
    animate: 'opacity-100 scale-100',
  },
  // Typewriter effect - text appears as if being typed
  'type': {
    initial: 'overflow-hidden whitespace-nowrap',
    animate: 'overflow-hidden whitespace-nowrap',
  },
  // Pop effect - expands and contracts into place
  'pop': {
    initial: 'inline-block',
    animate: 'inline-block',
  },
  // No animation - show immediately
  'none': {
    initial: '',
    animate: '',
  },
};

/**
 * ANIMATEDTEXT COMPONENT
 * 
 * Main component that renders animated text.
 * Uses React hooks to manage animation state and
 * IntersectionObserver API for scroll-triggered animations.
 */
export default function AnimatedText({
  children,
  animation = 'fade-in',
  className = '',
  containerClassName = '',
  delay = 100,
  triggerOnScroll = true,
  threshold = 0.1,
  duration = 700,
  as: Component = 'div',
}) {
  // ========== STATE MANAGEMENT ==========
  // isVisible: Controls whether the animation has been triggered
  // Starts as false (hidden) and becomes true when animation should play
  const [isVisible, setIsVisible] = useState(false);
  
  // ref: Reference to the DOM element for IntersectionObserver
  const ref = useRef(null);

  // ========== ANIMATION TRIGGER LOGIC ==========
  useEffect(() => {
    // If NOT using scroll trigger, animate after the delay
    if (!triggerOnScroll) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }

    // If using scroll trigger, set up IntersectionObserver
    // This watches when the element enters the viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When element is visible enough (based on threshold)
        if (entry.isIntersecting) {
          // Wait for delay, then trigger animation
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          // Stop observing after animation triggers (only animate once)
          observer.unobserve(entry.target);
        }
      },
      {
        // threshold: 0.1 means trigger when 10% of element is visible
        threshold: threshold,
      }
    );

    // Start observing the element
    if (ref.current) {
      observer.observe(ref.current);
    }

    // Cleanup: Stop observing when component unmounts
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [triggerOnScroll, delay, threshold]);

  // ========== FUZZY-SLIDE ANIMATION ==========
  // Special handling for fuzzy-slide: renders each letter individually
  // with alternating blur levels that animate to clear
  if (animation === 'fuzzy-slide') {
    // Convert children to string for letter-by-letter rendering
    const text = typeof children === 'string' ? children : String(children);
    
    return (
      <div ref={ref} className={containerClassName}>
        <Component className={className}>
          {text.split('').map((letter, index) => {
            // Alternate blur levels: odd letters = 4px blur, even letters = 6px blur
            // Both animate to 0px blur (clear)
            const initialBlur = index % 2 === 0 ? 4 : 6; // 4px ≈ 50%, 6px ≈ 70% blur
            const initialTranslate = -20; // Start 20px to the left
            
            return (
              <span
                key={index}
                style={{
                  display: 'inline-block',
                  filter: isVisible ? 'blur(0px)' : `blur(${initialBlur}px)`,
                  transform: isVisible ? 'translateX(0)' : `translateX(${initialTranslate}px)`,
                  opacity: isVisible ? 1 : 0,
                  transition: `filter ${duration}ms ease-out, transform ${duration}ms ease-out, opacity ${duration}ms ease-out`,
                  // Stagger the animation slightly for each letter
                  transitionDelay: `${index * 30}ms`,
                  // Preserve spaces
                  whiteSpace: letter === ' ' ? 'pre' : 'normal',
                }}
              >
                {letter}
              </span>
            );
          })}
        </Component>
      </div>
    );
  }

  // ========== POP ANIMATION ==========
  // Special handling for pop: text expands onto screen and contracts into place
  // Uses scale transform to create expand/contract effect
  if (animation === 'pop') {
    return (
      <div ref={ref} className={containerClassName}>
        <Component
          className={`${className} inline-block`}
          style={{
            transform: isVisible ? 'scale(1)' : 'scale(0)',
            opacity: isVisible ? 1 : 0,
            transition: `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,
            animation: isVisible ? `expandContract ${duration}ms ease-in-out` : 'none',
          }}
        >
          {children}
        </Component>
        <style jsx>{`
          @keyframes expandContract {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            25% {
              transform: scale(1.2);
              opacity: 1;
            }
            50% {
              transform: scale(1);
              opacity: 1;
            }
            75% {
              transform: scale(1.2);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }

  // ========== TYPEWRITER ANIMATION ==========
  // Special handling for type: text appears as if being typed
  // Reveals characters one by one with opacity transitions
  if (animation === 'type') {
    // Convert children to string for character-by-character rendering
    const text = typeof children === 'string' ? children : String(children);
    
    return (
      <div ref={ref} className={containerClassName}>
        <Component className={`${className} overflow-hidden whitespace-nowrap`}>
          {text.split('').map((letter, index) => (
            <span
              key={index}
              style={{
                display: 'inline-block',
                opacity: isVisible ? 1 : 0,
                transition: `opacity 50ms ease-out`,
                transitionDelay: isVisible ? `${delay + (index * duration / text.length)}ms` : '0ms',
                // Preserve spaces
                whiteSpace: letter === ' ' ? 'pre' : 'normal',
              }}
            >
              {letter}
            </span>
          ))}
        </Component>
      </div>
    );
  }

  // ========== BUILD CSS CLASSES (Standard Animations) ==========
  // Get the animation configuration (or default to fade-in)
  const animationConfig = animationStyles[animation] || animationStyles['fade-in'];
  
  // Combine transition class with either initial or animate state
  // transition-all: Animate all properties that change
  // ease-out: Start fast, end slow (natural feeling)
  const animationClasses = `transition-all ease-out ${
    isVisible ? animationConfig.animate : animationConfig.initial
  }`;

  // Inline style for animation duration (allows custom duration via prop)
  const transitionStyle = {
    transitionDuration: `${duration}ms`,
  };

  // ========== RENDER (Standard Animations) ==========
  return (
    <div ref={ref} className={containerClassName}>
      <Component
        className={`${animationClasses} ${className}`}
        style={transitionStyle}
      >
        {children}
      </Component>
    </div>
  );
}
