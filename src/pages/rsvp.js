/**
 * ============================================================================
 * FILE: rsvp.js
 * LOCATION: src/pages/rsvp.js
 * PURPOSE: RSVP page for wedding guests to confirm attendance
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This is the RSVP page that displays when users visit /rsvp.
 * It features:
 * 1. A PageBanner at the top with background image and title
 * 2. An RSVPFormMessage with wedding details
 * 3. Space for an RSVP form (to be added)
 * 
 * DEPENDENCIES:
 * =============
 * Components:
 * - PageBanner: Banner component with background and title
 *   Location: src/components/public/PageBanner.js
 * 
 * - RSVPFormMessage: Wedding details message component
 *   Location: src/components/public/RSVP/RSVPFormMessage.js
 * 
 * HOW NEXT.JS PAGES WORK:
 * =======================
 * In Next.js, files in the "pages" folder automatically become routes:
 * - pages/index.js → URL: / (home page)
 * - pages/rsvp.js → URL: /rsvp
 * - pages/about.js → URL: /about
 * 
 * ============================================================================
 */

import PageBanner from "@/components/public/PageBanner";
import RSVPFormMessage from "@/components/public/RSVP/RSVPFormMessage";

/**
 * RSVP COMPONENT
 * 
 * The RSVP page component.
 * Displays a banner, wedding details, and RSVP form.
 */
export default function RSVP() {
  return (
    <div className="min-h-screen bg-white">
      {/* 
        PageBanner Component
        ====================
        Displays a rectangular banner at the top of the page with:
        - Background image
        - Title text (left-aligned)
        - Bride and groom names
        
        Props explained:
        - backgroundImage: Path to the banner background image
        - title: Page title (e.g., "RSVP")
        - groom: Groom's name
        - bride: Bride's name
      */}
      <PageBanner
        backgroundImage="/images/image_001.jpg"
        title="Save the date"
        groom="Chris"
        bride="Jenn"
      />

      {/* 
        RSVPFormMessage Component
        =========================
        Displays wedding details and message for guests.
        
        Props explained:
        - location: Wedding location
        - date: Wedding date
        - time: Wedding time
        - groom: Groom's name
        - bride: Bride's name
        - text: Additional message for guests
      */}
      <RSVPFormMessage
        location="Grand Ballroom, The Plaza Hotel"
        date="June 9, 2026"
        time="3:00 PM"
        groom="Chris"
        bride="Jenn"
        text="Please confirm your attendance by filling out the form below. We kindly request that you RSVP by May 15, 2026. If you have any dietary restrictions or special requirements, please let us know in the comments section."
      />

      {/* 
        RSVP Form Section
        =================
        TODO: Add RSVP form component here
        This section will contain the actual form for guests to fill out
      */}
      <div className="w-full px-4 md:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <p className="cormorant-garamond-regular text-lg text-gray-600 text-center">
            RSVP Form Coming Soon
          </p>
        </div>
      </div>
    </div>
  );
}
