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
export declare const AiActionsRepository: {
    /**
     * Get all AI actions for the current user
     * @returns Array of AI actions
     */
    getAllAiActions(): Promise<AiAction[]>;
    /**
     * Get an AI action by ID
     * @param id AI action ID
     * @returns AI action or null if not found
     */
    getAiActionById(id: string): Promise<AiAction | null>;
    /**
     * Get an AI action with contact and session details
     * @param id AI action ID
     * @returns AI action with details or null if not found
     */
    getAiActionWithDetails(id: string): Promise<AiActionWithDetails | null>;
    /**
     * Create a new AI action
     * @param aiAction AI action data
     * @returns Created AI action
     */
    createAiAction(aiAction: AiActionInsert): Promise<AiAction>;
    /**
     * Update an AI action
     * @param id AI action ID
     * @param updates AI action updates
     * @returns Updated AI action
     */
    updateAiAction(id: string, updates: AiActionUpdate): Promise<AiAction>;
    /**
     * Delete an AI action
     * @param id AI action ID
     * @returns Success status
     */
    deleteAiAction(id: string): Promise<boolean>;
    /**
     * Get AI actions for a specific contact
     * @param contactId Contact ID
     * @returns Array of AI actions
     */
    getAiActionsByContact(contactId: string): Promise<AiAction[]>;
    /**
     * Get AI actions for a specific session
     * @param sessionId Session ID
     * @returns Array of AI actions
     */
    getAiActionsBySession(sessionId: string): Promise<AiAction[]>;
    /**
     * Get AI actions by status
     * @param status Status of the AI action
     * @returns Array of AI actions with the specified status
     */
    getAiActionsByStatus(status: string): Promise<AiAction[]>;
    /**
     * Get AI actions by type
     * @param actionType Type of AI action
     * @returns Array of AI actions of the specified type
     */
    getAiActionsByType(actionType: string): Promise<AiAction[]>;
    /**
     * Update AI action status
     * @param id AI action ID
     * @param status New status
     * @param feedback Optional feedback
     * @returns Updated AI action
     */
    updateAiActionStatus(id: string, status: string, feedback?: string): Promise<AiAction>;
    /**
     * Mark AI action as implemented
     * @param id AI action ID
     * @param feedback Optional feedback
     * @returns Updated AI action
     */
    markAiActionImplemented(id: string, feedback?: string): Promise<AiAction>;
};
export {};
