-- Step 1: Copy data from old 'company' column to 'company_name'
-- Only update if company_name is NULL and the old company column has a value.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'company') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'company_name') THEN
        
        UPDATE clients
        SET company_name = company
        WHERE company_name IS NULL AND company IS NOT NULL;
        
    END IF;
END $$;

-- Step 2: Copy data from old 'avatar_url' column to 'profile_image_url'
-- Only update if profile_image_url is NULL and the old avatar_url column has a value.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'avatar_url') AND
       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'profile_image_url') THEN

        UPDATE clients
        SET profile_image_url = avatar_url
        WHERE profile_image_url IS NULL AND avatar_url IS NOT NULL;

    END IF;
END $$;

-- Step 3: Drop the old 'company' column if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'company') THEN
        ALTER TABLE clients DROP COLUMN company;
    END IF;
END $$;

-- Step 4: Drop the old 'avatar_url' column if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'avatar_url') THEN
        ALTER TABLE clients DROP COLUMN avatar_url;
    END IF;
END $$;

-- Comments for company_name and profile_image_url should have been set by 20250524170327_add_client_details_fields.sql
