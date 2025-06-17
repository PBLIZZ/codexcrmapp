import type { Database } from '../database.types';

type Contact = Database['public']['Tables']['contacts']['Row'];
type ContactInsert = Database['public']['Tables']['contacts']['Insert'];
type ContactUpdate = Database['public']['Tables']['contacts']['Update'];

/**
 * Repository for contact-related database operations
 */
export declare const ContactsRepository: {
    /**
     * Get all contacts for the current user
     * @returns Array of contacts
     */
    getAllContacts(): Promise<Contact[]>;
    /**
     * Get a contact by ID
     * @param id Contact ID
     * @returns Contact or null if not found
     */
    getContactById(id: string): Promise<Contact | null>;
    /**
     * Create a new contact
     * @param contact Contact data
     * @returns Created contact
     */
    createContact(contact: ContactInsert): Promise<Contact>;
    /**
     * Update a contact
     * @param id Contact ID
     * @param updates Contact updates
     * @returns Updated contact
     */
    updateContact(id: string, updates: ContactUpdate): Promise<Contact>;
    /**
     * Delete a contact
     * @param id Contact ID
     * @returns Success status
     */
    deleteContact(id: string): Promise<boolean>;
    /**
     * Search contacts by name or email
     * @param query Search query
     * @returns Array of matching contacts
     */
    searchContacts(query: string): Promise<Contact[]>;
    /**
     * Get contacts with wellness goals
     * @returns Array of contacts with wellness goals
     */
    getContactsWithWellnessGoals(): Promise<Contact[]>;
    /**
     * Get contacts by wellness journey stage
     * @param stage Wellness journey stage
     * @returns Array of contacts in the specified stage
     */
    getContactsByJourneyStage(stage: string): Promise<Contact[]>;
};

export {};
