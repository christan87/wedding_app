/**
 * ============================================================================
 * FILE: RSVP.js
 * LOCATION: src/components/public/RSVP/RSVP.js
 * PURPOSE: RSVP section component with background image and call-to-action
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This component displays an RSVP call-to-action section with:
 * - Background image
 * - Large stylized "RSVP" text with "please" above and "BY" with date below
 * - RSVP button
 * - Instructions for guests
 * 
 * LAYOUT STRUCTURE:
 * ================
 * - Background image container
 * - Centered content with:
 *   - "please" text
 *   - "RS" text (large)
 *   - "VP" text (large)
 *   - "BY" text with month and day
 *   - RSVP button
 *   - Instructions and thank you message
 * 
 * DEPENDENCIES:
 * =============
 * External Libraries:
 * - react: For building the component
 * - next/image: For optimized image rendering
 * 
 * Related Files:
 * - Used by: src/pages/index.js or other page components
 * 
 * PROPS:
 * ======
 * @param {string} backgroundImage - Path to the background image
 * @param {string} month - Month for RSVP deadline (e.g., "January")
 * @param {string} day - Day for RSVP deadline (e.g., "15")
 * 
 * USAGE EXAMPLE:
 * ==============
 * <RSVP
 *   backgroundImage="/images/background.jpg"
 *   month="January"
 *   day="15"
 * />
 * 
 * ============================================================================
 */

import Image from 'next/image';
import AnimatedText from '../AnimatedText';
import AnimatedButton from '../AnimatedButton';

/**
 * RSVP COMPONENT
 * 
 * Renders an RSVP section with background image and call-to-action content.
 */
export default function RSVP({
  backgroundImage,
  month,
  day,
}) {
  // ========== RENDER ==========
  return (
    /**
     * Main container:
     * - 'relative': For positioning background image
     * - 'w-full': Full width of viewport
     * - 'min-h-screen': Minimum full viewport height
     * - 'flex items-center justify-center': Center content
     */
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* 
        BACKGROUND IMAGE
        ================
        Full-screen background with overlay for text readability
      */}
      {backgroundImage && (
        <>
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage}
              alt="RSVP background"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
          {/* Dark overlay for text contrast */}
          <div className="absolute inset-0 bg-black/30 z-0" />
        </>
      )}

      {/* 
        CONTENT SECTION
        ===============
        Centered content with RSVP text and button
      */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-16 text-center">
        {/* "please" text */}
        <div className="mb-4 align-text-bottom">
          <span className="windsong-medium  text-4xl md:text-5xl text-white drop-shadow-lg">
            Please
          </span>
        </div>

        {/* "RS" text - extremely large */}
        <div className="mb-0">
          <AnimatedText
            animation="pop"
            duration={1000}
            delay={300}
            triggerOnScroll={true}
            as="h1"
            className="cormorant-garamond-bold text-8xl md:text-9xl lg:text-[12rem] text-white drop-shadow-2xl leading-none"
          >
            RS
          </AnimatedText>
        </div>

        {/* "VP" text - extremely large */}
        <div className="mb-4">
          <AnimatedText
            animation="pop"
            duration={1000}
            delay={600}
            triggerOnScroll={true}
            as="h1"
            className="cormorant-garamond-bold text-8xl md:text-9xl lg:text-[12rem] text-white drop-shadow-2xl leading-none"
          >
            VP
          </AnimatedText>
        </div>

        {/* "BY" with month and day */}
        <div className="mb-8">
          <span className="cormorant-garamond-semibold text-3xl md:text-4xl text-white drop-shadow-lg">
            BY {month} {day}
          </span>
        </div>

        {/* RSVP Button */}
        <div className="mb-8">
          <AnimatedButton
            btnText="RSVP"
            url="/rsvp"
            animation="fade-up"
            delay={900}
            duration={800}
            triggerOnScroll={true}
          />
        </div>

        {/* Instructions */}
        <div className="max-w-2xl">
          <p className="cormorant-garamond-regular text-lg md:text-xl text-white drop-shadow-md mb-4">
            Please click the RSVP button and fill out the form to confirm your attendance.
          </p>
          <p className="windsong-medium text-xl md:text-2xl text-white drop-shadow-lg">
            Thank You!
          </p>
        </div>
      </div>
    </div>
  );
}
