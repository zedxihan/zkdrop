import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const now = new Date().toISOString();

  const { data: files, error } = await supabase
    .from("files-table")
    .select("id, file_path")
    .lt("expires_at", now);

  if (error) return new Response(error.message, { status: 500 });
  if (!files?.length) return new Response("No expired files");

  const ids = files.map((f) => f.id);
  const paths = files.map((f) => f.file_path);

  console.log("Deleting:", paths);

  await supabase.storage.from("files").remove(paths);
  await supabase.from("files-table").delete().in("id", ids);

  return new Response(`Deleted ${files.length} files`);
});
