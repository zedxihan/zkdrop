import { useState } from 'react';
import { uploadFile } from './lib/upload';
import { useMutation } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import FilePage from './pages/FilePage';
import FileDropzone from './components/upload/FileDropzone';

export default function App() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const uploadMutation = useMutation<string, Error, File>({
    mutationFn: uploadFile,
    onSuccess: (url) => {
      console.log('Upload Success:', url);
      setUploadedUrl(url);
    },
    onError: (error) => {
      console.log('Upload Error:', error);
    },
  });

  const handleFileChange = (file: File) => {
    if (file.size > 30 * 1024 * 1024) {
      alert('File size must be under 30MB');
      return;
    }

    uploadMutation.mutate(file);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>ZKDrop</h1>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <FileDropzone
                onFileSelect={handleFileChange}
                isUploading={uploadMutation.isPending}
              />
              {uploadMutation.isPending && <p>Uploading...</p>}
              {uploadMutation.error && (
                <p>Error: {uploadMutation.error.message}</p>
              )}

              {uploadedUrl && (
                <div style={{ marginTop: 20 }}>
                  <p>File uploaded!</p>
                  <a href={uploadedUrl} target="_blank">
                    {uploadedUrl}
                  </a>
                </div>
              )}
            </>
          }
        />

        <Route path="/file/:id" element={<FilePage />} />
      </Routes>
    </div>
  );
}
