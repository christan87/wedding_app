/**
 * ============================================================================
 * FILE: GoogleMapSection.js
 * LOCATION: src/components/public/Map/GoogleMapSection.js
 * PURPOSE: Display multiple locations with tabbed navigation
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This component displays a section with multiple location maps.
 * It provides:
 * - Tabbed navigation for switching between locations
 * - Location name and address display
 * - GoogleMap component for each location
 * - First location rendered by default
 * 
 * LAYOUT STRUCTURE:
 * ================
 * - Title (optional)
 * - Tab buttons for each location
 * - Selected location's address
 * - GoogleMap component showing the selected location
 * 
 * DEPENDENCIES:
 * =============
 * External Libraries:
 * - react: useState for active tab state
 * 
 * Related Files:
 * - GoogleMap: src/components/public/Map/GoogleMap.js
 * - Used by: src/pages/index.js
 * 
 * PROPS:
 * ======
 * @param {Array} locations - Array of location objects (required)
 *   Each object should have:
 *   - {string} name - Name of the location (e.g., "Ceremony", "Reception")
 *   - {string} address - Full address of the location
 * 
 * @param {string} title - Optional title displayed above the tabs
 * @param {string} className - Additional CSS classes for the container (default: '')
 * @param {string} mapHeight - Height of the map (default: 'h-64')
 * @param {number} zoom - Zoom level for the maps (default: 17)
 * 
 * USAGE EXAMPLE:
 * ==============
 * <GoogleMapSection
 *   title="Event Locations"
 *   locations={[
 *     { name: "Ceremony", address: "123 Church St, Oakland, CA 94601" },
 *     { name: "Reception", address: "456 Venue Ave, Oakland, CA 94602" },
 *   ]}
 *   mapHeight="h-80"
 * />
 * 
 * ============================================================================
 */

import { useState } from 'react';
import GoogleMap from './GoogleMap';

/**
 * GOOGLEMAPSECTION COMPONENT
 * 
 * Renders a section with tabbed location navigation and Google Maps.
 * The first location is displayed by default.
 */
export default function GoogleMapSection({
  locations = [],
  title = '',
  className = '',
  mapHeight = 'h-64',
  zoom = 17,
}) {
  // ========== STATE MANAGEMENT ==========
  // activeIndex: Tracks which location tab is currently selected
  const [activeIndex, setActiveIndex] = useState(0);

  // ========== VALIDATION ==========
  // If no locations provided, don't render anything
  if (!locations || locations.length === 0) {
    return null;
  }

  // Get the currently active location
  const activeLocation = locations[activeIndex];

  // ========== RENDER ==========
  return (
    <div className={`w-full py-8 lg:py-12 xl:py-16 ${className}`}>
      {/* TITLE SECTION */}
      {title && (
        <h2 className="cormorant-garamond-semibold text-3xl md:text-4xl lg:text-5xl xl:text-5xl text-gray-700 text-center mb-6 lg:mb-8 drop-shadow-md">
          {title}
        </h2>
      )}

      {/* TAB NAVIGATION */}
      {locations.length > 1 && (
        <div className="flex justify-center mb-4">
          <div className="inline-flex rounded-lg bg-gray-100 p-1">
            {locations.map((location, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeIndex === index
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label={`View ${location.name} location`}
              >
                <span className="cormorant-garamond-medium">{location.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* LOCATION INFO */}
      <div className="text-center mb-4">
        <h3 className="cormorant-garamond-semibold text-xl lg:text-2xl xl:text-2xl text-gray-700">
          {activeLocation.name}
        </h3>
        <p className="cormorant-garamond-regular text-base lg:text-lg xl:text-xl text-gray-600 mt-1">
          {activeLocation.address}
        </p>
      </div>

      {/* MAP */}
      <div className="px-4 md:px-8 lg:px-12 xl:px-16">
        <GoogleMap
          address={activeLocation.address}
          height={mapHeight}
          zoom={zoom}
        />
      </div>

      {/* DIRECTIONS LINK */}
      <div className="text-center mt-4">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeLocation.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 cormorant-garamond-medium transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Get Directions
        </a>
      </div>
    </div>
  );
}
