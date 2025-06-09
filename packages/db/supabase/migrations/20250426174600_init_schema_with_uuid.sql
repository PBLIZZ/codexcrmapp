-- Migration: Recreate core schema with UUID for clients and standardized RLS policies

-- Drop existing tables in a safe order (rely on CASCADE)
DROP TABLE IF EXISTS public.notes CASCADE;
DROP TABLE IF EXISTS public.follow_ups CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.program_enrollments CASCADE;
DROP TABLE IF EXISTS public.session_attendees CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.programs CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE; -- Drop clients last

-------------------------------------------------
-- Create Tables with Corrected Types & Foreign Keys
-------------------------------------------------

-- Clients table using UUID primary key
CREATE TABLE public.clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), -- Use UUID for clients PK
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- FK to auth users
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text, -- Removed UNIQUE constraint, allow null if needed
    phone text,
    address_street text,
    address_city text,
    address_state text,
    address_postal_code text,
    address_country text,
    company_name text,
    job_title text,
    date_of_birth date,
    profile_image_url text, -- For Supabase Storage path
    social_profiles jsonb, -- Store key-value pairs
    enrichment_data jsonb, -- Store data from external enrichment
    tags text[], -- Array for categorization
    notes text, -- General notes
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX clients_user_id_email_unique_idx ON public.clients (user_id, lower(email)) WHERE email IS NOT NULL;
CREATE INDEX idx_clients_user_id ON public.clients(user_id);
COMMENT ON TABLE public.clients IS 'Stores information about wellness clients.';
COMMENT ON COLUMN public.clients.user_id IS 'Identifier linking the client record to the authenticated Supabase user who owns it.';
COMMENT ON COLUMN public.clients.profile_image_url IS 'Path to the profile image file in Supabase Storage.';

-- Services table (keeping bigint PK for this example)
CREATE TABLE public.services (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    duration integer, -- Duration in minutes
    price numeric(10, 2),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX idx_services_user_id ON public.services(user_id);
COMMENT ON TABLE public.services IS 'Defines the different services offered by a practitioner.';

-- Programs table (keeping bigint PK)
CREATE TABLE public.programs (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    start_date date,
    end_date date,
    price numeric(10, 2),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX idx_programs_user_id ON public.programs(user_id);
COMMENT ON TABLE public.programs IS 'Represents multi-session programs or packages.';

-- Sessions table (keeping bigint PK)
CREATE TABLE public.sessions (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL, -- References clients.id (UUID)
    service_id bigint REFERENCES public.services(id) ON DELETE SET NULL,
    program_id bigint REFERENCES public.programs(id) ON DELETE SET NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone,
    status text NOT NULL CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
    location text,
    notes text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_client_id ON public.sessions(client_id);
CREATE INDEX idx_sessions_service_id ON public.sessions(service_id);
CREATE INDEX idx_sessions_program_id ON public.sessions(program_id);
CREATE INDEX idx_sessions_start_time ON public.sessions(start_time);
COMMENT ON TABLE public.sessions IS 'Records individual appointments or sessions.';

-- Session Attendees junction table
CREATE TABLE public.session_attendees (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id bigint NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
    client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE, -- References clients.id (UUID)
    attendance_status text NOT NULL DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'absent')),
    check_in_time timestamp with time zone,
    notes text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (session_id, client_id)
);
CREATE INDEX idx_session_attendees_user_id ON public.session_attendees(user_id);
CREATE INDEX idx_session_attendees_session_id ON public.session_attendees(session_id);
CREATE INDEX idx_session_attendees_client_id ON public.session_attendees(client_id);
COMMENT ON TABLE public.session_attendees IS 'Links clients attending specific sessions (for group sessions or tracking).';

-- Program Enrollments junction table
CREATE TABLE public.program_enrollments (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    program_id bigint NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE, -- References clients.id (UUID)
    enrolled_at timestamp with time zone NOT NULL DEFAULT now(),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    completion_date date,
    notes text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (program_id, client_id)
);
CREATE INDEX idx_program_enrollments_user_id ON public.program_enrollments(user_id);
CREATE INDEX idx_program_enrollments_program_id ON public.program_enrollments(program_id);
CREATE INDEX idx_program_enrollments_client_id ON public.program_enrollments(client_id);
COMMENT ON TABLE public.program_enrollments IS 'Links clients enrolled in specific programs.';

-- Payments table
CREATE TABLE public.payments (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE, -- References clients.id (UUID)
    session_id bigint REFERENCES public.sessions(id) ON DELETE SET NULL,
    program_id bigint REFERENCES public.programs(id) ON DELETE SET NULL,
    service_id bigint REFERENCES public.services(id) ON DELETE SET NULL,
    amount numeric(10, 2) NOT NULL,
    currency char(3) NOT NULL DEFAULT 'USD',
    status text NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    method text,
    external_payment_id text UNIQUE,
    paid_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_client_id ON public.payments(client_id);
CREATE INDEX idx_payments_session_id ON public.payments(session_id);
CREATE INDEX idx_payments_program_id ON public.payments(program_id);
CREATE INDEX idx_payments_service_id ON public.payments(service_id);
CREATE INDEX idx_payments_external_payment_id ON public.payments(external_payment_id);
COMMENT ON TABLE public.payments IS 'Tracks payments related to clients, sessions, or programs.';

-- Follow-ups table
CREATE TABLE public.follow_ups (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE, -- References clients.id (UUID)
    session_id bigint REFERENCES public.sessions(id) ON DELETE SET NULL,
    type text NOT NULL,
    notes text,
    due_date timestamp with time zone,
    completed_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX idx_followups_user_id ON public.follow_ups(user_id);
CREATE INDEX idx_followups_client_id ON public.follow_ups(client_id);
CREATE INDEX idx_followups_session_id ON public.follow_ups(session_id);
CREATE INDEX idx_followups_due_date ON public.follow_ups(due_date);
COMMENT ON TABLE public.follow_ups IS 'Tracks follow-up tasks or actions related to clients/sessions.';

-- Notes table
CREATE TABLE public.notes (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE, -- References clients.id (UUID)
    session_id bigint REFERENCES public.sessions(id) ON DELETE CASCADE,
    program_id bigint REFERENCES public.programs(id) ON DELETE SET NULL,
    title text,
    note_text text NOT NULL,
    is_pinned boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX idx_notes_user_id ON public.notes(user_id);
CREATE INDEX idx_notes_client_id ON public.notes(client_id);
CREATE INDEX idx_notes_session_id ON public.notes(session_id);
CREATE INDEX idx_notes_program_id ON public.notes(program_id);
COMMENT ON TABLE public.notes IS 'Stores general or specific notes related to clients, sessions, or programs.';

-------------------------------------------------
-- Enable RLS and Apply Policies and Grants
-------------------------------------------------
DO $$
DECLARE
  tbl text;
  authenticated_role regrole := 'authenticated'; -- Use regrole for safety
  policy_name text;
  seq_name text;

  -- List of tables managed by this RLS setup
  rls_tables text[] := ARRAY[
      'clients', 'services', 'programs', 'sessions',
      'session_attendees', 'program_enrollments',
      'payments', 'follow_ups', 'notes'
  ];

BEGIN
  FOREACH tbl IN ARRAY rls_tables
  LOOP
    -- Enable RLS
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);

    -- Define Owner Policy Name
    policy_name := format('%I_owner_policy', tbl);

    -- Drop existing policy IF EXISTS first (makes policy creation idempotent)
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I;', policy_name, tbl);

    -- Create the unified policy for all actions for authenticated users
    EXECUTE format(
      'CREATE POLICY %I ON public.%I
          FOR ALL
          TO %s -- Use role variable
          USING (user_id = auth.uid())
          WITH CHECK (user_id = auth.uid());',
      policy_name, tbl, authenticated_role
    );

    -- Grant permissions on the table to the authenticated role
    -- Granting ALL (SELECT, INSERT, UPDATE, DELETE) based on the policy above
    EXECUTE format('GRANT ALL ON TABLE public.%I TO %s;', tbl, authenticated_role);

    -- Grant usage on sequences if using bigint identity PKs
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = tbl AND column_name = 'id'
        AND column_default LIKE 'nextval(%_id_seq%::regclass)'
    ) THEN
        seq_name := tbl || '_id_seq';
        EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE public.%I TO %s;', seq_name, authenticated_role);
    END IF;

  END LOOP;

    -- Grant usage on the schema (usually default but safe to include)
    EXECUTE format('GRANT USAGE ON SCHEMA public TO %s;', authenticated_role);

END;
$$;

-- SELECT 'Schema, RLS, and Grants setup complete.' as status; -- Optional confirmation