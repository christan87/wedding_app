/**
 * ============================================================================
 * FILE: OpacityAnimation.js
 * LOCATION: src/components/public/Images/OpacityAnimation.js
 * PURPOSE: Creates a flashing/pulsing opacity animation effect on an image
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This component displays an image that continuously transitions between
 * two opacity values, creating a flashing or pulsing effect. The animation
 * loops infinitely, fading from startOpacity to endOpacity and back.
 * 
 * HOW IT WORKS:
 * =============
 * 1. Image starts at startOpacity (e.g., 0.3)
 * 2. Over the interval duration, fades to endOpacity (e.g., 1.0)
 * 3. Then fades back to startOpacity
 * 4. Repeats infinitely
 * 
 * POSITIONING:
 * ============
 * By default, the image is positioned at the bottom center of its container.
 * Use the position prop to change this ('top', 'center', 'bottom').
 * 
 * DEPENDENCIES:
 * =============
 * External Libraries:
 * - react: useState, useEffect hooks for managing animation state
 * - next/image: Next.js optimized Image component
 * 
 * Related Files:
 * - Used by: src/components/public/HeroImage.js
 * - Similar to: src/components/public/Images/ImageDisplay.js
 * 
 * PROPS:
 * ======
 * @param {string} image - Image source path (from public folder) or URL
 * @param {number} startOpacity - Starting opacity value (0 to 1), default: 0.3
 * @param {number} endOpacity - Ending opacity value (0 to 1), default: 1
 * @param {number} interval - Time in milliseconds for one fade cycle, default: 2000
 * @param {string} alt - Alt text for accessibility, default: ''
 * @param {string} className - Additional CSS classes for the image
 * @param {string} containerClassName - CSS classes for the wrapper div
 * @param {number} maxHeight - Maximum height of the image in pixels, default: 600
 * @param {string} position - Vertical position: 'top', 'center', 'bottom', default: 'bottom'
 * 
 * USAGE EXAMPLE:
 * ==============
 * <OpacityAnimation
 *   image="/images/overlay.png"
 *   startOpacity={0.3}
 *   endOpacity={1}
 *   interval={2000}
 *   alt="Flashing overlay"
 *   maxHeight={600}
 *   position="bottom"
 * />
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * OPACITYANIMATION COMPONENT
 * 
 * Renders an image with a continuous opacity animation (flashing effect).
 * The opacity transitions smoothly between startOpacity and endOpacity
 * over the specified interval, then reverses direction.
 * 
 * The image is positioned at the bottom center by default with a max height.
 */
export default function OpacityAnimation({
  image,
  startOpacity = 0.3,
  endOpacity = 1,
  interval = 2000,
  alt = '',
  className = '',
  containerClassName = '',
  maxHeight = 600,
  position = 'bottom',
}) {
  // ========== STATE ==========
  // currentOpacity: The current opacity value being displayed
  // Starts at startOpacity and animates toward endOpacity
  const [currentOpacity, setCurrentOpacity] = useState(startOpacity);
  
  // isFadingIn: Direction of the animation
  // true = fading from startOpacity to endOpacity
  // false = fading from endOpacity to startOpacity
  const [isFadingIn, setIsFadingIn] = useState(true);

  // ========== ANIMATION LOGIC ==========
  useEffect(() => {
    // Set up interval to toggle the opacity direction
    // When interval completes, switch direction (fade in <-> fade out)
    const animationInterval = setInterval(() => {
      setIsFadingIn((prev) => !prev);
    }, interval);

    // Cleanup: Clear interval when component unmounts
    return () => clearInterval(animationInterval);
  }, [interval]);

  // ========== UPDATE OPACITY BASED ON DIRECTION ==========
  useEffect(() => {
    // When direction changes, update the target opacity
    // isFadingIn = true: animate to endOpacity
    // isFadingIn = false: animate to startOpacity
    setCurrentOpacity(isFadingIn ? endOpacity : startOpacity);
  }, [isFadingIn, startOpacity, endOpacity]);

  // ========== EXTERNAL URL CHECK ==========
  // Next.js Image optimization doesn't work with external URLs
  const isExternalUrl = image?.startsWith('http://') || image?.startsWith('https://');

  // ========== POSITION CLASSES ==========
  // Determine flexbox alignment based on position prop
  // 'top' = align to top, 'center' = center vertically, 'bottom' = align to bottom
  const positionClasses = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
  };
  const alignmentClass = positionClasses[position] || positionClasses.bottom;

  // ========== RENDER ==========
  return (
    // Container: Only as wide as the image (no extra space on sides)
    // Uses inline-flex to shrink-wrap around content
    <div 
      className={`${className} ${containerClassName}`}
      style={{
        opacity: currentOpacity,
        transition: `opacity ${interval}ms ease-in-out`,
      }}
    >
      <Image
        src={image}
        alt={alt}
        width={0}
        height={0}
        sizes="100vw"
        className="w-auto h-auto object-contain"
        style={{ maxHeight: `${maxHeight}px` }}
        {...(isExternalUrl && { unoptimized: true })}
      />
    </div>
  );
}
