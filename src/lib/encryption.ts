// parsers
export const toBase64 = (b: ArrayBuffer): string =>
  btoa(String.fromCharCode(...new Uint8Array(b)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

export const parseBase64 = (s: string): Uint8Array => {
  let b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4 !== 0) b64 += '=';
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
};

export const generateEncryptionKey = () => {
  const rawKey = crypto.getRandomValues(new Uint8Array(32));
  return { rawKey, base64Key: toBase64(rawKey.buffer) };
};

// worker
export class CryptoWorkerManager {
  private worker: Worker;

  constructor() {
    this.worker = new Worker(new URL('./crypto.worker.ts', import.meta.url), {
      type: 'module',
    });
  }
  processChunk(
    type: 'ENCRYPT' | 'DECRYPT',
    chunk: ArrayBuffer,
    rawKey: Uint8Array,
  ): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      this.worker.onmessage = (e: MessageEvent) => {
        const { type: resType, payload, error } = e.data;
        if (resType === 'SUCCESS') resolve(payload);
        else reject(new Error(error));
      };
      this.worker.postMessage({ type, chunk, rawKey }, [chunk]);
    });
  }
  terminate() {
    this.worker.terminate();
  }
}
