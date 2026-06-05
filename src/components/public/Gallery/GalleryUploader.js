import { useState, useRef } from 'react';

const MAX_BYTES = 52428800; // 50 MB

export default function GalleryUploader({ onUploadComplete, onCloudinaryError }) {
  const [status, setStatus] = useState('idle');
  const [uploaderName, setUploaderName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setErrorMessage(null);

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setErrorMessage('Only image or video files are allowed.');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_BYTES) {
      setErrorMessage('File must be under 50 MB.');
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || status === 'uploading') return;

    setStatus('uploading');
    setErrorMessage(null);

    try {
      // Step 1 — get signed upload params
      const paramsRes = await fetch('/api/photos/upload-params');
      const paramsJson = await paramsRes.json();
      const params = paramsJson.data;

      // Step 2 — upload directly to Cloudinary
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('timestamp', params.timestamp);
      formData.append('signature', params.signature);
      formData.append('api_key', params.apiKey);
      formData.append('folder', params.folder);

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${params.cloudName}/auto/upload`,
        { method: 'POST', body: formData }
      );

      if (!cloudRes.ok) {
        onCloudinaryError?.();
        setStatus('error');
        setErrorMessage('There was a storage error. Please try again later.');
        return;
      }

      const cloudData = await cloudRes.json();
      const { public_id, secure_url, resource_type, width, height, format } = cloudData;

      // Step 3 — save metadata to MongoDB
      const saveRes = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicId: public_id,
          url: secure_url,
          resourceType: resource_type,
          width,
          height,
          format,
          uploaderName: uploaderName.trim() || undefined,
        }),
      });

      const saveJson = await saveRes.json();
      if (!saveJson.success) throw new Error(saveJson.error || 'Failed to save photo');

      setStatus('done');
      onUploadComplete?.();

      setTimeout(() => {
        setStatus('idle');
        setSelectedFile(null);
        setUploaderName('');
        setErrorMessage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 2000);

    } catch (err) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto mt-10">
      <h3 className="cormorant-garamond-light text-2xl md:text-3xl lg:text-4xl text-gray-600 text-center italic mb-6">
        Share a Memory
      </h3>

      <div className="flex flex-col gap-4">
        {/* Name input */}
        <input
          type="text"
          value={uploaderName}
          onChange={(e) => setUploaderName(e.target.value)}
          placeholder="Your name (optional)"
          maxLength={200}
          disabled={status === 'uploading'}
          className="w-full px-4 py-3 lg:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cormorant-garamond-regular text-lg lg:text-xl text-gray-700 disabled:bg-gray-50 disabled:text-gray-400"
        />

        {/* File selector + upload button row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Styled file label */}
          <label className="cursor-pointer">
            <span className="inline-block px-5 py-3 border border-gray-400 rounded-lg cormorant-garamond-semibold text-lg text-gray-700 hover:bg-gray-50 transition-colors">
              {selectedFile ? 'Change file' : 'Choose file'}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              disabled={status === 'uploading'}
              className="sr-only"
            />
          </label>

          {/* Selected filename */}
          {selectedFile && (
            <span className="cormorant-garamond-regular text-base text-gray-500 truncate max-w-xs">
              {selectedFile.name}
            </span>
          )}

          {/* Upload button */}
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || status === 'uploading'}
            className="px-8 py-3 bg-gray-700 text-white cormorant-garamond-semibold text-lg rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {status === 'uploading' ? 'Uploading…' : 'Upload'}
          </button>
        </div>

        {/* Status feedback */}
        {status === 'uploading' && (
          <p className="cormorant-garamond-regular text-base text-gray-500 text-center">
            Uploading…
          </p>
        )}

        {status === 'done' && (
          <p className="cormorant-garamond-regular text-base text-green-600 text-center">
            Uploaded! Thank you for sharing.
          </p>
        )}

        {status === 'error' && errorMessage && (
          <p className="cormorant-garamond-regular text-base text-red-500 text-center">
            {errorMessage}
          </p>
        )}

        {status === 'idle' && errorMessage && (
          <p className="cormorant-garamond-regular text-base text-red-500 text-center">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
