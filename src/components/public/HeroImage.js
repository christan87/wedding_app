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
 * @param {object} bottomTextProps - Props for bottom row AnimatedText (optional)
 *   { text: string|ReactNode, ...AnimatedText props }
 *   Default animation: 'fade-in' - spans full width below the main content
 * 
 * @param {object} fuzzyText1Props - Props for first fuzzy slide AnimatedText (optional)
 *   { text: string|ReactNode, ...AnimatedText props }
 *   Default animation: 'fuzzy-slide' - uses Parisienne font
 * 
 * @param {object} fuzzyText2Props - Props for second fuzzy slide AnimatedText (optional)
 *   { text: string|ReactNode, ...AnimatedText props }
 *   Default animation: 'fuzzy-slide' - uses WindSong font
 * 
 * @param {object} fuzzyText3Props - Props for third fuzzy slide AnimatedText (optional)
 *   { text: string|ReactNode, ...AnimatedText props }
 *   Default animation: 'fuzzy-slide' - uses Parisienne font
 * 
 * @param {object} row5TextProps - Props for row 5 AnimatedText (optional)
 *   { text: string|ReactNode, ...AnimatedText props }
 *   Default animation: 'fade-in' - same display as bottomTextProps (row 3)
 * 
 * @param {object} row6TextProps - Props for row 6 AnimatedText (optional)
 *   { text: string|ReactNode, ...AnimatedText props }
 *   Default animation: 'fade-in' - same display as bottomTextProps (row 3)
 * 
 * @param {object} textBannerProps - Props for row 7 TextBanner component (optional)
 *   { row1Props, row2LeftProps, row2CenterProps, row2RightProps, row3Props, borderColor }
 *   A decorative 3x3 grid banner with animated text and borders
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
import TextBanner from '@/components/public/TextBanner';

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
  
  // Props for bottom row AnimatedText (fade-in, spans full width)
  bottomTextProps = null,
  
  // Props for fuzzy slide AnimatedText 1 (Parisienne font)
  fuzzyText1Props = null,
  
  // Props for fuzzy slide AnimatedText 2 (WindSong font)
  fuzzyText2Props = null,
  
  // Props for fuzzy slide AnimatedText 3 (Parisienne font)
  fuzzyText3Props = null,
  
  // Props for row 5 AnimatedText (same display as row 3)
  row5TextProps = null,
  
  // Props for row 6 AnimatedText (same display as row 3)
  row6TextProps = null,
  
  // Props for row 7 TextBanner component (3x3 grid with animated text and borders)
  textBannerProps = null,
  
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

  // Extract bottom text props if provided (fade-in animation by default)
  const {
    text: bottomText,
    animation: bottomAnimation = 'fade-in',
    className: bottomClassName = '',
    ...restBottomTextProps
  } = bottomTextProps || {};

  // Extract fuzzy text 1 props if provided (fuzzy-slide animation by default)
  const {
    text: fuzzyText1,
    animation: fuzzyAnimation1 = 'fuzzy-slide',
    className: fuzzyClassName1 = '',
    ...restFuzzyText1Props
  } = fuzzyText1Props || {};

  // Extract fuzzy text 2 props if provided (fuzzy-slide animation by default)
  const {
    text: fuzzyText2,
    animation: fuzzyAnimation2 = 'fuzzy-slide',
    className: fuzzyClassName2 = '',
    ...restFuzzyText2Props
  } = fuzzyText2Props || {};

  // Extract fuzzy text 3 props if provided (fuzzy-slide animation by default)
  const {
    text: fuzzyText3,
    animation: fuzzyAnimation3 = 'fuzzy-slide',
    className: fuzzyClassName3 = '',
    ...restFuzzyText3Props
  } = fuzzyText3Props || {};

  // Extract row 5 text props if provided (fade-in animation by default, same as row 3)
  const {
    text: row5Text,
    animation: row5Animation = 'fade-in',
    className: row5ClassName = '',
    ...restRow5TextProps
  } = row5TextProps || {};

  // Extract row 6 text props if provided (fade-in animation by default, same as row 3)
  const {
    text: row6Text,
    animation: row6Animation = 'fade-in',
    className: row6ClassName = '',
    ...restRow6TextProps
  } = row6TextProps || {};

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
        <div className="flex items-center justify-center">
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

        {/* ROW 3: Bottom text row - fade-in text spanning full width */}
        {bottomTextProps && bottomText && (
          <div className="flex justify-center w-full">
            <AnimatedText
              animation={bottomAnimation}
              className={bottomClassName}
              triggerOnScroll={false}
              {...restBottomTextProps}
            >
              {bottomText}
            </AnimatedText>
          </div>
        )}

        {/* ROW 4: Fuzzy slide text row - 3 texts with alternating blur effect */}
        {(fuzzyText1Props || fuzzyText2Props || fuzzyText3Props) && (
          <div className="flex justify-center items-center w-full gap-2">
            {/* FUZZY TEXT 1: Uses Parisienne font */}
            {fuzzyText1Props && fuzzyText1 && (
              <AnimatedText
                animation={fuzzyAnimation1}
                className={fuzzyClassName1}
                triggerOnScroll={false}
                {...restFuzzyText1Props}
              >
                {fuzzyText1}
              </AnimatedText>
            )}

            {/* FUZZY TEXT 2: Uses WindSong font */}
            {fuzzyText2Props && fuzzyText2 && (
              <AnimatedText
                animation={fuzzyAnimation2}
                className={fuzzyClassName2}
                triggerOnScroll={false}
                {...restFuzzyText2Props}
              >
                {fuzzyText2}
              </AnimatedText>
            )}

            {/* FUZZY TEXT 3: Uses Parisienne font */}
            {fuzzyText3Props && fuzzyText3 && (
              <AnimatedText
                animation={fuzzyAnimation3}
                className={fuzzyClassName3}
                triggerOnScroll={false}
                {...restFuzzyText3Props}
              >
                {fuzzyText3}
              </AnimatedText>
            )}
          </div>
        )}

        {/* ROW 5: Text row - same display as row 3 (fade-in, spans full width) */}
        {row5TextProps && row5Text && (
          <div className="flex justify-center w-full pt-2">
            <AnimatedText
              animation={row5Animation}
              className={row5ClassName}
              triggerOnScroll={false}
              {...restRow5TextProps}
            >
              {row5Text}
            </AnimatedText>
          </div>
        )}

        {/* ROW 6: Text row - same display as row 3 (fade-in, spans full width) */}
        {row6TextProps && row6Text && (
          <div className="flex justify-center w-full pb-2">
            <AnimatedText
              animation={row6Animation}
              className={row6ClassName}
              triggerOnScroll={false}
              {...restRow6TextProps}
            >
              {row6Text}
            </AnimatedText>
          </div>
        )}

        {/* ROW 7: TextBanner - 3x3 grid with animated text and borders
            A decorative banner component featuring:
            - Row 1: Center text with fuzzy-slide animation
            - Row 2: Left/right text with fuzzy-slide + borders, center with slide-up
            - Row 3: Center text with fuzzy-slide animation
        */}
        {textBannerProps && (
          <div className="flex justify-center w-full pb-8">
            <TextBanner {...textBannerProps} />
          </div>
        )}
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
