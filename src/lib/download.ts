import axios from 'axios';
import type { DownloadProps } from '../types';
import api from './api';
import { CryptoWorkerManager, parseBase64 } from './encryption';

// 10MB + iv + tag
const ENC_CHUNK_SIZE = 10 * 1024 * 1024 + 12 + 16;

export async function downloadFile({
  fileId,
  base64Key,
  onProgress,
  setProgress,
  onMeta,
}: DownloadProps) {
  onProgress('fetching');
  const {
    data: { url, filename: encryptedFilename, size },
  } = await api.get(`/api/file/download/${fileId}`);

  const rawKey = parseBase64(base64Key);
  const worker = new CryptoWorkerManager();

  try {
    // filename
    const nameBuffer = parseBase64(encryptedFilename);
    const decryptedNameBuffer = await worker.processChunk(
      'DECRYPT',
      nameBuffer.buffer as ArrayBuffer,
      rawKey,
    );
    const name = new TextDecoder().decode(decryptedNameBuffer);
    if (onMeta) onMeta({ name, size });

    // blob
    const { data: encryptedPayload } = await axios.get<ArrayBuffer>(url, {
      responseType: 'arraybuffer',
      onDownloadProgress: (e) =>
        e.total && setProgress(Math.round((e.loaded / e.total) * 90)),
    });

    const totalChunks = Math.ceil(encryptedPayload.byteLength / ENC_CHUNK_SIZE);

    onProgress('decrypting');

    const chunks: ArrayBuffer[] = [];
    for (let i = 0; i < totalChunks; i++) {
      const chunk = encryptedPayload.slice(
        i * ENC_CHUNK_SIZE,
        (i + 1) * ENC_CHUNK_SIZE,
      );

      chunks.push(await worker.processChunk('DECRYPT', chunk, rawKey));
      setProgress(90 + Math.round(((i + 1) / totalChunks) * 10));
    }

    const blob = new Blob(chunks, { type: 'application/octet-stream' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);

    onProgress('done');
  } finally {
    worker.terminate();
  }
}
