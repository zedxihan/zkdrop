import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { uploadFile, type UploadStep } from './lib/upload';
import FilePage from './pages/FilePage';
import FileDropzone from './components/upload/FileDropzone';

export default function App() {
  const [progress, setProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState<UploadStep>('idle');

  const resetUI = () => {
    setUploadStep('idle');
    setProgress(0);
  };

  const { mutate, data, error, reset, variables } = useMutation<
    string,
    Error,
    {
      file: File;
      onProgress: (step: UploadStep) => void;
      setProgress: (value: number) => void;
    }
  >({
    mutationFn: uploadFile,

    onSuccess: () => {
      setUploadStep('done');
      setTimeout(() => {
        reset();
        resetUI();
      }, 2500);
    },

    onError: () => resetUI(),
  });

  const handleFileSelect = (file: File) => {
    if (file.size > 30 * 1024 * 1024)
      return alert('File size must be under 30MB');

    setProgress(0);
    mutate({ file, onProgress: setUploadStep, setProgress });
  };

  const renderHome = () => (
    <>
      <FileDropzone
        onFileSelect={handleFileSelect}
        uploadStep={uploadStep}
        selectedFile={variables?.file}
        progress={progress}
      />

      {error && <p className="mt-4 text-red-500">Error: {error.message}</p>}

      {data && (
        <div className="mt-5">
          <p>File uploaded!</p>
          <a href={data} target="_blank" className="text-accent underline">
            {data}
          </a>
        </div>
      )}
    </>
  );

  return (
    <div className="p-10">
      <h1 className="mb-8 text-4xl">ZKDrop</h1>

      <Routes>
        <Route path="/" element={renderHome()} />
        <Route path="/file/:id" element={<FilePage />} />
      </Routes>
    </div>
  );
}
