'use client';

import { useState, useEffect } from 'react';
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

export function ContactAvatar({
  profileImageUrl,
  fullName,
  size = 'md',
  className = '',
}: ContactAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  // Get signed URL for Supabase storage images
  const { data: fileUrlData, error: storageError } = api.storage.getFileUrl.useQuery(
    { filePath: profileImageUrl || '' },
    {
      enabled: !!profileImageUrl && profileImageUrl.startsWith('contacts/'),
      staleTime: 55 * 60 * 1000, // 55 minutes (URLs valid for 1 hour)
    }
  );

  // Debug logging
  console.log('ContactAvatar Debug:', {
    profileImageUrl,
    isStoragePath: profileImageUrl?.startsWith('contacts/'),
    queryEnabled: !!profileImageUrl && profileImageUrl.startsWith('contacts/'),
    fileUrlData,
    storageError,
    signedUrl,
  });

  // Update signed URL when fetched
  useEffect(() => {
    if (fileUrlData?.signedUrl) {
      setSignedUrl(fileUrlData.signedUrl);
      setImageError(false);
    }
  }, [fileUrlData]);

  // Reset image error when profileImageUrl changes
  useEffect(() => {
    setImageError(false);
    if (profileImageUrl?.includes('contact-profile-photo')) {
      // Reset signed URL to trigger new fetch
      setSignedUrl(null);
    } else {
      // Direct URL, use it directly
      setSignedUrl(profileImageUrl || null);
    }
  }, [profileImageUrl]);

  const handleImageError = () => {
    setImageError(true);
  };

  // Determine the image source
  const imageSrc = profileImageUrl?.includes('contact-profile-photo') ? signedUrl : profileImageUrl;

  // Get initials for fallback
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const sizeClass = sizeClasses[size];
  const fallbackSizeClass = fallbackSizes[size];

  return (
    <Avatar className={`${sizeClass} ${className}`}>
      {imageSrc && !imageError ? (
        <AvatarImage src={imageSrc} alt={fullName} onError={handleImageError} />
      ) : null}
      <AvatarFallback
        className={`bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold ${fallbackSizeClass}`}
      >
        {getInitials(fullName)}
      </AvatarFallback>
    </Avatar>
  );
}
