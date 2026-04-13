import { useEffect, useState } from 'react';
import { base64ToBuffer, importKey } from '../lib/encryption';

export function useDecryptionKeys(hash: string) {
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);

  useEffect(() => {
    const fragment = hash.substring(1);
    if (!fragment) return;

    async function setKey() {
      try {
        const keyBuffer = base64ToBuffer(fragment);
        const key = await importKey(keyBuffer);
        setCryptoKey(key);
      } catch (err) {
        console.error('Invalid key in URL', err);
      }
    }
    setKey();
  }, [hash]);

  return { cryptoKey };
}
