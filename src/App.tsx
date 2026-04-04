import { uploadFile } from './lib/upload';
import { useMutation } from '@tanstack/react-query';

export default function App() {
  const uploadMutation = useMutation<string, Error, File>({
    mutationFn: uploadFile,
    onSuccess: (url) => {
      console.log('Upload Success:', url);
    },
    onError: (error) => {
      console.log('Upload Error:', error);
    },
  });
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
    <div>
      <h1>zkDrop</h1>
      <input type="file" onChange={handleChange} />
      {uploadMutation.isPending && <p>Uploading...</p>}
      {uploadMutation.isSuccess && <p>Upload Success</p>}
      {uploadMutation.isError && <p>Upload Error</p>}
    </div>
  );
}
