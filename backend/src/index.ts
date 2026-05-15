import type {
  ExecutionContext,
  ScheduledEvent,
} from '@cloudflare/workers-types';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { R2, type R2Env } from './lib/r2';

const app = new Hono<{ Bindings: R2Env }>();

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const EXPIRY_TIME = 24 * 60 * 60 * 1000;

interface FileRecord {
  id: string;
  r2_key: string;
  filename: string;
  size: number;
  expires_at: number;
}

app.use('/api/*', cors());

// upload
app.post('/api/upload/init', async (c) => {
  const { size } = await c.req.json();

  if (!size || size <= 0 || size > MAX_FILE_SIZE) {
    return c.json({ error: 'Invalid file size' }, 400);
  }

  const id = crypto.randomUUID();
  const r2_key = `files/${id}`;

  const uploadId = await R2.startMultipart(c.env, r2_key);
  const partUrls = await R2.getChunkUrls(c.env, r2_key, size, uploadId);

  return c.json({ id, uploadId, partUrls });
});

app.post('/api/upload/complete', async (c) => {
  const { id, fileName, size, uploadId, parts } = await c.req.json();

  if (
    !id ||
    !uploadId ||
    !fileName ||
    !size ||
    size > MAX_FILE_SIZE ||
    !parts?.length
  ) {
    return c.json({ error: 'Invalid payload' }, 400);
  }
  const r2_key = `files/${id}`;
  const expires_at = Date.now() + EXPIRY_TIME;

  await Promise.all([
    R2.completeMultipart(c.env, r2_key, uploadId, parts),
    c.env.DB.prepare(
      `INSERT INTO files (id, r2_key, filename, size, expires_at) VALUES (?, ?, ?, ?, ?)`,
    )
      .bind(id, r2_key, fileName, size, expires_at)
      .run(),
  ]);
  return c.json({ success: true, id });
});

// abort
app.post('/api/upload/abort', async (c) => {
  const { id, uploadId } = await c.req.json();

  if (!id || !uploadId) {
    return c.json({ error: 'Invalid payload' }, 400);
  }
  const r2_key = `files/${id}`;
  await R2.abortMultipart(c.env, r2_key, uploadId);

  return c.json({ success: true });
});

// download
app.get('/api/file/download/:id', async (c) => {
  const file = await c.env.DB.prepare(`SELECT * FROM files WHERE id = ?`)
    .bind(c.req.param('id'))
    .first<FileRecord>();

  if (!file || Date.now() > file.expires_at) {
    return c.json({ error: 'File expired or not found' }, 404);
  }

  return c.json({
    url: await R2.getDownloadUrl(c.env, file.r2_key),
    filename: file.filename,
    size: file.size,
  });
});

// cron
export default {
  fetch: app.fetch,

  async scheduled(_event: ScheduledEvent, env: R2Env, ctx: ExecutionContext) {
    ctx.waitUntil(this.handleCleanup(env));
  },

  async handleCleanup(env: R2Env) {
    const now = Date.now();

    const { results } = await env.DB.prepare(
      'SELECT r2_key FROM files WHERE expires_at < ? LIMIT 1000',
    )
      .bind(now)
      .all<{ r2_key: string }>();

    if (!results?.length) return;
    console.log(`Cleaning up ${results.length} files...`);

    const keys = results.map((f) => f.r2_key);
    await R2.deleteFile(env, keys);

    const placeholders = keys.map(() => '?').join(',');
    await env.DB.prepare(`DELETE FROM files WHERE r2_key IN (${placeholders})`)
      .bind(...keys)
      .run();

    console.log('Cleanup successful.');
  },
};
