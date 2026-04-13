import { supabase } from './supabase';
import { decryptFile } from './encryption';
import type { DownloadProps } from '../types';

export async function downloadFile({
  fileId,
  cryptoKey,
  onProgress,
  setProgress,
}: DownloadProps) {
  onProgress('fetching');
  setProgress(30);

  const { data, error } = await supabase.storage
    .from('files')
    .createSignedUrl(fileId, 60);

  if (error) throw error;

  const res = await fetch(data.signedUrl);
  if (!res.ok) throw new Error('Failed to fetch encrypted file');
  const encryptedPayload = await res.arrayBuffer();

  onProgress('decrypting');
  setProgress(75);

  const { fileBytes, metadata } = await decryptFile(
    encryptedPayload,
    cryptoKey,
  );

  const blob = new Blob([fileBytes], {
    type: metadata.type || 'application/octet-stream',
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = metadata.name;
  a.click();

  URL.revokeObjectURL(url);

  setProgress(100);
  onProgress('done');
}
