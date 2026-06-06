import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { COLLECTION_NAME } from '@/models/Photo';
import { deleteUploadcareFile } from '@/lib/uploadcare';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  const { id } = req.query;
  let objectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return res.status(400).json({ success: false, error: 'Invalid id' });
  }

  try {
    const { db } = await connectToDatabase();
    const col = db.collection(COLLECTION_NAME);

    const photo = await col.findOne({ _id: objectId });
    if (!photo) return res.status(404).json({ success: false, error: 'Photo not found' });

    const isUploadcareUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(photo.publicId);

    if (isUploadcareUuid) {
      await deleteUploadcareFile(photo.publicId);
    }
    // If not a UUID, it's a legacy Cloudinary asset — skip remote delete,
    // just remove the MongoDB record below.

    await col.deleteOne({ _id: objectId });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Failed to delete photo' });
  }
}
