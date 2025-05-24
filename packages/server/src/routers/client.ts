import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure, publicProcedure } from '../trpc';
import { supabaseAdmin } from '../supabaseAdmin';
import { Database } from '@codexcrm/db';

const clientInputSchema = z.object({
  id: z.string().uuid().optional(), // ID is UUID string, optional for creation
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').optional().nullable(),
  phone: z.string().optional().nullable(),
  company_name: z.string().optional().nullable(),
  job_title: z.string().optional().nullable(),
  profile_image_url: z.string().refine(
    (val) => {
      // Accept empty string, null, undefined, or valid URL
      return !val || val === "" || /^https?:\/\/[^\s]+$/.test(val);
    },
    {
      message: "Invalid URL for profile image. Must start with http:// or https://",
    }
  ).optional().nullable(),
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

export const clientRouter = router({

  // ===== Protected Procedures (require authentication) =====

  // Protected procedure for listing authenticated user's clients
  // Now uses supabaseUser to properly enforce RLS
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    
    // Use the USER-SCOPED client from context for reads to respect RLS!
    const { data, error } = await ctx.supabaseUser
      .from('clients')
      .select('*')
      // .eq('user_id', ctx.user.id) // Not needed with proper RLS, but can keep for defense-in-depth
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching clients (RLS scope):", error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch clients' });
    }
    return data || [];
  }),
  // Fetch a single client by ID
  getById: protectedProcedure
    .input(z.object({ clientId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      const { data, error } = await ctx.supabaseUser
        .from('clients')
        .select('*')
        .eq('id', input.clientId)
        .single();
      if (error) {
        console.error('Error fetching client by id:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch client',
          cause: error,
        });
      }
      return data;
    }),

  // Protected procedure for creating/updating clients
  save: protectedProcedure
    .input(clientInputSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      
      const clientId = input.id;
      // Prepare fields to update/insert, mapping client field names to DB columns
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
        let attemptFields: any = { ...fields };
        let data: any = null;
        let dbError: any = null;
        if (clientId) {
          console.log(`Attempting client update for id: ${clientId}`, attemptFields);
          do {
            ({ data, error: dbError } = await ctx.supabaseUser
              .from('clients')
              .update(attemptFields)
              .match({ id: clientId, user_id: ctx.user.id })
              .select()
              .single());
            if (dbError) {
              const m = dbError.message.match(/Could not find the '(.+)' column/);
              if (m && attemptFields.hasOwnProperty(m[1])) {
                console.warn(`${m[1]} column missing, retrying without it`);
                delete attemptFields[m[1]];
                continue;
              }
            }
            break;
          } while (true);
        } else {
          console.log('Attempting client insert with user context', { ...attemptFields, user_id: ctx.user.id });
          do {
            ({ data, error: dbError } = await ctx.supabaseUser
              .from('clients')
              .insert({ ...attemptFields, user_id: ctx.user.id })
              .select()
              .single());
            if (dbError) {
              const m = dbError.message.match(/Could not find the '(.+)' column/);
              if (m && attemptFields.hasOwnProperty(m[1])) {
                console.warn(`${m[1]} column missing, retrying insert without it`);
                delete attemptFields[m[1]];
                continue;
              }
            }
            break;
          } while (true);
        }
        if (dbError) {
          console.error('Supabase save error:', dbError, { input, userId: ctx.user.id });
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: `Failed to save client: ${dbError.message}`, cause: dbError });
        }
        if (!data) {
          console.error('Supabase save returned no data and no error.');
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to save client due to unexpected issue.' });
        }
        console.log('Client save successful:', data);
        return data;
      } catch (err) {
        console.error('Unexpected error in save procedure:', err);
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err instanceof Error ? err.message : 'An unknown error occurred while saving the client.',
        });
      }
    }),

  // Procedure to delete a client
  delete: protectedProcedure
    .input(z.object({
      clientId: z.string().uuid(), // Expect UUID string ID
    }))
    .mutation(async ({ input, ctx }) => {
      console.log(`Attempting to delete client ID: ${input.clientId} by user ${ctx.user.id}`);
      const { error } = await ctx.supabaseUser
        .from('clients')
        .delete()
        .match({ id: input.clientId, user_id: ctx.user.id }); // Match on UUID string ID and user_id

      if (error) {
        console.error('Error deleting client:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete client' });
      }

      console.log(`Client ${input.clientId} deleted successfully by user ${ctx.user.id}`);
      return { success: true, deletedClientId: input.clientId };
    }),
});