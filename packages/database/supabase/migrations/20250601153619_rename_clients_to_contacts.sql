-- Step 1: Rename table
ALTER TABLE public.clients RENAME TO contacts;

-- Step 2: Recreate RLS policies for the new 'contacts' table
-- Drop any existing policies on 'contacts' that might have been auto-created or carried over incorrectly
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT polname FROM pg_policy WHERE polrelid = 'public.contacts'::regclass
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.contacts;', pol.polname);
  END LOOP;
END $$;

-- Create the owner policy for 'contacts', using the performance-optimized helper function
CREATE POLICY "contacts_owner_policy"
ON public.contacts
FOR ALL
TO authenticated
USING (public.get_current_user_id() = user_id) -- Using the helper function from public schema
WITH CHECK (public.get_current_user_id() = user_id); -- Using the helper function from public schema