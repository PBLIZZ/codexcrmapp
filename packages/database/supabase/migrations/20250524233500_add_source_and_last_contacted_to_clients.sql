-- Add source column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'clients' AND column_name = 'source') THEN
        ALTER TABLE clients ADD COLUMN source TEXT;
    END IF;
END $$;

-- Add last_contacted_at column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                  WHERE table_name = 'clients' AND column_name = 'last_contacted_at') THEN
        ALTER TABLE clients ADD COLUMN last_contacted_at TIMESTAMPTZ; -- Using TIMESTAMPTZ for timezone support
    END IF;
END $$;

-- Add comments to the new columns for documentation
COMMENT ON COLUMN clients.source IS 'Source from where the client was acquired (e.g., Referral, Website, Event)';
COMMENT ON COLUMN clients.last_contacted_at IS 'Timestamp of the last contact with the client';
