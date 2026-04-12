import { supabase } from './supabase';
import { decryptFile } from './encryption';
import type { DownloadProps } from '../types';

export async function downloadFile({
  fileId,
  fileName,
  cryptoKey,
  iv,
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
  const encrypted = await res.arrayBuffer();

  onProgress('decrypting');
  setProgress(75);

  const decrypted = await decryptFile(encrypted, cryptoKey, iv);

  const blob = new Blob([decrypted]);
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(url);

  setProgress(100);
  onProgress('done');
}
