'use client';

import { useState, useEffect, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@codexcrm/ui';
import { api } from '@/lib/trpc';

interface ContactAvatarProps {
  profileImageUrl?: string | null;
  fullName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-32 w-32',
};

const fallbackSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-lg',
  xl: 'text-2xl',
};

// Helper function to determine if URL is a Supabase storage path
const isStoragePath = (url: string | null | undefined): boolean => {
  return !!url && url.startsWith('contacts/');
};

// Helper function to check if URL is valid
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export function ContactAvatar({
  profileImageUrl,
  fullName,
  size = 'md',
  className = '',
}: ContactAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Only fetch signed URL for storage paths
  const shouldFetchSignedUrl = isStoragePath(profileImageUrl);

  const {
    data: fileUrlData,
    error: storageError,
    isLoading: isUrlLoading,
  } = api.storage.getFileUrl.useQuery(
    { filePath: profileImageUrl || '' },
    {
      enabled: shouldFetchSignedUrl,
      staleTime: 50 * 60 * 1000, // 50 minutes (URLs valid for 1 hour)
      retry: 2,
      retryDelay: 1000,
    }
  );

  // Reset error state when profileImageUrl changes
  useEffect(() => {
    setImageError(false);
    setIsLoading(shouldFetchSignedUrl);
  }, [profileImageUrl, shouldFetchSignedUrl]);

  // Update loading state when URL fetch completes
  useEffect(() => {
    if (!isUrlLoading) {
      setIsLoading(false);
    }
  }, [isUrlLoading]);

  const handleImageError = useCallback(() => {
    console.warn('Image failed to load:', {
      profileImageUrl,
      signedUrl: fileUrlData?.signedUrl,
      storageError,
    });
    setImageError(true);
    setIsLoading(false);
  }, [profileImageUrl, fileUrlData?.signedUrl, storageError]);

  const handleImageLoad = useCallback(() => {
    setImageError(false);
    setIsLoading(false);
  }, []);

  // Determine the image source to use
  const getImageSrc = (): string | null => {
    if (!profileImageUrl) return null;

    // For storage paths, use signed URL if available
    if (isStoragePath(profileImageUrl)) {
      return fileUrlData?.signedUrl || null;
    }

    // For direct URLs, validate and use directly
    if (isValidUrl(profileImageUrl)) {
      return profileImageUrl;
    }

    return null;
  };

  const imageSrc = getImageSrc();

  // Get initials for fallback
  const getInitials = (name: string): string => {
    if (!name?.trim()) return 'U';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const sizeClass = sizeClasses[size];
  const fallbackSizeClass = fallbackSizes[size];
  const showImage = imageSrc && !imageError && !isLoading;

  return (
    <Avatar className={`${sizeClass} ${className}`}>
      {showImage ? (
        <AvatarImage
          src={imageSrc}
          alt={`${fullName}'s profile picture`}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      ) : null}
      <AvatarFallback
        className={`bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold ${fallbackSizeClass} ${isLoading ? 'animate-pulse' : ''}`}
      >
        {isLoading ? '...' : getInitials(fullName)}
      </AvatarFallback>
    </Avatar>
  );
}
