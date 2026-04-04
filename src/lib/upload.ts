import { supabase } from './supabase';

export async function uploadFile(file: File): Promise<string> {
  const filePath = `${file.name}-${Date.now()}`;

  const { error } = await supabase.storage.from('files').upload(filePath, file);

  if (error) {
    console.error('Failed to upload file: ', error.message);
    throw error;
  }
  const { data } = supabase.storage.from('files').getPublicUrl(filePath);

  return data.publicUrl;
}
