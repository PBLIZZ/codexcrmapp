import { getSupabaseClient, safeDbOperation, isDbError, handleDbResult } from '../utils/db-helpers';
import type { Database } from '../database.types';

type Contact = Database['public']['Tables']['contacts']['Row'];
type ContactInsert = Database['public']['Tables']['contacts']['Insert'];
type ContactUpdate = Database['public']['Tables']['contacts']['Update'];

type ContactProfile = Database['public']['Tables']['contact_profiles']['Row'];
type ContactProfileInsert = Database['public']['Tables']['contact_profiles']['Insert'];
type ContactProfileUpdate = Database['public']['Tables']['contact_profiles']['Update'];

type ContactWithProfile = Contact & {
  profile?: ContactProfile | null;
};

/**
 * Repository for contact-related database operations
 */
export const ContactsRepository = {
  /**
   * Get all contacts for the current user
   * @returns Array of contacts
   */
  async getAllContacts(): Promise<Contact[]> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }, 'getAllContacts');
    
    return handleDbResult(result);
  },

  /**
   * Get a contact by ID
   * @param id Contact ID
   * @returns Contact or null if not found
   */
  async getContactById(id: string): Promise<Contact | null> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('contacts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }
      return data;
    }, 'getContactById');
    
    return handleDbResult(result);
  },

  /**
   * Get a contact with its profile
   * @param id Contact ID
   * @returns Contact with profile or null if not found
   */
  async getContactWithProfile(id: string): Promise<ContactWithProfile | null> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('contacts')
        .select(`
          *,
          profile:contact_profiles(*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data as ContactWithProfile;
    }, 'getContactWithProfile');
    
    return handleDbResult(result);
  },

  /**
   * Create a new contact
   * @param contact Contact data
   * @returns Created contact
   */
  async createContact(contact: ContactInsert): Promise<Contact> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('contacts')
        .insert(contact)
        .select()
        .single();

      if (error) throw error;
      return data;
    }, 'createContact');
    
    return handleDbResult(result);
  },

  /**
   * Create a contact with profile
   * @param contact Contact data
   * @param profile Profile data
   * @returns Created contact with profile
   */
  async createContactWithProfile(
    contact: ContactInsert,
    profile: Omit<ContactProfileInsert, 'contact_id' | 'user_id'>
  ): Promise<ContactWithProfile> {
    const supabase = getSupabaseClient();

    const result = await safeDbOperation(async () => {
      // Start a transaction
      const { data: contactData, error: contactError } = await supabase
        .from('contacts')
        .insert(contact)
        .select()
        .single();

      if (contactError) throw contactError;

      // Create profile with the new contact ID
      const profileInsert: ContactProfileInsert = {
        ...profile,
        contact_id: contactData.id,
        user_id: contactData.user_id,
      };

      const { data: profileData, error: profileError } = await supabase
        .from('contact_profiles')
        .insert(profileInsert)
        .select()
        .single();

      if (profileError) throw profileError;

      return {
        ...contactData,
        profile: profileData,
      };
    }, 'createContactWithProfile');
    
    return handleDbResult(result);
  },

  /**
   * Update a contact
   * @param id Contact ID
   * @param updates Contact updates
   * @returns Updated contact
   */
  async updateContact(id: string, updates: ContactUpdate): Promise<Contact> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }, 'updateContact');
    
    return handleDbResult(result);
  },

  /**
   * Delete a contact
   * @param id Contact ID
   * @returns Success status
   */
  async deleteContact(id: string): Promise<boolean> {
    const result = await safeDbOperation(async () => {
      const { error } = await getSupabaseClient()
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    }, 'deleteContact');
    
    return handleDbResult(result);
  },

  /**
   * Search contacts by name or email
   * @param query Search query
   * @returns Array of matching contacts
   */
  async searchContacts(query: string): Promise<Contact[]> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('contacts')
        .select('*')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
        .order('full_name', { ascending: true });

      if (error) throw error;
      return data || [];
    }, 'searchContacts');
    
    return handleDbResult(result);
  },

  /**
   * Get contacts with wellness goals
   * @returns Array of contacts with wellness goals
   */
  async getContactsWithWellnessGoals(): Promise<Contact[]> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('contacts')
        .select('*')
        .not('wellness_goals', 'is', null)
        .order('last_assessment_date', { ascending: false });

      if (error) throw error;
      return data || [];
    }, 'getContactsWithWellnessGoals');
    
    return handleDbResult(result);
  },

  /**
   * Get contacts by wellness journey stage
   * @param stage Wellness journey stage
   * @returns Array of contacts in the specified stage
   */
  async getContactsByJourneyStage(stage: string): Promise<Contact[]> {
    const result = await safeDbOperation(async () => {
      const { data, error } = await getSupabaseClient()
        .from('contacts')
        .select('*')
        .eq('wellness_journey_stage', stage)
        .order('full_name', { ascending: true });

      if (error) throw error;
      return data || [];
    }, 'getContactsByJourneyStage');
    
    return handleDbResult(result);
  }
};