import { useState, useEffect } from 'react';
import ProtectedPage from '@/components/admin/ProtectedPage';
import AdminLayout from '@/components/admin/AdminLayout';
import ToastNotification from '@/components/public/ToastNotification';

export default function AdminGalleryPage() {
  const [settings, setSettings] = useState({ galleryVisible: false, uploadsOpen: false });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/settings/gallery'),
      fetch('/api/photos'),
    ])
      .then(async ([settingsRes, photosRes]) => {
        const settingsData = await settingsRes.json();
        const photosData = await photosRes.json();
        setSettings(settingsData.data || { galleryVisible: false, uploadsOpen: false });
        setPhotos(photosData.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load gallery data:', err);
        setToast({ visible: true, type: 'error', message: 'Failed to load gallery data.' });
        setLoading(false);
      });
  }, []);

  async function handleToggle(field, value) {
    try {
      const res = await fetch('/api/settings/gallery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update setting');
      setSettings(prev => ({ ...prev, [field]: value }));
      setToast({ visible: true, type: 'success', message: 'Setting updated.' });
    } catch (err) {
      setToast({ visible: true, type: 'error', message: err.message || 'Failed to update setting.' });
    }
  }

  async function handleDelete(id, publicId, resourceType) {
    try {
      const res = await fetch(`/api/photos/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete media');
      setPhotos(prev => prev.filter(p => p._id !== id));
      setToast({ visible: true, type: 'success', message: 'Media deleted.' });
    } catch (err) {
      setToast({ visible: true, type: 'error', message: err.message || 'Failed to delete media.' });
    }
  }

  return (
    <ProtectedPage>
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
            <p className="mt-1 text-sm text-gray-500">Manage gallery visibility and uploaded media</p>
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Gallery Settings</h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Gallery visible to guests</p>
                <p className="text-sm text-gray-500">When off, the gallery is hidden from the landing page.</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('galleryVisible', !settings.galleryVisible)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.galleryVisible ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${settings.galleryVisible ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>

            <hr className="my-6 border-gray-200" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Guest uploads open</p>
                <p className="text-sm text-gray-500">When off, guests cannot upload new photos or videos.</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('uploadsOpen', !settings.uploadsOpen)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.uploadsOpen ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${settings.uploadsOpen ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
          </div>

          {/* Media Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Uploaded Media</h2>

            {loading && (
              <p className="text-sm text-gray-500">Loading…</p>
            )}

            {!loading && photos.length === 0 && (
              <p className="text-sm text-gray-500">No photos or videos uploaded yet.</p>
            )}

            {!loading && photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map(photo => (
                  <div key={photo._id} className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-square">
                    {photo.resourceType === 'image' ? (
                      <img
                        src={photo.url}
                        alt={photo.caption || 'Guest photo'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={photo.url}
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(photo._id, photo.publicId, photo.resourceType)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                    {photo.uploaderName && (
                      <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 truncate">
                        {photo.uploaderName}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {toast !== null && (
          <ToastNotification
            visible={toast.visible}
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </AdminLayout>
    </ProtectedPage>
  );
}
