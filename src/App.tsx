import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Routes, Route } from 'react-router-dom';
import { uploadFile, type UploadStep } from './lib/upload';
import FilePage from './pages/FilePage';
import FileDropzone from './components/upload/FileDropzone';
import InfoCards from './components/ui/InfoCards';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

export default function App() {
  const [ui, setUI] = useState<{ step: UploadStep; progress: number }>({
    step: 'idle',
    progress: 0,
  });

  const { mutate, data, error, reset, variables } = useMutation({
    mutationFn: uploadFile,
    onError: () => setUI({ step: 'idle', progress: 0 }),
  });

  const handleFileSelect = (file: File) => {
    if (file.size > 30 * 1024 * 1024) {
      alert('File size must be under 30MB');
      return;
    }
    setUI((s) => ({ ...s, progress: 0 }));

    mutate({
      file,
      onProgress: (step) => setUI((s) => ({ ...s, step })),
      setProgress: (progress) => setUI((s) => ({ ...s, progress })),
    });
  };

  const handleReset = () => {
    reset();
    setUI({ step: 'idle', progress: 0 });
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
        uploadStep={ui.step}
        selectedFile={variables?.file}
        progress={ui.progress}
        shareableLink={data}
        onReset={handleReset}
      />
      <InfoCards />

      {error && (
        <p className="font-note mt-4 text-red-500">Error: {error.message}</p>
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
