import { supabase } from './supabase';
import { bufferToBase64, encryptFile, exportKey } from './encryption';
import type { UploadProps } from '../types';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function step(
  setProgress: (v: number) => void,
  value: number,
  delay = 0,
) {
  setProgress(value);
  if (delay) await sleep(delay);
}

export async function uploadFile({
  file,
  onProgress,
  setProgress,
}: UploadProps): Promise<string> {
  onProgress('encrypting');
  await step(setProgress, 10, 600);
  await step(setProgress, 25);

  const { encryptedBuffer, key } = await encryptFile(file);
  await step(setProgress, 35, 600);

  const rawKey = await exportKey(key);
  const base64Key = bufferToBase64(rawKey);

  const filePath = `${crypto.randomUUID()}.enc`;
  const encryptedFile = new Blob([encryptedBuffer], {
    type: 'application/octet-stream',
  });

  onProgress('uploading');
  await step(setProgress, 45, 200);
  await step(setProgress, 70, 200);

  const { error } = await supabase.storage
    .from('files')
    .upload(filePath, encryptedFile);

  if (error) {
    console.error('Failed to upload file:', error.message);
    throw error;
  }
  await step(setProgress, 90);

  onProgress('finalizing');
  await step(setProgress, 95, 300);

  const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000);

  const [, dbResult] = await Promise.all([
    sleep(600),
    supabase.from('files-table').insert({
      file_path: filePath,
      expires_at: expiresAt.toISOString(),
    }),
  ]);

  if (dbResult.error) {
    await supabase.storage.from('files').remove([filePath]);
    console.error('Failed to insert metadata:', dbResult.error.message);
    throw dbResult.error;
  }

  const shareableLink = `${window.location.origin}/file/${encodeURIComponent(
    filePath,
  )}#${base64Key}`;

  await step(setProgress, 100);
  onProgress('done');
  return shareableLink;
}
