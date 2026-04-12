import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Container from '../components/layout/Container';
import FileDropzone from '../components/dropzone/FileDropzone';
import { downloadFile } from '../lib/download';
import { useDecryptionKeys } from '../hooks/useDecryptionKeys';
import type { ProgressStep } from '../types';

export default function FilePage() {
  const { id = '' } = useParams();
  const { params, cryptoKey, iv } = useDecryptionKeys(window.location.hash);

  const [step, setStep] = useState<ProgressStep>('idle');
  const [progress, setProgress] = useState(0);

  const fileName = params.encodedName
    ? decodeURIComponent(params.encodedName)
    : 'download';

  const { mutate, error } = useMutation({
    mutationFn: downloadFile,
    onError: () => {
      setStep('idle');
      setProgress(0);
    },
  });

  const handleDownload = () => {
    mutate({
      fileId: id,
      fileName,
      cryptoKey: cryptoKey!,
      iv: iv!,
      onProgress: setStep,
      setProgress,
    });
  };

  return (
    <Container
      title="Secure File"
      accent="Retrieval"
      subtitle="Decrypt locally and download securely."
      error={error?.message}
    >
      <FileDropzone
        mode="download"
        step={step}
        progress={progress}
        selectedFile={{ name: fileName, size: 0 } as File}
        downloadName={fileName}
        onDownload={handleDownload}
      />
    </Container>
  );
}
