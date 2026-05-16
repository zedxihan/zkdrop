import type { ReactNode } from 'react';

export type ProgressStep =
  | 'idle'
  | 'encrypting'
  | 'uploading'
  | 'finalizing'
  | 'fetching'
  | 'decrypting'
  | 'done';

export interface ContainerProps {
  title: string;
  accent: string;
  subtitle: string;
  children: ReactNode;
  error?: string | null;
}

export interface DropzoneProps {
  mode?: 'upload' | 'download';
  step: ProgressStep;
  progress: number;
  selectedFile?: { name: string; size: number } | null;
  shareableLink?: string;
  downloadName?: string;
  onFileSelect?: (file: File) => void;
  onDownload?: () => void;
  onReset?: () => void;
}

export interface IdleViewProps {
  mode: 'upload' | 'download';
  fileName?: string;
  onSelect: () => void;
  onDownload?: () => void;
}

export interface StatusViewProps {
  mode: 'upload' | 'download';
  step: ProgressStep;
  progress: number;
  file: { name: string; size: number };
  shareableLink?: string;
  onReset?: () => void;
  onDownload?: () => void;
}

export interface ActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

export interface EncryptedFile {
  encryptedBuffer: ArrayBuffer;
  key: CryptoKey;
}

export interface UploadProps {
  file: File;
  onProgress: (step: ProgressStep) => void;
  setProgress: (value: number) => void;
}

export interface DownloadProps {
  fileId: string;
  base64Key: string;
  onProgress: (step: ProgressStep) => void;
  setProgress: (value: number) => void;
  onMeta?: (meta: { name: string; size: number }) => void;
}
