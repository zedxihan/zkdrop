import type {
  D1Database,
  Fetcher,
  R2Bucket,
  RateLimit,
} from '@cloudflare/workers-types';
import { AwsClient } from 'aws4fetch';

export interface R2Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  BUCKET_NAME: string;
  R2_ACCOUNT_ID: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  RATE_LIMITER: RateLimit;
  FRONTEND_URL?: string;
  ASSETS?: Fetcher;
}

const CHUNK_SIZE = 10 * 1024 * 1024;

let cachedClient: AwsClient | null = null;
const getClient = (env: R2Env) =>
  (cachedClient ??= new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    region: 'auto',
    service: 's3',
  }));

// helper
const createSignedRequest = (
  env: R2Env,
  Key: string,
  method: 'GET' | 'PUT',
  params: Record<string, string> = {},
) => {
  const url = new URL(`https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`);
  url.pathname = `/${env.BUCKET_NAME}/${Key}`;

  url.searchParams.set('X-Amz-Expires', '900');
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const aws = getClient(env);
  return aws.sign(url, { method, aws: { signQuery: true } });
};

// Main
export const R2 = {
  startMultipart: async (env: R2Env, Key: string) =>
    (await env.BUCKET.createMultipartUpload(Key)).uploadId,

  getChunkUrls: (
    env: R2Env,
    Key: string,
    fileSize: number,
    UploadId: string,
  ) => {
    const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);

    return Promise.all(
      Array.from({ length: totalChunks }, async (_, i) => {
        const signed = await createSignedRequest(env, Key, 'PUT', {
          uploadId: UploadId,
          partNumber: String(i + 1),
        });
        return signed.url;
      }),
    );
  },

  completeMultipart: (
    env: R2Env,
    Key: string,
    UploadId: string,
    Parts: { ETag: string; PartNumber: number }[],
  ) => {
    const upload = env.BUCKET.resumeMultipartUpload(Key, UploadId);

    const uploadedParts = Parts.map((p) => ({
      etag: p.ETag.replace(/^"|"$/g, ''), // trim quotes
      partNumber: p.PartNumber,
    }));
    return upload.complete(uploadedParts);
  },

  abortMultipart: (env: R2Env, Key: string, UploadId: string) =>
    env.BUCKET.resumeMultipartUpload(Key, UploadId).abort(),

  getDownloadUrl: async (env: R2Env, Key: string) => {
    const signed = await createSignedRequest(env, Key, 'GET');
    return signed.url;
  },

  deleteFile: (env: R2Env, keys: string[]) => env.BUCKET.delete(keys),
};
