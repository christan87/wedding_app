/**
 * ============================================================================
 * FILE: EventCalendar.js
 * LOCATION: src/components/public/EventCalendar/EventCalendar.js
 * PURPOSE: Display a collection of event cards over a grayscale background
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This component combines a GrayscaleBackground with EventCalendarCard components
 * to create an elegant event schedule display. The background provides a subtle
 * animated backdrop while the event cards are overlaid on top.
 * 
 * This is useful for:
 * - Displaying wedding event schedules (ceremony, reception, etc.)
 * - Creating a visually appealing timeline of events
 * - Showing multiple events with alternating layouts for visual interest
 * 
 * COMPONENT STRUCTURE:
 * ====================
 * 1. GrayscaleBackground: Provides the animated grayscale backdrop
 * 2. Content Container: Positioned absolutely over the background
 * 3. EventCalendarCard(s): Individual event cards rendered inside the container
 * 
 * LAYER STRUCTURE:
 * ================
 * - Layer 1 (z-0): GrayscaleBackground (animated GIF in grayscale)
 * - Layer 2 (z-10): Event cards container with EventCalendarCard components
 * 
 * DEPENDENCIES:
 * =============
 * External Libraries:
 * - react: For building the component
 * 
 * Internal Components:
 * - GrayscaleBackground: Displays grayscale animated background
 *   Location: src/components/public/Images/GrayscaleBackground.js
 * - EventCalendarCard: Individual event card component
 *   Location: src/components/public/EventCalendar/EventCalendarCard.js
 * - AnimatedText: Text component with entrance animations
 *   Location: src/components/public/AnimatedText.js
 * 
 * Related Files:
 * - Used by: src/pages/index.js (or any page needing an event calendar)
 * 
 * PROPS:
 * ======
 * @param {string} backgroundSrc - Path to the background GIF/image
 *                                 Example: "/images/silhouette.gif"
 * @param {string} backgroundAlt - Alt text for the background image (default: 'Event calendar background')
 * @param {number} backgroundOpacity - Opacity of the background (0-1, default: 0.1)
 * @param {string} height - Height of the calendar section (default: 'h-auto')
 *                          Can use Tailwind classes like 'h-screen', 'h-96', etc.
 * @param {Array} events - Array of event objects to display
 *                         Each event object should have:
 *                         - flip: boolean (optional, alternates layout)
 *                         - dividerImage: string (path to divider image)
 *                         - iconImage: string (path to icon image)
 *                         - ruleImage: string (path to rule decoration image)
 *                         - time: string (event time)
 *                         - event: string (event name)
 *                         - location: string (event location)
 * @param {string} className - Additional CSS classes for the container (default: '')
 * 
 * USAGE EXAMPLE:
 * ==============
 * const weddingEvents = [
 *   {
 *     flip: false,
 *     dividerImage: "/images/divider.png",
 *     iconImage: "/images/ceremony.png",
 *     ruleImage: "/images/diamond.png",
 *     time: "3:00 PM",
 *     event: "Wedding Ceremony",
 *     location: "St. Mary's Church"
 *   },
 *   {
 *     flip: true,
 *     dividerImage: "/images/divider.png",
 *     iconImage: "/images/reception.png",
 *     ruleImage: "/images/diamond.png",
 *     time: "6:00 PM",
 *     event: "Reception",
 *     location: "Grand Ballroom"
 *   }
 * ];
 * 
 * <EventCalendar
 *   backgroundSrc="/images/silhouette.gif"
 *   backgroundOpacity={0.1}
 *   height="h-auto"
 *   events={weddingEvents}
 * />
 * 
 * ============================================================================
 */

import GrayscaleBackground from '../Images/GrayscaleBackground';
import EventCalendarCard from './EventCalendarCard';
import AnimatedText from '../AnimatedText';

/**
 * EVENTCALENDAR COMPONENT
 * 
 * Renders a collection of event cards over a grayscale animated background.
 * The component uses a layered approach:
 * 1. Background layer with GrayscaleBackground component
 * 2. Overlay layer with EventCalendarCard components
 */
export default function EventCalendar({
  backgroundSrc,
  backgroundAlt = 'Event calendar background',
  backgroundOpacity = 0.1,
  height = 'h-auto',
  events = [],
  className = '',
}) {
  // ========== RENDER ==========
  return (
    /**
     * Main container:
     * - 'relative': Establishes positioning context for absolute background
     * - 'w-full': Full width of parent
     * - 'min-h-0': Allows container to shrink if needed
     * - 'overflow-hidden': Prevents content from spilling outside
     * - className: Any additional custom classes
     * 
     * Height grows automatically based on content (event cards).
     * The GrayscaleBackground is absolutely positioned to fill this container.
     */
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* 
        LAYER 1: Grayscale Background
        ==============================
        The GrayscaleBackground component provides an animated backdrop.
        It's positioned absolutely within the container.
        
        Props:
        - src: Path to the GIF/image for the background
        - alt: Accessibility description
        - opacity: Controls visibility (lower = more subtle)
        - height: 'h-full' makes it fill the container height
        - zIndex: 0 places it behind the event cards
      */}
      <GrayscaleBackground
        src={backgroundSrc}
        alt={backgroundAlt}
        opacity={backgroundOpacity}
        height="h-full"
        fixed={false}
        zIndex={0}
        className="absolute inset-0"
      />

      {/* 
        LAYER 2: Event Cards Container
        ================================
        This container is positioned relatively so it determines the
        parent's height based on content. Cards stack and grow naturally.
        
        Styling:
        - 'relative': Normal flow, determines parent height
        - 'z-10': Places cards above the background
        - 'flex flex-col': Stacks cards vertically
        - 'items-center': Centers cards horizontally
        - 'px-4 md:px-8': Horizontal padding for responsiveness
        - 'py-8': Vertical padding
      */}
      <div className="relative z-10 flex flex-col items-center px-4 md:px-8 py-8">
        {/* 
          Program Header
          ===============
          Animated "Program" title at the top of the event calendar.
          Uses typewriter animation for elegant entrance effect.
        */}
        <div className="mb-8">
          <AnimatedText
            animation="type"
            className="cormorant-garamond-regular text-5xl md:text-6xl text-gray-700 drop-shadow-lg"
            duration={1000}
            delay={200}
            triggerOnScroll={true}
          >
            PROGRAM
          </AnimatedText>
        </div>
        {/* 
          Cards Wrapper
          ==============
          Contains the actual event cards with a max width for readability.
          Cards are stacked vertically with no spacing between them so that
          the Col 2 dividers of each card align and flow visually.
          
          Styling:
          - 'w-full max-w-2xl': Full width up to 672px maximum
        */}
        <div className="w-full max-w-2xl">
          {/* 
            Map through events array and render EventCalendarCard for each
            The 'key' prop uses the index, but in production you might want
            to use a unique event ID if available
          */}
          {events.map((eventData, index) => (
            <EventCalendarCard
              key={index}
              flip={eventData.flip}
              dividerImage={eventData.dividerImage}
              iconImage={eventData.iconImage}
              ruleImage={eventData.ruleImage}
              time={eventData.time}
              event={eventData.event}
              location={eventData.location}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
