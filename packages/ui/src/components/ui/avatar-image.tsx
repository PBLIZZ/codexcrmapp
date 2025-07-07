'use client';

import { UserCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AvatarImageProps {
  src: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  rounded?: boolean;
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
  rounded = true,
}: AvatarImageProps) {
  const dimensions = {
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 96, height: 96 },
    xl: { width: 128, height: 128 },
  }[size] || { width: 40, height: 40 };

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gray-100 flex items-center justify-center',
        rounded ? 'rounded-full' : 'rounded-md',
        className
      )}
      style={{ width: dimensions.width, height: dimensions.height }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          width={dimensions.width}
          height={dimensions.height}
          className="object-cover w-full h-full"
        />
      ) : (
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
      )}
    </div>
  );
}
