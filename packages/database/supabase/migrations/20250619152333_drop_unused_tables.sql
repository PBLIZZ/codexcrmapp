-- Migration script to drop unused tables
-- Generated on 2025-06-19 15:23:33

BEGIN;

-- Drop tables with CASCADE to handle dependencies
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.programs CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.follow_ups CASCADE;
DROP TABLE IF EXISTS public.notes CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.program_enrollments CASCADE;
DROP TABLE IF EXISTS public.session_attendees CASCADE;
DROP TABLE IF EXISTS public.contact_profiles CASCADE;
DROP TABLE IF EXISTS public.ai_actions CASCADE;
DROP TABLE IF EXISTS public.wellness_metrics CASCADE;
DROP TABLE IF EXISTS public.relationship_events CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.headings CASCADE;
DROP TABLE IF EXISTS public.tags CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.checklists CASCADE;
DROP TABLE IF EXISTS public.checklist_items CASCADE;
DROP TABLE IF EXISTS public.task_dependencies CASCADE;
DROP TABLE IF EXISTS public.task_history CASCADE;
DROP TABLE IF EXISTS public.task_tags CASCADE;
DROP TABLE IF EXISTS public.project_tags CASCADE;

COMMIT;