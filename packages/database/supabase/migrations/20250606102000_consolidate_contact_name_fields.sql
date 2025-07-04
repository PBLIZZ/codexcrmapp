-- Add the full_name column
ALTER TABLE public.contacts ADD COLUMN full_name TEXT;

-- Populate the full_name column from existing first_name and last_name
-- This handles cases where first_name or last_name might be null or empty,
-- and trims any resulting leading/trailing/double spaces.
UPDATE public.contacts
SET full_name = TRIM(BOTH ' ' FROM COALESCE(first_name, '') || ' ' || COALESCE(last_name, ''));

-- Set full_name to NOT NULL.
-- The original schema in types.ts showed first_name and last_name as non-nullable strings,
-- so full_name should always have a value after concatenation (even if it's an empty string from two null/empty names,
-- though that scenario shouldn't happen if the previous NOT NULL constraints were enforced).
-- If an empty string is not acceptable, further constraints might be needed.
ALTER TABLE public.contacts ALTER COLUMN full_name SET NOT NULL;

-- Drop the old first_name and last_name columns
ALTER TABLE public.contacts DROP COLUMN first_name;
ALTER TABLE public.contacts DROP COLUMN last_name;
