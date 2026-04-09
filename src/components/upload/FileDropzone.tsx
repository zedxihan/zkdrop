import React, { useCallback, useState, useRef } from 'react';
import { FolderOpen } from 'lucide-react';
import { Button, Divider } from 'sketchbook-ui';
import 'sketchbook-ui/style.css';
import clsx from 'clsx';
import UploadIcon from './UploadIcon';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
}

export default function FileDropzone({
  onFileSelect,
  isUploading = false,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      const file = e.dataTransfer.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const openFilePicker = () => !isUploading && fileInputRef.current?.click();

  return (
    <div
      onDragOver={toggleDragging(true)}
      onDragEnter={toggleDragging(true)}
      onDragLeave={toggleDragging(false)}
      onDrop={handleDrop}
      className={clsx(
        'bg-card text-text mx-auto flex min-h-[320px] w-full max-w-[940px] items-center justify-center rounded-xl border-[2.5px] border-dashed px-6 py-10 transition-all duration-200',
        isDragging && 'shadow-[inset_0_0_0_2px_#9eb6aa]',
        isUploading && 'cursor-not-allowed opacity-80',
      )}
    >
      <div className="flex w-full flex-col items-center gap-5">
        <UploadIcon />

        <div className="text-text text-center">
          <h2 className="text-[2.8rem] leading-none">
            Drag files here to upload
          </h2>
          <span className="text-muted text-[1.2rem] italic">or</span>
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
          disabled={isUploading}
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
          disabled={isUploading}
        />
      </div>
    </div>
  );
}
