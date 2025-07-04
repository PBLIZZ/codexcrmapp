'use client';

import { createBrowserClient } from '@supabase/ssr';
import { Loader2, Upload, X, UserCircle } from 'lucide-react';
import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

import { api } from '@/lib/trpc';

interface ImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  contactId: string | undefined; // Explicitly allow undefined
}

export function ImageUpload({ value, onChange, disabled = false, contactId }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value);
  const [imageError, setImageError] = useState(false);

  // Initialize Supabase client
  const supabase = createBrowserClient(
    process.env['NEXT_PUBLIC_SUPABASE_URL'] ?? '',
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ?? ''
  );

  const getPathForQueryFromValue = (currentValue: string | null): string => {
    if (!currentValue) {
      return '';
    }
    if (currentValue.startsWith('http')) {
      try {
        const url = new URL(currentValue);
        const parts = url.pathname.split('/');
        const bucketMarker = 'contact-profile-photo';
        const markerIndex = parts.indexOf(bucketMarker);
        if (markerIndex !== -1 && markerIndex < parts.length - 1) {
          return parts.slice(markerIndex + 1).join('/');
        }
        return '';
      } catch (_error) {
        return '';
      }
    }
    return currentValue;
  };

  const pathForFileUrlQuery = getPathForQueryFromValue(value);

  // Generate signed URL for profile photos from Supabase Storage
  const { data: fileUrlData } = api.storage.getFileUrl.useQuery(
    { filePath: pathForFileUrlQuery }, // Use processed path
    {
      enabled: !!pathForFileUrlQuery && !pathForFileUrlQuery.includes('?token='),
      staleTime: 55 * 60 * 1000, // 55 minutes (URLs valid for 1 hour)
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
    // Only clear the preview if value is explicitly null
    // (for initial load, we want to wait for the signed URL)
    if (value === null) {
      setPreviewUrl(null);
    }
    setImageError(false);
  }, [value]);

  // Use tRPC mutation to get signed upload URL
  const getUploadUrlMutation = api.storage.getUploadUrl.useMutation();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        if (acceptedFiles.length === 0) {
          return;
        }

        setIsUploading(true);
        setUploadError(null);

        const file = acceptedFiles[0]; // Only use the first file
        if (!file) {
          setIsUploading(false);
          return;
        }

        // Validate file size (max 2MB for Supabase free tier)
        if (file.size > 2 * 1024 * 1024) {
          setIsUploading(false);
          throw new Error('File size must be less than 2MB');
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files are allowed');
        }

        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${contactId ?? uuidv4()}-${Date.now()}.${fileExt}`;

        // Get signed upload URL from backend
        const { signedUrl, path } = await getUploadUrlMutation.mutateAsync({
          fileName,
          contentType: file.type,
          folderPath: 'contacts',
        });

        // Upload file directly to Storage using the signed URL
        const uploadResponse = await fetch(signedUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file as unknown as BodyInit, // Type assertion to handle File type
        });
        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          const errorMessage = `Upload failed: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`;
          console.error(errorMessage, {
            status: uploadResponse.status,
            statusText: uploadResponse.statusText,
            errorText,
          });
          throw new Error(errorMessage);
        }

        // Get the URL for the file
        const { error: urlError } = await supabase.storage
          .from('contact-profile-photo')
          .createSignedUrl(path, 3600); // URL valid for 1 hour

        if (urlError) {
          let specificMessage = `Error creating signed URL: ${urlError.message}`;
          if (urlError.message?.includes('bucket') || urlError.message?.includes('not found')) {
            specificMessage =
              'Storage bucket not set up. Please contact administrator to set up contact photo storage.';
          }
          console.error(specificMessage, urlError);
          throw new Error(specificMessage);
        }

        onChange(path); // Store the relative path
        setUploadError(null);
      } catch (error: unknown) {
        let message = 'An unknown error occurred during upload.';
        if (error instanceof Error) {
          message = error.message;
        } else if (typeof error === 'string') {
          message = error;
        } else if (
          error &&
          typeof error === 'object' &&
          'message' in error &&
          typeof error.message === 'string'
        ) {
          message = error.message;
        }
        console.error('Error during upload process:', message, error);
        setUploadError(message);
        // onChange(null); // Consider if this is desired UX
      } finally {
        setIsUploading(false);
      }
    },
    [getUploadUrlMutation, supabase, onChange, contactId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        void onDrop(acceptedFiles);
      },
      [onDrop]
    ),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: isUploading || disabled,
  });

  // Delete file mutation
  const deleteFileMutation = api.storage.deleteFile.useMutation();

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();

      const removeFile = async () => {
        // If the value is a storage path, delete the file
        if (value && typeof value === 'string' && value.includes('contact-profile-photo')) {
          try {
            // Extract the path part from the URL if needed
            const path = value.includes('?') ? value.split('?')[0] : value;
            if (path) {
              await deleteFileMutation.mutateAsync({ filePath: path });
            }
          } catch (error) {
            console.error('Error deleting file:', error);
          }
        }

        setPreviewUrl(null);
        onChange(null);
      };

      void removeFile();
    },
    [onChange, value, deleteFileMutation]
  );

  const handleImageError = () => {
    setImageError(true);
  };

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
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400'}
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
              {imageError ? (
                <div className='flex items-center justify-center h-full w-full bg-gray-100'>
                  <UserCircle className='h-16 w-16 text-gray-400' />
                </div>
              ) : (
                <Image
                  src={
                    previewUrl?.startsWith('/') || previewUrl?.startsWith('http')
                      ? previewUrl
                      : `/${previewUrl}`
                  }
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
