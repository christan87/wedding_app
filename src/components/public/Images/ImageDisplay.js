/**
 * ============================================================================
 * FILE: ImageDisplay.js
 * LOCATION: src/components/public/Images/ImageDisplay.js
 * PURPOSE: Reusable image component with entrance animations
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This component displays images with customizable entrance animations.
 * It can animate images when:
 * 1. The page loads (triggerOnScroll = false)
 * 2. The image scrolls into view (triggerOnScroll = true)
 * 
 * AVAILABLE ANIMATIONS:
 * =====================
 * - 'fade-in': Image fades from transparent to visible
 * - 'slide-up': Image slides up from below while fading in
 * - 'slide-down': Image slides down from above while fading in
 * - 'slide-left': Image slides in from the right while fading in
 * - 'slide-right': Image slides in from the left while fading in
 * - 'zoom-in': Image scales up from smaller while fading in
 * - 'zoom-out': Image scales down from larger while fading in
 * - 'none': No animation
 * 
 * DEPENDENCIES:
 * =============
 * External Libraries:
 * - react: useState, useEffect, useRef hooks for state and DOM management
 * - next/image: Next.js optimized Image component for performance
 * 
 * Related Files:
 * - Can be used in any page or component that needs animated images
 * - Example usage in: src/pages/index.js
 * 
 * PROPS:
 * ======
 * @param {string} src - Image source (public path like "/images/photo.jpg" or URL)
 * @param {string} alt - Alt text for accessibility (default: '')
 * @param {string} animation - Animation type (default: 'fade-in')
 * @param {number} width - Image width in pixels (required if fill=false)
 * @param {number} height - Image height in pixels (required if fill=false)
 * @param {boolean} fill - Use fill mode to cover parent container (default: false)
 * @param {string} className - CSS classes for the image element (default: '')
 * @param {string} containerClassName - CSS classes for the wrapper div (default: '')
 * @param {boolean} priority - Load image with high priority (default: false)
 * @param {number} delay - Milliseconds to wait before animation starts (default: 100)
 * @param {boolean} triggerOnScroll - Animate when scrolled into view (default: true)
 * @param {number} threshold - How much of image must be visible to trigger (default: 0.1)
 * @param {number} duration - Animation duration in milliseconds (default: 700)
 * 
 * USAGE EXAMPLE:
 * ==============
 * <ImageDisplay
 *   src="/images/wedding.jpg"
 *   alt="Wedding photo"
 *   animation="slide-up"
 *   width={600}
 *   height={400}
 *   delay={200}
 *   duration={1000}
 *   triggerOnScroll={false}
 * />
 * 
 * ============================================================================
 */

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

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
  // No animation - show immediately
  'none': {
    initial: '',
    animate: '',
  },
};

/**
 * IMAGEDISPLAY COMPONENT
 * 
 * Main component that renders an animated image.
 * Uses React hooks to manage animation state and
 * IntersectionObserver API for scroll-triggered animations.
 */
export default function ImageDisplay({
  src,
  alt = '',
  animation = 'fade-in',
  width,
  height,
  fill = false,
  className = '',
  containerClassName = '',
  priority = false,
  delay = 100,
  triggerOnScroll = true,
  threshold = 0.1,
  duration = 700,
}) {
  // ========== STATE MANAGEMENT ==========
  // isVisible: Controls whether the image shows in animated or initial state
  // Starts as false so the image begins hidden, then animates to visible
  const [isVisible, setIsVisible] = useState(false);
  
  // hasAnimated: Prevents the animation from running multiple times
  // Once animated, it stays visible even if scrolled out and back in
  const [hasAnimated, setHasAnimated] = useState(false);
  
  // ref: Reference to the container div for IntersectionObserver
  // This lets us detect when the element enters the viewport
  const ref = useRef(null);

  // ========== ANIMATION TRIGGER LOGIC ==========
  useEffect(() => {
    // OPTION 1: Animate on page load (triggerOnScroll = false)
    // Wait for the specified delay, then show the image
    if (!triggerOnScroll) {
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasAnimated(true);
      }, delay);
      // Cleanup: Cancel timer if component unmounts
      return () => clearTimeout(timer);
    }

    // OPTION 2: Animate when scrolled into view (triggerOnScroll = true)
    // Use IntersectionObserver to detect when element enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        // entry.isIntersecting is true when element is visible
        // hasAnimated check prevents re-animating
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, delay);
        }
      },
      { threshold } // threshold: 0.1 means 10% of element must be visible
    );

    // Start observing the container element
    if (ref.current) {
      observer.observe(ref.current);
    }

    // Cleanup: Stop observing when component unmounts
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [triggerOnScroll, delay, threshold, hasAnimated]);

  // ========== BUILD CSS CLASSES ==========
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

  // ========== EXTERNAL URL CHECK ==========
  // Next.js Image optimization doesn't work with external URLs by default
  // If it's an external URL, we disable optimization (unoptimized: true)
  const isExternalUrl = src?.startsWith('http://') || src?.startsWith('https://');

  // ========== RENDER ==========
  return (
    <div ref={ref} className={`${containerClassName}`}>
      {/* FILL MODE: Image fills its parent container */}
      {fill ? (
        <div 
          className={`relative ${animationClasses} ${className}`}
          style={transitionStyle}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="object-cover"
            {...(isExternalUrl && { unoptimized: true })}
          />
        </div>
      ) : (
        /* FIXED SIZE MODE: Image has explicit width and height */
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className={`${animationClasses} ${className}`}
          style={transitionStyle}
          {...(isExternalUrl && { unoptimized: true })}
        />
      )}
    </div>
  );
}
