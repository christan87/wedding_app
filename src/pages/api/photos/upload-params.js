export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
  return res.status(200).json({
    success: true,
    data: {
      publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY,
    },
  });
}
