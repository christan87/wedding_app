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

    const mime = file.type.toLowerCase();
    const isImage = mime.startsWith('image/') || mime === '' || mime === 'application/octet-stream';
    const isVideo = mime.startsWith('video/');
    const ext = file.name.split('.').pop().toLowerCase();
    const isHeic = ['heic', 'heif'].includes(ext);

    if (!isImage && !isVideo && !isHeic) {
      setErrorMessage('Only image or video files are allowed.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 52428800) {
      setErrorMessage('File is too large. Maximum size is 50 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || status === 'uploading') return;

    setStatus('uploading');
    setErrorMessage(null);

    // Step 1 — get signed upload params
    let params;
    try {
      const paramsRes = await fetch('/api/photos/upload-params');
      if (!paramsRes.ok) {
        const text = await paramsRes.text();
        console.error('upload-params failed:', paramsRes.status, text);
        setStatus('error');
        setErrorMessage('Could not start upload. Please try again.');
        return;
      }
      const paramsJson = await paramsRes.json();
      params = paramsJson.data;
    } catch (err) {
      console.error('upload-params fetch error:', err);
      setStatus('error');
      setErrorMessage('Could not start upload. Please check your connection and try again.');
      return;
    }

    // Step 2 — upload file directly to Cloudinary
    let cloudData;
    try {
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
        const text = await cloudRes.text();
        console.error('Cloudinary upload failed:', cloudRes.status, text);
        onCloudinaryError?.();
        setStatus('error');
        setErrorMessage('There was a storage error. Please try again later.');
        return;
      }

      cloudData = await cloudRes.json();
    } catch (err) {
      console.error('Cloudinary fetch error:', err);
      onCloudinaryError?.();
      setStatus('error');
      setErrorMessage('Upload failed. Please check your connection and try again.');
      return;
    }

    // Step 3 — save metadata to MongoDB via /api/photos
    try {
      const saveRes = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicId:     cloudData.public_id,
          url:          cloudData.secure_url,
          resourceType: cloudData.resource_type,
          width:        cloudData.width,
          height:       cloudData.height,
          format:       cloudData.format,
          uploaderName: uploaderName.trim() || undefined,
        }),
      });

      const saveJson = await saveRes.json();
      if (!saveJson.success) {
        console.error('Photo save failed:', saveJson.error);
        setStatus('error');
        setErrorMessage('Photo uploaded but could not be saved. Please contact us.');
        return;
      }

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
      console.error('Photo save fetch error:', err);
      setStatus('error');
      setErrorMessage('Photo uploaded but could not be saved. Please contact us.');
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
