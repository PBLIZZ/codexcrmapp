'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '@/lib/trpc';
import { Avatar } from '@codexcrm/ui/components/ui/avatar';
import type { Contact } from '../types';

interface ProfileAvatarProps {
  contact: Contact;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * ProfileAvatar component that handles profile image display with proper URL signing
 * Falls back to initials if no image is available or if image fails to load
 */
export function ProfileAvatar({ 
  contact, 
  size = 'md',
  className = '' 
}: ProfileAvatarProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Size configuration
  const sizeConfig = {
    sm: { className: 'h-8 w-8', width: 32, height: 32 },
    md: { className: 'h-10 w-10', width: 40, height: 40 },
    lg: { className: 'h-12 w-12', width: 48, height: 48 },
  };

  const config = sizeConfig[size];

  // Use tRPC to get signed URL if profile_image_url exists and is a storage path
  const { data: fileUrlData } = api.storage.getFileUrl.useQuery(
    { filePath: contact.profile_image_url ?? '' },
    {
      enabled: !!contact.profile_image_url && !contact.profile_image_url.includes('?token='),
      staleTime: 55 * 60 * 1000, // 55 minutes (URLs valid for 1 hour)
    }
  );

  // Update image URL when signed URL is fetched
  useEffect(() => {
    if (fileUrlData?.signedUrl) {
      setImageUrl(fileUrlData.signedUrl);
      setImageError(false);
    }
  }, [fileUrlData]);

  // Reset error state when contact changes
  useEffect(() => {
    setImageError(false);
    setImageUrl(null);
  }, [contact.id]);

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  // Get initials from full name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarClassName = `${config.className} bg-teal-100 text-teal-800 ${className}`;

  // Show image if available and no error
  if (contact.profile_image_url && !imageError && imageUrl) {
    return (
      <Avatar className={`${avatarClassName} overflow-hidden`}>
        <Image
          src={imageUrl}
          alt={`${contact.full_name} profile picture`}
          width={config.width}
          height={config.height}
          className="h-full w-full object-cover"
          onError={handleImageError}
          priority={false}
        />
      </Avatar>
    );
  }

  // Fallback to initials avatar
  return (
    <Avatar className={avatarClassName}>
      <div className="flex items-center justify-center h-full w-full font-medium">
        {getInitials(contact.full_name)}
      </div>
    </Avatar>
  );
}