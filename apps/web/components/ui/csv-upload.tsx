'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@codexcrm/ui';
import { File, Upload } from 'lucide-react';

interface CSVUploadProps {
  onUpload: (file: File) => void;
  className?: string;
}

/**
 * CSVUpload component provides a drag-and-drop interface for uploading CSV files.
 * It validates file types and provides visual feedback for the upload process.
 */
export function CSVUpload({ onUpload, className }: CSVUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setIsUploading(true);
        const file = acceptedFiles[0];

        // Simulate upload process
        setTimeout(() => {
          onUpload(file);
          setIsUploading(false);
        }, 1000);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}
        ${className}
      `}
    >
      <input {...getInputProps()} />

      <div className='flex flex-col items-center justify-center space-y-4 text-center'>
        <div className='flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full'>
          {isUploading ? (
            <div className='animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full' />
          ) : (
            <Upload className='w-8 h-8 text-gray-400' />
          )}
        </div>

        <div className='space-y-2'>
          <p className='text-lg font-medium text-gray-900'>
            {isDragActive ? 'Drop your CSV file here' : 'Upload CSV file'}
          </p>
          <p className='text-sm text-gray-500'>
            Drag and drop your CSV file here, or click to select
          </p>
        </div>

        <Button type='button' variant='outline' disabled={isUploading} className='mt-4'>
          <File className='w-4 h-4 mr-2' />
          {isUploading ? 'Uploading...' : 'Choose File'}
        </Button>
      </div>
    </div>
  );
}
