import { deleteFile } from '@uploadcare/rest-client';
import { UploadcareSimpleAuthSchema } from '@uploadcare/rest-client';

export async function deleteUploadcareFile(uuid) {
  const authSchema = new UploadcareSimpleAuthSchema({
    publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY,
    secretKey: process.env.UPLOADCARE_SECRET_KEY,
  });

  console.log('Deleting Uploadcare file:', uuid);
  console.log('Public key present:', !!process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY);
  console.log('Secret key present:', !!process.env.UPLOADCARE_SECRET_KEY);

  await deleteFile({ uuid }, { authSchema });
}

export default null;
