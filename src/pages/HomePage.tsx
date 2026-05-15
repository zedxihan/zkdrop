import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Container from '../components/layout/Container';
import FileDropzone from '../components/dropzone/FileDropzone';
import { uploadFile } from '../lib/upload';
import type { ProgressStep } from '../types';

export default function HomePage() {
  const [step, setStep] = useState<ProgressStep>('idle');
  const [progress, setProgress] = useState(0);

  const { mutate, data, error, reset, variables } = useMutation({
    mutationFn: uploadFile,
    onError: () => {
      setStep('idle');
      setProgress(0);
    },
  });

  const handleFileSelect = (file: File) => {
    if (file.size > 100 * 1024 * 1024) return alert('File must be under 100MB');

    mutate({
      file,
      onProgress: setStep,
      setProgress,
    });
  };

  const handleReset = () => {
    reset();
    setStep('idle');
    setProgress(0);
  };

  return (
    <Container
      title="Secure, Temporary"
      accent="File Sharing"
      subtitle="Share files securely with zero-knowledge encryption."
      error={error?.message}
    >
      <FileDropzone
        mode="upload"
        step={step}
        progress={progress}
        selectedFile={variables?.file}
        shareableLink={data}
        onFileSelect={handleFileSelect}
        onReset={handleReset}
      />
    </Container>
  );
}
