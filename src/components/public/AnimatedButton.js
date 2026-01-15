/**
 * ============================================================================
 * FILE: AnimatedButton.js
 * LOCATION: src/components/public/AnimatedButton.js
 * PURPOSE: Reusable button component with entrance animations
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This component displays a button with customizable entrance animations.
 * It can animate buttons when:
 * 1. The page loads (triggerOnScroll = false)
 * 2. The button scrolls into view (triggerOnScroll = true)
 * 
 * AVAILABLE ANIMATIONS:
 * =====================
 * - 'fade-up': Button slides up from below while fading in
 * - 'fade-in': Button fades from transparent to visible
 * - 'none': No animation
 * 
 * DEPENDENCIES:
 * =============
 * External Libraries:
 * - react: useState, useEffect, useRef hooks for state and DOM management
 * - next/link: For client-side navigation
 * 
 * Related Files:
 * - Similar to: src/components/public/AnimatedText.js (same animation logic)
 * 
 * PROPS:
 * ======
 * @param {string} btnText - The button text to display
 * @param {string} url - The URL to navigate to when clicked (optional)
 * @param {string} animation - Animation type (default: 'fade-up')
 * @param {string} className - CSS classes for the button element (default: '')
 * @param {number} delay - Milliseconds to wait before animation starts (default: 100)
 * @param {boolean} triggerOnScroll - Animate when scrolled into view (default: true)
 * @param {number} threshold - How much of button must be visible to trigger (default: 0.1)
 * @param {number} duration - Animation duration in milliseconds (default: 700)
 * @param {function} onClick - Optional click handler function
 * 
 * USAGE EXAMPLE:
 * ==============
 * <AnimatedButton
 *   btnText="RSVP"
 *   url="/rsvp"
 *   animation="fade-up"
 *   delay={200}
 *   duration={1000}
 *   triggerOnScroll={true}
 * />
 * 
 * ============================================================================
 */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

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
  // Slide up from below (translate-y-16 = 64px down)
  'fade-up': {
    initial: 'opacity-0 translate-y-16',
    animate: 'opacity-100 translate-y-0',
  },
  // Simple fade from transparent to visible
  'fade-in': {
    initial: 'opacity-0',
    animate: 'opacity-100',
  },
  // No animation - show immediately
  'none': {
    initial: '',
    animate: '',
  },
};

/**
 * ANIMATEDBUTTON COMPONENT
 * 
 * Main component that renders animated button.
 * Uses React hooks to manage animation state and
 * IntersectionObserver API for scroll-triggered animations.
 */
export default function AnimatedButton({
  btnText,
  url,
  animation = 'fade-up',
  className = '',
  delay = 100,
  triggerOnScroll = true,
  threshold = 0.1,
  duration = 700,
  onClick,
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

  // ========== BUILD CSS CLASSES ==========
  // Get the animation configuration (or default to fade-up)
  const animationConfig = animationStyles[animation] || animationStyles['fade-up'];
  
  // Combine transition class with either initial or animate state
  // transition-all: Animate all properties that change
  // ease-out: Start fast, end slow (natural feeling)
  const animationClasses = `transition-all ease-out ${
    isVisible ? animationConfig.animate : animationConfig.initial
  }`;

  // Default button styling
  const defaultButtonClasses = 'px-12 py-4 bg-white/90 hover:bg-white text-gray-800 cormorant-garamond-semibold text-xl md:text-2xl rounded-full shadow-2xl hover:scale-105 hover:shadow-3xl';

  // Inline style for animation duration (allows custom duration via prop)
  const transitionStyle = {
    transitionDuration: `${duration}ms`,
  };

  // ========== RENDER ==========
  // Button content
  const buttonContent = (
    <button
      className={`${animationClasses} ${defaultButtonClasses} ${className}`}
      style={transitionStyle}
      onClick={onClick}
    >
      {btnText}
    </button>
  );

  // If url is provided, wrap in Link component
  if (url) {
    return (
      <div ref={ref}>
        <Link href={url}>
          {buttonContent}
        </Link>
      </div>
    );
  }

  // Otherwise, just return the button
  return (
    <div ref={ref}>
      {buttonContent}
    </div>
  );
}
