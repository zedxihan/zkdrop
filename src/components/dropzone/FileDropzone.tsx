import { lazy, Suspense, useRef } from 'react';
import type { DropzoneProps } from '../../types';
import DropzoneIdle from './DropzoneIdle';
import DropzoneStatus from './DropzoneStatus';

const DotGrid = lazy(() => import('../ui/DotGrid'));

export default function FileDropzone(props: DropzoneProps) {
  const { mode = 'upload', step, onFileSelect } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const onProgress = step !== 'idle';

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (mode === 'upload' && step === 'idle')
          onFileSelect?.(e.dataTransfer.files[0]);
      }}
      className="bg-card text-text relative min-h-[320px] w-full overflow-hidden rounded-xl border-[2.5px] border-dashed border-white/70 transition-all duration-200 sm:min-h-[360px] md:h-[400px]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <Suspense fallback={null}>
          <DotGrid
            dotSize={4}
            gap={13}
            baseColor="#241f31"
            activeColor="#9eb6aa"
            proximity={85}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </Suspense>
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 sm:px-6">
        {onProgress ? (
          <DropzoneStatus
            {...props}
            mode={mode}
            file={
              props.selectedFile || {
                name: props.downloadName || 'file',
                size: 0,
              }
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
    </div>
  );
}
