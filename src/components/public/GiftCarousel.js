/**
 * ============================================================================
 * FILE: GiftCarousel.js
 * LOCATION: src/components/public/GiftCarousel.js
 * PURPOSE: Display a carousel of gift items with images, names, and optional links
 * 
 * WHAT THIS FILE DOES:
 * ====================
 * This component displays a horizontal carousel of gift items. Each item shows:
 * - An image of the gift
 * - The name of the gift
 * - If a link is provided, the image becomes a clickable button that navigates
 *   to the link (opens in a new tab)
 * 
 * The carousel supports:
 * - Configurable number of items displayed at once
 * - Navigation arrows for scrolling through items
 * - Responsive sizing options
 * - Smooth scroll animations
 * 
 * DEPENDENCIES:
 * =============
 * External Libraries:
 * - react: useState for carousel state management
 * - next/image: Next.js optimized Image component for performance
 * 
 * Related Files:
 * - Used by: src/pages/index.js
 * 
 * PROPS:
 * ======
 * @param {Array} items - Array of gift objects to display
 *   Each object should have:
 *   - {string} name - Name of the gift (required)
 *   - {string} image - Image source path or URL (required)
 *   - {string} link - Optional URL to navigate to when clicked
 * 
 * @param {number} itemsPerView - Number of items visible at once (default: 3)
 * @param {string} size - Size preset: 'sm', 'md', 'lg' (default: 'md')
 *   - 'sm': 150px x 150px images
 *   - 'md': 200px x 200px images
 *   - 'lg': 250px x 250px images
 * 
 * @param {string} className - Additional CSS classes for the container (default: '')
 * @param {string} title - Optional title displayed above the carousel
 * @param {boolean} showArrows - Show navigation arrows (default: true)
 * @param {boolean} showDots - Show dot indicators (default: true)
 * @param {number} gap - Gap between items in pixels (default: 16)
 * 
 * USAGE EXAMPLE:
 * ==============
 * const giftItems = [
 *   { name: "Kitchen Aid Mixer", image: "/images/gifts/mixer.jpg", link: "https://amazon.com/..." },
 *   { name: "Dinnerware Set", image: "/images/gifts/dinnerware.jpg", link: "https://target.com/..." },
 *   { name: "Honeymoon Fund", image: "/images/gifts/honeymoon.jpg" }, // No link
 * ];
 * 
 * <GiftCarousel
 *   items={giftItems}
 *   itemsPerView={3}
 *   size="md"
 *   title="Our Gift Registry"
 *   showArrows={true}
 *   showDots={true}
 * />
 * 
 * ============================================================================
 */

import { useState } from 'react';
import Image from 'next/image';

/**
 * SIZE CONFIGURATIONS
 * 
 * Defines the dimensions for each size preset.
 * These control the image container dimensions.
 */
const sizeConfig = {
  sm: { width: 150, height: 150, textSize: 'text-sm' },
  md: { width: 200, height: 200, textSize: 'text-base' },
  lg: { width: 250, height: 250, textSize: 'text-lg' },
};

/**
 * GIFTCAROUSEL COMPONENT
 * 
 * Renders a horizontal carousel of gift items with navigation controls.
 * Items can optionally link to external registries or stores.
 */
export default function GiftCarousel({
  items = [],
  itemsPerView = 3,
  size = 'md',
  className = '',
  title = '',
  showArrows = true,
  showDots = true,
  gap = 16,
}) {
  // ========== STATE MANAGEMENT ==========
  // currentIndex tracks the first visible item in the carousel
  const [currentIndex, setCurrentIndex] = useState(0);

  // ========== CONFIGURATION ==========
  // Get size configuration based on size prop
  const { width, height, textSize } = sizeConfig[size] || sizeConfig.md;

  // Calculate the maximum index (prevents scrolling past the last items)
  const maxIndex = Math.max(0, items.length - itemsPerView);

  // Calculate total number of "pages" for dot indicators
  const totalPages = Math.ceil(items.length / itemsPerView);
  const currentPage = Math.floor(currentIndex / itemsPerView);

  // ========== NAVIGATION HANDLERS ==========
  /**
   * Move to the previous set of items
   * Wraps around to the end if at the beginning
   */
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  /**
   * Move to the next set of items
   * Wraps around to the beginning if at the end
   */
  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  /**
   * Jump to a specific page (for dot navigation)
   */
  const goToPage = (pageIndex) => {
    const newIndex = Math.min(pageIndex * itemsPerView, maxIndex);
    setCurrentIndex(newIndex);
  };

  // ========== EARLY RETURN ==========
  // If no items, don't render anything
  if (!items || items.length === 0) {
    return null;
  }

  // ========== RENDER ==========
  return (
    <div className={`w-full py-8 ${className}`}>
      {/* TITLE SECTION */}
      {title && (
        <h2 className="cormorant-garamond-semibold text-3xl md:text-4xl text-gray-700 text-center mb-8 drop-shadow-md">
          {title}
        </h2>
      )}

      {/* CAROUSEL CONTAINER */}
      <div className="relative flex items-center justify-center">
        {/* LEFT ARROW */}
        {showArrows && items.length > itemsPerView && (
          <button
            onClick={handlePrev}
            className="z-10 p-2 md:p-3 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 mr-2"
            aria-label="Previous items"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 md:h-6 md:w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* CAROUSEL TRACK */}
        <div 
          className="overflow-hidden"
          style={{
            width: `${itemsPerView * width + (itemsPerView - 1) * gap}px`,
          }}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (width + gap)}px)`,
              gap: `${gap}px`,
            }}
          >
            {items.map((item, index) => (
              <GiftItem
                key={index}
                item={item}
                width={width}
                height={height}
                textSize={textSize}
              />
            ))}
          </div>
        </div>

        {/* RIGHT ARROW */}
        {showArrows && items.length > itemsPerView && (
          <button
            onClick={handleNext}
            className="z-10 p-2 md:p-3 bg-white/80 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 ml-2"
            aria-label="Next items"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 md:h-6 md:w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* DOT INDICATORS */}
      {showDots && totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }).map((_, pageIndex) => (
            <button
              key={pageIndex}
              onClick={() => goToPage(pageIndex)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentPage === pageIndex
                  ? 'bg-gray-700 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to page ${pageIndex + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * GIFTITEM COMPONENT
 * 
 * Renders a single gift item with image and name.
 * If a link is provided, the image becomes a clickable button.
 * 
 * @param {object} item - The gift item data
 * @param {number} width - Width of the image container
 * @param {number} height - Height of the image container
 * @param {string} textSize - Tailwind text size class
 */
function GiftItem({ item, width, height, textSize }) {
  const { name, image, link } = item;

  // ========== IMAGE CONTENT ==========
  // The image wrapped in a container with proper sizing
  const imageContent = (
    <div
      className="relative overflow-hidden rounded-lg shadow-md bg-gray-100"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover transition-transform duration-300 hover:scale-105"
        sizes={`${width}px`}
      />
    </div>
  );

  // ========== RENDER ==========
  return (
    <div className="flex flex-col items-center shrink-0">
      {/* IMAGE: Clickable link or static display */}
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block cursor-pointer group"
          aria-label={`View ${name} on external site`}
        >
          <div
            className="relative overflow-hidden rounded-lg shadow-md bg-gray-100 group-hover:shadow-xl transition-shadow duration-300"
            style={{ width: `${width}px`, height: `${height}px` }}
          >
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes={`${width}px`}
            />
            {/* Hover overlay with link icon */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </div>
          </div>
        </a>
      ) : (
        imageContent
      )}

      {/* NAME */}
      <p className={`mt-3 cormorant-garamond-medium ${textSize} text-gray-700 text-center max-w-[${width}px]`}>
        {name}
      </p>
    </div>
  );
}
