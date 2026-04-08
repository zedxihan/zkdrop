import { supabase } from './supabase';
import { bufferToBase64, encryptFile, exportKey } from './encryption';

export async function uploadFile(file: File): Promise<string> {
  const { encryptedBuffer, key, iv } = await encryptFile(file);
  const rawKey = await exportKey(key);
  const base64Key = bufferToBase64(rawKey);
  const base64Iv = bufferToBase64(iv);

  const filePath = `${file.name}-${Date.now()}`;

  const encryptedFile = new File([encryptedBuffer], file.name + '.enc');

  const { error } = await supabase.storage
    .from('files')
    .upload(filePath, encryptedFile);

  if (error) {
    console.error('Failed to upload file: ', error.message);
    throw error;
  }

  // expiration
  const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hr
  const { error: dbError } = await supabase.from('files-table').insert({
    file_path: filePath,
    expires_at: expiresAt.toISOString(),
  });
  if (dbError) {
    console.error('Failed to insert file metadata: ', dbError.message);
    throw dbError;
  }

  const encodedName = encodeURIComponent(file.name);
  const encodedType = encodeURIComponent(file.type);
  const shareableLink = `${window.location.origin}/file/${filePath}#${[
    base64Key,
    base64Iv,
    encodedName,
    encodedType,
  ].join('.')}`;

  return shareableLink;
}
