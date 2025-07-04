'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '@/lib/trpc';
import { Avatar } from '@codexcrm/ui/components/ui/avatar';

interface Contact {
  profile_image_url?: string | null;
  full_name: string;
}

interface ProfileAvatarProps {
  contact: Contact;
}

export function ProfileAvatar({ contact }: ProfileAvatarProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

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

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  if (contact.profile_image_url && !imageError && imageUrl) {
    return (
      <Avatar className='h-10 w-10 bg-teal-100 text-teal-800 overflow-hidden'>
        <Image
          src={imageUrl}
          alt={contact.full_name}
          width={40}
          height={40}
          className='h-full w-full object-cover'
          onError={handleImageError}
        />
      </Avatar>
    );
  }

  // Fallback to initials avatar
  return (
    <Avatar className='h-10 w-10 bg-teal-100 text-teal-800'>
      <div className='flex items-center justify-center h-full w-full font-medium'>
        {contact.full_name.charAt(0)}
      </div>
    </Avatar>
  );
}