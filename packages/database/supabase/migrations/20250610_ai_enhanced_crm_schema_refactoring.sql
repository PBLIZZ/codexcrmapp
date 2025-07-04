-- Migration: Refactor database schema for AI-Enhanced CRM features
-- This migration adds support for contact enrichment, AI insights, and relationship tracking

-- 1. Enhance contacts table with additional fields for wellness journey tracking
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS wellness_goals TEXT[];
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS wellness_journey_stage TEXT;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS wellness_status TEXT;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS last_assessment_date TIMESTAMPTZ;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS client_since TIMESTAMPTZ;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS relationship_status TEXT;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS referral_source TEXT;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS communication_preferences JSONB;

COMMENT ON COLUMN public.contacts.wellness_goals IS 'Array of wellness goals set by the client';
COMMENT ON COLUMN public.contacts.wellness_journey_stage IS 'Current stage in wellness journey (e.g., new, active, maintenance)';
COMMENT ON COLUMN public.contacts.wellness_status IS 'Overall wellness status assessment';
COMMENT ON COLUMN public.contacts.last_assessment_date IS 'Date of most recent wellness assessment';
COMMENT ON COLUMN public.contacts.client_since IS 'Date when the person became a client';
COMMENT ON COLUMN public.contacts.relationship_status IS 'Status of relationship with practitioner';
COMMENT ON COLUMN public.contacts.referral_source IS 'How the client was referred';
COMMENT ON COLUMN public.contacts.communication_preferences IS 'Preferred communication methods and frequency';

-- 2. Create contact_profiles table for extended profile information
CREATE TABLE IF NOT EXISTS public.contact_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  detailed_bio TEXT,
  personality_traits TEXT[],
  health_metrics JSONB,
  wellness_history TEXT,
  important_dates JSONB,
  custom_fields JSONB,
  preferences JSONB,
  family_members JSONB[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT contact_profiles_contact_user_unique UNIQUE (contact_id, user_id)
);

-- Add indexes for contact_profiles
CREATE INDEX IF NOT EXISTS idx_contact_profiles_contact_id ON public.contact_profiles(contact_id);
CREATE INDEX IF NOT EXISTS idx_contact_profiles_user_id ON public.contact_profiles(user_id);

-- Enable RLS for contact_profiles
ALTER TABLE public.contact_profiles ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for contact_profiles
CREATE POLICY "contact_profiles_owner_policy"
  ON public.contact_profiles
  FOR ALL
  TO authenticated
  USING (public.get_current_user_id() = user_id)
  WITH CHECK (public.get_current_user_id() = user_id);

-- Grant permissions for authenticated users
GRANT ALL ON TABLE public.contact_profiles TO authenticated;

COMMENT ON TABLE public.contact_profiles IS 'Stores extended profile information for contacts';
COMMENT ON COLUMN public.contact_profiles.detailed_bio IS 'Comprehensive biography including life events, background';
COMMENT ON COLUMN public.contact_profiles.personality_traits IS 'Array of personality characteristics';
COMMENT ON COLUMN public.contact_profiles.health_metrics IS 'Various health measurements and indicators';
COMMENT ON COLUMN public.contact_profiles.wellness_history IS 'Narrative of past wellness experiences';
COMMENT ON COLUMN public.contact_profiles.important_dates IS 'Key dates like anniversaries, milestones';
COMMENT ON COLUMN public.contact_profiles.custom_fields IS 'User-defined additional profile fields';
COMMENT ON COLUMN public.contact_profiles.preferences IS 'Client preferences for sessions, communication, etc.';
COMMENT ON COLUMN public.contact_profiles.family_members IS 'Information about family connections';

-- 3. Enhance sessions table with additional fields
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS duration_minutes INTEGER;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS session_type TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS virtual_meeting_link TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS outcomes TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS follow_up_needed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS follow_up_details TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS ai_insights JSONB;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS sentiment TEXT;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS key_topics TEXT[];

COMMENT ON COLUMN public.sessions.duration_minutes IS 'Duration of the session in minutes';
COMMENT ON COLUMN public.sessions.session_type IS 'Type of session (intake, follow-up, assessment, etc.)';
COMMENT ON COLUMN public.sessions.location IS 'Physical location where session occurs';
COMMENT ON COLUMN public.sessions.virtual_meeting_link IS 'Link for virtual meetings';
COMMENT ON COLUMN public.sessions.outcomes IS 'Outcomes or results from the session';
COMMENT ON COLUMN public.sessions.follow_up_needed IS 'Flag indicating if follow-up is required';
COMMENT ON COLUMN public.sessions.follow_up_details IS 'Details about required follow-up actions';
COMMENT ON COLUMN public.sessions.ai_insights IS 'AI-generated insights from session content';
COMMENT ON COLUMN public.sessions.sentiment IS 'Overall sentiment analysis of the session';
COMMENT ON COLUMN public.sessions.key_topics IS 'Main topics discussed during session';

-- Create index for key_topics to improve search performance
CREATE INDEX IF NOT EXISTS idx_sessions_key_topics ON public.sessions USING GIN(key_topics);

-- 4. Create ai_actions table for AI-generated suggestions and approval status
CREATE TABLE IF NOT EXISTS public.ai_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  session_id BIGINT REFERENCES public.sessions(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  suggestion TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  context JSONB,
  feedback TEXT,
  implemented BOOLEAN DEFAULT FALSE,
  implementation_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for ai_actions
CREATE INDEX IF NOT EXISTS idx_ai_actions_user_id ON public.ai_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_actions_contact_id ON public.ai_actions(contact_id);
CREATE INDEX IF NOT EXISTS idx_ai_actions_session_id ON public.ai_actions(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_actions_status ON public.ai_actions(status);
CREATE INDEX IF NOT EXISTS idx_ai_actions_action_type ON public.ai_actions(action_type);

-- Enable RLS for ai_actions
ALTER TABLE public.ai_actions ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for ai_actions
CREATE POLICY "ai_actions_owner_policy"
  ON public.ai_actions
  FOR ALL
  TO authenticated
  USING (public.get_current_user_id() = user_id)
  WITH CHECK (public.get_current_user_id() = user_id);

-- Grant permissions for authenticated users
GRANT ALL ON TABLE public.ai_actions TO authenticated;

COMMENT ON TABLE public.ai_actions IS 'Stores AI-generated suggestions and their approval status';
COMMENT ON COLUMN public.ai_actions.action_type IS 'Type of action suggested (follow-up, content, assessment, etc.)';
COMMENT ON COLUMN public.ai_actions.suggestion IS 'The actual suggestion text generated by AI';
COMMENT ON COLUMN public.ai_actions.status IS 'Status of the suggestion (pending, approved, rejected, implemented)';
COMMENT ON COLUMN public.ai_actions.priority IS 'Priority level of the suggestion (low, medium, high)';
COMMENT ON COLUMN public.ai_actions.context IS 'Contextual information used to generate the suggestion';
COMMENT ON COLUMN public.ai_actions.feedback IS 'User feedback on the suggestion';
COMMENT ON COLUMN public.ai_actions.implemented IS 'Whether the suggestion has been implemented';
COMMENT ON COLUMN public.ai_actions.implementation_date IS 'When the suggestion was implemented';

-- 5. Enhance notes table with AI analysis and tagging
-- First make sure we're using "contact_id" rather than "client_id" for consistency
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'notes' 
    AND column_name = 'client_id'
  ) THEN
    ALTER TABLE public.notes RENAME COLUMN client_id TO contact_id;
  END IF;
END
$$;

-- Add AI analysis fields to notes
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS ai_analysis JSONB;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS sentiment TEXT;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS key_topics TEXT[];
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS action_items JSONB[];
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS ai_tags TEXT[];
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS is_ai_generated BOOLEAN DEFAULT FALSE;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'private';

-- Rename note_text to content if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'notes' 
    AND column_name = 'note_text'
  ) THEN
    ALTER TABLE public.notes RENAME COLUMN note_text TO content;
  END IF;
END
$$;

COMMENT ON COLUMN public.notes.ai_analysis IS 'AI-generated analysis of note content';
COMMENT ON COLUMN public.notes.sentiment IS 'Sentiment analysis of note content';
COMMENT ON COLUMN public.notes.key_topics IS 'Main topics identified in the note';
COMMENT ON COLUMN public.notes.action_items IS 'Action items extracted from note content';
COMMENT ON COLUMN public.notes.ai_tags IS 'AI-generated tags for categorization';
COMMENT ON COLUMN public.notes.is_ai_generated IS 'Whether the note was generated by AI';
COMMENT ON COLUMN public.notes.visibility IS 'Visibility setting (private, shared, public)';

-- Create index for key_topics and ai_tags to improve search
CREATE INDEX IF NOT EXISTS idx_notes_key_topics ON public.notes USING GIN(key_topics);
CREATE INDEX IF NOT EXISTS idx_notes_ai_tags ON public.notes USING GIN(ai_tags);

-- 6. Create wellness_metrics table for tracking progress
CREATE TABLE IF NOT EXISTS public.wellness_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value JSONB NOT NULL,
  recorded_date TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for wellness_metrics
CREATE INDEX IF NOT EXISTS idx_wellness_metrics_user_id ON public.wellness_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_metrics_contact_id ON public.wellness_metrics(contact_id);
CREATE INDEX IF NOT EXISTS idx_wellness_metrics_metric_name ON public.wellness_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_wellness_metrics_recorded_date ON public.wellness_metrics(recorded_date);

-- Enable RLS for wellness_metrics
ALTER TABLE public.wellness_metrics ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for wellness_metrics
CREATE POLICY "wellness_metrics_owner_policy"
  ON public.wellness_metrics
  FOR ALL
  TO authenticated
  USING (public.get_current_user_id() = user_id)
  WITH CHECK (public.get_current_user_id() = user_id);

-- Grant permissions for authenticated users
GRANT ALL ON TABLE public.wellness_metrics TO authenticated;

COMMENT ON TABLE public.wellness_metrics IS 'Tracks wellness metrics and progress for contacts';
COMMENT ON COLUMN public.wellness_metrics.metric_name IS 'Name of the wellness metric being tracked';
COMMENT ON COLUMN public.wellness_metrics.metric_value IS 'Value of the metric, stored as JSONB for flexibility';
COMMENT ON COLUMN public.wellness_metrics.recorded_date IS 'When the metric was recorded';
COMMENT ON COLUMN public.wellness_metrics.notes IS 'Additional notes about the measurement';

-- 7. Create relationship_events table for tracking significant interactions
CREATE TABLE IF NOT EXISTS public.relationship_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  description TEXT,
  importance INTEGER DEFAULT 3, -- Scale 1-5
  session_id BIGINT REFERENCES public.sessions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for relationship_events
CREATE INDEX IF NOT EXISTS idx_relationship_events_user_id ON public.relationship_events(user_id);
CREATE INDEX IF NOT EXISTS idx_relationship_events_contact_id ON public.relationship_events(contact_id);
CREATE INDEX IF NOT EXISTS idx_relationship_events_event_type ON public.relationship_events(event_type);
CREATE INDEX IF NOT EXISTS idx_relationship_events_event_date ON public.relationship_events(event_date);
CREATE INDEX IF NOT EXISTS idx_relationship_events_session_id ON public.relationship_events(session_id);

-- Enable RLS for relationship_events
ALTER TABLE public.relationship_events ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for relationship_events
CREATE POLICY "relationship_events_owner_policy"
  ON public.relationship_events
  FOR ALL
  TO authenticated
  USING (public.get_current_user_id() = user_id)
  WITH CHECK (public.get_current_user_id() = user_id);

-- Grant permissions for authenticated users
GRANT ALL ON TABLE public.relationship_events TO authenticated;

COMMENT ON TABLE public.relationship_events IS 'Tracks significant events in client relationships';
COMMENT ON COLUMN public.relationship_events.event_type IS 'Type of relationship event (milestone, conflict, breakthrough, etc.)';
COMMENT ON COLUMN public.relationship_events.event_date IS 'When the event occurred';
COMMENT ON COLUMN public.relationship_events.description IS 'Description of the event';
COMMENT ON COLUMN public.relationship_events.importance IS 'Importance rating (1-5) of the event';
COMMENT ON COLUMN public.relationship_events.session_id IS 'Associated session if applicable';

-- 8. Additional indexes for performance on existing tables
-- Add specific indexes for contacts table
CREATE INDEX IF NOT EXISTS idx_contacts_wellness_journey_stage ON public.contacts(wellness_journey_stage);
CREATE INDEX IF NOT EXISTS idx_contacts_wellness_status ON public.contacts(wellness_status);
CREATE INDEX IF NOT EXISTS idx_contacts_last_assessment_date ON public.contacts(last_assessment_date);
CREATE INDEX IF NOT EXISTS idx_contacts_client_since ON public.contacts(client_since);
CREATE INDEX IF NOT EXISTS idx_contacts_relationship_status ON public.contacts(relationship_status);

-- Update triggers for timestamps on all tables
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to new tables
DO $$
DECLARE
  tbl text;
  tables text[] := ARRAY['contact_profiles', 'ai_actions', 'wellness_metrics', 'relationship_events'];
BEGIN
  FOREACH tbl IN ARRAY tables
  LOOP
    -- Drop existing trigger if exists
    EXECUTE format('DROP TRIGGER IF EXISTS update_updated_at ON public.%I;', tbl);
    
    -- Create new trigger
    EXECUTE format('
      CREATE TRIGGER update_updated_at
      BEFORE UPDATE ON public.%I
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
    ', tbl);
  END LOOP;
END;
$$;