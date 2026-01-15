/**
 * ============================================================================
 * FILE: RSVPFormMessage.js
 * LOCATION: src/components/public/RSVP/RSVPFormMessage.js
 * PURPOSE: Display wedding details message for RSVP form
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This component displays wedding information including:
 * - Wedding title with bride and groom names
 * - Location
 * - Date
 * - Time
 * - Additional message text
 * 
 * LAYOUT STRUCTURE:
 * ================
 * - "[Groom] & [Bride]'s Wedding" in large text (left-aligned)
 * - Location in slightly smaller text
 * - Date below location
 * - Time below date
 * - Message text in normal font
 * 
 * DEPENDENCIES:
 * =============
 * External Libraries:
 * - react: For building the component
 * 
 * Related Files:
 * - Used by: src/pages/rsvp.js
 * 
 * PROPS:
 * ======
 * @param {string} location - Wedding location (e.g., "Grand Ballroom")
 * @param {string} date - Wedding date (e.g., "June 9, 2026")
 * @param {string} time - Wedding time (e.g., "3:00 PM")
 * @param {string} groom - Groom's name (e.g., "Chris")
 * @param {string} bride - Bride's name (e.g., "Jenn")
 * @param {string} text - Additional message text
 * 
 * USAGE EXAMPLE:
 * ==============
 * <RSVPFormMessage
 *   location="Grand Ballroom"
 *   date="June 9, 2026"
 *   time="3:00 PM"
 *   groom="Chris"
 *   bride="Jenn"
 *   text="Please confirm your attendance by filling out the form below."
 * />
 * 
 * ============================================================================
 */

/**
 * RSVPFORMMESSAGE COMPONENT
 * 
 * Renders wedding details and message for RSVP form.
 */
export default function RSVPFormMessage({
  location,
  date,
  time,
  groom,
  bride,
  text,
}) {
  // ========== RENDER ==========
  return (
    /**
     * Main container:
     * - 'w-full': Full width
     * - 'px-4 md:px-8': Responsive padding
     * - 'py-8': Vertical padding
     */
    <div className="w-full px-4 md:px-8 py-8">
      {/* Wedding title - large text */}
      <h2 className="cormorant-garamond-bold text-4xl md:text-5xl text-gray-700 drop-shadow-md mb-6">
        {groom} & {bride}'s Wedding
      </h2>

      {/* Location - slightly smaller text */}
      <p className="cormorant-garamond-semibold text-2xl md:text-3xl text-gray-600 drop-shadow-sm mb-2">
        {location}
      </p>

      {/* Date - slightly smaller text */}
      <p className="cormorant-garamond-semibold text-2xl md:text-3xl text-gray-600 drop-shadow-sm mb-2">
        {date}
      </p>

      {/* Time - slightly smaller text */}
      <p className="cormorant-garamond-semibold text-2xl md:text-3xl text-gray-600 drop-shadow-sm mb-6">
        {time}
      </p>

      {/* Message text - normal font */}
      <p className="cormorant-garamond-regular text-lg md:text-xl text-gray-600 leading-relaxed">
        {text}
      </p>
    </div>
  );
}
