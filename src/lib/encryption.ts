// parsers
export function generateEncryptionKey() {
  const rawKey = crypto.getRandomValues(new Uint8Array(32));
  const keyHex = Array.from(rawKey)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return { rawKey, keyHex };
}

export function parseKeyHex(keyHex: string): Uint8Array {
  const rawKey = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    rawKey[i] = parseInt(keyHex.slice(i * 2, i * 2 + 2), 16);
  }
  return rawKey;
}

// worker manager
export class CryptoWorkerManager {
  private worker: Worker;

  constructor() {
    this.worker = new Worker(new URL('./crypto.worker.ts', import.meta.url), {
      type: 'module',
    });
  }

  async processChunk(
    type: 'ENCRYPT' | 'DECRYPT',
    chunk: ArrayBuffer,
    rawKey: Uint8Array,
  ): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      this.worker.onmessage = (e) => {
        if (e.data.type === 'SUCCESS') resolve(e.data.payload);
        else reject(new Error(`Worker Error: ${e.data.error}`));
      };

      // send as obj
      this.worker.postMessage({ type, chunk, rawKey }, [chunk]);
    });
  }
  terminate() {
    this.worker.terminate();
  }
}
