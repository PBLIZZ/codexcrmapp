'use client';

import { Loader2, Upload, X, User } from 'lucide-react';
import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

import { api } from '@/lib/trpc';

// Helper function to validate if a string is a valid URL
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

// Helper function to determine if URL is a Supabase storage path
function isStoragePath(url: string | null | undefined): boolean {
  return !!url && url.startsWith('contacts/');
}

interface ImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled = false }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value);
  const [imageError, setImageError] = useState(false);

  // Get upload URL mutation
  const getUploadUrlMutation = api.storage.getUploadUrl.useMutation();

  // Generate signed URL for storage paths
  const { data: fileUrlData } = api.storage.getFileUrl.useQuery(
    { filePath: value || '' },
    {
      enabled: isStoragePath(value),
      staleTime: 50 * 60 * 1000, // 50 minutes (URLs valid for 1 hour)
      retry: 2,
    }
  );

  // Update preview URL when signed URL is fetched
  useEffect(() => {
    if (fileUrlData?.signedUrl) {
      setPreviewUrl(fileUrlData.signedUrl);
      setImageError(false);
    }
  }, [fileUrlData]);

  // Update preview URL when value changes
  useEffect(() => {
    if (value === null) {
      setPreviewUrl(null);
    } else if (isStoragePath(value)) {
      // For storage paths, wait for signed URL
      if (!fileUrlData?.signedUrl) {
        setPreviewUrl(null);
      }
    } else if (value && isValidUrl(value)) {
      // For direct URLs, use immediately
      setPreviewUrl(value);
    }
    setImageError(false);
  }, [value, fileUrlData]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setIsUploading(true);
      setUploadError(null);

      try {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error('Please select a valid image file (JPG, PNG, GIF, or WEBP)');
        }

        // Validate file size (2MB limit)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
          throw new Error('File size must be less than 2MB');
        }

        // Generate unique filename with timestamp
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const uniqueFileName = `${timestamp}-${uuidv4()}.${fileExtension}`;

        console.log('Starting upload:', {
          fileName: uniqueFileName,
          fileSize: file.size,
          fileType: file.type,
        });

        // Get signed upload URL from tRPC
        const uploadUrlResponse = await getUploadUrlMutation.mutateAsync({
          fileName: uniqueFileName,
          contentType: file.type,
          folderPath: 'contacts',
        });

        if (!uploadUrlResponse?.signedUrl) {
          throw new Error('Failed to get upload URL from server');
        }

        console.log('Got signed URL, uploading to storage...');

        // Upload file directly to Supabase Storage using signed URL
        const uploadResponse = await fetch(uploadUrlResponse.signedUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
            'Cache-Control': 'max-age=3600',
          },
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error('Storage upload failed:', {
            status: uploadResponse.status,
            statusText: uploadResponse.statusText,
            errorText,
          });
          throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
        }

        // The path returned by createSignedUploadUrl is the storage path
        const storagePath = uploadUrlResponse.path;
        console.log('Upload successful:', {
          storagePath,
          uploadResponse: {
            status: uploadResponse.status,
            statusText: uploadResponse.statusText,
          },
        });

        // Update the form with the storage path
        onChange(storagePath);

        // Show success feedback
        console.log('Image uploaded successfully!');
      } catch (error) {
        console.error('Upload error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed. Please try again.';
        setUploadError(errorMessage);

        // Reset preview on error
        setPreviewUrl(null);
      } finally {
        setIsUploading(false);
      }
    },
    [getUploadUrlMutation, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: disabled || isUploading,
  });

  const handleRemove = useCallback(() => {
    setPreviewUrl(null);
    onChange(null);
    setImageError(false);
    setUploadError(null);
  }, [onChange]);

  const handleImageError = useCallback(() => {
    console.warn('Image failed to load:', { value, previewUrl });
    setImageError(true);
  }, [value, previewUrl]);

  return (
    <div className='w-full'>
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${disabled || isUploading ? 'cursor-not-allowed opacity-50' : 'hover:border-gray-400'}
        `}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className='flex flex-col items-center justify-center p-4'>
            <Loader2 className='h-10 w-10 text-blue-500 animate-spin mb-2' />
            <p className='text-sm text-gray-500'>Uploading image...</p>
          </div>
        ) : previewUrl ? (
          <div className='relative flex justify-center'>
            <div className='relative h-32 w-32 rounded-full overflow-hidden'>
              {imageError || !isValidUrl(previewUrl) ? (
                <div className='flex items-center justify-center h-full w-full bg-gray-100'>
                  <User className='h-16 w-16 text-gray-400' />
                </div>
              ) : (
                <Image
                  src={previewUrl}
                  alt='Contact avatar'
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes='128px'
                  onError={handleImageError}
                />
              )}
            </div>
            {!disabled && (
              <button
                type='button'
                onClick={handleRemove}
                className='absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors'
              >
                <X className='h-4 w-4' />
              </button>
            )}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center p-4'>
            <Upload className='h-10 w-10 text-gray-400 mb-2' />
            <p className='text-sm text-center text-gray-500 mb-1'>
              {isDragActive ? 'Drop the image here' : 'Upload a profile photo'}
            </p>
            <p className='text-xs text-center text-gray-400'>
              Drag & drop or click to select
              <br />
              Supported formats: JPG, PNG, GIF, WEBP (max 2MB)
            </p>
          </div>
        )}
      </div>

      {uploadError && <p className='text-sm text-red-600 mt-2'>{uploadError}</p>}
    </div>
  );
}
