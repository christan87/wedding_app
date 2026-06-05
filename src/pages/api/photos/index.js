import { connectToDatabase } from '@/lib/mongodb';
import { validatePhoto, createPhotoObject, COLLECTION_NAME } from '@/models/Photo';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const col = db.collection(COLLECTION_NAME);

  if (req.method === 'GET') {
    try {
      const photos = await col.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({ success: true, data: photos });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Failed to fetch photos' });
    }
  }

  if (req.method === 'POST') {
    try {
      const validation = validatePhoto(req.body);
      if (!validation.isValid) {
        return res.status(400).json({ success: false, errors: validation.errors });
      }
      const photo = createPhotoObject(req.body);
      const result = await col.insertOne(photo);
      return res.status(201).json({ success: true, data: { _id: result.insertedId, ...photo } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Failed to save photo' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
}
