-- Migration to update clients table with missing fields
-- This ensures all fields from the client form schema are present in the database

-- Add company_name column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'clients' AND column_name = 'company_name') THEN
        ALTER TABLE clients ADD COLUMN company_name TEXT;
    END IF;
END $$;

-- Add job_title column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'clients' AND column_name = 'job_title') THEN
        ALTER TABLE clients ADD COLUMN job_title TEXT;
    END IF;
END $$;

-- Add profile_image_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'clients' AND column_name = 'profile_image_url') THEN
        ALTER TABLE clients ADD COLUMN profile_image_url TEXT;
    END IF;
END $$;

-- Add notes column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'clients' AND column_name = 'notes') THEN
        ALTER TABLE clients ADD COLUMN notes TEXT;
    END IF;
END $$;

-- Add comment to the table for documentation
COMMENT ON TABLE clients IS 'Stores client information with all fields matching the UI form schema';

-- Add comments to the columns for documentation
COMMENT ON COLUMN clients.company_name IS 'Client company name';
COMMENT ON COLUMN clients.job_title IS 'Client job title';
COMMENT ON COLUMN clients.profile_image_url IS 'URL to client profile image/avatar';
COMMENT ON COLUMN clients.notes IS 'Additional notes about the client';
