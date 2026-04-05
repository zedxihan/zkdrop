import { supabase } from './supabase';
import { encryptFile, exportKey, bufferToBase64 } from './encryption';

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
  const shareableLink = `${window.location.origin}/file/${filePath}#${base64Key}.${base64Iv}`;

  return shareableLink;
}
