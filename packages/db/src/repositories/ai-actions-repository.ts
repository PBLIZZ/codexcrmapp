import { getSupabaseClient, safeDbOperation, handleDbResult } from '../utils/db-helpers';
import type { Database } from '../database.types';

type AiAction = Database['public']['Tables']['ai_actions']['Row'];
type AiActionInsert = Database['public']['Tables']['ai_actions']['Insert'];
type AiActionUpdate = Database['public']['Tables']['ai_actions']['Update'];

type Contact = Database['public']['Tables']['contacts']['Row'];
type Session = Database['public']['Tables']['sessions']['Row'];

type AiActionWithDetails = AiAction & {
  contact?: Contact;
  session?: Session;
};

/**
 * Repository for AI action-related database operations
 */
export const AiActionsRepository = {
  /**
   * Get all AI actions for the current user
   * @returns Array of AI actions
   */
  async getAllAiActions(): Promise<AiAction[]> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('ai_actions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }, 'getAllAiActions');
    
    return handleDbResult(result);
  },

  /**
   * Get an AI action by ID
   * @param id AI action ID
   * @returns AI action or null if not found
   */
  async getAiActionById(id: string): Promise<AiAction | null> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('ai_actions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }
      return data;
    }, 'getAiActionById');
    
    return handleDbResult(result);
  },

  /**
   * Get an AI action with contact and session details
   * @param id AI action ID
   * @returns AI action with details or null if not found
   */
  async getAiActionWithDetails(id: string): Promise<AiActionWithDetails | null> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('ai_actions')
        .select(`
          *,
          contact:contacts(*),
          session:sessions(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data as AiActionWithDetails;
    }, 'getAiActionWithDetails');
    
    return handleDbResult(result);
  },

  /**
   * Create a new AI action
   * @param aiAction AI action data
   * @returns Created AI action
   */
  async createAiAction(aiAction: AiActionInsert): Promise<AiAction> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('ai_actions')
        .insert(aiAction)
        .select()
        .single();

      if (error) throw error;
      return data;
    }, 'createAiAction');
    
    return handleDbResult(result);
  },

  /**
   * Update an AI action
   * @param id AI action ID
   * @param updates AI action updates
   * @returns Updated AI action
   */
  async updateAiAction(id: string, updates: AiActionUpdate): Promise<AiAction> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('ai_actions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }, 'updateAiAction');
    
    return handleDbResult(result);
  },

  /**
   * Delete an AI action
   * @param id AI action ID
   * @returns Success status
   */
  async deleteAiAction(id: string): Promise<boolean> {
    const result = await safeDbOperation(async () => {
      const { error } = await getSupabaseClient()
        .from('ai_actions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    }, 'deleteAiAction');
    
    return handleDbResult(result);
  },

  /**
   * Get AI actions for a specific contact
   * @param contactId Contact ID
   * @returns Array of AI actions
   */
  async getAiActionsByContact(contactId: string): Promise<AiAction[]> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('ai_actions')
        .select('*')
        .eq('contact_id', contactId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }, 'getAiActionsByContact');
    
    return handleDbResult(result);
  },

  /**
   * Get AI actions for a specific session
   * @param sessionId Session ID
   * @returns Array of AI actions
   */
  async getAiActionsBySession(sessionId: string): Promise<AiAction[]> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('ai_actions')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }, 'getAiActionsBySession');
    
    return handleDbResult(result);
  },

  /**
   * Get AI actions by status
   * @param status Status of the AI action
   * @returns Array of AI actions with the specified status
   */
  async getAiActionsByStatus(status: string): Promise<AiAction[]> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('ai_actions')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }, 'getAiActionsByStatus');
    
    return handleDbResult(result);
  },

  /**
   * Get AI actions by type
   * @param actionType Type of AI action
   * @returns Array of AI actions of the specified type
   */
  async getAiActionsByType(actionType: string): Promise<AiAction[]> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('ai_actions')
        .select('*')
        .eq('action_type', actionType)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }, 'getAiActionsByType');
    
    return handleDbResult(result);
  },

  /**
   * Update AI action status
   * @param id AI action ID
   * @param status New status
   * @param feedback Optional feedback
   * @returns Updated AI action
   */
  async updateAiActionStatus(
    id: string, 
    status: string, 
    feedback?: string
  ): Promise<AiAction> {
    const result = await safeDbOperation(async () => {
      const updates: AiActionUpdate = { status };
      if (feedback) updates.feedback = feedback;
      
      const { data, error } = await getSupabaseClient()
        .from('ai_actions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }, 'updateAiActionStatus');
    
    return handleDbResult(result);
  },

  /**
   * Mark AI action as implemented
   * @param id AI action ID
   * @param feedback Optional feedback
   * @returns Updated AI action
   */
  async markAiActionImplemented(id: string, feedback?: string): Promise<AiAction> {
    const result = await safeDbOperation(async () => {
      const updates: AiActionUpdate = { 
        implemented: true,
        implementation_date: new Date().toISOString(),
        status: 'implemented'
      };
      
      if (feedback) updates.feedback = feedback;
      
      const { data, error } = await getSupabaseClient()
        .from('ai_actions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }, 'markAiActionImplemented');
    
    return handleDbResult(result);
  }
};