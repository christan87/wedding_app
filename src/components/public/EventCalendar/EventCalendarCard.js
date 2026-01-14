/**
 * ============================================================================
 * FILE: EventCalendarCard.js
 * LOCATION: src/components/public/EventCalendar/EventCalendarCard.js
 * PURPOSE: Display a single event card with time, event details, and decorative elements
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This component renders an event card in a 3-column, 3-row grid layout.
 * It displays event information (time, event name, location) with decorative
 * images and rules (lines) to create an elegant calendar-style appearance.
 * 
 * The "flip" prop allows swapping the content of columns 1 and 3, enabling
 * alternating layouts for visual variety when displaying multiple events.
 * 
 * GRID LAYOUT STRUCTURE:
 * ======================
 * The component uses a 3x3 grid with the following structure:
 * 
 *   |   Col 1 (Text)    |   Col 2 (Divider)   |   Col 3 (Icon)    |
 *   |-------------------|---------------------|-------------------|
 *   | Row 1: time       | Row 1: vertical     | Row 1: (empty)    |
 *   |                   | rule (line)         |                   |
 *   |-------------------|---------------------|-------------------|
 *   | Row 2: horizontal | Row 2: dividerImage | Row 2: iconImage  |
 *   | rule + ruleImage  | (centered)          | (centered)        |
 *   |-------------------|---------------------|-------------------|
 *   | Row 3: event +    | Row 3: vertical     | Row 3: (empty)    |
 *   | location text     | rule (line)         |                   |
 *   |-------------------|---------------------|-------------------|
 * 
 * When flip=true, Col 1 and Col 3 swap their content.
 * 
 * DEPENDENCIES:
 * =============
 * External Libraries:
 * - react: For building the component
 * - next/image: Next.js optimized Image component for performance
 * 
 * Related Files:
 * - Used by: src/components/public/EventCalendar/EventCalendar.js
 * - Parent component provides the images and event data
 * 
 * PROPS:
 * ======
 * @param {boolean} flip - If true, swaps Col 1 and Col 3 content (default: false)
 *                         Useful for alternating layouts in a list of events
 * @param {string} dividerImage - Path to the divider image (displayed in Col 2, Row 2)
 *                                Example: "/images/divider-ornament.png"
 * @param {string} iconImage - Path to the icon image (displayed in Col 3, Row 2)
 *                             Example: "/images/ceremony-icon.png"
 * @param {string} ruleImage - Path to the rule image (displayed in Col 1, Row 2)
 *                             This image appears between horizontal lines
 *                             Example: "/images/decorative-diamond.png"
 * @param {string} time - The event time to display (e.g., "3:00 PM")
 * @param {string} event - The event name (e.g., "Wedding Ceremony")
 * @param {string} location - The event location (e.g., "St. Mary's Church")
 * 
 * USAGE EXAMPLE:
 * ==============
 * // Standard layout (icon on right)
 * <EventCalendarCard
 *   flip={false}
 *   dividerImage="/images/divider.png"
 *   iconImage="/images/ceremony.png"
 *   ruleImage="/images/diamond.png"
 *   time="3:00 PM"
 *   event="Wedding Ceremony"
 *   location="St. Mary's Church"
 * />
 * 
 * // Flipped layout (icon on left)
 * <EventCalendarCard
 *   flip={true}
 *   dividerImage="/images/divider.png"
 *   iconImage="/images/reception.png"
 *   ruleImage="/images/diamond.png"
 *   time="6:00 PM"
 *   event="Reception"
 *   location="Grand Ballroom"
 * />
 * 
 * ============================================================================
 */

import Image from 'next/image';

/**
 * EVENTCALENDARCARD COMPONENT
 * 
 * Renders an event card with a 3-column, 3-row grid layout.
 * The flip prop allows swapping columns 1 and 3 for alternating layouts.
 * 
 * Grid Structure:
 * - Col 1: Text content (time in row 1, rule decoration in row 2, event/location in row 3)
 * - Col 2: Divider (vertical lines in rows 1 & 3, divider image in row 2)
 * - Col 3: Icon (icon image centered in row 2)
 */
export default function EventCalendarCard({
  flip = false,
  dividerImage,
  iconImage,
  ruleImage,
  time,
  event,
  location,
}) {
  // ========== COLUMN CONTENT DEFINITIONS ==========
  // Define the content for each column, which can be swapped based on the flip prop

  /**
   * TEXT COLUMN CONTENT (normally Col 1)
   * ------------------------------------
   * Row 1: Displays the event time (centered horizontally, aligned to bottom)
   * Row 2: Displays horizontal rules with a decorative image in the center (fits content vertically)
   * Row 3: Displays the event name and location (centered horizontally, aligned to top)
   * 
   * The column width fits the content of row 1 or 3 (whichever is wider).
   * Text content is centered horizontally within the column.
   */
  const TextColumn = () => (
    <div className="flex flex-col h-full items-center">
      {/* Row 1: Time display - flex-1 to fill space, content at bottom center */}
      <div className="flex-1 flex items-end justify-center w-full">
        <span className="cormorant-garamond-regular text-lg md:text-xl text-gray-700 drop-shadow-md whitespace-nowrap">
          {time}
        </span>
      </div>

      {/* Row 2: Horizontal rule with centered rule image - fits content vertically */}
      <div className="flex items-center justify-center w-full">
        {/* Left horizontal rule - extends to the left edge */}
        <div className="flex-1 h-px bg-black/50" />
        
        {/* Center: Rule image (decorative element like a diamond or ornament) */}
        {ruleImage && (
          <div className="relative w-6 h-6 mx-2 shrink-0">
            <Image
              src={ruleImage}
              alt="Decorative rule element"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        )}
        
        {/* Right horizontal rule - extends to the right edge */}
        <div className="flex-1 h-px bg-black/50" />
      </div>

      {/* Row 3: Event name and location - flex-1 to fill space, content at top center */}
      <div className="flex-1 flex items-start justify-center w-full">
        <div className="flex flex-col items-center">
          <span className="cormorant-garamond-semibold text-base md:text-lg text-gray-700 drop-shadow-md whitespace-nowrap">
            {event}
          </span>
          <span className="cormorant-garamond-light text-sm md:text-base text-gray-700/80 drop-shadow-sm whitespace-nowrap">
            {location}
          </span>
        </div>
      </div>
    </div>
  );

  /**
   * DIVIDER COLUMN CONTENT (always Col 2 - center column)
   * ------------------------------------------------------
   * Row 1: Vertical rule extending from top (matches width of dividerImage)
   * Row 2: Divider image fits content both horizontally and vertically
   * Row 3: Vertical rule extending to bottom (matches width of dividerImage)
   * 
   * The column uses inline-flex with items-center to:
   * - Center the vertical rules under the dividerImage
   * - Let Row 2 determine the column width (fit content)
   */
  const DividerColumn = () => (
    <div className="flex flex-col items-center h-full">
      {/* Row 1: Vertical rule from top - flex-1 to fill remaining space */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-px h-full bg-black/50" />
      </div>
      
      {/* Row 2: Divider image - fits content, determines column alignment */}
      {dividerImage && (
        <div className="relative w-12 h-12 shrink-0">
          <Image
            src={dividerImage}
            alt="Divider ornament"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      )}
      
      {/* Row 3: Vertical rule to bottom - flex-1 to fill remaining space */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-px h-full bg-black/50" />
      </div>
    </div>
  );

  /**
   * ICON COLUMN CONTENT (normally Col 3)
   * -------------------------------------
   * Row 1: Empty space
   * Row 2: Icon image justified to left (or right when flipped)
   * Row 3: Empty space
   * 
   * @param {boolean} isFlipped - When true, icon is on left side so justify right
   */
  const IconColumn = ({ isFlipped }) => (
    <div className="flex flex-col h-full">
      {/* Row 1: Empty spacer */}
      <div className="flex-1" />
      
      {/* Row 2: Icon image - left justified normally, right justified when flipped */}
      <div className={`flex items-center ${isFlipped ? 'justify-end' : 'justify-start'}`}>
        {iconImage && (
          <div className="relative w-16 h-16">
            <Image
              src={iconImage}
              alt="Event icon"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        )}
      </div>
      
      {/* Row 3: Empty spacer */}
      <div className="flex-1" />
    </div>
  );

  // ========== RENDER ==========
  // The grid layout with 3 columns
  // If flip is true, swap the order of Col 1 (Text) and Col 3 (Icon)

  return (
    /**
     * Main container:
     * - 'grid grid-cols-[1fr_auto_1fr]': Symmetric 3-column grid where:
     *   - Col 1 (1fr): Equal flexible width
     *   - Col 2 (auto): Fits dividerImage content, always centered
     *   - Col 3 (1fr): Equal flexible width
     * - 'gap-2 md:gap-4': Smaller gap on mobile, larger on desktop
     * - 'min-h-[150px] md:min-h-[200px]': Responsive minimum height
     * 
     * Using symmetric columns (1fr_auto_1fr) ensures Col 2 is always
     * centered across all cards, creating a flowing visual display.
     */
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 md:gap-4 min-h-[150px] md:min-h-[200px]">
      {/* 
        Column order depends on flip prop:
        - flip=false: TextColumn | DividerColumn | IconColumn
        - flip=true:  IconColumn | DividerColumn | TextColumn
        
        Col 2 (divider) is always centered due to symmetric 1fr columns.
        This ensures all cards' dividers align vertically.
      */}
      {flip ? (
        <>
          {/* Flipped: Icon on left, Text on right */}
          <IconColumn isFlipped={true} />
          <DividerColumn />
          <TextColumn />
        </>
      ) : (
        <>
          {/* Normal: Text on left, Icon on right */}
          <TextColumn />
          <DividerColumn />
          <IconColumn isFlipped={false} />
        </>
      )}
    </div>
  );
}
