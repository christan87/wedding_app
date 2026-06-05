export const COLLECTION_NAME = 'photos';

export function validatePhoto(data) {
  const errors = [];
  if (!data.publicId || typeof data.publicId !== 'string' || !data.publicId.trim()) {
    errors.push('publicId is required');
  }
  if (!data.url || typeof data.url !== 'string' || !data.url.trim()) {
    errors.push('url is required');
  }
  if (!['image', 'video'].includes(data.resourceType)) {
    errors.push('resourceType must be image or video');
  }
  return { isValid: errors.length === 0, errors };
}

export function createPhotoObject(data) {
  return {
    publicId:     String(data.publicId || '').trim(),
    url:          String(data.url || '').trim(),
    resourceType: data.resourceType === 'video' ? 'video' : 'image',
    width:        data.width ? Number(data.width) : undefined,
    height:       data.height ? Number(data.height) : undefined,
    format:       data.format ? String(data.format) : undefined,
    uploaderName: data.uploaderName ? String(data.uploaderName).trim().slice(0, 200) : undefined,
    createdAt:    new Date(),
  };
}
