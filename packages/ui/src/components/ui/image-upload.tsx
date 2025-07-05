'use client';

import { Loader2, Upload, UserCircle, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone, type FileWithPath } from 'react-dropzone';
import { Button } from './button';

interface ImageUploadProps {
  /** The current URL of the image to display. */
  value: string | null;
  /** Callback fired when a file is dropped or selected. */
  onDrop: (acceptedFiles: FileWithPath[]) => void;
  /** Callback fired when the remove button is clicked. */
  onRemove: () => void;
  /** Whether the component is in a loading state. */
  isUploading?: boolean;
  /** Whether the component is disabled. */
  disabled?: boolean;
  /** Error message to display. */
  uploadError?: string | null;
}

export function ImageUpload({
  value,
  onDrop,
  onRemove,
  isUploading = false,
  disabled = false,
  uploadError,
}: ImageUploadProps) {
  const [imageError, setImageError] = useState(false);

  const handleDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      if (acceptedFiles.length > 0) {
        setImageError(false);
        onDrop(acceptedFiles);
      }
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: isUploading || disabled,
  });

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const hasPreview = value && !imageError;

  return (
    <div className='space-y-2'>
      <div
        {...getRootProps()}
        className={`
          relative
          cursor-pointer
          border-2
          border-dashed
          rounded-md
          p-4
          transition
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${isUploading || disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400'}
        `}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className='flex flex-col items-center justify-center p-4'>
            <Loader2 className='h-10 w-10 text-blue-500 animate-spin mb-2' />
            <p className='text-sm text-gray-500'>Uploading image...</p>
          </div>
        ) : hasPreview ? (
          <div className='relative flex justify-center'>
            <div className='relative h-32 w-32 rounded-full overflow-hidden'>
              <img
                src={value}
                alt='Contact avatar'
                className='h-full w-full object-cover'
                onError={handleImageError}
              />
            </div>
            {!disabled && (
              <Button
                type='button'
                variant='destructive'
                size='icon'
                onClick={handleRemoveClick}
                className='absolute top-0 right-0 h-6 w-6 rounded-full'
              >
                <X className='h-4 w-4' />
              </Button>
            )}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center p-4'>
            {imageError && value ? (
              <>
                <UserCircle className='h-16 w-16 text-gray-400' />
                <p className='text-xs text-red-500 mt-1'>Error loading image.</p>
              </>
            ) : (
              <>
                <Upload className='h-10 w-10 text-gray-400 mb-2' />
                <p className='text-sm text-center text-gray-500 mb-1'>
                  {isDragActive ? 'Drop the image here' : 'Upload a profile photo'}
                </p>
                <p className='text-xs text-center text-gray-400'>
                  Drag & drop or click to select
                  <br />
                  (Max 2MB)
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {uploadError && <p className='text-sm text-red-600 mt-2'>{uploadError}</p>}
    </div>
  );
}