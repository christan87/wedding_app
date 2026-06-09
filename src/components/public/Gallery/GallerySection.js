import { useState, useEffect, useCallback, useMemo } from 'react';
import GalleryUploader from './GalleryUploader';

export default function GallerySection() {
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [uploadsOpen, setUploadsOpen] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const PREVIEW_SIZE  = 4;   // 1 row of 4 shown by default
  const EXPANDED_SIZE = 16;  // 4 rows × 4 cols per page when expanded
  const [filterType, setFilterType] = useState('all');   // 'all' | 'image' | 'video'
  const [sortBy, setSortBy]         = useState('newest'); // 'newest' | 'oldest'
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [nameQuery, setNameQuery]   = useState('');

  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

  const validPhotos = useMemo(() =>
    photos.filter(photo => UUID_REGEX.test(photo.publicId)),
  [photos]);

  const filteredPhotos = useMemo(() => {
    let result = filterType === 'all'
      ? validPhotos
      : validPhotos.filter(p => p.resourceType === filterType);

    if (nameQuery.trim()) {
      const q = nameQuery.toLowerCase();
      result = result.filter(p => p.uploaderName?.toLowerCase().includes(q));
    }

    if (sortBy === 'newest') return [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return [...result].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [validPhotos, filterType, sortBy, nameQuery]);

  const hasMore         = !isExpanded && filteredPhotos.length > PREVIEW_SIZE;
  const totalPages      = Math.ceil(filteredPhotos.length / EXPANDED_SIZE);
  const previewPhotos   = filteredPhotos.slice(0, PREVIEW_SIZE);
  const pagedPhotos     = filteredPhotos.slice(currentPage * EXPANDED_SIZE, (currentPage + 1) * EXPANDED_SIZE);
  const displayedPhotos = isExpanded ? pagedPhotos : previewPhotos;

  useEffect(() => {
    fetch('/api/settings/gallery')
      .then(r => r.json())
      .then(json => {
        const { galleryVisible, uploadsOpen } = json.data;
        setGalleryVisible(galleryVisible);
        setUploadsOpen(uploadsOpen);
        setSettingsLoaded(true);
        if (galleryVisible) {
          return fetch('/api/photos')
            .then(r => r.json())
            .then(photosJson => setPhotos(photosJson.data));
        }
      })
      .catch((err) => {
        console.error('Failed to fetch gallery settings:', err);
        setSettingsLoaded(true);
      });
  }, []);

  const refetchPhotos = async () => {
    const res = await fetch('/api/photos');
    const json = await res.json();
    setPhotos(json.data);
  };

  const handleCloudinaryError = () => {
    setUploadsOpen(false);
  };

  const openLightbox = useCallback((index) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevPhoto = useCallback(() =>
    setLightboxIndex(i => (i - 1 + filteredPhotos.length) % filteredPhotos.length), [filteredPhotos.length]);
  const nextPhoto = useCallback(() =>
    setLightboxIndex(i => (i + 1) % filteredPhotos.length), [filteredPhotos.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, prevPhoto, nextPhoto, closeLightbox]);

  useEffect(() => {
    setCurrentPage(0);
    setIsExpanded(false);
  }, [filterType, sortBy, nameQuery]);

  if (settingsLoaded && !galleryVisible) return null;

  const activePhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <>
      <section className="w-full py-16 lg:py-20 xl:py-24 px-4 md:px-8 lg:px-16 xl:px-24 bg-white">
        <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
          <h2 className="cormorant-garamond-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-700 text-center mb-12 lg:mb-16 drop-shadow-md">
            Photo Gallery
          </h2>

          {filteredPhotos.length === 0 && validPhotos.length === 0 ? (
            <p className="cormorant-garamond-light text-xl md:text-2xl text-gray-500 italic text-center">
              Be the first to share a memory ✦
            </p>
          ) : (
            <>
              {/* Filter and sort controls */}
              {validPhotos.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
                  {/* Type filter */}
                  <div className="inline-flex rounded-lg bg-gray-100 p-1">
                    {[
                      { value: 'all',   label: `All (${validPhotos.length})` },
                      { value: 'image', label: 'Photos' },
                      { value: 'video', label: 'Videos' },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFilterType(value)}
                        className={`px-4 py-2 rounded-md text-sm transition-all duration-200 cormorant-garamond-medium ${
                          filterType === value
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Sort order */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cormorant-garamond-regular text-base text-gray-700 bg-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>

                  {/* Name search */}
                  <input
                    type="text"
                    value={nameQuery}
                    onChange={(e) => setNameQuery(e.target.value)}
                    placeholder="Search by name..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent cormorant-garamond-regular text-lg text-gray-700"
                  />
                </div>
              )}

              {/* No results for this filter */}
              {filteredPhotos.length === 0 ? (
                <p className="cormorant-garamond-light text-xl md:text-2xl text-gray-500 italic text-center">
                  {nameQuery.trim()
                    ? `No results for "${nameQuery}".`
                    : `No ${filterType === 'image' ? 'photos' : 'videos'} yet.`}
                </p>
              ) : (
                <>
                  {/* Photo grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {displayedPhotos.map((photo, index) => {
                      const globalIndex = isExpanded
                        ? currentPage * EXPANDED_SIZE + index
                        : index;
                      return (
                        <button
                          key={photo._id || index}
                          type="button"
                          onClick={() => openLightbox(globalIndex)}
                          className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
                        >
                          {photo.resourceType === 'image' ? (
                            <img
                              src={photo.url}
                              alt={photo.caption || 'Guest photo'}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                          ) : (
                            <video
                              src={photo.url}
                              preload="metadata"
                              className="w-full h-full object-cover"
                            />
                          )}
                          {photo.resourceType === 'video' && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="bg-black/40 rounded-full p-2">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Preview mode: more photos available */}
                  {!isExpanded && hasMore && (
                    <div className="flex flex-col items-center gap-3 mt-8">
                      <button
                        type="button"
                        onClick={() => { setIsExpanded(true); setCurrentPage(0); }}
                        className="px-6 py-2 text-gray-600 cormorant-garamond-semibold text-lg hover:text-gray-800 transition-colors"
                      >
                        Show All ({filteredPhotos.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsExpanded(true); setCurrentPage(0); }}
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                        aria-label="Show more"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Expanded mode: multiple pages */}
                  {isExpanded && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                      <button
                        type="button"
                        onClick={() => currentPage === 0 ? setIsExpanded(false) : setCurrentPage(p => p - 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                        aria-label="Previous page"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>

                      <span className="cormorant-garamond-regular text-lg text-gray-600">
                        {currentPage + 1} / {totalPages}
                      </span>

                      <button
                        type="button"
                        onClick={() => setCurrentPage(p => p + 1)}
                        disabled={currentPage >= totalPages - 1}
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Next page"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Expanded mode: only one page */}
                  {isExpanded && totalPages === 1 && (
                    <div className="flex flex-col items-center mt-8">
                      <button
                        type="button"
                        onClick={() => setIsExpanded(false)}
                        className="px-6 py-2 text-gray-600 cormorant-garamond-semibold text-lg hover:text-gray-800 transition-colors"
                      >
                        Show Less
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {uploadsOpen ? (
            <GalleryUploader
              onUploadComplete={refetchPhotos}
              onCloudinaryError={handleCloudinaryError}
            />
          ) : (
            <p className="cormorant-garamond-light text-base md:text-lg text-gray-400 italic text-center mt-8">
              Uploads are currently closed.
            </p>
          )}
        </div>
      </section>

      {activePhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {filteredPhotos.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors"
                aria-label="Previous"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors"
                aria-label="Next"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div
            className="max-w-5xl max-h-[90vh] w-full mx-8 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {activePhoto.resourceType === 'image' ? (
              <img
                src={activePhoto.url}
                alt={activePhoto.caption || 'Guest photo'}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
            ) : (
              <video
                src={activePhoto.url}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] rounded-lg"
              />
            )}
            {activePhoto.uploaderName && (
              <p className="absolute bottom-6 left-0 right-0 text-center text-white/70 cormorant-garamond-light text-lg">
                {activePhoto.uploaderName}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
