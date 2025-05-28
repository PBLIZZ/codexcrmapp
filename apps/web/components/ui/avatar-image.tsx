"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { UserCircle } from "lucide-react";
import { api } from "@/lib/trpc";

interface AvatarImageProps {
  src: string | null;
  alt: string;
  size?: "sm" | "md" | "lg";
  className?: string;
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
  }[size];
  
  // Generate signed URL for private images if needed
  const { data: fileUrlData } = api.storage.getFileUrl.useQuery(
    { filePath: src || "" },
    {
      enabled: !!src && src.includes("contacts-avatars") && !src.includes("?token="),
      staleTime: 55 * 60 * 1000, // 55 minutes (URLs valid for 1 hour)
    }
  );

  // Update imageUrl when signed URL is fetched
  useEffect(() => {
    if (fileUrlData?.signedUrl) {
      setImageUrl(fileUrlData.signedUrl);
      setError(false);
    }
  }, [fileUrlData]);
  
  // Update imageUrl when src changes
  useEffect(() => {
    setImageUrl(src);
    setError(false);
  }, [src]);

  // Generate initials from name
  const getInitials = () => {
    if (!alt) return "?";
    
    const nameParts = alt.split(" ").filter(part => part.length > 0);
    if (nameParts.length === 0) return "?";
    
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

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
              {getInitials()}
            </span>
          ) : (
            <UserCircle className="text-gray-400" style={{ width: dimensions.width * 0.7, height: dimensions.height * 0.7 }} />
          )}
        </div>
      ) : (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          sizes={`${dimensions.width}px`}
          className="object-cover"
          onError={handleError}
        />
      )}
    </div>
  );
}
