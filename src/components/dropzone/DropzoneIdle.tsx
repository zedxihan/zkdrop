import { FolderOpen, Download } from 'lucide-react';
import { Divider } from 'sketchbook-ui';
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
    <div className="flex flex-col items-center gap-5 text-center">
      {mode === 'upload' ? (
        <div className="flex w-full flex-col items-center gap-5">
          <UploadIcon />
          <div className="text-text text-center">
            <h2 className="text-4xl leading-none">Drag files here to upload</h2>
            <span className="text-muted text-xl italic">or</span>
          </div>
          <ActionButton
            icon={<FolderOpen />}
            label="Select File"
            onClick={onSelect}
          />
          <div className="w-[400px]">
            <Divider variant="dashed" />
          </div>
        </div>
      ) : (
        <>
          <UploadIcon />
          <div>
            <h2 className="text-4xl">Secure Retrieval</h2>
            <p className="text-muted max-w-[600px] truncate text-xl">
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
