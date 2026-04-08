import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { decryptFile } from '../lib/encryption';
import { useDecryptionKeys } from '../hooks/useDecryptionkeys';

export default function FilePage() {
  const path = window.location.pathname;
  const hash = window.location.hash;

  const fileId = path.replace('/file/', '');
  const { params, cryptoKey, iv } = useDecryptionKeys(hash);

  // check expiration
  const {
    data: fileMeta,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['file-meta', fileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('files-table')
        .select('expires_at')
        .eq('file_path', fileId)
        .single();

      if (error || !data) throw new Error('File not found or link expired');
      return data;
    },
    select: (data) => ({
      ...data,
      isExpired: new Date(data.expires_at) < new Date(),
    }),
  });

  // fetch and decrypt
  const fileQuery = useQuery({
    queryKey: ['file', fileId],
    enabled: !!cryptoKey && !!iv && !!fileMeta && !fileMeta.isExpired,

    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from('files')
        .createSignedUrl(fileId, 60);
      if (error || !data) throw new Error('Failed to get signed URL');

      const res = await fetch(data.signedUrl);
      if (!res.ok) throw new Error('Failed to fetch file');

      const encryptedBuffer = await res.arrayBuffer();
      const decryptedBuffer = await decryptFile(
        encryptedBuffer,
        cryptoKey!,
        iv!,
      );

      const fileType = params.encodedType
        ? decodeURIComponent(params.encodedType)
        : 'application/octet-stream';

      const blob = new Blob([decryptedBuffer], { type: fileType });
      return URL.createObjectURL(blob);
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // cleanup
  useEffect(() => {
    const url = fileQuery.data;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [fileQuery.data]);

  if (isLoading) return <p>Loading...</p>;
  if (isError || fileMeta?.isExpired) return <p>Link expired or invalid</p>;

  const fileName = params.encodedName
    ? decodeURIComponent(params.encodedName)
    : 'download';

  return (
    <div>
      {fileQuery.data ? (
        <a href={fileQuery.data} download={fileName}>
          Download {fileName}
        </a>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
