import { useState, useEffect, useCallback } from 'react';
import GalleryUploader from './GalleryUploader';

export default function GallerySection() {
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [uploadsOpen, setUploadsOpen] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

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
    setLightboxIndex(i => (i - 1 + photos.length) % photos.length), [photos.length]);
  const nextPhoto = useCallback(() =>
    setLightboxIndex(i => (i + 1) % photos.length), [photos.length]);

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

  if (settingsLoaded && !galleryVisible) return null;

  const activePhoto = lightboxIndex !== null ? photos[lightboxIndex] : null;

  return (
    <>
      <section className="w-full py-16 lg:py-20 xl:py-24 px-4 md:px-8 lg:px-16 xl:px-24 bg-white">
        <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
          <h2 className="cormorant-garamond-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-700 text-center mb-12 lg:mb-16 drop-shadow-md">
            Photo Gallery
          </h2>

          {photos.length === 0 ? (
            <p className="cormorant-garamond-light text-xl md:text-2xl text-gray-500 italic text-center">
              Be the first to share a memory ✦
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {photos.filter(photo => photo.url?.startsWith('https://ucarecdn.com')).map((photo, index) => (
                <button
                  key={photo._id || index}
                  type="button"
                  onClick={() => openLightbox(index)}
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
              ))}
            </div>
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

          {photos.length > 1 && (
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
