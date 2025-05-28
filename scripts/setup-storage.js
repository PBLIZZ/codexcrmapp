// setup-storage.js
// This script creates the necessary Supabase Storage buckets and policies
// Run with: node scripts/setup-storage.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Initialize dotenv
dotenv.config();

// Get the directory path for the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or service role key. Make sure these are set in your .env file:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=your-project-url');
  console.error('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  try {
    console.log('Setting up Supabase Storage for CodexCRM...');

    // Create contact-profile-photo bucket (if it doesn't exist)
    console.log('Creating contact-profile-photo bucket...');
    const { data: bucketData, error: bucketError } = await supabase
      .storage
      .createBucket('contact-profile-photo', {
        public: false, // Private bucket
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      });

    if (bucketError && !bucketError.message.includes('already exists')) {
      throw bucketError;
    }

    console.log('Bucket created or already exists');

    // Create policy for users to read only their own files
    console.log('Setting up RLS policies for contact-profile-photo bucket...');
    
    // Policy for users to read their own files
    const { error: readPolicyError } = await supabase
      .rpc('create_storage_policy', {
        bucket_name: 'contact-profile-photo',
        policy_name: 'User Read Own Files',
        definition: `((storage.foldername(name))[1] = auth.uid() OR (storage.foldername(name))[1] IS NULL)`,
        operation: 'SELECT',
      });

    if (readPolicyError) {
      console.warn('Error creating read policy:', readPolicyError.message);
      console.log('Policy may already exist or needs manual creation in the Supabase dashboard');
    }

    // Policy for users to upload their own files
    const { error: insertPolicyError } = await supabase
      .rpc('create_storage_policy', {
        bucket_name: 'contact-profile-photo',
        policy_name: 'User Insert Own Files',
        definition: `((storage.foldername(name))[1] = auth.uid())`,
        operation: 'INSERT',
      });

    if (insertPolicyError) {
      console.warn('Error creating insert policy:', insertPolicyError.message);
      console.log('Policy may already exist or needs manual creation in the Supabase dashboard');
    }

    // Policy for users to update their own files
    const { error: updatePolicyError } = await supabase
      .rpc('create_storage_policy', {
        bucket_name: 'contact-profile-photo',
        policy_name: 'User Update Own Files',
        definition: `((storage.foldername(name))[1] = auth.uid())`,
        operation: 'UPDATE',
      });

    if (updatePolicyError) {
      console.warn('Error creating update policy:', updatePolicyError.message);
      console.log('Policy may already exist or needs manual creation in the Supabase dashboard');
    }

    // Policy for users to delete their own files
    const { error: deletePolicyError } = await supabase
      .rpc('create_storage_policy', {
        bucket_name: 'contact-profile-photo',
        policy_name: 'User Delete Own Files',
        definition: `((storage.foldername(name))[1] = auth.uid())`,
        operation: 'DELETE',
      });

    if (deletePolicyError) {
      console.warn('Error creating delete policy:', deletePolicyError.message);
      console.log('Policy may already exist or needs manual creation in the Supabase dashboard');
    }

    console.log('✅ Storage setup complete!');
    console.log('');
    console.log('Manual steps if policies failed to create:');
    console.log('1. Go to your Supabase dashboard: https://app.supabase.com');
    console.log('2. Select your project and go to Storage > Policies');
    console.log('3. For the contact-profile-photo bucket, create these policies:');
    console.log('   - SELECT: ((storage.foldername(name))[1] = auth.uid() OR (storage.foldername(name))[1] IS NULL)');
    console.log('   - INSERT: ((storage.foldername(name))[1] = auth.uid())');
    console.log('   - UPDATE: ((storage.foldername(name))[1] = auth.uid())');
    console.log('   - DELETE: ((storage.foldername(name))[1] = auth.uid())');

  } catch (error) {
    console.error('Error setting up storage:', error.message);
    process.exit(1);
  }
}

setupStorage();
