"use client";

import { UserCircle } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";

import { api } from "@/lib/trpc";

interface AvatarImageProps {
  src: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

function getInitials(alt: string): string {
  return alt
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function AvatarImage({ 
  src, 
  alt, 
  size = "md",
  className = ""
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
  
  // Generate signed URL for private images if needed
  const { data: fileUrlData } = api.storage.getFileUrl.useQuery(
    { filePath: src || "" },
    {
      enabled: !!src && (src.includes("contact-profile-photo") || src.includes("contacts/")) && !src.includes("?token="),
      staleTime: 55 * 60 * 1000, // 55 minutes (URLs valid for 1 hour)
    }
  );

  // Determine the actual URL to use
  const actualImageUrl = useMemo(() => {
    // If we have a signed URL, use it
    if (fileUrlData?.signedUrl) {
      return fileUrlData.signedUrl;
    }
    
    // If src is a storage path but we don't have signed URL yet, don't render
    if (src && (src.includes("contact-profile-photo") || src.includes("contacts/")) && !src.includes("?token=")) {
      return null;
    }
    
    // Otherwise use the original src
    return src;
  }, [src, fileUrlData?.signedUrl]);

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
            <UserCircle className="text-gray-400" style={{ width: dimensions.width * 0.7, height: dimensions.height * 0.7 }} />
          )}
        </div>
      ) : imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) ? (
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
