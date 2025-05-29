import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { supabaseAdmin as _supabaseAdmin } from '../supabaseAdmin';
import { router, protectedProcedure } from '../trpc';


const contactInputSchema = z.object({
  id: z.string().uuid().optional(), // ID is UUID string, optional for creation
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').optional().nullable(),
  phone: z.string().optional().nullable(),
  company_name: z.string().optional().nullable(),
  job_title: z.string().optional().nullable(),
  profile_image_url: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  source: z.string().optional().nullable(), // Added source
  last_contacted_at: z.preprocess((arg) => { // Added last_contacted_at
    // Empty string or null/undefined should become null
    if (arg === '' || arg === null || arg === undefined) {
      return null;
    }
    // Try to parse as date if it's a string or Date
    if (typeof arg === 'string' || arg instanceof Date) {
      const date = new Date(arg);
      // Check if date is valid
      return isNaN(date.getTime()) ? null : date;
    }
    return null; // Default to null for any other case
  }, z.date().optional().nullable()),
});

export const contactRouter = router({

  // ===== Protected Procedures (require authentication) =====

  // Protected procedure for listing authenticated user's contacts with filtering options
  list: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        groupId: z.string().uuid().optional(),
      }).optional()
    )
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      
      // Use the USER-SCOPED client from context for reads to respect RLS
      let query = ctx.supabaseUser
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      // If groupId is provided, filter contacts by group membership
      if (input?.groupId) {
        // Get contact IDs in the specified group
        const { data: groupMembers, error: groupMembersError } = await ctx.supabaseUser
          .from('group_members')
          .select('client_id')
          .eq('group_id', input.groupId);
        
        if (groupMembersError) {
          console.error("Error fetching group members:", groupMembersError);
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch group members' });
        }
        
        // If there are contacts in the group, filter by their IDs
        if (groupMembers && groupMembers.length > 0) {
          const contactIds = groupMembers.map((member: { client_id: string }) => member.client_id);
          query = query.in('id', contactIds);
        } else {
          // No contacts in this group, return empty array
          return [];
        }
      }
      
      // If search query is provided, filter contacts by name, email, or company
      if (input?.search) {
        const searchTerms = input.search.toLowerCase().trim().split(/\s+/);
        
        // For each search term, create a filter condition
        searchTerms.forEach(term => {
          const searchPattern = `%${term}%`;
          query = query.or(
            `first_name.ilike.${searchPattern},` +
            `last_name.ilike.${searchPattern},` +
            `email.ilike.${searchPattern},` +
            `company_name.ilike.${searchPattern}`
          );
        });
      }
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching contacts (RLS scope):", error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch contacts' });
      }
      
      return data || [];
    }),
  // Fetch a single contact by ID
  getById: protectedProcedure
    .input(z.object({ contactId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      const { data, error } = await ctx.supabaseUser
        .from('clients')
        .select('*')
        .eq('id', input.contactId)
        .single();
      if (error) {
        console.error('Error fetching contact by id:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch contact',
          cause: error,
        });
      }
      return data;
    }),

  // Protected procedure for creating/updating contacts
  save: protectedProcedure
    .input(contactInputSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      
      const contactId = input.id;
      // Prepare fields to update/insert, mapping contact field names to DB columns
      const fields = {
        first_name: input.first_name,
        last_name: input.last_name,
        email: input.email || null,
        phone: input.phone || null,
        company_name: input.company_name || null,
        job_title: input.job_title || null,
        profile_image_url: input.profile_image_url || null,
        notes: input.notes || null,
        source: input.source || null, // Added source
        last_contacted_at: input.last_contacted_at || null, // Added last_contacted_at
      };

      try {
        // Iterative fallback for missing columns during update/insert
        const attemptFields: Record<string, unknown> = { ...fields };
        let data: Record<string, unknown> | null = null;
        let dbError: { message: string } | null = null;
        if (contactId) {
          console.warn(`Attempting contact update for id: ${contactId}`, attemptFields);
          do {
            ({ data, error: dbError } = await ctx.supabaseUser
              .from('clients')
              .update(attemptFields)
              .match({ id: contactId, user_id: ctx.user.id })
              .select()
              .single());
            if (dbError) {
              const m = dbError.message.match(/Could not find the '(.+)' column/);
              if (m && Object.hasOwn(attemptFields, m[1])) {
                console.warn(`${m[1]} column missing, retrying without it`);
                delete attemptFields[m[1]];
                continue;
              }
            }
            break;
          } while (dbError !== null);
        } else {
          console.warn('Attempting contact insert with user context', { ...attemptFields, user_id: ctx.user.id });
          do {
            ({ data, error: dbError } = await ctx.supabaseUser
              .from('clients')
              .insert({ ...attemptFields, user_id: ctx.user.id })
              .select()
              .single());
            if (dbError) {
              const m = dbError.message.match(/Could not find the '(.+)' column/);
              if (m && Object.hasOwn(attemptFields, m[1])) {
                console.warn(`${m[1]} column missing, retrying insert without it`);
                delete attemptFields[m[1]];
                continue;
              }
            }
            break;
          } while (dbError !== null);
        }
        if (dbError) {
          console.error('Supabase save error:', dbError, { input, userId: ctx.user.id });
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: `Failed to save contact: ${dbError.message}`, cause: dbError });
        }
        if (!data) {
          console.error('Supabase save returned no data and no error.');
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to save contact due to unexpected issue.' });
        }
        console.warn('Contact save successful:', data);
        return data;
      } catch (err) {
        console.error('Unexpected error in save procedure:', err);
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err instanceof Error ? err.message : 'An unknown error occurred while saving the contact.',
        });
      }
    }),

  // Procedure to delete a contact
  delete: protectedProcedure
    .input(z.object({
      contactId: z.string().uuid(), // Expect UUID string ID
    }))
    .mutation(async ({ input, ctx }) => {
      console.warn(`Attempting to delete contact ID: ${input.contactId} by user ${ctx.user.id}`);
      const { error } = await ctx.supabaseUser
        .from('clients')
        .delete()
        .match({ id: input.contactId, user_id: ctx.user.id }); // Match on UUID string ID and user_id

      if (error) {
        console.error('Error deleting contact:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete contact' });
      }

      console.warn(`Contact ${input.contactId} deleted successfully by user ${ctx.user.id}`);
      return { success: true, deletedContactId: input.contactId };
    }),
});