/// <reference lib="webworker" />
self.onmessage = async (e) => {
  const { type, chunk, rawKey } = e.data;

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      rawKey,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt'],
    );

    // Encrypt
    if (type === 'ENCRYPT') {
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        chunk,
      );
      const payload = new Uint8Array(iv.length + encrypted.byteLength);

      payload.set(iv, 0);
      payload.set(new Uint8Array(encrypted), iv.length);

      self.postMessage({ type: 'SUCCESS', payload: payload.buffer }, [
        payload.buffer,
      ]);
    }

    // Decrypt
    else if (type === 'DECRYPT') {
      const iv = new Uint8Array(chunk.slice(0, 12));
      const encryptedChunk = chunk.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encryptedChunk,
      );

      self.postMessage({ type: 'SUCCESS', payload: decrypted }, [decrypted]);
    }
  } catch (err) {
    self.postMessage({ type: 'ERROR', error: (err as Error).message });
  }
};
