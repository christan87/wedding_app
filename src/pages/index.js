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
import DateFooter from "@/components/public/Footer/DateFooter";
import GiftCarousel from "@/components/public/GiftCarousel";

// Images
const images = {
  img_001: "https://res.cloudinary.com/dxnxtxxep/image/upload/v1777574576/wedding/IMG_001_oxnafm.jpg",
  img_002: "https://res.cloudinary.com/dxnxtxxep/image/upload/v1777574576/wedding/IMG_002_coe0j4.jpg",
  img_003: "https://res.cloudinary.com/dxnxtxxep/image/upload/v1777574577/wedding/IMG_003_q7vuk5.jpg",
  img_004: "https://res.cloudinary.com/dxnxtxxep/image/upload/v1777574336/wedding/IMG_004_nla7sy.jpg",
  img_005: "https://res.cloudinary.com/dxnxtxxep/image/upload/v1777574337/wedding/IMG_005_cic4vn.jpg",
  img_006: "https://res.cloudinary.com/dxnxtxxep/image/upload/v1777574337/wedding/IMG_006_zde3ey.jpg",
  img_007: "https://res.cloudinary.com/dxnxtxxep/image/upload/v1777574337/wedding/IMG_007_uctkwj.jpg",
}

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
          src: images.img_001,
          alt: "Wedding background",
          animation: "slide-up",
          priority: true,
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
          text: "Christan",
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
          text: "Jennifer",
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
            text: "AT 4:30 PM",
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
        backgroundSrc={images.img_005}  // TODO: Replace with your actual GIF path
        backgroundAlt="Animated grayscale background"
        backgroundOpacity={0.3}  // 10% opacity for subtle effect
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
            time: "4:30 PM",
            event: "Ceremony",
            location: "St. Mary's Church",
          },
          // Example Event 2: Reception (flipped layout - icon left, text right)
          {
            flip: true,
            dividerImage: "/images/icons/waxseal.png",  // TODO: Replace with your divider image
            iconImage: "/images/icons/martini.png",  // TODO: Replace with reception icon
            ruleImage: "/images/icons/heart_rule_center.png",  // TODO: Replace with rule decoration
            time: "6:00 PM",
            event: "Cocktails",
            location: "Eve's Waterfront",
          },
          {
            flip: false,
            dividerImage: "/images/icons/waxseal.png",  // TODO: Replace with your divider image
            iconImage: "/images/icons/camera.png",  // TODO: Replace with reception icon
            ruleImage: "/images/icons/heart_rule_center.png",  // TODO: Replace with rule decoration
            time: "6:30 PM",
            event: "Photos",
            location: "Eve's Waterfront",
          },
          {
            flip: true,
            dividerImage: "/images/icons/waxseal.png",  // TODO: Replace with your divider image
            iconImage: "/images/icons/plating.png",  // TODO: Replace with reception icon
            ruleImage: "/images/icons/heart_rule_center.png",  // TODO: Replace with rule decoration
            time: "7:00 PM",
            event: "Dinner",
            location: "Eve's Waterfront",
          },
          {
            flip: false,
            dividerImage: "/images/icons/waxseal.png",  // TODO: Replace with your divider image
            iconImage: "/images/icons/speaker.png",  // TODO: Replace with reception icon
            ruleImage: "/images/icons/heart_rule_center.png",  // TODO: Replace with rule decoration
            time: "8:00 PM",
            event: "Party",
            location: "Eve's Waterfront",
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
          title="Details"
          accent="The"
          backgroundImage={images.img_002} // TODO: Replace with your actual GIF path
          backgroundOpacity={0.5}  // 10% opacity for subtle effect
          details={[
            // Detail 1: Accommodations
            {
              dividerImage: "/images/icons/waxseal.png",  // TODO: Replace with your divider image
              title: "Accommodations",
              text: "If you think you or a guest may have issues standing for extended periods, please let us know and we will do our best to accommodate you.",
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
              text: "Transportation to and from the ceremony and reception will not be provided unfortunately. Please arrange your own transportation or coordinate with other guests.",
            },
            // Detail 4: Dress Code
            {
              dividerImage: "/images/icons/waxseal.png",  // TODO: Replace with your divider image
              title: "Dress Code",
              text: "Dress attire is requested for the ceremony and evening reception. Please avoid wearing white to respect the bride (our colors are red and gold). The ceremony will be held outdoors, so comfortable shoes are recommended.",
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
        backgroundImage="/images/image_003.jpg"
        month="MAY"
        day="15"
      />

      {/* 
        DATEFOOTER SECTION
        ==================
        Displays wedding date footer with grayscale background.
        
        Props explained:
        - backgroundImage: Path to the background image
        - month: Month of the wedding
        - day: Day of the wedding
        - year: Year of the wedding
        - groom: Groom's name
        - bride: Bride's name
      */}
      <DateFooter
        backgroundImage={images.img_006}
        month="06"
        day="09"
        year="2026"
        groom="Chris"
        bride="Jenn"
      />

      {/* 
        GIFT CAROUSEL SECTION
        =====================
        Displays gift registry items in a horizontal carousel.
        
        Props explained:
        - items: Array of gift objects with name, image, and optional link
        - itemsPerView: Number of items visible at once
        - size: Size preset ('sm', 'md', 'lg')
        - title: Optional title above the carousel
        - showArrows: Show navigation arrows
        - showDots: Show dot indicators
      */}
      <GiftCarousel
        items={[
          { name: "Amazon Registry", image: "/images/qr_code.jpg", link: "https://www.amazon.com/wedding/guest-view/1DJLGQVKXGA75" }
        ]}
        itemsPerView={1}
        size="lg"
        title="Our Gift Registry"
        showArrows={true}
        showDots={true}
        className="bg-gray-50"
      />
    </div>
  );
}
