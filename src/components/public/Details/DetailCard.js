/**
 * ============================================================================
 * FILE: DetailCard.js
 * LOCATION: src/components/public/Details/DetailCard.js
 * PURPOSE: Reusable detail card component with decorative divider and text content
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This component displays a detail card with a decorative rule section at the top
 * and text content below. The rule section contains vertical rules and a centered
 * divider image, while the content section displays a title and description text.
 * 
 * LAYOUT STRUCTURE:
 * ================
 * The card has 4 rows total:
 * - Rows 1-3: Rule section with 2 columns
 *   - Row 1: Col 1 (empty) | Col 2 (vertical rule)
 *   - Row 2: Col 1 (empty) | Col 2 (divider image, centered)
 *   - Row 3: Col 1 (empty) | Col 2 (vertical rule)
 * - Row 4: Content section (1 column) with title and text, right-aligned
 * 
 * DEPENDENCIES:
 * =============
 * External Libraries:
 * - react: For building the component
 * - next/image: For optimized image rendering
 * 
 * Related Files:
 * - Used by: src/components/public/Details/DetailList.js
 * - Similar to: src/components/public/EventCalendar/EventCalendarCard.js (similar divider pattern)
 * 
 * PROPS:
 * ======
 * @param {string} dividerImage - Path to the divider image (e.g., "/images/icons/waxseal.png")
 * @param {string} title - The title text to display (e.g., "Accommodations")
 * @param {string} text - The descriptive text content (e.g., "Hotel information...")
 * 
 * USAGE EXAMPLE:
 * ==============
 * <DetailCard
 *   dividerImage="/images/icons/waxseal.png"
 *   title="Accommodations"
 *   text="We have reserved rooms at the Grand Hotel for our guests..."
 * />
 * 
 * ============================================================================
 */

import Image from 'next/image';

/**
 * DETAILCARD COMPONENT
 * 
 * Renders a detail card with decorative rule section and text content.
 * Uses CSS Grid for the 4-row layout structure.
 */
export default function DetailCard({
  dividerImage,
  title,
  text,
}) {
  // ========== RENDER ==========
  return (
    /**
     * Main container:
     * - 'grid grid-rows-4': Creates 4 equal-height rows
     * - 'gap-0': No gap between rows for seamless appearance
     * - 'w-full': Full width of parent
     * - 'min-h-[300px]': Minimum height for proper proportions
     */
    <div className="grid grid-rows-[1fr_auto_1fr_auto] gap-0 w-full min-h-[220px]">
      {/* 
        ROWS 1-3: RULE SECTION
        =======================
        Using a single 3-column grid with col 2 as a flex column container.
        This ensures all col 2 content (rules and divider) are centered together.
        Col 1: Empty space (flexible)
        Col 2: Decorative elements (auto width, centered using flex column)
        Col 3: Empty space with 50px max width
      */}
      
      <div className="grid grid-cols-[1fr_auto_20px] row-span-3">
        {/* Col 1: Empty space */}
        <div className="w-full" />
        
        {/* Col 2: Flex column container for all decorative elements */}
        <div className="flex flex-col items-center h-full">
          {/* Row 1: Top vertical rule - flex-1 to fill space */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-px h-full bg-black/50" />
          </div>
          
          {/* Row 2: Divider image - fits content */}
          {dividerImage && (
            <div className="relative w-8 h-8 shrink-0">
              <Image
                src={dividerImage}
                alt="Decorative divider element"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}
          
          {/* Row 3: Bottom vertical rule - flex-1 to fill space */}
          <div className="flex-1 flex max-h-[20px] items-center justify-center">
            <div className="w-px h-full bg-black/50" />
          </div>
        </div>
        
        {/* Col 3: Empty space with 50px max width */}
        <div className="w-full max-w-[20px]" />
      </div>

      {/* 
        ROW 4: CONTENT SECTION
        ========================
        Single column containing title and text, right-aligned.
      */}
      <div className="flex flex-col items-end justify-center w-full px-4">
        {/* Title */}
        <h3 className="cormorant-garamond-semibold text-lg md:text-xl text-gray-700 drop-shadow-md mb-2">
          {title}
        </h3>
        {/* Text content */}
        <p className="cormorant-garamond-regular text-sm md:text-base text-gray-600/90 drop-shadow-sm text-right">
          {text}
        </p>
      </div>
    </div>
  );
}
