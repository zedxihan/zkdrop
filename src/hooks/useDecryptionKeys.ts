import { useEffect, useMemo, useState } from 'react';
import { base64ToBuffer, importKey } from '../lib/encryption';
import type { DecryptionKeyParams } from '../types';

export function useDecryptionKeys(hash: string) {
  // parse hash
  const params: DecryptionKeyParams = useMemo(() => {
    const fragment = hash.substring(1);
    const [base64Key, base64IV, encodedName, encodedType] = fragment.split('.');

    return { base64Key, base64IV, encodedName, encodedType };
  }, [hash]);

  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);
  const [iv, setIV] = useState<Uint8Array | null>(null);

  useEffect(() => {
    if (!params.base64Key || !params.base64IV) return;

    async function setCryptoKeyAndIV() {
      const keyBuffer = base64ToBuffer(params.base64Key);
      const ivBuffer = base64ToBuffer(params.base64IV);

      const key = await importKey(keyBuffer);

      setCryptoKey(key);
      setIV(new Uint8Array(ivBuffer));
    }
    setCryptoKeyAndIV();
  }, [params.base64Key, params.base64IV]);

  return { params, cryptoKey, iv };
}
