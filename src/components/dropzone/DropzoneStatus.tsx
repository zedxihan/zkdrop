import { RotateCcw, Download, Check, Copy } from 'lucide-react';
import { Progress } from 'sketchbook-ui';
import { useState } from 'react';
import ActionButton from '../ui/ActionButton';
import type { StatusViewProps, ProgressStep } from '../../types';

const LABELS: Record<ProgressStep, string> = {
  idle: 'Preparing...',
  encrypting: 'Encrypting...',
  uploading: 'Uploading...',
  finalizing: 'Finalizing...',
  fetching: 'Fetching...',
  decrypting: 'Decrypting...',
  done: 'Completed!',
};

const formatSize = (b: number) =>
  b < 1024 * 1024
    ? `${(b / 1024).toFixed(1)} KB`
    : `${(b / (1024 * 1024)).toFixed(1)} MB`;

export default function DropzoneStatus({
  mode,
  step,
  progress,
  file,
  shareableLink,
  onReset,
  onDownload,
}: StatusViewProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(shareableLink || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (step !== 'done')
    return (
      <div className="flex w-full max-w-[400px] flex-col items-center gap-8 py-6 sm:gap-10 sm:py-8">
        <h2 className="text-4xl md:text-5xl">
          {mode === 'upload' ? 'Encryption' : 'Decryption'}
        </h2>
        <div className="w-full px-1 text-center sm:px-4">
          <Progress
            variant="hatching"
            value={progress}
            label={LABELS[step]}
            colors={{
              bg: 'var(--color-accent)',
              bgOverlay: 'var(--color-accent-hover)',
              stroke: 'var(--color-text)',
              label: 'var(--color-text)',
              fill: 'var(--color-text)',
            }}
          />
        </div>
        <div className="text-center">
          <p className="text-2xl break-all sm:text-3xl">{file.name}</p>
          <p className="text-muted text-xl">{formatSize(file.size)}</p>
        </div>
      </div>
    );

  return (
    <div className="flex w-full max-w-full flex-col items-center gap-6 text-center">
      <h2 className="text-3xl sm:text-4xl">
        {mode === 'upload' ? '✅ Upload Complete' : '🔓 File Ready'}
      </h2>
      {mode === 'upload' ? (
        <>
          <p className="max-w-full truncate text-lg sm:text-xl">{file.name}</p>
          {shareableLink && (
            <div className="flex w-full max-w-xl items-center gap-2 rounded-xl border p-2">
              <input
                readOnly
                value={shareableLink}
                className="min-w-0 flex-1 truncate bg-transparent text-base outline-hidden sm:text-lg"
                onClick={(e) => e.currentTarget.select()}
              />
              <button onClick={handleCopy}>
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          )}
          <ActionButton
            icon={<RotateCcw />}
            label="Upload Again"
            onClick={onReset}
          />
        </>
      ) : (
        <>
          <p className="max-w-full truncate text-lg sm:text-xl">{file.name}</p>
          <ActionButton
            icon={<Download />}
            label="Download File"
            onClick={onDownload}
          />
        </>
      )}
    </div>
  );
}
