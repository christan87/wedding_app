/**
 * ============================================================================
 * FILE: GrayscaleBackground.js
 * LOCATION: src/components/public/Images/GrayscaleBackground.js
 * PURPOSE: Display a GIF image with grayscale filter and adjustable opacity
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This component displays a GIF (or any image) as a full-width background
 * with a grayscale (black and white) filter applied. The opacity can be
 * adjusted to make the background more or less visible.
 * 
 * This is useful for:
 * - Creating subtle animated backgrounds that don't distract from content
 * - Adding visual interest without overwhelming the user
 * - Creating a vintage or elegant aesthetic with grayscale imagery
 * 
 * HOW GRAYSCALE WORKS:
 * ====================
 * The CSS filter property with grayscale(100%) removes all color from
 * the image, leaving only shades of gray (black, white, and grays).
 * - grayscale(0%) = full color (no filter)
 * - grayscale(50%) = half desaturated
 * - grayscale(100%) = completely black and white
 * 
 * HOW OPACITY WORKS:
 * ==================
 * Opacity controls how transparent an element is:
 * - opacity: 1 (or 100%) = fully visible
 * - opacity: 0.5 (or 50%) = half transparent
 * - opacity: 0 (or 0%) = completely invisible
 * 
 * DEPENDENCIES:
 * =============
 * External Libraries:
 * - react: For building the component
 * - next/image: Next.js optimized Image component for performance
 * 
 * Related Files:
 * - Can be used in any page that needs a grayscale animated background
 * - Example usage in: src/pages/index.js
 * 
 * PROPS:
 * ======
 * @param {string} src - Image/GIF source path (e.g., "/images/animation.gif")
 * @param {string} alt - Alt text for accessibility (default: 'Background image')
 * @param {number} opacity - Opacity value from 0 to 1 (default: 0.5)
 *                           0 = invisible, 1 = fully visible
 * @param {string} className - Additional CSS classes for the container (default: '')
 * @param {string} height - Height of the container (default: 'h-96')
 *                          Can use Tailwind classes like 'h-screen', 'h-64', etc.
 * @param {boolean} fixed - If true, background stays fixed while scrolling (default: false)
 * @param {number|string} zIndex - z-index for layering (default: 0)
 * 
 * USAGE EXAMPLE:
 * ==============
 * // Basic usage with a GIF at 30% opacity
 * <GrayscaleBackground
 *   src="/images/my-animation.gif"
 *   alt="Animated background"
 *   opacity={0.3}
 * />
 * 
 * // Full-screen fixed background at 50% opacity
 * <GrayscaleBackground
 *   src="/images/wedding-loop.gif"
 *   alt="Wedding animation"
 *   opacity={0.5}
 *   height="h-screen"
 *   fixed={true}
 * />
 * 
 * ============================================================================
 */

import Image from 'next/image';

/**
 * GRAYSCALEBACKGROUND COMPONENT
 * 
 * Renders a full-width container with a grayscale image/GIF background.
 * The image is displayed using Next.js Image component with fill mode
 * and object-cover to ensure it covers the entire container.
 * 
 * The grayscale effect is achieved using CSS filter: grayscale(100%)
 * The opacity is controlled via the CSS opacity property.
 */
export default function GrayscaleBackground({
  src,
  alt = 'Background image',
  opacity = 0.5,
  className = '',
  height = 'h-96',
  fixed = false,
  zIndex = 0,
}) {
  // ========== VALIDATION ==========
  // Ensure opacity is within valid range (0 to 1)
  // If user passes a value outside this range, clamp it
  const validOpacity = Math.max(0, Math.min(1, opacity));

  // ========== POSITION STYLE ==========
  // If fixed is true, the background will stay in place while scrolling
  // This creates a parallax-like effect
  const positionClass = fixed ? 'fixed inset-0' : 'relative';

  // ========== RENDER ==========
  return (
    /**
     * Container div:
     * - 'relative' or 'fixed': Positioning context for the absolute Image
     * - 'w-full': Full width of parent
     * - height prop: Controls the height (e.g., 'h-96', 'h-screen')
     * - 'overflow-hidden': Prevents image from spilling outside container
     * - className: Any additional custom classes
     */
    <div 
      className={`${positionClass} w-full ${height} overflow-hidden ${className}`}
      style={{ zIndex }}
    >
      {/**
       * Image wrapper div:
       * - 'absolute inset-0': Fills the entire parent container
       * - 'grayscale': Tailwind class that applies grayscale(100%) filter
       * - Style opacity: Controls visibility (0 = hidden, 1 = fully visible)
       * 
       * WHY SEPARATE WRAPPER?
       * We wrap the Image in a div so we can apply the grayscale filter
       * and opacity to the wrapper. This ensures the filter applies to
       * the entire image uniformly.
       */}
      <div 
        className="absolute inset-0 grayscale"
        style={{ opacity: validOpacity }}
      >
        {/**
         * Next.js Image Component:
         * - src: The image/GIF path
         * - alt: Accessibility description
         * - fill: Makes image fill its parent container
         * - className="object-cover": Crops image to cover container
         *   without distorting aspect ratio
         * - unoptimized: Required for GIFs to preserve animation
         *   (Next.js optimization would convert GIF to static image)
         * - priority={false}: Load normally (not critical for page load)
         */}
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          unoptimized // Required for GIFs to animate properly
          priority={false}
        />
      </div>
    </div>
  );
}
