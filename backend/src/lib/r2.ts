import {
  GetObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { D1Database, R2Bucket } from '@cloudflare/workers-types';

export interface R2Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  BUCKET_NAME: string;
  R2_ACCOUNT_ID: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
}

let client: S3Client | null = null;
const CHUNK_SIZE = 10 * 1024 * 1024;

const getClient = (env: R2Env) =>
  (client ??= new S3Client({
    region: 'auto',
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  }));

export const R2 = {
  startMultipart: async (env: R2Env, Key: string) => {
    const upload = await env.BUCKET.createMultipartUpload(Key);
    return upload.uploadId;
  },

  getChunkUrls: (
    env: R2Env,
    Key: string,
    fileSize: number,
    UploadId: string,
  ) => {
    const s3 = getClient(env);
    const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);

    return Promise.all(
      Array.from({ length: totalChunks }, (_, i) => {
        const command = new UploadPartCommand({
          Bucket: env.BUCKET_NAME,
          Key,
          UploadId,
          PartNumber: i + 1,
        });
        return getSignedUrl(s3, command, { expiresIn: 900 });
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

  abortMultipart: (env: R2Env, Key: string, UploadId: string) => {
    const upload = env.BUCKET.resumeMultipartUpload(Key, UploadId);
    return upload.abort();
  },

  getDownloadUrl: (env: R2Env, Key: string) => {
    const s3 = getClient(env);
    const command = new GetObjectCommand({
      Bucket: env.BUCKET_NAME,
      Key,
    });
    return getSignedUrl(s3, command, { expiresIn: 900 });
  },

  deleteFile: (env: R2Env, keys: string[]) => {
    return env.BUCKET.delete(keys);
  },
};
