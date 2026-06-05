import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const col = db.collection('settings');

  if (req.method === 'GET') {
    try {
      const doc = await col.findOne({ key: 'gallery' });
      return res.status(200).json({
        success: true,
        data: doc
          ? { galleryVisible: doc.galleryVisible ?? false, uploadsOpen: doc.uploadsOpen ?? false }
          : { galleryVisible: false, uploadsOpen: false },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Failed to fetch settings' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { galleryVisible, uploadsOpen } = req.body;
      const update = {};
      if (typeof galleryVisible === 'boolean') update.galleryVisible = galleryVisible;
      if (typeof uploadsOpen === 'boolean') update.uploadsOpen = uploadsOpen;
      await col.updateOne({ key: 'gallery' }, { $set: update }, { upsert: true });
      const doc = await col.findOne({ key: 'gallery' });
      return res.status(200).json({
        success: true,
        data: { galleryVisible: doc.galleryVisible ?? false, uploadsOpen: doc.uploadsOpen ?? false },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Failed to update settings' });
    }
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
