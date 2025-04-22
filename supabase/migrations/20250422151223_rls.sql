-- 0. Enable the pgcrypto extension (needed for uuid_generate_v4 if you switch to UUID PKs later)
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-------------------------------------------------
-- 1.  Add owner column to every user‑scoped table
-------------------------------------------------
-- NOTE: auth.users.id is UUID, so we use uuid here.
-- If you keep bigint PKs for data tables, that’s OK; the owner column is *still* uuid.

ALTER TABLE clients              ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid();
ALTER TABLE services             ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid();
ALTER TABLE programs             ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid();
ALTER TABLE sessions             ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid();
ALTER TABLE session_attendees    ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid();
ALTER TABLE program_enrollments  ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid();
ALTER TABLE payments             ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid();
ALTER TABLE follow_ups           ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid();
ALTER TABLE notes                ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid();

-- (Optional but recommended)
-- Add FK back to auth.users for referential integrity
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY
    ARRAY[
      'clients','services','programs','sessions',
      'session_attendees','program_enrollments',
      'payments','follow_ups','notes'
    ]
  LOOP
    EXECUTE format(
      'ALTER TABLE %I
         ADD CONSTRAINT %I_user_fk
         FOREIGN KEY (user_id) REFERENCES auth.users(id);',
      t, t
    );
  END LOOP;
END $$;

-------------------------------------------------
-- 2.  Turn RLS ON for all those tables
-------------------------------------------------
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY
    ARRAY[
      'clients','services','programs','sessions',
      'session_attendees','program_enrollments',
      'payments','follow_ups','notes'
    ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
  END LOOP;
END $$;

-------------------------------------------------
-- 3.  “Owner can read/write” policies
-------------------------------------------------
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY
    ARRAY[
      'clients','services','programs','sessions',
      'session_attendees','program_enrollments',
      'payments','follow_ups','notes'
    ]
  LOOP
    EXECUTE format(
      $policy$
      CREATE POLICY %I_owner_all
      ON %I
      FOR ALL
      USING  (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
      $policy$,
      t, t
    );
  END LOOP;
END $$;

-- 4. Verify
-- SELECT table_name, relrowsecurity FROM information_schema.tables
--   JOIN pg_class ON relname = table_name
--   WHERE table_schema = 'public';