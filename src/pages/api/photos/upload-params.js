import { getSignedUploadParams } from '@/lib/cloudinary';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
  try {
    const params = getSignedUploadParams('wedding/gallery');
    return res.status(200).json({ success: true, data: params });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Failed to generate upload params' });
  }
}
