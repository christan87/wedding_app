import { deleteFile } from '@uploadcare/rest-client';
import { UploadcareSimpleAuthSchema } from '@uploadcare/rest-client';

export async function deleteUploadcareFile(uuid) {
  const authSchema = new UploadcareSimpleAuthSchema({
    publicKey:  process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY,
    secretKey:  process.env.UPLOADCARE_SECRET_KEY,
  });
  console.log('Attempting delete of UUID:', uuid);
  console.log('Using public key:', process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY);
  await deleteFile({ uuid }, { authSchema });
}

export default null;
