interface EncryptedFile {
  encryptedBuffer: ArrayBuffer;
  key: CryptoKey;
  iv: Uint8Array;
}

// encrypt file
export async function encryptFile(file: File): Promise<EncryptedFile> {
  const arrayBuffer = await file.arrayBuffer();

  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt'],
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    arrayBuffer,
  );
  return { encryptedBuffer, key, iv };
}

// export key
export async function exportKey(key: CryptoKey): Promise<ArrayBuffer> {
  return await crypto.subtle.exportKey('raw', key);
}

// convert to base64
export function bufferToBase64(input: ArrayBuffer | Uint8Array): string {
  const isUnit8 = input instanceof Uint8Array;
  const bytes = isUnit8 ? input : new Uint8Array(input);

  let binary = '';

  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary);
}
