import axios from 'axios';
import type { UploadProps } from '../types';
import { CryptoWorkerManager, generateEncryptionKey } from './encryption';

const CHUNK_SIZE = 10 * 1024 * 1024;

export async function uploadFile({
  file,
  onProgress,
  setProgress,
}: UploadProps): Promise<string> {
  const { rawKey, keyHex } = generateEncryptionKey();

  onProgress('encrypting');
  const {
    data: { id, uploadId, partUrls },
  } = await axios.post('/api/upload/init', { size: file.size });

  const worker = new CryptoWorkerManager();
  const partLoaded = new Array<number>(partUrls.length).fill(0);

  const trackProgress = (i: number, loaded: number) => {
    partLoaded[i] = loaded;
    const total = partLoaded.reduce((a, b) => a + b, 0);
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
      if (!headers.etag) throw new Error(`No ETag for part ${i + 1}`);
      parts.push({ PartNumber: i + 1, ETag: headers.etag });
    }

    setProgress(100);

    onProgress('finalizing');
    await axios.post('/api/upload/complete', {
      id,
      uploadId,
      parts,
      fileName: file.name,
      size: file.size,
    });

    onProgress('done');
    return `${location.origin}/file/${id}#${keyHex}`;
  } finally {
    worker.terminate();
  }
}
