import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { R2, type R2Env } from './lib/r2';

const app = new Hono<{ Bindings: R2Env }>();

type FileRecord = {
  id: string;
  r2_key: string;
  filename: string;
  size: number;
  expires_at: number;
};

app.use('/api/*', cors());

app.post('/api/upload/init', async (c) => {
  const { size } = await c.req.json();
  const id = crypto.randomUUID();
  const r2_key = `files/${id}`;

  const uploadId = await R2.startMultipart(c.env, r2_key);
  const partUrls = await R2.getChunkUrls(c.env, r2_key, size, uploadId);

  return c.json({ id, uploadId, partUrls });
});

app.post('/api/upload/complete', async (c) => {
  const { id, fileName, size, expires_at, uploadId, partUrls } =
    await c.req.json();
  const r2_key = `files/${id}`;

  await Promise.all([
    R2.completeMultipart(c.env, r2_key, uploadId, partUrls),
    c.env.DB.prepare(
      `INSERT INTO files (id, r2_key, filename, size, expires_at) VALUES (?, ?, ?, ?, ?)`,
    )
      .bind(id, r2_key, fileName, size, expires_at)
      .run(),
  ]);

  return c.json({ success: true, id });
});

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

export default app;
