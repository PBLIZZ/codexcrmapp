-- Migration: Complete RLS policies and standardize cascade rules
-- This migration adds missing RLS policies and standardizes cascade rules for foreign keys

-- 1. Add RLS policies for notes table
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notes_owner_policy"
  ON public.notes
  FOR ALL
  TO authenticated
  USING (public.get_current_user_id() = user_id)
  WITH CHECK (public.get_current_user_id() = user_id);

-- 2. Add RLS policies for sessions table
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sessions_owner_policy"
  ON public.sessions
  FOR ALL
  TO authenticated
  USING (public.get_current_user_id() = user_id)
  WITH CHECK (public.get_current_user_id() = user_id);

-- 3. Standardize cascade rules for foreign keys
-- First, drop existing foreign keys without cascade rules

-- For sessions table
ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS sessions_contact_id_fkey;
ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS sessions_program_id_fkey;
ALTER TABLE public.sessions DROP CONSTRAINT IF EXISTS sessions_service_id_fkey;

-- Re-add with cascade rules
ALTER TABLE public.sessions 
  ADD CONSTRAINT sessions_contact_id_fkey 
  FOREIGN KEY (contact_id) 
  REFERENCES public.contacts(id) 
  ON DELETE CASCADE;

ALTER TABLE public.sessions 
  ADD CONSTRAINT sessions_program_id_fkey 
  FOREIGN KEY (program_id) 
  REFERENCES public.programs(id) 
  ON DELETE SET NULL;

ALTER TABLE public.sessions 
  ADD CONSTRAINT sessions_service_id_fkey 
  FOREIGN KEY (service_id) 
  REFERENCES public.services(id) 
  ON DELETE SET NULL;

-- For notes table
ALTER TABLE public.notes DROP CONSTRAINT IF EXISTS notes_contact_id_fkey;
ALTER TABLE public.notes DROP CONSTRAINT IF EXISTS notes_session_id_fkey;

ALTER TABLE public.notes 
  ADD CONSTRAINT notes_contact_id_fkey 
  FOREIGN KEY (contact_id) 
  REFERENCES public.contacts(id) 
  ON DELETE CASCADE;

ALTER TABLE public.notes 
  ADD CONSTRAINT notes_session_id_fkey 
  FOREIGN KEY (session_id) 
  REFERENCES public.sessions(id) 
  ON DELETE SET NULL;

-- For follow_ups table
ALTER TABLE public.follow_ups DROP CONSTRAINT IF EXISTS follow_ups_contact_id_fkey;
ALTER TABLE public.follow_ups DROP CONSTRAINT IF EXISTS follow_ups_session_id_fkey;

ALTER TABLE public.follow_ups 
  ADD CONSTRAINT follow_ups_contact_id_fkey 
  FOREIGN KEY (contact_id) 
  REFERENCES public.contacts(id) 
  ON DELETE CASCADE;

ALTER TABLE public.follow_ups 
  ADD CONSTRAINT follow_ups_session_id_fkey 
  FOREIGN KEY (session_id) 
  REFERENCES public.sessions(id) 
  ON DELETE SET NULL;

-- For session_attendees table
ALTER TABLE public.session_attendees DROP CONSTRAINT IF EXISTS session_attendees_contact_id_fkey;
ALTER TABLE public.session_attendees DROP CONSTRAINT IF EXISTS session_attendees_session_id_fkey;

ALTER TABLE public.session_attendees 
  ADD CONSTRAINT session_attendees_contact_id_fkey 
  FOREIGN KEY (contact_id) 
  REFERENCES public.contacts(id) 
  ON DELETE CASCADE;

ALTER TABLE public.session_attendees 
  ADD CONSTRAINT session_attendees_session_id_fkey 
  FOREIGN KEY (session_id) 
  REFERENCES public.sessions(id) 
  ON DELETE CASCADE;

-- For payments table
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_contact_id_fkey;
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_program_id_fkey;

ALTER TABLE public.payments 
  ADD CONSTRAINT payments_contact_id_fkey 
  FOREIGN KEY (contact_id) 
  REFERENCES public.contacts(id) 
  ON DELETE CASCADE;

ALTER TABLE public.payments 
  ADD CONSTRAINT payments_program_id_fkey 
  FOREIGN KEY (program_id) 
  REFERENCES public.programs(id) 
  ON DELETE SET NULL;

-- For program_enrollments table
ALTER TABLE public.program_enrollments DROP CONSTRAINT IF EXISTS program_enrollments_contact_id_fkey;
ALTER TABLE public.program_enrollments DROP CONSTRAINT IF EXISTS program_enrollments_program_id_fkey;

ALTER TABLE public.program_enrollments 
  ADD CONSTRAINT program_enrollments_contact_id_fkey 
  FOREIGN KEY (contact_id) 
  REFERENCES public.contacts(id) 
  ON DELETE CASCADE;

ALTER TABLE public.program_enrollments 
  ADD CONSTRAINT program_enrollments_program_id_fkey 
  FOREIGN KEY (program_id) 
  REFERENCES public.programs(id) 
  ON DELETE CASCADE;

-- For group_members table
ALTER TABLE public.group_members DROP CONSTRAINT IF EXISTS group_members_contact_id_fkey;
ALTER TABLE public.group_members DROP CONSTRAINT IF EXISTS group_members_group_id_fkey;

ALTER TABLE public.group_members 
  ADD CONSTRAINT group_members_contact_id_fkey 
  FOREIGN KEY (contact_id) 
  REFERENCES public.contacts(id) 
  ON DELETE CASCADE;

ALTER TABLE public.group_members 
  ADD CONSTRAINT group_members_group_id_fkey 
  FOREIGN KEY (group_id) 
  REFERENCES public.groups(id) 
  ON DELETE CASCADE;

-- Grant permissions for authenticated users
GRANT ALL ON TABLE public.notes TO authenticated;
GRANT ALL ON TABLE public.sessions TO authenticated;