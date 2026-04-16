import '@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from '@supabase/supabase-js';

const BATCH_SIZE = 100;

interface FileRecord {
  id: string;
  file_path: string;
}

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: files, error: fetchError } = await supabase
    .from('files-table')
    .select('id, file_path')
    .lt('expires_at', new Date().toISOString())
    .limit(BATCH_SIZE);

  if (fetchError) return new Response(fetchError.message, { status: 500 });
  if (!files?.length) return new Response('No expired files');

  const ids = files.map((f: FileRecord) => f.id);
  const paths = files.map((f: FileRecord) => f.file_path);

  console.log('Deleting:', paths);

  const { error: storageError } = await supabase.storage
    .from('files')
    .remove(paths);
  if (storageError)
    return new Response(`Storage error: ${storageError.message}`, {
      status: 500,
    });

  const { error: dbError } = await supabase
    .from('files-table')
    .delete()
    .in('id', ids);
  if (dbError)
    return new Response(`DB error: ${dbError.message}`, { status: 500 });

  return new Response(`Deleted ${files.length} files`);
});
