/**
 * ============================================================================
 * FILE: index.js
 * LOCATION: src/pages/index.js
 * PURPOSE: Home page of the Wedding App - the main landing page visitors see
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This is the home page that displays when users visit the root URL (/).
 * It features a full-screen hero section with:
 * 1. A background image with slide-up animation
 * 2. A 3-column layout at the bottom:
 *    - Left: Text sliding in from the left
 *    - Center: Heart image with flashing/pulsing effect
 *    - Right: Text sliding in from the right
 * 3. Optional centered content on top
 * 
 * DEPENDENCIES:
 * =============
 * Components:
 * - HeroImage: Full-screen hero with layered images and 3-column layout
 *   Location: src/components/public/HeroImage.js
 *   Purpose: Combines background image + animated overlay + animated text
 * 
 * Assets:
 * - /images/image_001.jpg: Main background image (public/images folder)
 * - /images/heart.png: Heart overlay image (public/images folder)
 * 
 * Fonts (from globals.css):
 * - parisienne-regular: Elegant cursive font for headings
 * - cormorant-garamond-*: Sophisticated serif font for body text
 * 
 * HOW NEXT.JS PAGES WORK:
 * =======================
 * In Next.js, files in the "pages" folder automatically become routes:
 * - pages/index.js → URL: / (home page)
 * - pages/about.js → URL: /about
 * - pages/admin/index.js → URL: /admin
 * 
 * ============================================================================
 */

import HeroImage from "@/components/public/HeroImage";

/**
 * HOME COMPONENT
 * 
 * The main landing page component.
 * Displays a full-screen hero section with:
 * 1. Background image with slide-up entrance animation
 * 2. 3-column bottom layout:
 *    - Left text sliding in from left (slide-right animation)
 *    - Center heart with pulsing opacity (40% to 80% over 1000ms)
 *    - Right text sliding in from right (slide-left animation)
 */
export default function Home() {
  return (
    // Full-screen container - no padding needed as HeroImage fills the space
    <div className="min-h-screen">
      {/* 
        HeroImage Component
        ===================
        Creates a layered hero section with:
        - Layer 1 (z-0): Background image with slide-up animation
        - Layer 2 (z-10): 3-column layout at bottom:
          - Left column: AnimatedText sliding in from left
          - Center column: OpacityAnimation (heart) with flashing effect
          - Right column: AnimatedText sliding in from right
        - Layer 3 (z-20): Optional children content on top
        
        Props explained:
        - imageDisplayProps: Props for background ImageDisplay
        - opacityAnimationProps: Props for center OpacityAnimation (heart)
        - leftTextProps: Props for left AnimatedText (slides from left)
        - rightTextProps: Props for right AnimatedText (slides from right)
        - height: Height of the hero section (h-screen = full viewport)
      */}
      <HeroImage
        imageDisplayProps={{
          src: "/images/image_001.jpg",
          alt: "Wedding background",
          animation: "slide-up",
        }}
        opacityAnimationProps={{
          image: "/images/heart_white.png",
          alt: "Heart overlay",
          startOpacity: 0.4,
          endOpacity: 0.6,
          interval: 750,
          maxHeight: 200,
        }}
        leftTextProps={{
          text: "John",
          className: "parisienne-regular text-5xl md:text-7xl text-white drop-shadow-lg",
          delay: 500,
          duration: 1000,
        }}
        rightTextProps={{
          text: "Jane",
          className: "parisienne-regular text-5xl md:text-7xl text-white drop-shadow-lg",
          delay: 500,
          duration: 1000,
        }}
        height="h-screen"
      />
    </div>
  );
}
