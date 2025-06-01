-- Create a helper function in the 'public' schema to get the current user's ID.
-- This can be used in RLS policies to improve performance by reducing direct calls to auth.uid() per row.
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid
LANGUAGE sql STABLE
SECURITY DEFINER
-- Set a secure search_path: by default, SECURITY DEFINER functions will have a
-- search_path that includes pg_temp, which can be exploited by malicious users.
-- See https://www.postgresql.org/docs/current/sql-createfunction.html#SQL-CREATEFUNCTION-SECURITY
SET search_path = public, pg_catalog -- Keep 'public' here as the function is now in 'public'
AS $$
  SELECT auth.uid();
$$;

-- Grant execute permission to authenticated users, or any role that will need to use it in RLS policies.
GRANT EXECUTE ON FUNCTION public.get_current_user_id() TO authenticated;
-- If service_role or other roles need it, grant to them as well:
-- GRANT EXECUTE ON FUNCTION auth.get_current_user_id() TO service_role;