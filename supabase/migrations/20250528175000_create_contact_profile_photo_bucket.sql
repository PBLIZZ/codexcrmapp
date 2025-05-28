-- Create storage bucket for contact profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('contact-profile-photo', 'contact-profile-photo', false);

-- Enable RLS on the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to upload their own files
CREATE POLICY "Users can upload their own contact photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'contact-profile-photo' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow authenticated users to view their own files
CREATE POLICY "Users can view their own contact photos" ON storage.objects
FOR SELECT USING (
  bucket_id = 'contact-profile-photo' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow authenticated users to update their own files
CREATE POLICY "Users can update their own contact photos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'contact-profile-photo' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy to allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own contact photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'contact-profile-photo' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
