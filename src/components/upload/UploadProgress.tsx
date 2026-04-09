import { Progress } from 'sketchbook-ui';
import type { UploadStep } from '../../lib/upload';

interface UploadProgressProps {
  step: UploadStep;
  file: File;
  progress: number;
}

const STEPS: Record<UploadStep, string> = {
  idle: 'Preparing...',
  encrypting: 'Encrypting (AES-GCM)...',
  uploading: 'Uploading...',
  finalizing: 'Finalizing link...',
  done: 'Completed!',
};

export default function UploadProgress({
  step,
  file,
  progress,
}: UploadProgressProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex w-full max-w-[400px] flex-col items-center justify-center gap-10 py-8">
      <h2 className="text-center text-[2.8rem]">Encryption Progress</h2>

      <div className="w-full px-4">
        <Progress
          variant="hatching"
          value={progress}
          label={STEPS[step]}
          colors={{
            bg: 'var(--color-accent)',
            bgOverlay: 'var(--color-accent-hover)',
            stroke: 'var(--color-text)',
            label: 'var(--color-text)',
            fill: 'var(--color-text)',
          }}
        />
      </div>

      <div className="flex w-full flex-col items-center gap-1 pt-4 text-center">
        <p className="text-text text-3xl break-all">{file.name}</p>
        <p className="text-muted text-xl">{formatSize(file.size)}</p>
      </div>
    </div>
  );
}
