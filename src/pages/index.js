/**
 * ============================================================================
 * FILE: index.js
 * LOCATION: src/pages/index.js
 * PURPOSE: Home page of the Wedding App - the main landing page visitors see
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This is the home page that displays when users visit the root URL (/).
 * It features:
 * 1. A full-screen hero section with:
 *    - A background image with slide-up animation
 *    - A layout at the bottom with multiple rows:
 *      - Row 1: Left text, center heart image, right text
 *      - Row 2: Bottom text with fade-in animation
 *      - Row 3: Fuzzy slide text with alternating blur effect
 * 2. An EventCalendar section below the hero that displays wedding events
 *    over a grayscale animated background
 * 3. A DetailList section that displays wedding details and information
 *    with right-aligned detail cards over a grayscale animated background
 * 
 * DEPENDENCIES:
 * =============
 * Components:
 * - HeroImage: Full-screen hero with layered images and multi-row layout
 *   Location: src/components/public/HeroImage.js
 *   Purpose: Combines background image + animated overlay + animated text
 * 
 * - EventCalendar: Displays event cards over a grayscale background
 *   Location: src/components/public/EventCalendar/EventCalendar.js
 *   Purpose: Shows wedding event schedule with decorative elements
 *   Depends on: GrayscaleBackground, EventCalendarCard
 * 
 * - DetailList: Displays detail cards with wedding information
 *   Location: src/components/public/Details/DetailList.js
 *   Purpose: Shows wedding details with right-aligned cards and decorative dividers
 *   Depends on: GrayscaleBackground, DetailCard, AnimatedText
 * 
 * Assets:
 * - /images/image_001.jpg: Main background image (public/images folder)
 * - /images/heart_white.png: Heart overlay image (public/images folder)
 * - GIF image: Used in EventCalendar and DetailList backgrounds (update path as needed)
 * - Event images: Icons, dividers, and rule decorations for event cards
 * - Detail images: Divider icons for detail cards
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
import EventCalendar from "@/components/public/EventCalendar/EventCalendar";
import DetailList from "@/components/public/Details/DetailList";
import RSVP from "@/components/public/RSVP/RSVP";

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
 * 3. EventCalendar section below with wedding events
 * 4. DetailList section with wedding details and information
 */
export default function Home() {
  return (
    // Full-screen container - no padding needed as HeroImage fills the space
    <div className="min-h-screen bg-white">
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
          maxHeight: 100,
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
            className: "cormorant-garamond-regular text-xl md:text-2xl text-white drop-shadow-lg",
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
            className: "cormorant-garamond-regular text-xl md:text-2xl text-white drop-shadow-lg",
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

      {/* 
        EventCalendar Component
        =======================
        Displays wedding event cards over a grayscale animated background.
        Each event card shows time, event name, location with decorative elements.
        
        Props explained:
        - backgroundSrc: Path to the GIF image for the grayscale background
        - backgroundAlt: Accessibility description for the background
        - backgroundOpacity: Controls background visibility (0-1)
        - height: Height of the calendar section (uses Tailwind classes)
        - events: Array of event objects containing:
          - flip: If true, swaps layout (icon left, text right)
          - dividerImage: Path to center column divider image
          - iconImage: Path to event icon image
          - ruleImage: Path to horizontal rule decoration image
          - time: Event time string
          - event: Event name string
          - location: Event location string
        
        CUSTOMIZATION TIPS:
        - Add more events to the events array as needed
        - Alternate 'flip' values for visual variety
        - Replace placeholder images with your actual event icons
        - Adjust backgroundOpacity for desired background intensity
        
        NOTE: Replace the image paths with your actual images in /public/images/
      */}
      <EventCalendar
        backgroundSrc="/images/silhouette.gif"  // TODO: Replace with your actual GIF path
        backgroundAlt="Animated grayscale background"
        backgroundOpacity={0.1}  // 10% opacity for subtle effect
        height="h-full"  // Fixed height section (384px)
        title={{           
          animation:"type",
          className:"cormorant-garamond-regular text-5xl md:text-6xl text-gray-700 drop-shadow-lg",
          duration:1000,
          delay:200,
          triggerOnScroll:true,
          text:"PROGRAM"
        }}
        events={[
          // Example Event 1: Wedding Ceremony (normal layout - text left, icon right)
          {
            flip: false,
            dividerImage: "/images/icons/waxseal.png",  // TODO: Replace with your divider image
            iconImage: "/images/icons/rings.png",  // TODO: Replace with ceremony icon
            ruleImage: "/images/icons/heart_rule_center.png",  // TODO: Replace with rule decoration
            time: "3:00 PM",
            event: "Wedding Ceremony",
            location: "St. Mary's Church",
          },
          // Example Event 2: Reception (flipped layout - icon left, text right)
          {
            flip: true,
            dividerImage: "/images/icons/waxseal.png",  // TODO: Replace with your divider image
            iconImage: "/images/icons/martini.png",  // TODO: Replace with reception icon
            ruleImage: "/images/icons/heart_rule_center.png",  // TODO: Replace with rule decoration
            time: "4:30 PM",
            event: "Cocktails",
            location: "Grand Ballroom",
          },
          {
            flip: false,
            dividerImage: "/images/icons/waxseal.png",  // TODO: Replace with your divider image
            iconImage: "/images/icons/camera.png",  // TODO: Replace with reception icon
            ruleImage: "/images/icons/heart_rule_center.png",  // TODO: Replace with rule decoration
            time: "5:00 PM",
            event: "Photos",
            location: "Grand Ballroom",
          },
          {
            flip: true,
            dividerImage: "/images/icons/waxseal.png",  // TODO: Replace with your divider image
            iconImage: "/images/icons/plating.png",  // TODO: Replace with reception icon
            ruleImage: "/images/icons/heart_rule_center.png",  // TODO: Replace with rule decoration
            time: "6:30 PM",
            event: "Dinner",
            location: "Grand Ballroom",
          },
          {
            flip: false,
            dividerImage: "/images/icons/waxseal.png",  // TODO: Replace with your divider image
            iconImage: "/images/icons/speaker.png",  // TODO: Replace with reception icon
            ruleImage: "/images/icons/heart_rule_center.png",  // TODO: Replace with rule decoration
            time: "8:00 PM",
            event: "Party",
            location: "Grand Ballroom",
          }
        ]}
      />

      {/* 
        DETAIL LIST SECTION
        ===================
        Displays wedding details and information using the DetailList component.
        Features right-aligned detail cards with decorative dividers over a 
        grayscale animated background.
        
        Styling:
        - 'w-full': Full width of viewport
        - 'py-16': Vertical padding for section spacing
      */}
      <div className="w-full">
        <DetailList
          title="Wedding Details"
          accent="The"
          backgroundImage="/images/image_002.jpg"  // TODO: Replace with your actual GIF path
          details={[
            // Detail 1: Accommodations
            {
              dividerImage: "/images/icons/waxseal.png",  // TODO: Replace with your divider image
              title: "Accommodations",
              text: "We have reserved rooms at the Grand Hotel for our guests. Please mention the Smith-Jones wedding when booking to receive the special rate. Rooms are available for Friday and Saturday nights.",
            },
            // Detail 2: Registry
            {
              dividerImage: "/images/icons/waxseal.png",  // TODO: Replace with your divider image
              title: "Registry",
              text: "Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, we have registered at Macy's and Bed Bath & Beyond.",
            },
            // Detail 3: Transportation
            {
              dividerImage: "/images/icons/waxseal.png",  // TODO: Replace with your divider image
              title: "Transportation",
              text: "Shuttle service will be provided between the hotel and ceremony/reception venues. Please check the schedule in your welcome packet for specific pickup and drop-off times.",
            },
            // Detail 4: Dress Code
            {
              dividerImage: "/images/icons/waxseal.png",  // TODO: Replace with your divider image
              title: "Dress Code",
              text: "Cocktail attire is requested for the evening reception. Please avoid wearing white to respect the bride. The ceremony will be held outdoors, so comfortable shoes are recommended.",
            },
          ]}
        />
      </div>

      {/* 
        RSVP SECTION
        ============
        Displays RSVP call-to-action with background image and animated text.
        
        Props explained:
        - backgroundImage: Path to the background image
        - month: Month for RSVP deadline
        - day: Day for RSVP deadline
      */}
      <RSVP
        backgroundImage="/images/image_001.jpg"
        month="May"
        day="15"
      />
    </div>
  );
}
