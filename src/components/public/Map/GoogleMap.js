/**
 * ============================================================================
 * FILE: GoogleMap.js
 * LOCATION: src/components/public/Map/GoogleMap.js
 * PURPOSE: Display a Google Map for a given address with Street View Pegman
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This component renders a Google Map for a specified address.
 * It provides:
 * - Interactive map view with the location marked
 * - Street View Pegman (drag-and-drop person icon) for street view
 * - Geocoding to convert address to coordinates
 * - Info window with location details
 * 
 * HOW IT WORKS:
 * =============
 * Uses @react-google-maps/api for full Google Maps JavaScript API access.
 * The address is geocoded to coordinates, then displayed on an interactive map.
 * Users can drag the Pegman onto the map to activate Street View.
 * 
 * DEPENDENCIES:
 * =============
 * External Libraries:
 * - react: useState, useEffect, useCallback for state management
 * - @react-google-maps/api: Google Maps React wrapper
 * 
 * Environment Variables:
 * - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: Google Maps API key
 * 
 * Related Files:
 * - Used by: src/components/public/Map/GoogleMapSection.js
 * 
 * PROPS:
 * ======
 * @param {string} address - The address to display on the map (required)
 * @param {string} className - Additional CSS classes for the container (default: '')
 * @param {string} height - Height of the map container (default: 'h-80')
 * @param {number} zoom - Zoom level for the map (default: 17)
 * 
 * USAGE EXAMPLE:
 * ==============
 * <GoogleMap
 *   address="123 Main St, Oakland, CA 94601"
 *   height="h-96"
 *   zoom={15}
 * />
 * 
 * ============================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { GoogleMap as GoogleMapComponent, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

/**
 * GOOGLEMAP COMPONENT
 * 
 * Renders an interactive Google Map with Street View Pegman support.
 * Geocodes the address to coordinates and displays a marker.
 */
export default function GoogleMap({
  address,
  className = '',
  height = 'h-80',
  zoom = 17,
}) {
  // ========== API KEY ==========
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // ========== LOAD GOOGLE MAPS SCRIPT ==========
  // useJsApiLoader prevents issues when component remounts (e.g., tab switching)
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || '',
  });

  // ========== STATE MANAGEMENT ==========
  const [coordinates, setCoordinates] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(true);
  const [geocodeError, setGeocodeError] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [map, setMap] = useState(null);

  // ========== GEOCODE ADDRESS ==========
  // Convert address to coordinates when component mounts or address changes
  useEffect(() => {
    if (!address || !apiKey) return;

    const geocodeAddress = async () => {
      setIsGeocoding(true);
      setGeocodeError(null);

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
        );
        const data = await response.json();

        if (data.status === 'OK' && data.results[0]) {
          const { lat, lng } = data.results[0].geometry.location;
          setCoordinates({ lat, lng });
        } else {
          setGeocodeError('Unable to find location');
        }
      } catch (err) {
        setGeocodeError('Failed to geocode address');
        console.error('Geocoding error:', err);
      } finally {
        setIsGeocoding(false);
      }
    };

    geocodeAddress();
  }, [address, apiKey]);

  // ========== MAP CALLBACKS ==========
  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  // ========== VALIDATION ==========
  // If no API key, show error message
  if (!apiKey) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg p-4 ${height} ${className}`}>
        <div className="text-center">
          <p className="text-red-500 font-medium">Google Maps API key is missing.</p>
          <p className="text-gray-600 mt-2 text-sm">
            Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables.
          </p>
        </div>
      </div>
    );
  }

  // If no address provided, show placeholder
  if (!address) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg p-4 ${height} ${className}`}>
        <p className="text-gray-500">No address provided</p>
      </div>
    );
  }

  // Show loading state (either script loading or geocoding)
  if (!isLoaded || isGeocoding) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg p-4 ${height} ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700 mx-auto mb-2"></div>
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (loadError || geocodeError || !coordinates) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg p-4 ${height} ${className}`}>
        <p className="text-gray-500">{geocodeError || 'Unable to load map'}</p>
      </div>
    );
  }

  // ========== RENDER ==========
  return (
    <div className={`w-full ${height} ${className} rounded-lg overflow-hidden`}>
        <GoogleMapComponent
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={coordinates}
          zoom={zoom}
          onLoad={onMapLoad}
          options={{
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: true,
            zoomControl: true,
          }}
        >
          {/* Marker at the location */}
          <Marker
            position={coordinates}
            onClick={() => setShowInfoWindow(true)}
          />

          {/* Info Window */}
          {showInfoWindow && (
            <InfoWindow
              position={coordinates}
              onCloseClick={() => setShowInfoWindow(false)}
            >
              <div className="p-1">
                <p className="text-gray-900 text-sm font-medium max-w-[200px]">{address}</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xs mt-1 inline-block"
                >
                  Get Directions
                </a>
              </div>
            </InfoWindow>
          )}
        </GoogleMapComponent>
    </div>
  );
}
