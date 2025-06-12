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
export declare const SessionsRepository: {
    /**
     * Get all sessions for the current user
     * @returns Array of sessions
     */
    getAllSessions(): Promise<Session[]>;
    /**
     * Get a session by ID
     * @param id Session ID
     * @returns Session or null if not found
     */
    getSessionById(id: string): Promise<Session | null>;
    /**
     * Get a session with contact and notes
     * @param id Session ID
     * @returns Session with details or null if not found
     */
    getSessionWithDetails(id: string): Promise<SessionWithDetails | null>;
    /**
     * Create a new session
     * @param session Session data
     * @returns Created session
     */
    createSession(session: SessionInsert): Promise<Session>;
    /**
     * Update a session
     * @param id Session ID
     * @param updates Session updates
     * @returns Updated session
     */
    updateSession(id: string, updates: SessionUpdate): Promise<Session>;
    /**
     * Delete a session
     * @param id Session ID
     * @returns Success status
     */
    deleteSession(id: string): Promise<boolean>;
    /**
     * Get sessions for a specific contact
     * @param contactId Contact ID
     * @returns Array of sessions
     */
    getSessionsByContact(contactId: string): Promise<Session[]>;
    /**
     * Get upcoming sessions
     * @param limit Number of sessions to return
     * @returns Array of upcoming sessions
     */
    getUpcomingSessions(limit?: number): Promise<Session[]>;
    /**
     * Get sessions by type
     * @param sessionType Type of session
     * @returns Array of sessions of the specified type
     */
    getSessionsByType(sessionType: string): Promise<Session[]>;
    /**
     * Get sessions that need follow-up
     * @returns Array of sessions that need follow-up
     */
    getSessionsNeedingFollowUp(): Promise<Session[]>;
    /**
     * Update session AI insights
     * @param id Session ID
     * @param aiInsights AI-generated insights
     * @returns Updated session
     */
    updateSessionAiInsights(id: string, aiInsights: any): Promise<Session>;
};
export {};
