/**
 * ============================================================================
 * FILE: GuestBook.js
 * LOCATION: src/components/public/GuestBook/GuestBook.js
 * PURPOSE: Guest Book section displaying all signatures and a sign form
 * 
 * PROPS:
 * ======
 * @param {Array} signatures - Array of signature objects from the database
 * @param {string} title - Section title (default: "Guest Book")
 * 
 * ============================================================================
 */

import { useState, useMemo } from 'react';
import GuestBookCard from './GuestBookCard';
import GuestBookForm from './GuestBookForm';

const PAGE_SIZE = 5;

export default function GuestBook({ signatures: initialSignatures = [], title = "Guest Book" }) {
  const [signatures, setSignatures] = useState(initialSignatures);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState('date-desc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignatureAdded = (newSignature) => {
    setSignatures(prev => [newSignature, ...prev]);
  };

  // Filter by search query
  const filteredSignatures = useMemo(() => {
    if (!searchQuery.trim()) return signatures;
    const query = searchQuery.toLowerCase();
    return signatures.filter(sig => sig.name?.toLowerCase().includes(query));
  }, [signatures, searchQuery]);

  // Sort filtered signatures
  const sortedSignatures = useMemo(() => {
    const sorted = [...filteredSignatures];
    switch (sortBy) {
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'name-asc':
        return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'name-desc':
        return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      default:
        return sorted;
    }
  }, [filteredSignatures, sortBy]);

  // Determine visible signatures
  const displayedSignatures = showAll
    ? sortedSignatures
    : sortedSignatures.slice(0, visibleCount);

  const hasMore = !showAll && visibleCount < sortedSignatures.length;
  const allShown = showAll || visibleCount >= sortedSignatures.length;

  const handleShowMore = () => {
    setVisibleCount(prev => prev + PAGE_SIZE);
  };

  const handleShowAll = () => {
    setShowAll(true);
  };

  return (
    <section className="w-full py-16 lg:py-20 xl:py-24 px-4 md:px-8 lg:px-16 xl:px-24 bg-white">
      <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
        {/* Section Title */}
        <h2 className="cormorant-garamond-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-700 text-center mb-12 lg:mb-16 drop-shadow-md">
          {title}
        </h2>

        {/* Guest Book Form */}
        <div className="mb-12">
          <GuestBookForm onSignatureAdded={handleSignatureAdded} />
        </div>

        {/* Sort & Search Controls */}
        {signatures.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setVisibleCount(PAGE_SIZE);
                setShowAll(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cormorant-garamond-regular text-lg text-gray-700 bg-white"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name (A–Z)</option>
              <option value="name-desc">Name (Z–A)</option>
            </select>

            {/* Search Bar */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(PAGE_SIZE);
                setShowAll(false);
              }}
              placeholder="Search by name..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cormorant-garamond-regular text-lg text-gray-700"
            />
          </div>
        )}

        {/* Signatures List */}
        {sortedSignatures.length === 0 ? (
          <div className="text-center py-12 max-w-2xl">
            <p className="cormorant-garamond-regular text-2xl text-gray-500 italic">
              {signatures.length === 0
                ? 'Be the first to sign our guest book!'
                : 'No signatures found matching your search.'}
            </p>
          </div>
        ) : (
          <>
            {/* Single Column Cards */}
            <div className="flex flex-col gap-6 lg:gap-8 max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
              {displayedSignatures.map((sig, index) => (
                <GuestBookCard
                  key={sig._id || index}
                  name={sig.name}
                  message={sig.message}
                  createdAt={sig.createdAt}
                />
              ))}
            </div>

            {/* Show More / Show All Controls */}
            {!allShown && (
              <div className="flex flex-col items-center gap-3 mt-8">
                {/* Show All Button */}
                <button
                  onClick={handleShowAll}
                  className="px-6 py-2 text-gray-600 cormorant-garamond-semibold text-lg hover:text-gray-800 transition-colors"
                >
                  Show All ({sortedSignatures.length})
                </button>

                {/* Down Arrow / Load More Button */}
                <button
                  onClick={handleShowMore}
                  disabled={!hasMore}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
