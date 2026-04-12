import React, { type ReactNode } from 'react';

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
  children: React.ReactNode;
  error?: string | null;
}

export interface DropzoneProps {
  mode?: 'upload' | 'download';
  step: ProgressStep;
  progress: number;
  selectedFile?: File | null;
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
  file: File;
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
  iv: Uint8Array;
}

export interface UploadProps {
  file: File;
  onProgress: (step: ProgressStep) => void;
  setProgress: (value: number) => void;
}

export interface DownloadProps {
  fileId: string;
  fileName: string;
  cryptoKey: CryptoKey;
  iv: Uint8Array;
  onProgress: (step: ProgressStep) => void;
  setProgress: (value: number) => void;
}

export interface DecryptionKeyParams {
  base64Key: string;
  base64IV: string;
  encodedName: string;
  encodedType: string;
}
