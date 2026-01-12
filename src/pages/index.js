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
 * 2. A layout at the bottom with multiple rows:
 *    - Row 1: Left text, center heart image, right text
 *    - Row 2: Bottom text with fade-in animation
 *    - Row 3: Fuzzy slide text with alternating blur effect
 * 
 * DEPENDENCIES:
 * =============
 * Components:
 * - HeroImage: Full-screen hero with layered images and multi-row layout
 *   Location: src/components/public/HeroImage.js
 *   Purpose: Combines background image + animated overlay + animated text
 * 
 * Assets:
 * - /images/image_001.jpg: Main background image (public/images folder)
 * - /images/heart_white.png: Heart overlay image (public/images folder)
 * 
 * Fonts (from globals.css):
 * - parisienne-regular: Elegant cursive font for headings
 * - cormorant-garamond-*: Sophisticated serif font for body text
 * - windsong-regular/medium: Flowing cursive font for romantic text
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
 * 2. Multi-row bottom layout:
 *    - Row 1: Names with heart in center
 *    - Row 2: Fade-in text spanning full width
 *    - Row 3: Fuzzy slide text with alternating blur effect
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
        - Layer 2 (z-10): Multi-row layout at bottom:
          - Row 1: Left text, center heart, right text
          - Row 2: Bottom text with fade-in animation
          - Row 3: Fuzzy slide text with alternating blur
        - Layer 3 (z-20): Optional children content on top
        
        Props explained:
        - imageDisplayProps: Props for background ImageDisplay
        - opacityAnimationProps: Props for center OpacityAnimation (heart)
        - leftTextProps: Props for left AnimatedText (slides from left)
        - rightTextProps: Props for right AnimatedText (slides from right)
        - bottomTextProps: Props for fade-in text below the main row
        - fuzzyText1Props: Props for first fuzzy text (Parisienne font)
        - fuzzyText2Props: Props for second fuzzy text (WindSong font)
        - fuzzyText3Props: Props for third fuzzy text (Parisienne font)
        - row5TextProps: Props for row 5 fade-in text
        - row6TextProps: Props for row 6 fade-in text
        - textBannerProps: Props for row 7 TextBanner (3x3 grid with animated text/borders)
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
          interval: 600,
          maxHeight: 200,
        }}
        leftTextProps={{
          text: "We",
          className: "windsong-regular text-5xl md:text-7xl text-white drop-shadow-lg",
          delay: 500,
          duration: 1000,
        }}
        rightTextProps={{
          text: "Do",
          className: "windsong-regular text-5xl md:text-7xl text-white drop-shadow-lg",
          delay: 500,
          duration: 1000,
        }}
        bottomTextProps={{
          text: "Together with the families",
          className: "cormorant-garamond-light text-xl md:text-2xl text-white drop-shadow-md",
          delay: 800,
          duration: 2000,
        }}
        fuzzyText1Props={{
          text: "Chris",
          className: "parisienne-regular text-4xl md:text-6xl text-white drop-shadow-md",
          delay: 1200,
          duration: 1200,
        }}
        fuzzyText2Props={{
          text: "and ",
          className: "windsong-regular text-4xl md:text-6xl text-white drop-shadow-md",
          delay: 1200,
          duration: 1200,
        }}
        fuzzyText3Props={{
          text: "Jenn",
          className: "parisienne-regular text-4xl md:text-6xl text-white drop-shadow-md",
          delay: 1200,
          duration: 1200,
        }}
        row5TextProps={{
          text: "Invite You",
          className: "cormorant-garamond-regular text-lg md:text-xl text-white drop-shadow-md",
          delay: 1500,
          duration: 1000,
        }}
        row6TextProps={{
          text: "To Their Wedding Celebration",
          className: "cormorant-garamond-light text-lg md:text-xl text-white drop-shadow-md",
          delay: 1800,
          duration: 1000,
        }}
        textBannerProps={{
          row1Props: {
            text: "JUNE",
            className: "cormorant-garamond-regular text-xl md:text-2xl text-white drop-shadow-md",
            delay: 2000,
            duration: 1000,
          },
          row2LeftProps: {
            text: "TUESDAY",
            className: "cormorant-garamond-regular text-3xl md:text-4xl text-white drop-shadow-lg",
            delay: 2300,
            duration: 1000,
          },
          row2CenterProps: {
            text: "09",
            className: "cormorant-garamond-regular text-4xl md:text-5xl text-white drop-shadow-lg",
            delay: 2300,
            duration: 1000,
          },
          row2RightProps: {
            text: "AT 3:00 PM",
            className: "cormorant-garamond-regular text-3xl md:text-4xl text-white drop-shadow-lg",
            delay: 2300,
            duration: 1000,
          },
          row3Props: {
            text: "2026",
            className: "cormorant-garamond-regular text-xl md:text-2xl text-white drop-shadow-md",
            delay: 2600,
            duration: 1000,
          },
          borderColor: "white",
        }}
        height="h-screen"
      />
    </div>
  );
}
