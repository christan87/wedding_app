/**
 * ============================================================================
 * FILE: DetailList.js
 * LOCATION: src/components/public/Details/DetailList.js
 * PURPOSE: Container component for displaying a list of detail cards with background
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This component displays a collection of detail cards over a grayscale animated
 * background. It features an accent text at the top, an animated title, and a
 * right-aligned container of detail cards. The component uses a layered approach
 * similar to EventCalendar for visual consistency.
 * 
 * LAYOUT STRUCTURE:
 * ================
 * The component uses a layered approach:
 * 1. Background layer with GrayscaleBackground component
 * 2. Content layer with:
 *    - Accent text at the top
 *    - Animated title below accent
 *    - Right-aligned container with DetailCard components
 * 
 * DEPENDENCIES:
 * =============
 * External Libraries:
 * - react: For building the component
 * 
 * Internal Components:
 * - GrayscaleBackground: Displays grayscale animated background
 *   Location: src/components/public/Images/GrayscaleBackground.js
 * - DetailCard: Individual detail card component
 *   Location: src/components/public/Details/DetailCard.js
 * - AnimatedText: Text component with entrance animations
 *   Location: src/components/public/AnimatedText.js
 * 
 * Related Files:
 * - Similar to: src/components/public/EventCalendar/EventCalendar.js (same layered pattern)
 * - Used by: src/pages/index.js (or any page needing a detail list)
 * 
 * PROPS:
 * ======
 * @param {string} title - The main title text (e.g., "Wedding Details")
 * @param {string} accent - The accent text displayed above title (e.g., "Important Information")
 * @param {string} backgroundImage - Path to the background GIF/image (e.g., "/images/silhouette.gif")
 * @param {Array} details - Array of detail objects with properties:
 *   - dividerImage: Path to divider image (e.g., "/images/icons/waxseal.png")
 *   - title: Card title (e.g., "Accommodations")
 *   - text: Card description text (e.g., "Hotel information...")
 * @param {string} className - Additional CSS classes (default: '')
 * 
 * USAGE EXAMPLE:
 * ==============
 * <DetailList
 *   title="Wedding Details"
 *   accent="Important Information"
 *   backgroundImage="/images/silhouette.gif"
 *   details={[
 *     {
 *       dividerImage: "/images/icons/waxseal.png",
 *       title: "Accommodations",
 *       text: "We have reserved rooms at the Grand Hotel..."
 *     },
 *     {
 *       dividerImage: "/images/icons/rings.png",
 *       title: "Registry",
 *       text: "Your presence is the greatest gift, but if you wish..."
 *     }
 *   ]}
 * />
 * 
 * ============================================================================
 */

import GrayscaleBackground from '../Images/GrayscaleBackground';
import DetailCard from './DetailCard';
import AnimatedText from '../AnimatedText';

/**
 * Detaillist COMPONENT
 * 
 * Renders a collection of detail cards over a grayscale animated background.
 * The component uses a layered approach with proper positioning and spacing.
 */
export default function DetailList({
  title,
  accent,
  backgroundImage,
  details = [],
  className = '',
}) {
  // ========== RENDER ==========
  return (
    /**
     * Main container:
     * - 'relative': Establishes positioning context for absolute background
     * - 'w-full': Full width of parent
     * - 'min-h-screen': Minimum height to fill viewport
     * - 'overflow-hidden': Prevents content from spilling outside
     * - className: Any additional custom classes
     * 
     * Height grows automatically based on content (detail cards).
     * The GrayscaleBackground is absolutely positioned to fill this container.
     */
    <div className={`relative w-full min-h-screen overflow-hidden ${className}`}>
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
        - zIndex: 0 places it behind the content
      */}
      <GrayscaleBackground
        src={backgroundImage}
        alt="Detail list background"
        opacity={0.1}
        height="h-full"
        fixed={false}
        zIndex={0}
        className="absolute inset-0"
      />

      {/* 
        LAYER 2: Content Container
        ============================
        This container is positioned relatively so it determines the
        parent's height based on content. Content is right-aligned.
        
        Styling:
        - 'relative': Normal flow, determines parent height
        - 'z-10': Places content above the background
        - 'flex flex-col': Stacks content vertically
        - 'items-end': Right-aligns content
        - 'justify-start': Aligns content to top
        - 'px-4 md:px-8': Horizontal padding for responsiveness
        - 'py-8': Vertical padding
        - 'h-full': Full height of parent
      */}
      <div className="relative z-10 flex flex-col items-end justify-start px-4 md:px-8 py-8 h-full">
        {/* 
          Content Wrapper
          ===============
          Contains the accent text, animated title, and detail cards.
          Right-aligned with max width for readability.
        */}
        <div className="w-full max-w-2xl">
          {/* 
            Accent Text
            ===========
            Small accent text displayed above the main title.
            Styled with cormorant font and subtle appearance.
          */}
          <div className="mb-4 text-right">
            <span className="cormorant-garamond-light text-sm md:text-base text-gray-600/80 drop-shadow-sm uppercase tracking-wider">
              {accent}
            </span>
          </div>

          {/* 
            Animated Title
            ==============
            Main title with typewriter animation effect.
            Right-aligned with responsive sizing and styling.
          */}
          <div className="mb-12 text-right">
            <AnimatedText
              animation="type"
              className="cormorant-garamond-regular text-3xl md:text-4xl text-gray-700 drop-shadow-lg"
              duration={2000}
              delay={500}
              triggerOnScroll={true}
            >
              {title}
            </AnimatedText>
          </div>

          {/* 
            Detail Cards Container
            ======================
            Contains all the DetailCard components.
            Cards are stacked vertically with spacing between them.
          */}
          <div className="space-y-8">
            {details.map((detail, index) => (
              <DetailCard
                key={index}
                dividerImage={detail.dividerImage}
                title={detail.title}
                text={detail.text}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
