-- Drop existing tables in reverse order of dependency (or use CASCADE)
-- Using CASCADE makes the order less critical, but reverse dependency is good practice
drop table if exists notes CASCADE;

drop table if exists follow_ups CASCADE;

drop table if exists payments CASCADE;

drop table if exists program_enrollments CASCADE;

drop table if exists session_attendees CASCADE;

drop table if exists sessions CASCADE;

drop table if exists programs CASCADE;

drop table if exists services CASCADE;

drop table if exists clients CASCADE;

-- Drop clients last as many things depend on it
-- Create tables with user_id column and CORRECTED foreign key types
create table clients (
  id bigint primary key generated always as identity,
  first_name text not null,
  last_name text not null,
  email text unique not null,
  phone text,
  address text,
  date_of_birth date,
  notes text,
  created_at timestamp with time zone default now(),
  user_id uuid not null default (auth.uid ())
);

create index idx_clients_email on clients (email);

create index idx_clients_user_id on clients (user_id);

-- Index user_id for RLS performance
create table services (
  id bigint primary key generated always as identity,
  name text not null,
  description text,
  duration integer, -- Assuming duration is in minutes or similar, integer is fine
  price numeric(10, 2) not null,
  created_at timestamp with time zone default now(),
  user_id uuid not null default (auth.uid ())
);

create index idx_services_user_id on services (user_id);

-- Index user_id for RLS performance
create table programs (
  id bigint primary key generated always as identity,
  name text not null,
  description text,
  type text,
  start_date date,
  end_date date,
  sessions_count integer,
  price numeric(10, 2),
  created_at timestamp with time zone default now(),
  user_id uuid not null default (auth.uid ())
);

create index idx_programs_user_id on programs (user_id);

-- Index user_id for RLS performance
create table sessions (
  id bigint primary key generated always as identity,
  service_id bigint references services (id) on delete set null, -- Changed to bigint
  program_id bigint references programs (id) on delete set null, -- Changed to bigint
  start_time timestamp with time zone not null,
  end_time timestamp with time zone,
  location text,
  status text not null,
  notes text,
  created_at timestamp with time zone default now(),
  user_id uuid not null default (auth.uid ())
);

create index idx_sessions_start_time on sessions (start_time);

create index idx_sessions_program_id on sessions (program_id);

create index idx_sessions_service_id on sessions (service_id);

create index idx_sessions_user_id on sessions (user_id);

-- Index user_id for RLS performance
create table session_attendees (
  id bigint primary key generated always as identity,
  session_id bigint not null references sessions (id) on delete CASCADE, -- Changed to bigint
  client_id bigint not null references clients (id) on delete CASCADE, -- Changed to bigint
  attendance_status text not null default 'registered',
  check_in_time timestamp with time zone,
  payment_status text,
  unique (session_id, client_id),
  user_id uuid not null default (auth.uid ())
);

create index idx_session_attendees_session_id on session_attendees (session_id);

create index idx_session_attendees_client_id on session_attendees (client_id);

create index idx_session_attendees_user_id on session_attendees (user_id);

-- Index user_id for RLS performance
create table program_enrollments (
  id bigint primary key generated always as identity,
  program_id bigint not null references programs (id) on delete CASCADE, -- Changed to bigint
  client_id bigint not null references clients (id) on delete CASCADE, -- Changed to bigint
  enrolled_at timestamp with time zone default now(),
  status text not null default 'active',
  sessions_remaining integer,
  completion_date date,
  unique (program_id, client_id),
  user_id uuid not null default (auth.uid ())
);

create index idx_program_enrollments_program_id on program_enrollments (program_id);

create index idx_program_enrollments_client_id on program_enrollments (client_id);

create index idx_program_enrollments_user_id on program_enrollments (user_id);

-- Index user_id for RLS performance
create table payments (
  id bigint primary key generated always as identity,
  client_id bigint not null references clients (id) on delete CASCADE, -- Changed to bigint
  session_id bigint references sessions (id) on delete set null, -- Changed to bigint
  program_id bigint references programs (id) on delete set null, -- Changed to bigint
  amount numeric(10, 2) not null,
  currency text not null default 'USD',
  status text not null,
  stripe_payment_id text unique, -- Added UNIQUE constraint, likely desired
  paid_at timestamp with time zone,
  method text,
  user_id uuid not null default (auth.uid ())
);

create index idx_payments_client_id on payments (client_id);

create index idx_payments_session_id on payments (session_id);

create index idx_payments_program_id on payments (program_id);

create index idx_payments_stripe_payment_id on payments (stripe_payment_id);

create index idx_payments_user_id on payments (user_id);

-- Index user_id for RLS performance
create table follow_ups (
  id bigint primary key generated always as identity,
  client_id bigint not null references clients (id) on delete CASCADE, -- Changed to bigint
  session_id bigint references sessions (id) on delete set null, -- Changed to bigint
  type text not null,
  notes text,
  due_date timestamp with time zone,
  completed boolean not null default false,
  user_id uuid not null default (auth.uid ())
);

create index idx_followups_client_id on follow_ups (client_id);

create index idx_followups_due_date on follow_ups (due_date);

create index idx_followups_session_id on follow_ups (session_id);

create index idx_followups_user_id on follow_ups (user_id);

-- Index user_id for RLS performance
create table notes (
  id bigint primary key generated always as identity,
  client_id bigint references clients (id) on delete CASCADE, -- Changed to bigint
  session_id bigint references sessions (id) on delete CASCADE, -- Changed to bigint
  note_text text not null,
  created_at timestamp with time zone default now(),
  user_id uuid not null default (auth.uid ())
);

create index idx_notes_client_id on notes (client_id);

create index idx_notes_session_id on notes (session_id);

create index idx_notes_user_id on notes (user_id);

-- Index user_id for RLS performance
-- Enable RLS for all tables (these are idempotent, safe to run again)
alter table clients ENABLE row LEVEL SECURITY;

alter table services ENABLE row LEVEL SECURITY;

alter table programs ENABLE row LEVEL SECURITY;

alter table sessions ENABLE row LEVEL SECURITY;

alter table session_attendees ENABLE row LEVEL SECURITY;

alter table program_enrollments ENABLE row LEVEL SECURITY;

alter table payments ENABLE row LEVEL SECURITY;

alter table follow_ups ENABLE row LEVEL SECURITY;

alter table notes ENABLE row LEVEL SECURITY;

-- Create standardized owner-only policies for ALL tables using a DO block
do $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY
    ARRAY['clients', 'services', 'programs', 'sessions', 'session_attendees',
          'program_enrollments', 'payments', 'follow_ups', 'notes']
  LOOP
    -- Drop existing policy IF EXISTS first (makes policy creation idempotent)
    EXECUTE format('DROP POLICY IF EXISTS %I_owner_policy ON %I;', tbl, tbl);

    -- Create the unified policy for all actions
    EXECUTE format(
      'CREATE POLICY %I_owner_policy ON %I
          FOR ALL
          TO authenticated
          USING (user_id = auth.uid())
          WITH CHECK (user_id = auth.uid());
      ',
      tbl, tbl
    );
    -- Grant permissions on the table to the authenticated role (idempotent or handled by Supabase)
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE %I TO authenticated;', tbl);
  END LOOP;
END;
$$;

-- Grant usage on the schema to authenticated users (Needed if using a custom schema)
-- GRANT USAGE ON SCHEMA public TO authenticated; -- Usually default in Supabase
-- Grant usage on sequences for the ID columns (Crucial for INSERTs!)
do $$
DECLARE
  tbl text;
  seq_name text;
BEGIN
  FOREACH tbl IN ARRAY
    ARRAY['clients', 'services', 'programs', 'sessions', 'session_attendees',
          'program_enrollments', 'payments', 'follow_ups', 'notes']
  LOOP
      seq_name := tbl || '_id_seq';
      -- Grant permissions (GRANT is generally idempotent for usage/select)
      EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE %I TO authenticated;', seq_name);
  END LOOP;
END;
$$;

-- Add COMMENTs to tables and columns (Good Practice)
COMMENT on table clients is 'Stores information about wellness clients.';

COMMENT on column clients.user_id is 'Identifier linking the record to the authenticated Supabase user.';

COMMENT on table services is 'Defines the different services offered.';

-- ... Add more comments ...
-- Confirmation message (optional, won't show in Supabase editor but useful in psql)
-- SELECT 'Schema setup complete.' as status;