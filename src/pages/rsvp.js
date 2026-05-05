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
import RSVPForm from "@/components/public/RSVP/RSVPForm";

// Images
const images = {
  img_001: "https://res.cloudinary.com/dxnxtxxep/image/upload/v1777574576/wedding/IMG_001_oxnafm.jpg",
  img_002: "https://res.cloudinary.com/dxnxtxxep/image/upload/v1777574576/wedding/IMG_002_coe0j4.jpg",
  img_003: "https://res.cloudinary.com/dxnxtxxep/image/upload/v1777574577/wedding/IMG_003_q7vuk5.jpg",
  img_004: "https://res.cloudinary.com/dxnxtxxep/image/upload/v1777574336/wedding/IMG_004_nla7sy.jpg",
  img_005: "https://res.cloudinary.com/dxnxtxxep/image/upload/v1777574337/wedding/IMG_005_cic4vn.jpg",
  img_006: "https://res.cloudinary.com/dxnxtxxep/image/upload/v1777574337/wedding/IMG_006_zde3ey.jpg",
  img_007: "https://res.cloudinary.com/dxnxtxxep/image/upload/v1777574337/wedding/IMG_007_uctkwj.jpg",
  img_008: "https://res.cloudinary.com/dxnxtxxep/image/upload/v1777933150/wedding/IMG_9203_banner_zpuwhp.jpg",
  img_009: "https://res.cloudinary.com/dxnxtxxep/image/upload/v1778003539/wedding/IMG_9289_ih5dtj.jpg",
  img_010: "https://res.cloudinary.com/dxnxtxxep/image/upload/v1778003672/wedding/IMG_9316_decnuc.jpg",
  img_011: "https://res.cloudinary.com/dxnxtxxep/image/upload/v1778004923/wedding/IMG_9187_edited_uh1paw.jpg",
  img_012: "https://res.cloudinary.com/dxnxtxxep/image/upload/v1778004546/wedding/morecom_rose_garden_ffe04d.jpg",
  img_013: "https://res.cloudinary.com/dxnxtxxep/image/upload/v1778004546/wedding/ocean_ihlcvh.jpg"
}

/** 
 * img_001: Holding hands on beack looking at eachother
 * img_002: Back view head resting on shoulder with ring in view
 * img_003: Sitting on rock together looking at camera
 * img_004: Ring in sand with heart drawn around it
 * img_005: Ring in shell on sand
 * img_006: Back view of us holding hands on beack looking at eachother
 * img_007: Ring in sand with heart drawn around it
 * img_008: Banner image with me holding Jenny
 * img_009: Sitting on rock together looking at eachother
 * img_010: Standin as I kiss her forehead
 * img_011: Us kissing as she shows off the ring
 * img_012: Morecom rose garden
 * img_013: Ocean view
*/

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
        backgroundImage={images.img_013}
        title="Save the date"
        groom=""
        bride=""
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

        groom="Christan"
        bride="Jennifer"
        text="Please confirm your attendance by filling out the form below. We kindly request that you RSVP by May 19, 2026. If you have any dietary restrictions or special requirements, please let us know in the comments section. If you’re unable to attend, we warmly invite you to complete the form to share a message or request our mailing address."
      />

      {/* 
        RSVP Form Section
        =================
        RSVPForm component with all fields from the MongoDB model
      */}
      <div className="w-full px-4 md:px-8 py-12">
        <RSVPForm />
      </div>
    </div>
  );
}
