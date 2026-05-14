import axios from 'axios';
import type { DownloadProps } from '../types';
import { CryptoWorkerManager, parseKeyHex } from './encryption';

// 10MB + iv + tag
const ENC_CHUNK_SIZE = 10 * 1024 * 1024 + 12 + 16;

export async function downloadFile({
  fileId,
  keyHex,
  onProgress,
  setProgress,
}: DownloadProps) {
  onProgress('fetching');
  const {
    data: { url, filename },
  } = await axios.get(`/api/file/download/${fileId}`);

  const { data: encryptedPayload } = await axios.get<ArrayBuffer>(url, {
    responseType: 'arraybuffer',
    onDownloadProgress: (e) =>
      e.total && setProgress(Math.round((e.loaded / e.total) * 100)),
  });

  const worker = new CryptoWorkerManager();
  const rawKey = parseKeyHex(keyHex);
  const totalChunks = Math.ceil(encryptedPayload.byteLength / ENC_CHUNK_SIZE);

  setProgress(0);
  onProgress('decrypting');

  try {
    const decryptedChunks: ArrayBuffer[] = [];
    for (let i = 0; i < totalChunks; i++) {
      const chunk = encryptedPayload.slice(
        i * ENC_CHUNK_SIZE,
        (i + 1) * ENC_CHUNK_SIZE,
      );
      decryptedChunks.push(await worker.processChunk('DECRYPT', chunk, rawKey));
      setProgress(Math.round(((i + 1) / totalChunks) * 100));
    }

    const blob = new Blob(decryptedChunks, {
      type: 'application/octet-stream',
    });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);

    onProgress('done');
  } finally {
    worker.terminate();
  }
}
