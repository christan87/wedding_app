/**
 * ============================================================================
 * FILE: DateFooter.js
 * LOCATION: src/components/public/Footer/DateFooter.js
 * PURPOSE: Footer component displaying wedding date with grayscale background
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This component displays a footer section with:
 * - Grayscale background image
 * - Wedding date (month · day) in extremely large text
 * - Year in extremely large text
 * - Bride and groom names in normal text
 * - OR scripture text when provided (replaces date/names)
 * 
 * LAYOUT STRUCTURE:
 * ================
 * - GrayscaleBackground as the base layer
 * - Content positioned at the bottom with:
 *   - Month · Day (extremely large)
 *   - Year (extremely large)
 *   - [Groom] & [Bride] (normal size)
 * - OR scripture content with:
 *   - Quote text
 *   - Reference
 *   - Hashtag
 * 
 * DEPENDENCIES:
 * =============
 * External Libraries:
 * - react: For building the component
 * 
 * Related Files:
 * - GrayscaleBackground: src/components/public/Images/GrayscaleBackground.js
 * - Used by: src/pages/index.js or other page components
 * 
 * PROPS:
 * ======
 * @param {string} backgroundImage - Path to the background image
 * @param {string} month - Month for the wedding date (e.g., "JUNE")
 * @param {string} day - Day for the wedding date (e.g., "09")
 * @param {string} year - Year for the wedding date (e.g., "2026")
 * @param {string} groom - Groom's name (e.g., "Chris")
 * @param {string} bride - Bride's name (e.g., "Jenn")
 * @param {object} scripture - Scripture object with quote, reference, and hashtag
 *   { quote: string, reference: string, hashtag: string }
 * 
 * USAGE EXAMPLE:
 * ==============
 * <DateFooter
 *   backgroundImage="/images/background.jpg"
 *   month="JUNE"
 *   day="09"
 *   year="2026"
 *   groom="Chris"
 *   bride="Jenn"
 * />
 * 
 * // With scripture (replaces date/names):
 * <DateFooter
 *   backgroundImage="/images/background.jpg"
 *   scripture={{
 *     quote: "I have found the one whom my soul loves.",
 *     reference: "Song of Solomon 3:4",
 *     hashtag: "#ThePriceIsRight"
 *   }}
 * />
 * 
 * ============================================================================
 */

import GrayscaleBackground from '../Images/GrayscaleBackground';

/**
 * DATEFOOTER COMPONENT
 * 
 * Renders a footer section with grayscale background and wedding date information,
 * or scripture text when provided.
 */
export default function DateFooter({
  backgroundImage,
  month,
  day,
  year,
  groom,
  bride,
  scripture,
}) {
  // ========== RENDER ==========
  return (
    /**
     * Main container:
     * - 'relative': For positioning content over background
     * - 'w-full': Full width of viewport
     * - 'min-h-screen': Minimum full viewport height
     */
    <div className="relative w-full min-h-screen">
      {/* 
        GRAYSCALE BACKGROUND
        ====================
        Full-screen grayscale background image
      */}
      <GrayscaleBackground
        src={backgroundImage}
        alt="Footer background"
        opacity={0.3}
        height="h-full"
        className="absolute inset-0"
        zIndex={0}
      />

      {/* 
        CONTENT SECTION
        ===============
        Content positioned at the bottom of the footer
        Renders scripture if provided, otherwise renders date/names
      */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pb-16 text-center">
        {scripture ? (
          <>
            {/* Scripture Quote - elegant italic styling */}
            <div className="mb-6 max-w-3xl">
              <p className="cormorant-garamond-regular text-3xl md:text-4xl lg:text-5xl text-gray-700 drop-shadow-lg leading-relaxed">
                "{scripture.quote}"
              </p>
            </div>

            {/* Scripture Reference - smaller, refined */}
            <div className="mb-4">
              <p className="cormorant-garamond-medium text-xl md:text-2xl text-gray-600 drop-shadow-md">
                — {scripture.reference}
              </p>
            </div>

            {/* Hashtag - stylish accent */}
            <div>
              <p className="cormorant-garamond-regular text-xl md:text-2xl text-gray-700 drop-shadow-lg">
                {scripture.hashtag}
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Month · Day - extremely large text */}
            <div className="mb-4">
              <h2 className="cormorant-garamond-bold text-8xl md:text-9xl lg:text-[12rem] text-gray-700 drop-shadow-2xl leading-none">
                {month}·{day}
              </h2>
            </div>

            {/* Year - extremely large text */}
            <div className="mb-8">
              <h2 className="cormorant-garamond-bold text-8xl md:text-9xl lg:text-[12rem] text-gray-700 drop-shadow-2xl leading-none">
                {year}
              </h2>
            </div>

            {/* Groom & Bride - normal text */}
            <div className="mb-8">
              <p className="windsong-medium text-5xl md:text-6xl text-gray-700 drop-shadow-md">
                {groom} & {bride}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
