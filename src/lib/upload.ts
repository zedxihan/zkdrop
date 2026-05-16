import axios from 'axios';
import type { UploadProps } from '../types';
import api from './api';
import {
  CryptoWorkerManager,
  generateEncryptionKey,
  toBase64,
} from './encryption';

const CHUNK_SIZE = 10 * 1024 * 1024;

export async function uploadFile({
  file,
  onProgress,
  setProgress,
}: UploadProps): Promise<string> {
  const { rawKey, base64Key } = generateEncryptionKey();

  onProgress('encrypting');
  const {
    data: { id, uploadId, partUrls },
  } = await api.post('/api/upload/init', { size: file.size });

  const worker = new CryptoWorkerManager();
  const loadedParts = new Array(partUrls.length).fill(0);
  // progress bar
  const trackProgress = (i: number, loaded: number) => {
    loadedParts[i] = loaded;
    const total = loadedParts.reduce((a, b) => a + b, 0);
    setProgress(Math.min(99, Math.round((total / file.size) * 100)));
  };

  try {
    onProgress('uploading');
    const parts: { PartNumber: number; ETag: string }[] = [];

    for (const [i, url] of partUrls.entries()) {
      const chunk = await file
        .slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
        .arrayBuffer();
      const encrypted = await worker.processChunk('ENCRYPT', chunk, rawKey);

      const { headers } = await axios.put(url, encrypted, {
        onUploadProgress: (e) => trackProgress(i, e.loaded ?? 0),
      });
      parts.push({ PartNumber: i + 1, ETag: headers.etag! });
    }

    onProgress('finalizing');

    const nameBuffer = new TextEncoder().encode(file.name);
    const encryptedNameBuffer = await worker.processChunk(
      'ENCRYPT',
      nameBuffer.buffer as ArrayBuffer,
      rawKey,
    );
    const fileName = toBase64(encryptedNameBuffer);

    await api.post('/api/upload/complete', {
      id,
      uploadId,
      parts,
      fileName,
      size: file.size,
    });

    setProgress(100);
    onProgress('done');
    return `${location.origin}/file/${id}#${base64Key}`;
  } catch (error) {
    await api.post('/api/upload/abort', { id, uploadId }).catch(console.error);
    throw error;
  } finally {
    worker.terminate();
  }
}
