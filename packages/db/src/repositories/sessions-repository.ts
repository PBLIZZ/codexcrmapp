import { getSupabaseClient, safeDbOperation, handleDbResult } from '../utils/db-helpers';
import type { Database } from '../database.types';

type Session = Database['public']['Tables']['sessions']['Row'];
type SessionInsert = Database['public']['Tables']['sessions']['Insert'];
type SessionUpdate = Database['public']['Tables']['sessions']['Update'];

type Contact = Database['public']['Tables']['contacts']['Row'];
type Note = Database['public']['Tables']['notes']['Row'];

type SessionWithDetails = Session & {
  contact?: Contact;
  notes?: Note[];
};

/**
 * Repository for session-related database operations
 */
export const SessionsRepository = {
  /**
   * Get all sessions for the current user
   * @returns Array of sessions
   */
  async getAllSessions(): Promise<Session[]> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('sessions')
        .select('*')
        .order('session_time', { ascending: false });

      if (error) throw error;
      return data || [];
    }, 'getAllSessions');
    
    return handleDbResult(result);
  },

  /**
   * Get a session by ID
   * @param id Session ID
   * @returns Session or null if not found
   */
  async getSessionById(id: string): Promise<Session | null> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('sessions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }
      return data;
    }, 'getSessionById');
    
    return handleDbResult(result);
  },

  /**
   * Get a session with contact and notes
   * @param id Session ID
   * @returns Session with details or null if not found
   */
  async getSessionWithDetails(id: string): Promise<SessionWithDetails | null> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('sessions')
        .select(`
          *,
          contact:contacts(*),
          notes:notes(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data as SessionWithDetails;
    }, 'getSessionWithDetails');
    
    return handleDbResult(result);
  },

  /**
   * Create a new session
   * @param session Session data
   * @returns Created session
   */
  async createSession(session: SessionInsert): Promise<Session> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('sessions')
        .insert(session)
        .select()
        .single();

      if (error) throw error;
      return data;
    }, 'createSession');
    
    return handleDbResult(result);
  },

  /**
   * Update a session
   * @param id Session ID
   * @param updates Session updates
   * @returns Updated session
   */
  async updateSession(id: string, updates: SessionUpdate): Promise<Session> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }, 'updateSession');
    
    return handleDbResult(result);
  },

  /**
   * Delete a session
   * @param id Session ID
   * @returns Success status
   */
  async deleteSession(id: string): Promise<boolean> {
    const result = await safeDbOperation(async () => {
      const { error } = await getSupabaseClient()
        .from('sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    }, 'deleteSession');
    
    return handleDbResult(result);
  },

  /**
   * Get sessions for a specific contact
   * @param contactId Contact ID
   * @returns Array of sessions
   */
  async getSessionsByContact(contactId: string): Promise<Session[]> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('sessions')
        .select('*')
        .eq('contact_id', contactId)
        .order('session_time', { ascending: false });

      if (error) throw error;
      return data || [];
    }, 'getSessionsByContact');
    
    return handleDbResult(result);
  },

  /**
   * Get upcoming sessions
   * @param limit Number of sessions to return
   * @returns Array of upcoming sessions
   */
  async getUpcomingSessions(limit: number = 10): Promise<Session[]> {
    const result = await safeDbOperation(async () => {
      const now = new Date().toISOString();
      
      const { data, error } = await getSupabaseClient()
        .from('sessions')
        .select('*')
        .gte('session_time', now)
        .order('session_time', { ascending: true })
        .limit(limit);

      if (error) throw error;
      return data || [];
    }, 'getUpcomingSessions');
    
    return handleDbResult(result);
  },

  /**
   * Get sessions by type
   * @param sessionType Type of session
   * @returns Array of sessions of the specified type
   */
  async getSessionsByType(sessionType: string): Promise<Session[]> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('sessions')
        .select('*')
        .eq('session_type', sessionType)
        .order('session_time', { ascending: false });

      if (error) throw error;
      return data || [];
    }, 'getSessionsByType');
    
    return handleDbResult(result);
  },

  /**
   * Get sessions that need follow-up
   * @returns Array of sessions that need follow-up
   */
  async getSessionsNeedingFollowUp(): Promise<Session[]> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('sessions')
        .select('*')
        .eq('follow_up_needed', true)
        .order('session_time', { ascending: false });

      if (error) throw error;
      return data || [];
    }, 'getSessionsNeedingFollowUp');
    
    return handleDbResult(result);
  },

  /**
   * Update session AI insights
   * @param id Session ID
   * @param aiInsights AI-generated insights
   * @returns Updated session
   */
  async updateSessionAiInsights(id: string, aiInsights: any): Promise<Session> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('sessions')
        .update({ ai_insights: aiInsights })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }, 'updateSessionAiInsights');
    
    return handleDbResult(result);
  }
};