'use client';

import { UserCircle } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';

import { api } from '../../lib/trpc';

interface AvatarImageProps {
  src: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

function getInitials(alt: string): string {
  return alt
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function AvatarImage({
  src,
  alt,
  size = 'md',
  className = '',
}: AvatarImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(src);
  const [error, setError] = useState(false);

  // Calculate dimensions based on size
  const dimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 96, height: 96 },
    xl: { width: 128, height: 128 },
  }[size] || { width: 40, height: 40 };

  const getPathForQuery = (currentSrc: string | null): string => {
    if (!currentSrc) return '';
    // Check if it's a full URL that we might need to parse
    if (currentSrc.startsWith('http')) {
      try {
        const url = new URL(currentSrc);
        const parts = url.pathname.split('/');
        // Assuming path is like /storage/v1/object/public/BUCKET_NAME/ACTUAL_PATH
        // BUCKET_NAME could be 'contact-profile-photo'
        const bucketMarker = 'contact-profile-photo'; 
        const markerIndex = parts.indexOf(bucketMarker);
        if (markerIndex !== -1 && markerIndex < parts.length - 1) {
          return parts.slice(markerIndex + 1).join('/');
        }
        // If it's a URL but doesn't match the expected structure for extraction, 
        // return empty string to disable the query for a signed URL.
        return ''; 
      } catch (e) {
        // Not a valid URL, or some other error during parsing.
        return ''; // Disable query
      }
    }
    // If not starting with http, assume it's already a relative path or an invalid value.
    // The enabled condition below will further filter.
    return currentSrc; 
  };

  const pathForQuery = useMemo(() => getPathForQuery(src), [src]);

  const { data: fileUrlData, isLoading: isLoadingSignedUrl } = api.storage.getFileUrl.useQuery(
    { filePath: pathForQuery }, // Use the processed path
    {
      // Enable if pathForQuery is non-empty, and src (original prop) indicates it's a path that might need signing.
      enabled: !!pathForQuery && !pathForQuery.includes('?token='),
      staleTime: 55 * 60 * 1000, // 55 minutes (URLs valid for 1 hour)
    }
  );

  const actualImageUrl = useMemo(() => {
    if (isLoadingSignedUrl && pathForQuery) {
      return null; // Don't show anything while actively fetching a signed URL for a valid path
    }
    if (fileUrlData?.signedUrl) {
      return fileUrlData.signedUrl; // Use signed URL if available (for private/relative paths)
    }
    // If src is a full URL (http/https) and we didn't get/need a signed URL (e.g. public, or pathForQuery was empty)
    if (src && src.startsWith('http')) {
      return src;
    }
    // If src is not a URL, and we didn't get a signed URL (e.g. it was an invalid relative path or empty)
    // it might be a broken link or meant to be a local placeholder not handled here.
    // For safety, if src is present but no signed URL and not a full URL, return src to see what happens (or null if preferred)
    if (src && !pathForQuery && !src.startsWith('http')) {
       // This case means getPathForQuery returned empty for a non-http src, which implies src itself was deemed not a valid relative path.
       // Or, src was http but didn't match parseable structure.
       // If src is short and not http, it might be an invalid path. If long, could be data URI.
       // Let's return src to allow data URIs or other direct values to pass through if they are not http and not needing signing.
       return src;
    }
    return null; // Fallback: no image or still loading initial src that wasn't a direct URL
  }, [src, fileUrlData, pathForQuery, isLoadingSignedUrl]);

  // Update imageUrl when actualImageUrl changes
  useEffect(() => {
    setImageUrl(actualImageUrl);
    setError(false);
  }, [actualImageUrl]);

  const handleError = () => {
    setError(true);
  };

  return (
    <div
      className={`relative overflow-hidden bg-gray-100 flex items-center justify-center rounded-full ${className}`}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      {error || !imageUrl ? (
        <div className="flex items-center justify-center h-full w-full">
          {alt ? (
            <span className="font-medium text-gray-600">
              {getInitials(alt)}
            </span>
          ) : (
            <UserCircle
              className="text-gray-400"
              style={{
                width: dimensions.width * 0.7,
                height: dimensions.height * 0.7,
              }}
            />
          )}
        </div>
      ) : imageUrl &&
        (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes={`${dimensions.width}px`}
          className="object-cover"
          onError={handleError}
        />
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-200 text-gray-600 font-medium">
          {getInitials(alt)}
        </div>
      )}
    </div>
  );
}
