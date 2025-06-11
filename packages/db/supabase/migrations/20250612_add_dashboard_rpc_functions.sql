-- Create RPC function to get contacts by wellness journey stage
CREATE OR REPLACE FUNCTION get_contacts_by_journey_stage()
RETURNS TABLE (wellness_journey_stage text, count bigint) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    contacts.wellness_journey_stage, 
    COUNT(*)::bigint
  FROM 
    contacts
  WHERE 
    contacts.wellness_journey_stage IS NOT NULL
  GROUP BY 
    contacts.wellness_journey_stage;
END;
$$ LANGUAGE plpgsql;

-- Create RPC function to get sessions by type
CREATE OR REPLACE FUNCTION get_sessions_by_type()
RETURNS TABLE (session_type text, count bigint) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sessions.session_type, 
    COUNT(*)::bigint
  FROM 
    sessions
  WHERE 
    sessions.session_type IS NOT NULL
  GROUP BY 
    sessions.session_type;
END;
$$ LANGUAGE plpgsql;

-- Create RPC function to get AI actions by status
CREATE OR REPLACE FUNCTION get_ai_actions_by_status()
RETURNS TABLE (status text, count bigint) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ai_actions.status, 
    COUNT(*)::bigint
  FROM 
    ai_actions
  GROUP BY 
    ai_actions.status;
END;
$$ LANGUAGE plpgsql;

-- Create RPC function to get AI actions by type
CREATE OR REPLACE FUNCTION get_ai_actions_by_type()
RETURNS TABLE (action_type text, count bigint) 
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ai_actions.action_type, 
    COUNT(*)::bigint
  FROM 
    ai_actions
  GROUP BY 
    ai_actions.action_type;
END;
$$ LANGUAGE plpgsql;