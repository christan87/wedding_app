/**
 * ============================================================================
 * FILE: TextBanner.js
 * LOCATION: src/components/public/TextBanner.js
 * PURPOSE: A decorative text banner component with animated text and borders
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * Creates a 3-row, 3-column layout with animated text elements:
 * 
 * ROW 1: Center column only - AnimatedText with "fuzzy-slide" effect
 * ROW 2: All 3 columns:
 *   - Left: AnimatedText with "fuzzy-slide" + animated top/bottom borders
 *   - Center: AnimatedText with "slide-up" effect
 *   - Right: AnimatedText with "fuzzy-slide" + animated top/bottom borders
 * ROW 3: Center column only - AnimatedText with "fuzzy-slide" effect
 * 
 * The borders in columns 1 and 3 of row 2 slide up at the same time as
 * the center column text, creating a cohesive animation effect.
 * 
 * DEPENDENCIES:
 * =============
 * Components:
 * - AnimatedText: Handles text animations (fuzzy-slide, slide-up, etc.)
 *   Location: src/components/public/AnimatedText.js
 * 
 * Libraries:
 * - React: For component creation and hooks (useState, useEffect, useRef)
 * 
 * PROPS:
 * ======
 * @param {object} row1Props - Props for row 1 center text
 *   { text: string, className: string, delay: number, duration: number }
 * 
 * @param {object} row2LeftProps - Props for row 2 left text
 *   { text: string, className: string, delay: number, duration: number }
 * 
 * @param {object} row2CenterProps - Props for row 2 center text
 *   { text: string, className: string, delay: number, duration: number }
 * 
 * @param {object} row2RightProps - Props for row 2 right text
 *   { text: string, className: string, delay: number, duration: number }
 * 
 * @param {object} row3Props - Props for row 3 center text
 *   { text: string, className: string, delay: number, duration: number }
 * 
 * @param {string} borderColor - Color of the animated borders (default: 'white')
 * @param {string} className - Additional CSS classes for the container
 * 
 * USAGE EXAMPLE:
 * ==============
 * <TextBanner
 *   row1Props={{
 *     text: "Welcome",
 *     className: "text-2xl text-white",
 *     delay: 500,
 *     duration: 1000,
 *   }}
 *   row2LeftProps={{
 *     text: "John",
 *     className: "text-4xl text-white",
 *     delay: 800,
 *     duration: 1000,
 *   }}
 *   row2CenterProps={{
 *     text: "&",
 *     className: "text-3xl text-white",
 *     delay: 800,
 *     duration: 1000,
 *   }}
 *   row2RightProps={{
 *     text: "Jane",
 *     className: "text-4xl text-white",
 *     delay: 800,
 *     duration: 1000,
 *   }}
 *   row3Props={{
 *     text: "Forever",
 *     className: "text-2xl text-white",
 *     delay: 1100,
 *     duration: 1000,
 *   }}
 *   borderColor="white"
 * />
 * 
 * ============================================================================
 */

import { useState, useEffect, useRef } from 'react';
import AnimatedText from '@/components/public/AnimatedText';

/**
 * TEXTBANNER COMPONENT
 * 
 * A decorative banner with 3 rows and 3 columns of animated text.
 * Features animated borders that slide up alongside the center text.
 */
export default function TextBanner({
  // Props for row 1 center text (fuzzy-slide animation)
  row1Props = null,
  
  // Props for row 2 left text (fuzzy-slide animation with borders)
  row2LeftProps = null,
  
  // Props for row 2 center text (slide-up animation)
  row2CenterProps = null,
  
  // Props for row 2 right text (fuzzy-slide animation with borders)
  row2RightProps = null,
  
  // Props for row 3 center text (fuzzy-slide animation)
  row3Props = null,
  
  // Color of the animated borders (default: white)
  borderColor = 'white',
  
  // Additional CSS classes for the container
  className = '',
}) {
  // ========== STATE FOR BORDER ANIMATION ==========
  // Track whether the component is visible to trigger border animations
  const [isVisible, setIsVisible] = useState(false);
  
  // Reference to the component container for IntersectionObserver
  const containerRef = useRef(null);

  // ========== DESTRUCTURE PROPS WITH DEFAULTS ==========
  // Extract row 1 props (center column, fuzzy-slide)
  const {
    text: row1Text,
    className: row1ClassName = '',
    delay: row1Delay = 0,
    duration: row1Duration = 1000,
    ...restRow1Props
  } = row1Props || {};

  // Extract row 2 left props (fuzzy-slide with borders)
  const {
    text: row2LeftText,
    className: row2LeftClassName = '',
    delay: row2LeftDelay = 0,
    duration: row2LeftDuration = 1000,
    ...restRow2LeftProps
  } = row2LeftProps || {};

  // Extract row 2 center props (slide-up)
  const {
    text: row2CenterText,
    className: row2CenterClassName = '',
    delay: row2CenterDelay = 0,
    duration: row2CenterDuration = 1000,
    ...restRow2CenterProps
  } = row2CenterProps || {};

  // Extract row 2 right props (fuzzy-slide with borders)
  const {
    text: row2RightText,
    className: row2RightClassName = '',
    delay: row2RightDelay = 0,
    duration: row2RightDuration = 1000,
    ...restRow2RightProps
  } = row2RightProps || {};

  // Extract row 3 props (center column, fuzzy-slide)
  const {
    text: row3Text,
    className: row3ClassName = '',
    delay: row3Delay = 0,
    duration: row3Duration = 1000,
    ...restRow3Props
  } = row3Props || {};

  // ========== INTERSECTION OBSERVER FOR BORDER ANIMATION ==========
  // This triggers the border slide-up animation when the component becomes visible
  useEffect(() => {
    // Create an observer that watches when the component enters the viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When component is visible, set isVisible to true
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        // Trigger when 10% of the component is visible
        threshold: 0.1,
      }
    );

    // Start observing the container element
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Cleanup: stop observing when component unmounts
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // ========== BORDER ANIMATION STYLES ==========
  // These styles create the slide-up effect for the borders
  // The borders start translated down and invisible, then slide up when visible
  const borderStyle = {
    // Transform: slide up from below when visible
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    // Opacity: fade in when visible
    opacity: isVisible ? 1 : 0,
    // Transition: smooth animation matching the center text timing
    transition: `transform ${row2CenterDuration}ms ease-out, opacity ${row2CenterDuration}ms ease-out`,
    // Delay: match the center text delay so borders animate together
    transitionDelay: `${row2CenterDelay}ms`,
  };

  return (
    // ========== MAIN CONTAINER ==========
    // Uses CSS Grid with 3 columns: 1fr auto 1fr
    // This ensures the center column (auto) fits the widest content
    // and all center columns share the same width across rows
    // Left/right columns (1fr) take equal remaining space
    // ref: Used by IntersectionObserver to detect visibility
    <div 
      ref={containerRef}
      className={`w-full ${className}`}
      style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr' }}
    >
      {/* ========== ROW 1: CENTER TEXT ONLY ==========
          Uses fuzzy-slide animation
          Center column auto-sizes to fit content (shared width with other rows)
      */}
      {row1Props && row1Text && (
        <>
          {/* Empty left column */}
          <div></div>
          
          {/* Center column with fuzzy-slide text */}
          <div className="flex justify-center items-center">
            <AnimatedText
              animation="fuzzy-slide"
              className={row1ClassName}
              delay={row1Delay}
              duration={row1Duration}
              triggerOnScroll={false}
              {...restRow1Props}
            >
              {row1Text}
            </AnimatedText>
          </div>
          
          {/* Empty right column */}
          <div></div>
        </>
      )}

      {/* ========== ROW 2: ALL THREE COLUMNS ==========
          Left: fuzzy-slide text with animated borders (justified right)
          Center: slide-up text (auto width shared with other rows)
          Right: fuzzy-slide text with animated borders (justified left)
      */}
      {(row2LeftProps || row2CenterProps || row2RightProps) && (
        <>
          {/* LEFT COLUMN: Text with top and bottom borders - justified to the right */}
          <div className="flex flex-col items-end justify-center pr-4">
            {row2LeftProps && row2LeftText && (
              <>
                {/* Top border - slides up with center text */}
                <div 
                  className={`w-16 h-px bg-${borderColor} mb-2`}
                  style={borderStyle}
                ></div>
                
                {/* Left text with fuzzy-slide animation */}
                <AnimatedText
                  animation="fuzzy-slide"
                  className={row2LeftClassName}
                  delay={row2LeftDelay}
                  duration={row2LeftDuration}
                  triggerOnScroll={false}
                  {...restRow2LeftProps}
                >
                  {row2LeftText}
                </AnimatedText>
                
                {/* Bottom border - slides up with center text */}
                <div 
                  className={`w-16 h-px bg-${borderColor} mt-2`}
                  style={borderStyle}
                ></div>
              </>
            )}
          </div>

          {/* CENTER COLUMN: Text with slide-up animation */}
          <div className="flex justify-center items-center">
            {row2CenterProps && row2CenterText && (
              <AnimatedText
                animation="slide-up"
                className={row2CenterClassName}
                delay={row2CenterDelay}
                duration={row2CenterDuration}
                triggerOnScroll={false}
                {...restRow2CenterProps}
              >
                {row2CenterText}
              </AnimatedText>
            )}
          </div>

          {/* RIGHT COLUMN: Text with top and bottom borders - justified to the left */}
          <div className="flex flex-col items-start justify-center pl-4">
            {row2RightProps && row2RightText && (
              <>
                {/* Top border - slides up with center text */}
                <div 
                  className={`w-16 h-px bg-${borderColor} mb-2`}
                  style={borderStyle}
                ></div>
                
                {/* Right text with fuzzy-slide animation */}
                <AnimatedText
                  animation="fuzzy-slide"
                  className={row2RightClassName}
                  delay={row2RightDelay}
                  duration={row2RightDuration}
                  triggerOnScroll={false}
                  {...restRow2RightProps}
                >
                  {row2RightText}
                </AnimatedText>
                
                {/* Bottom border - slides up with center text */}
                <div 
                  className={`w-16 h-px bg-${borderColor} mt-2`}
                  style={borderStyle}
                ></div>
              </>
            )}
          </div>
        </>
      )}

      {/* ========== ROW 3: CENTER TEXT ONLY ==========
          Uses fuzzy-slide animation
          Center column auto-sizes to fit content (shared width with other rows)
      */}
      {row3Props && row3Text && (
        <>
          {/* Empty left column */}
          <div></div>
          
          {/* Center column with fuzzy-slide text */}
          <div className="flex justify-center items-center">
            <AnimatedText
              animation="fuzzy-slide"
              className={row3ClassName}
              delay={row3Delay}
              duration={row3Duration}
              triggerOnScroll={false}
              {...restRow3Props}
            >
              {row3Text}
            </AnimatedText>
          </div>
          
          {/* Empty right column */}
          <div></div>
        </>
      )}
    </div>
  );
}
