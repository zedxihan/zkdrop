import React, { useCallback, useState, useRef } from 'react';
import { FolderOpen } from 'lucide-react';
import { Button, Divider } from 'sketchbook-ui';
import clsx from 'clsx';
import UploadIcon from './UploadIcon';
import type { UploadStep } from '../../lib/upload';
import UploadProgress from './UploadProgress';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  uploadStep: UploadStep;
  selectedFile?: File | null;
  progress: number;
}

export default function FileDropzone({
  onFileSelect,
  uploadStep = 'idle',
  selectedFile = null,
  progress,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showProgress = uploadStep !== 'idle' && selectedFile;

  const toggleDragging = useCallback(
    (state: boolean) => (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(state);
    },
    [],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (showProgress) return;
      const file = e.dataTransfer.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect, showProgress],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };
  const openFilePicker = () => !showProgress && fileInputRef.current?.click();

  return (
    <div
      onDragOver={toggleDragging(true)}
      onDragEnter={toggleDragging(true)}
      onDragLeave={toggleDragging(false)}
      onDrop={handleDrop}
      className={clsx(
        'bg-card text-text mx-auto flex h-[400px] w-full max-w-[940px] items-center justify-center rounded-xl border-[2.5px] border-dashed px-6 transition-all duration-200',
        isDragging && 'shadow-[inset_0_0_0_2px_var(--color-accent-hover)]',
        showProgress && 'cursor-not-allowed opacity-80',
      )}
    >
      {uploadStep === 'done' && selectedFile ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-text text-5xl">✅ Upload Complete</h2>
          <p className="text-muted text-3xl break-all">{selectedFile.name}</p>
        </div>
      ) : showProgress ? (
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

          <Button
            size="sm"
            showBorder={false}
            colors={{
              bg: 'var(--color-accent)',
              stroke: '#4a4a4a',
              text: 'var(--color-bg)',
            }}
            typography={{ fontSize: '1.5rem' }}
            onClick={(e) => {
              e.stopPropagation();
              openFilePicker();
            }}
          >
            <div className="flex items-center gap-1">
              <FolderOpen />
              Select Files
            </div>
          </Button>

          <div className="w-[400px]">
            <Divider variant="dashed" />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
