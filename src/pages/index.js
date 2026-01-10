/**
 * ============================================================================
 * FILE: index.js
 * LOCATION: src/pages/index.js
 * PURPOSE: Home page of the Wedding App - the main landing page visitors see
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This is the home page that displays when users visit the root URL (/).
 * It shows a welcome message and a featured wedding image with a slide-up
 * animation effect.
 * 
 * DEPENDENCIES:
 * =============
 * Components:
 * - ImageDisplay: Custom animated image component
 *   Location: src/components/public/Images/ImageDisplay.js
 *   Purpose: Displays images with entrance animations
 * 
 * Assets:
 * - /images/image_001.jpg: Wedding image stored in public/images folder
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

import ImageDisplay from "@/components/public/Images/ImageDisplay";

/**
 * HOME COMPONENT
 * 
 * The main landing page component.
 * Displays a centered layout with:
 * 1. A welcome heading
 * 2. An animated wedding image using the ImageDisplay component
 */
export default function Home() {
  return (
    // Full-screen white background container
    <div className="min-h-screen bg-white">
      {/* Main content area - centered both vertically and horizontally */}
      <main className="flex flex-col items-center justify-center min-h-screen">
        {/* 
          Animated wedding image using ImageDisplay component
          
          Props explained:
          - src: Path to image in public folder (public/images/image_001.jpg)
          - alt: Accessibility text for screen readers
          - animation: "slide-up" makes image slide up from below
          - width/height: Image dimensions in pixels
          - className: Additional Tailwind classes for styling
          - triggerOnScroll: false = animate on page load, not on scroll
          - delay: (optional) milliseconds to wait before animating (default: 100)
          - duration: (optional) animation duration in ms (default: 700)
        */}
        <ImageDisplay
          src="/images/image_001.jpg"
          alt="Wedding image"
          animation="slide-up"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
          triggerOnScroll={false}
        />
      </main>
    </div>
  );
}
