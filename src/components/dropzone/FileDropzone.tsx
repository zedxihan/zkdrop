import { useRef, useState } from 'react';
import clsx from 'clsx';
import type { DropzoneProps } from '../../types';
import DropzoneIdle from './DropzoneIdle';
import DropzoneStatus from './DropzoneStatus';

export default function FileDropzone(props: DropzoneProps) {
  const { mode = 'upload', step, onFileSelect } = props;
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onProgress = step !== 'idle';

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (mode === 'upload' && step === 'idle') setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (mode === 'upload' && step === 'idle')
          onFileSelect?.(e.dataTransfer.files[0]);
      }}
      className={clsx(
        'bg-card text-text flex min-h-[320px] w-full items-center justify-center rounded-xl border-[2.5px] border-dashed px-4 py-8 transition-all duration-200 sm:min-h-[360px] sm:px-6 md:h-[400px] md:py-0',
        isDragging && 'shadow-[inset_0_0_0_2px_var(--color-accent-hover)]',
      )}
    >
      {onProgress ? (
        <DropzoneStatus
          {...props}
          mode={mode}
          file={
            props.selectedFile ||
            ({ name: props.downloadName || 'file', size: 0 } as File)
          }
        />
      ) : (
        <DropzoneIdle
          mode={mode}
          fileName={props.downloadName}
          onSelect={() => inputRef.current?.click()}
          onDownload={props.onDownload}
        />
      )}
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => onFileSelect?.(e.target.files![0])}
      />
    </div>
  );
}
