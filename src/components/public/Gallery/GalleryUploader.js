import { useState } from 'react';
import { FileUploaderRegular } from '@uploadcare/react-uploader';
import '@uploadcare/react-uploader/core.css';

export default function GalleryUploader({ onUploadComplete, onCloudinaryError }) {
  const [uploaderName, setUploaderName] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'saving' | 'done' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileUploadSuccess = async (fileInfo) => {
    setStatus('saving');
    setErrorMessage(null);

    try {
      const resourceType = fileInfo.isImage ? 'image' : 'video';
      const width  = fileInfo.imageInfo?.width  ?? null;
      const height = fileInfo.imageInfo?.height ?? null;
      const format = fileInfo.mimeType?.split('/')[1] ?? null;

      const saveRes = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicId:     fileInfo.uuid,
          url:          fileInfo.cdnUrl,
          resourceType,
          width,
          height,
          format,
          uploaderName: uploaderName.trim() || undefined,
        }),
      });

      const saveJson = await saveRes.json();
      if (!saveJson.success) throw new Error(saveJson.error || 'Save failed');

      setStatus('done');
      onUploadComplete?.();

      setTimeout(() => {
        setStatus('idle');
        setErrorMessage(null);
      }, 2500);
    } catch (err) {
      console.error('Photo save error:', err);
      setStatus('error');
      setErrorMessage('Upload succeeded but could not be saved. Please contact us.');
    }
  };

  const handleUploadFailed = (err) => {
    console.error('Uploadcare upload failed:', err);
    onCloudinaryError?.();
    setStatus('error');
    setErrorMessage('There was a storage error. Please try again.');
  };

  return (
    <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto mt-10">
      <h3 className="cormorant-garamond-light text-2xl md:text-3xl lg:text-4xl text-gray-600 text-center italic mb-6">
        Share a Memory
      </h3>

      <div className="flex flex-col gap-4">
        {/* Optional name input */}
        <div className="flex flex-col gap-1">
          <input
            type="text"
            value={uploaderName}
            onChange={(e) => setUploaderName(e.target.value)}
            placeholder="Your name (optional)"
            maxLength={100}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-base cormorant-garamond-regular text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Uploadcare widget */}
        <FileUploaderRegular
          pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY}
          multiple={true}
          sourceList="local, camera"
          onFileUploadSuccess={handleFileUploadSuccess}
          onFileUploadFailed={handleUploadFailed}
        />

        {/* Status messages */}
        {status === 'saving' && (
          <p className="cormorant-garamond-regular text-base text-gray-500 text-center">
            Saving…
          </p>
        )}
        {status === 'done' && (
          <p className="cormorant-garamond-regular text-base text-green-600 text-center">
            Thank you for sharing your memory!
          </p>
        )}
        {status === 'error' && errorMessage && (
          <p className="cormorant-garamond-regular text-base text-red-500 text-center">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}
