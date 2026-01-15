/**
 * ============================================================================
 * FILE: PageBanner.js
 * LOCATION: src/components/public/PageBanner.js
 * PURPOSE: Rectangular banner component for page headers with background image
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This component displays a rectangular banner at the top of a page with:
 * - Background image
 * - Title text (left-aligned, large font)
 * - Bride and groom names below title
 * 
 * LAYOUT STRUCTURE:
 * ================
 * - Background image container
 * - Content positioned to the left with:
 *   - Title (large)
 *   - [Groom] and [Bride] (beneath title)
 * 
 * DEPENDENCIES:
 * =============
 * External Libraries:
 * - react: For building the component
 * - next/image: For optimized image rendering
 * 
 * Related Files:
 * - Used by: src/pages/rsvp.js or other page components
 * 
 * PROPS:
 * ======
 * @param {string} backgroundImage - Path to the background image
 * @param {string} title - Title text to display (e.g., "RSVP")
 * @param {string} bride - Bride's name (e.g., "Jenn")
 * @param {string} groom - Groom's name (e.g., "Chris")
 * 
 * USAGE EXAMPLE:
 * ==============
 * <PageBanner
 *   backgroundImage="/images/background.jpg"
 *   title="RSVP"
 *   groom="Chris"
 *   bride="Jenn"
 * />
 * 
 * ============================================================================
 */

import Image from 'next/image';

/**
 * PAGEBANNER COMPONENT
 * 
 * Renders a rectangular banner with background image and text content.
 */
export default function PageBanner({
  backgroundImage,
  title,
  bride,
  groom,
}) {
  // ========== RENDER ==========
  return (
    /**
     * Main container:
     * - 'relative': For positioning background image
     * - 'w-full': Full width of viewport
     * - 'h-64 md:h-80': Responsive height (256px mobile, 320px desktop)
     * - 'overflow-hidden': Prevents image overflow
     */
    <div className="relative w-full h-64 md:h-80 overflow-hidden">
      {/* 
        BACKGROUND IMAGE
        ================
        Full banner background with dark overlay for text readability
      */}
      {backgroundImage && (
        <>
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage}
              alt="Page banner background"
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </div>
          {/* Dark overlay for text contrast */}
          <div className="absolute inset-0 bg-black/40 z-0" />
        </>
      )}

      {/* 
        CONTENT SECTION
        ===============
        Text content positioned to the left
      */}
      <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16">
        {/* Title - large text */}
        <h1 className="windsong-medium text-5xl md:text-7xl text-white drop-shadow-2xl mb-2">
          {title}
        </h1>

        {/* Groom and Bride names */}
        <p className="cormorant-garamond-regular text-3xl md:text-4xl text-white drop-shadow-lg">
          {groom} <span className="windsong-medium">and </span> {bride}
        </p>
      </div>
    </div>
  );
}
