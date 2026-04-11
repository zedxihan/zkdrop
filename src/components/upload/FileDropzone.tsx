import { useState, useRef } from 'react';
import { FolderOpen, Check, Copy, RotateCcw } from 'lucide-react';
import { Divider } from 'sketchbook-ui';
import type { UploadStep } from '../../lib/upload';
import clsx from 'clsx';
import UploadIcon from './UploadIcon';
import UploadProgress from './UploadProgress';
import ActionButton from '../ui/ActionButton';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  uploadStep: UploadStep;
  selectedFile?: File | null;
  progress: number;
  shareableLink?: string;
  onReset?: () => void;
}

export default function FileDropzone({
  onFileSelect,
  uploadStep = 'idle',
  selectedFile = null,
  progress,
  shareableLink,
  onReset,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUploading =
    uploadStep !== 'idle' && uploadStep !== 'done' && !!selectedFile;
  const selectFile = (file?: File) => {
    if (file) onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading) return;

    selectFile(e.dataTransfer.files?.[0]);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    selectFile(e.target.files?.[0]);
  };

  const copy = () => {
    if (!shareableLink) return;

    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onDragOver={(e) => (e.preventDefault(), setIsDragging(true))}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={clsx(
        'bg-card text-text mx-auto flex h-[400px] w-full max-w-[940px] items-center justify-center rounded-xl border-[2.5px] border-dashed px-6 transition-all duration-200',
        isDragging && 'shadow-[inset_0_0_0_2px_var(--color-accent-hover)]',
        isUploading && 'cursor-not-allowed opacity-80',
      )}
    >
      {uploadStep === 'done' && selectedFile ? (
        <div className="flex w-full max-w-2xl flex-col items-center gap-6 text-center">
          <h2 className="text-4xl">✅ Upload Complete</h2>
          <p className="truncate">{selectedFile.name}</p>

          {shareableLink && (
            <div className="flex w-full items-center gap-2 rounded-xl border p-2">
              <input
                readOnly
                value={shareableLink}
                className="flex-1 truncate bg-transparent text-lg outline-none"
                onClick={(e) => e.currentTarget.select()}
              />
              <button onClick={copy}>
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          )}

          {onReset && (
            <ActionButton
              icon={<RotateCcw />}
              label="Upload Again"
              onClick={onReset}
            />
          )}
        </div>
      ) : isUploading ? (
        <UploadProgress
          step={uploadStep}
          file={selectedFile}
          progress={progress}
        />
      ) : (
        <div className="flex w-full flex-col items-center gap-5">
          <UploadIcon />

          <div className="text-text text-center">
            <h2 className="text-4xl leading-none">Drag files here to upload</h2>
            <span className="text-muted text-xl italic">or</span>
          </div>

          <ActionButton
            icon={<FolderOpen />}
            label="Select Files"
            onClick={() => fileInputRef.current?.click()}
          />

          <div className="w-[400px]">
            <Divider variant="dashed" />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleSelect}
          />
        </div>
      )}
    </div>
  );
}
