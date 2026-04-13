import type { EncryptedFile } from "../types";

// converters
export function bufferToBase64(input: ArrayBuffer | Uint8Array): string {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  return btoa(String.fromCharCode(...bytes));
}

export function base64ToBuffer(base64: string): ArrayBuffer {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)).buffer;
}

// export-import
export const exportKey = (key: CryptoKey): Promise<ArrayBuffer> =>
  crypto.subtle.exportKey("raw", key);

export const importKey = (rawKey: ArrayBuffer): Promise<CryptoKey> =>
  crypto.subtle.importKey("raw", rawKey, { name: "AES-GCM" }, false, [
    "decrypt",
  ]);

/*---- Encrypt file ----*/
export async function encryptFile(file: File): Promise<EncryptedFile> {
  const meta = new TextEncoder().encode(
    JSON.stringify({
      name: file.name,
      type: file.type,
    }),
  );

  const combinedBlob = new Blob([new Uint32Array([meta.length]), meta, file]);
  const merged = new Uint8Array(await combinedBlob.arrayBuffer());

  const key = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    merged,
  );

  const payload = new Uint8Array(12 + encrypted.byteLength);
  payload.set(iv, 0);
  payload.set(new Uint8Array(encrypted), 12);

  return {
    encryptedBuffer: payload.buffer,
    key,
  };
}

/*---- Decrypt file ----*/
export async function decryptFile(
  encryptedPayload: ArrayBuffer,
  key: CryptoKey,
): Promise<{
  fileBytes: ArrayBuffer;
  metadata: { name: string; type: string };
}> {
  const bytes = new Uint8Array(encryptedPayload);

  const iv = bytes.slice(0, 12);
  const encrypted = bytes.slice(12);

  const decrypted = new Uint8Array(
    await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted),
  );

  const metaLength = new Uint32Array(decrypted.slice(0, 4).buffer)[0];

  const metaBytes = decrypted.slice(4, 4 + metaLength);
  const metadata = JSON.parse(new TextDecoder().decode(metaBytes));

  const fileBytes = decrypted.slice(4 + metaLength).buffer;

  return {
    fileBytes,
    metadata,
  };
}
