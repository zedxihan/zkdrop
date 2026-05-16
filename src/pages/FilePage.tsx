import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Container from '../components/layout/Container';
import FileDropzone from '../components/dropzone/FileDropzone';
import { downloadFile } from '../lib/download';
import type { ProgressStep } from '../types';

export default function FilePage() {
  const { id = '' } = useParams();
  const base64Key = window.location.hash.substring(1);

  const [step, setStep] = useState<ProgressStep>('idle');
  const [progress, setProgress] = useState(0);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number }>({
    name: 'Encrypted File',
    size: 0,
  });

  const { mutate, error } = useMutation({
    mutationFn: downloadFile,
    onError: () => {
      setStep('idle');
      setProgress(0);
    },
  });

  const handleDownload = () => {
    if (!base64Key) return;
    mutate({
      fileId: id,
      base64Key,
      onProgress: setStep,
      setProgress,
      onMeta: setFileMeta,
    });
  };

  return (
    <Container
      title="Secure File"
      accent="Retrieval"
      subtitle="Decrypt locally and download securely."
      error={
        error?.message ||
        (!base64Key && step === 'idle'
          ? 'Missing decryption key in URL.'
          : undefined)
      }
    >
      <FileDropzone
        mode="download"
        step={step}
        progress={progress}
        selectedFile={fileMeta}

        downloadName={fileMeta.name}
        onDownload={handleDownload}
      />
    </Container>
  );
}
