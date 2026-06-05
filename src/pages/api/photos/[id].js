import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { COLLECTION_NAME } from '@/models/Photo';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const col = db.collection(COLLECTION_NAME);
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      let objectId;
      try {
        objectId = new ObjectId(id);
      } catch {
        return res.status(400).json({ success: false, error: 'Invalid id' });
      }

      const photo = await col.findOne({ _id: objectId });
      if (!photo) return res.status(404).json({ success: false, error: 'Photo not found' });

      const cloudinary = (await import('@/lib/cloudinary')).default;
      await cloudinary.uploader.destroy(photo.publicId, { resource_type: photo.resourceType });

      await col.deleteOne({ _id: objectId });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Failed to delete photo' });
    }
  }

  res.setHeader('Allow', ['DELETE']);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
