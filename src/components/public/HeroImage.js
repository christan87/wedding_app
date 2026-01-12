/**
 * ============================================================================
 * FILE: HeroImage.js
 * LOCATION: src/components/public/HeroImage.js
 * PURPOSE: Full-screen hero section with layered background, animated overlay, and text
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This component creates a visually striking hero section by combining:
 * 1. A background image using ImageDisplay (with optional entrance animation)
 * 2. A 3-column overlay layout with:
 *    - Left column: AnimatedText sliding in from the left
 *    - Center column: OpacityAnimation (flashing/pulsing image)
 *    - Right column: AnimatedText sliding in from the right
 * 3. Content area for additional text, buttons, or other elements on top
 * 
 * LAYER STRUCTURE (bottom to top):
 * ================================
 * Layer 1 (z-0):  Background image (ImageDisplay) - static or animated entrance
 * Layer 2 (z-10): 3-column layout with left text, center image, right text
 * Layer 3 (z-20): Content area (children) - additional content on top
 * 
 * DEPENDENCIES:
 * =============
 * Components:
 * - ImageDisplay: For the background image with entrance animations
 *   Location: src/components/public/Images/ImageDisplay.js
 * - OpacityAnimation: For the flashing overlay effect in center column
 *   Location: src/components/public/Images/OpacityAnimation.js
 * - AnimatedText: For animated text in left and right columns
 *   Location: src/components/public/AnimatedText.js
 * 
 * Related Files:
 * - Used by: src/pages/index.js (home page)
 * 
 * PROPS:
 * ======
 * @param {object} imageDisplayProps - Props object passed to ImageDisplay component
 *   Required: { src: string } - Path to background image
 *   Optional: { alt, animation, fill, className, triggerOnScroll, delay, duration, priority }
 *   See ImageDisplay.js for full prop documentation
 * 
 * @param {object} opacityAnimationProps - Props object passed to OpacityAnimation component (optional)
 *   Required if used: { image: string } - Path to overlay image
 *   Optional: { startOpacity, endOpacity, interval, alt, maxHeight, position }
 *   See OpacityAnimation.js for full prop documentation
 * 
 * @param {object} leftTextProps - Props for left AnimatedText (optional)
 *   { text: string|ReactNode, ...AnimatedText props }
 *   Default animation: 'slide-right' (slides in from left toward center)
 * 
 * @param {object} rightTextProps - Props for right AnimatedText (optional)
 *   { text: string|ReactNode, ...AnimatedText props }
 *   Default animation: 'slide-left' (slides in from right toward center)
 * 
 * Container Props:
 * @param {string} className - Additional CSS classes for the container
 * @param {string} height - Height of the hero section (default: 'h-screen')
 * @param {ReactNode} children - Content to display on top of everything
 * 
 * USAGE EXAMPLE:
 * ==============
 * <HeroImage
 *   imageDisplayProps={{
 *     src: "/images/wedding-bg.jpg",
 *     alt: "Wedding background",
 *     animation: "slide-up",
 *   }}
 *   opacityAnimationProps={{
 *     image: "/images/heart.png",
 *     startOpacity: 0.4,
 *     endOpacity: 0.8,
 *     interval: 1000,
 *     maxHeight: 600,
 *   }}
 *   leftTextProps={{
 *     text: "John",
 *     className: "text-6xl text-white parisienne-regular",
 *   }}
 *   rightTextProps={{
 *     text: "Jane",
 *     className: "text-6xl text-white parisienne-regular",
 *   }}
 *   height="h-screen"
 * >
 *   <p className="text-white">Additional content here</p>
 * </HeroImage>
 * 
 * ============================================================================
 */

import ImageDisplay from '@/components/public/Images/ImageDisplay';
import OpacityAnimation from '@/components/public/Images/OpacityAnimation';
import AnimatedText from '@/components/public/AnimatedText';

/**
 * HEROIMAGE COMPONENT
 * 
 * Creates a layered hero section with background image, 3-column animated overlay,
 * and content area. Perfect for landing pages and hero sections.
 * 
 * @param {object} imageDisplayProps - Props passed to ImageDisplay (background)
 * @param {object} opacityAnimationProps - Props passed to OpacityAnimation (center)
 * @param {object} leftTextProps - Props for left AnimatedText
 * @param {object} rightTextProps - Props for right AnimatedText
 * @param {string} className - Additional CSS classes for container
 * @param {string} height - Height of hero section (default: 'h-screen')
 * @param {ReactNode} children - Content displayed on top
 */
export default function HeroImage({
  // Props object for ImageDisplay component (background image)
  imageDisplayProps = {},
  
  // Props object for OpacityAnimation component (center column - optional)
  opacityAnimationProps = null,
  
  // Props for left AnimatedText (slides in from left)
  leftTextProps = null,
  
  // Props for right AnimatedText (slides in from right)
  rightTextProps = null,
  
  // Container props
  className = '',
  height = 'h-screen',
  children,
}) {
  // ========== DESTRUCTURE PROPS WITH DEFAULTS ==========
  // Extract ImageDisplay props with sensible defaults
  const {
    src: backgroundSrc,
    alt: backgroundAlt = '',
    animation: backgroundAnimation = 'fade-in',
    fill: backgroundFill = true,
    className: backgroundClassName = 'object-cover',
    triggerOnScroll: backgroundTriggerOnScroll = false,
    ...restImageDisplayProps
  } = imageDisplayProps;

  // Extract OpacityAnimation props if provided
  const {
    image: overlayImage,
    alt: overlayAlt = '',
    startOpacity: overlayStartOpacity = 0.3,
    endOpacity: overlayEndOpacity = 1,
    interval: overlayInterval = 2000,
    maxHeight: overlayMaxHeight = 600,
    position: overlayPosition = 'center',
    ...restOpacityAnimationProps
  } = opacityAnimationProps || {};

  // Extract left text props if provided
  const {
    text: leftText,
    animation: leftAnimation = 'slide-right',
    className: leftClassName = '',
    ...restLeftTextProps
  } = leftTextProps || {};

  // Extract right text props if provided
  const {
    text: rightText,
    animation: rightAnimation = 'slide-left',
    className: rightClassName = '',
    ...restRightTextProps
  } = rightTextProps || {};

  return (
    // ========== MAIN CONTAINER ==========
    // relative: Establishes positioning context for absolute children
    // overflow-hidden: Prevents images from spilling outside container
    <div className={`relative ${height} w-full overflow-hidden ${className}`}>
      
      {/* ========== LAYER 1: BACKGROUND IMAGE ==========
          Uses ImageDisplay component for the main background
          z-0: Lowest layer (behind everything)
          inset-0: Fills the entire container
          
          The ImageDisplay component handles:
          - Entrance animations (fade-in, slide-up, etc.)
          - Responsive image optimization via Next.js Image
      */}
      <div className="absolute inset-0 z-0">
        <ImageDisplay
          src={backgroundSrc}
          alt={backgroundAlt}
          animation={backgroundAnimation}
          fill={backgroundFill}
          className={backgroundClassName}
          triggerOnScroll={backgroundTriggerOnScroll}
          {...restImageDisplayProps}
        />
      </div>

      {/* ========== LAYER 2: TWO-ROW LAYOUT ==========
          z-10: Middle layer (above background, below content)
          
          Layout structure:
          - Row 1 (flex-grow): Empty spacer that takes up all available space above
          - Row 2: Content row with left text, center image, right text
          
          The text is vertically centered within the content row to align with the image.
      */}
      <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
        {/* ROW 1: Spacer row - takes up all available space above */}
        <div className="grow"></div>
        
        {/* ROW 2: Content row - contains left text, center image, right text
            - items-center: Vertically centers all items within this row
            - justify-center: Horizontally centers the group
            - pb-8: Padding at bottom for spacing from edge
        */}
        <div className="flex items-center justify-center pb-8">
          {/* LEFT TEXT: Animated text sliding in from the left */}
          {leftTextProps && leftText && (
            <AnimatedText
              animation={leftAnimation}
              className={leftClassName}
              triggerOnScroll={false}
              {...restLeftTextProps}
            >
              {leftText}
            </AnimatedText>
          )}

          {/* CENTER: OpacityAnimation with flashing/pulsing image */}
          {opacityAnimationProps && overlayImage && (
            <OpacityAnimation
              image={overlayImage}
              alt={overlayAlt}
              startOpacity={overlayStartOpacity}
              endOpacity={overlayEndOpacity}
              interval={overlayInterval}
              maxHeight={overlayMaxHeight}
              position={overlayPosition}
              {...restOpacityAnimationProps}
            />
          )}

          {/* RIGHT TEXT: Animated text sliding in from the right */}
          {rightTextProps && rightText && (
            <AnimatedText
              animation={rightAnimation}
              className={rightClassName}
              triggerOnScroll={false}
              {...restRightTextProps}
            >
              {rightText}
            </AnimatedText>
          )}
        </div>
      </div>

      {/* ========== LAYER 3: CONTENT AREA ==========
          z-20: Top layer (above all images and overlay)
          Children can be any React elements (text, buttons, etc.)
          
          The content area is positioned to fill the container
          and centers content both vertically and horizontally
      */}
      {children && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
}
