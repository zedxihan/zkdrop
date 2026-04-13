import { FolderOpen, Download } from 'lucide-react';
import ActionButton from '../ui/ActionButton';
import type { IdleViewProps } from '../../types';
import UploadIcon from './UploadIcon';

export default function DropzoneIdle({
  mode,
  fileName,
  onSelect,
  onDownload,
}: IdleViewProps) {
  return (
    <div className="flex w-full flex-col items-center gap-5 px-2 text-center sm:px-0">
      {mode === 'upload' ? (
        <div className="flex w-full flex-col items-center gap-5 md:pb-[60px]">
          <UploadIcon />
          <div className="text-text text-center">
            <h2 className="text-3xl leading-none md:text-4xl">
              Drag files here to upload
            </h2>
            <span className="text-muted text-xl italic">or</span>
          </div>
          <ActionButton
            icon={<FolderOpen />}
            label="Select File"
            onClick={onSelect}
          />
        </div>
      ) : (
        <>
          <UploadIcon />
          <div className="w-full">
            <h2 className="text-3xl md:text-4xl">Secure Retrieval</h2>
            <p className="text-muted mx-auto max-w-full truncate text-lg sm:max-w-[600px] sm:text-xl">
              {fileName}
            </p>
          </div>
          <ActionButton
            icon={<Download />}
            label="Decrypt & Download"
            onClick={onDownload}
          />
        </>
      )}
    </div>
  );
}
