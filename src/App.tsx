import { uploadFile } from './lib/upload';
import { useMutation } from '@tanstack/react-query';
import FilePage from './pages/FilePage';

export default function App() {
  const path = window.location.pathname;

  const uploadMutation = useMutation<string, Error, File>({
    mutationFn: uploadFile,
    onSuccess: (url) => {
      console.log('Upload Success:', url);
    },
    onError: (error) => {
      console.log('Upload Error:', error);
    },
  });

  // for now
  if (path.startsWith('/file/')) return <FilePage />;

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be under 50MB');
      return;
    }

    uploadMutation.mutate(file);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>ZKDrop</h1>
      <input type="file" onChange={handleChange} />
      {uploadMutation.isPending && <p>Uploading...</p>}
      {uploadMutation.error && <p>Error: {uploadMutation.error.message}</p>}
    </div>
  );
}
