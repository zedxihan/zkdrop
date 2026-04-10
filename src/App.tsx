import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { uploadFile, type UploadStep } from './lib/upload';
import FilePage from './pages/FilePage';
import FileDropzone from './components/upload/FileDropzone';
import InfoCards from './components/cards/InfoCards';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

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
    <div className="flex flex-col items-center justify-center">
      <div className="mb-6 w-full max-w-[940px] text-center">
        <h2 className="text-text mb-3 text-4xl leading-none font-bold md:text-5xl">
          Secure, Temporary{' '}
          <span className="text-accent pb-1 underline decoration-dashed underline-offset-8">
            File Sharing
          </span>
        </h2>
        <p className="text-muted mx-auto mt-2 max-w-2xl text-xl md:text-2xl">
          Share files securely with true zero-knowledge end-to-end encryption.
          No logins, no tracking.
        </p>
      </div>

      <FileDropzone
        onFileSelect={handleFileSelect}
        uploadStep={uploadStep}
        selectedFile={variables?.file}
        progress={progress}
      />
      <InfoCards />

      {error && (
        <p className="font-note mt-4 text-red-500">Error: {error.message}</p>
      )}

      {data && (
        <div className="border-accent bg-card mt-8 flex w-full max-w-[940px] flex-col items-center rounded-xl border-2 border-dashed p-6">
          <p className="text-text mb-2 text-3xl">File uploaded successfully!</p>
          <a
            href={data}
            target="_blank"
            rel="noreferrer"
            className="text-accent font-note hover:text-accent-hover text-lg break-all underline transition-colors"
          >
            {data}
          </a>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Header />

      <main className="flex w-full flex-1 flex-col justify-center px-4 pb-6">
        <Routes>
          <Route path="/" element={renderHome()} />
          <Route path="/file/:id" element={<FilePage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}