# Contact Profile Photos in CodexCRM

This document explains how to set up and use the contact profile photo feature in CodexCRM.

## Overview

Contact profile photos in CodexCRM are implemented using Supabase Storage, which provides:
- Private, secure storage for contact profile images
- Row-level security (RLS) to ensure users can only access their own contacts' photos
- Direct browser uploads via presigned URLs
- Image URL management with automatic expiration for security

## Setup Instructions

### 1. Ensure Supabase Environment Variables

Make sure your `.env.local` file (or deployed environment) contains the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Run the Storage Setup Script

The setup script creates the necessary Supabase Storage bucket and security policies:

```bash
# Install required dependencies if not already installed
pnpm add @supabase/supabase-js dotenv

# Run the setup script
node scripts/setup-storage.js
```

### 3. Verify Bucket and Policies (Manual Step)

After running the script, verify in the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to Storage > Buckets
3. Confirm "contacts-avatars" bucket exists and is private
4. Check under Storage > Policies that the following policies exist for the bucket:
   - SELECT: `((storage.foldername(name))[1] = auth.uid() OR (storage.foldername(name))[1] IS NULL)`
   - INSERT: `((storage.foldername(name))[1] = auth.uid())`
   - UPDATE: `((storage.foldername(name))[1] = auth.uid())`
   - DELETE: `((storage.foldername(name))[1] = auth.uid())`

## Using Profile Photos

### Upload Methods

The system supports three ways to add profile photos:

1. **Direct Upload**: Users can upload images directly from their device through the UI
2. **URL Entry**: Users can paste a URL to an existing image (e.g., from social media)
3. **Future AI Integration**: The system is designed to support future AI-powered social media profile discovery

### Technical Implementation

#### Components

- `ImageUpload`: Client component for uploading and managing profile images
- `AvatarImage`: Client component for displaying profile images with fallbacks
- `storage.ts`: tRPC router handling secure file operations

#### Data Flow

1. When uploading a file:
   - A presigned URL is generated via tRPC
   - File is uploaded directly to Supabase Storage
   - Only the storage path is saved to the database

2. When displaying an image:
   - `AvatarImage` component fetches a temporary signed URL if needed
   - Fallback to initials display if image is unavailable

## Privacy & Security Considerations

- Images are stored in a private bucket with RLS policies
- User can only access their own contact photos
- Signed URLs expire after 1 hour for added security
- File size limited to 5MB
- Only image file types are allowed

## Troubleshooting

If you encounter issues:

1. Check browser console for upload errors
2. Verify Supabase Storage policies are correctly configured
3. Ensure correct environment variables are set
4. Check that the contacts-avatars bucket exists and is configured as private
