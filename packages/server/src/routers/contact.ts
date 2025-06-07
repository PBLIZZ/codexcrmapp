import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { supabaseAdmin as _supabaseAdmin } from '../supabaseAdmin';
import { router, protectedProcedure } from '../trpc';

const contactInputSchema = z.object({
  id: z.string().uuid().optional(),
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address').optional().nullable(),
  phone: z.string().optional().nullable(),
  phone_country_code: z.string().optional().nullable(), // New
  company_name: z.string().optional().nullable(),
  job_title: z.string().optional().nullable(),
  address_street: z.string().optional().nullable(), // New
  address_city: z.string().optional().nullable(), // New
  address_postal_code: z.string().optional().nullable(), // New
  address_country: z.string().optional().nullable(), // New
  website: z.string().url({ message: "Invalid URL" }).optional().nullable(), // New
  profile_image_url: z.string().optional().nullable(), // Reverted: No strict URL validation to support upload paths
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(), // New
  social_handles: z.array(z.string()).optional().nullable(), // New
  source: z.string().optional().nullable(),
  last_contacted_at: z.preprocess((arg) => {
    if (arg === '' || arg === null || arg === undefined) return null;
    if (typeof arg === 'string' || arg instanceof Date) {
      const date = new Date(arg);
      return isNaN(date.getTime()) ? null : date;
    }
    return null;
  }, z.date().optional().nullable()),
  enriched_data: z.any().optional().nullable(), // New
  enrichment_status: z.string().optional().nullable(), // New
});

// Defines tRPC procedures for contacts.
export const contactRouter = router({
  // ===== Protected Procedures (require authentication) =====

  // Protected procedure for listing authenticated user's contacts
  list: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        groupId: z.string().uuid().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      let query = ctx.supabaseUser.from('contacts');

      if (input.groupId) {
        query = query
          .select('*, group_members!inner(group_id)')
          .eq('group_members.group_id', input.groupId);
      } else {
        query = query.select('*, group_members!left(group_id)');
      }

      query = query.order('created_at', { ascending: false });

      if (input.search) {
        query = query.or(
          `full_name.ilike.%${input.search}%,email.ilike.%${input.search}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching contacts (RLS scope):', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch contacts',
        });
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
        .from('contacts')
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

  save: protectedProcedure
    .input(contactInputSchema) // Uses the schema defined above this router
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const contactId = input.id;
      const fieldsToSave = {
        full_name: input.full_name,
        email: input.email || null,
        phone: input.phone || null,
        phone_country_code: input.phone_country_code || null,
        company_name: input.company_name || null,
        job_title: input.job_title || null,
        address_street: input.address_street || null,
        address_city: input.address_city || null,
        address_postal_code: input.address_postal_code || null,
        address_country: input.address_country || null,
        website: input.website || null,
        profile_image_url: input.profile_image_url || null,
        notes: input.notes || null,
        tags: input.tags || null,
        social_handles: input.social_handles || null,
        source: input.source || null,
        last_contacted_at: input.last_contacted_at || null,
        enriched_data: input.enriched_data || null,
        enrichment_status: input.enrichment_status || null,
      };

      let dataObject: Record<string, unknown> | null = null;
      // Supabase errors have a 'code' property (string) among others
      let dbError: { message: string; code?: string; details?: string; hint?: string } | null = null;

      try {
        if (contactId) {
          // UPDATE LOGIC
          console.warn(`Attempting contact update for id: ${contactId}`, fieldsToSave);
          let attemptFields = { ...fieldsToSave };

          do {
            const updateOp = await ctx.supabaseUser
              .from('contacts')
              .update(attemptFields)
              .match({ id: contactId, user_id: ctx.user.id })
              .select()
              .single();
            dataObject = updateOp.data;
            dbError = updateOp.error;

            if (dbError) {
              const columnMatch = dbError.message.match(/Could not find the '(.+)' column/);
              if (columnMatch && Object.hasOwn(attemptFields, columnMatch[1] as keyof typeof attemptFields)) {
                console.warn(`${columnMatch[1]} column missing, retrying update without it`);
                delete (attemptFields as any)[columnMatch[1]];
                continue;
              }
            }
            break; 
          } while (dbError !== null);

        } else {
          // INSERT LOGIC
          const insertPayload = { ...fieldsToSave, user_id: ctx.user.id };
          console.warn('[DEBUG] Attempting contact insert:', insertPayload);
          
          const insertOp = await ctx.supabaseUser
            .from('contacts')
            .insert(insertPayload)
            .select('id, created_at, updated_at, user_id, email, full_name, profile_image_url') // Select minimal essential fields
            .single();

          dataObject = insertOp.data;
          dbError = insertOp.error;

          if (!dbError && !dataObject) {
            console.warn("Contact insert: Supabase insert succeeded but .select() returned no data (RLS visibility issue?). Constructing response from input.");
            // The insert was likely successful, but RLS prevents reading it back immediately.
            // We return the input data merged with user_id, but server-generated fields like 'id' and 'created_at' will be missing.
            // The client should be aware or refetch if these are critical immediately.
            dataObject = { ...insertPayload, id: undefined, created_at: undefined, updated_at: undefined }; 
          }
        }

        if (dbError) {
          console.error('Supabase save error:', JSON.stringify(dbError, null, 2), { input, contactId });
          if (dbError.code === '23505') { // PostgreSQL unique_violation
            throw new TRPCError({
              code: 'CONFLICT',
              message: `A contact with this email (${input.email}) already exists.`,
              cause: dbError,
            });
          }
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Database error: ${dbError.message}`,
            cause: dbError,
          });
        }

        if (!dataObject) {
          console.error('Supabase save returned no data and no explicit error after processing.', { input, contactId });
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to save contact: No data returned from database operation.',
          });
        }
        
        console.warn('Contact save successful:', dataObject);
        return dataObject;

      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Unhandled error in contact save procedure:', error, { input, contactId });
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred while saving the contact.',
          cause: error instanceof Error ? error : undefined,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ contactId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const { error } = await ctx.supabaseUser
        .from('contacts')
        .delete()
        .match({ id: input.contactId, user_id: ctx.user.id });

      if (error) {
        console.error('Error deleting contact:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete contact',
          cause: error,
        });
      }
      return { success: true, contactId: input.contactId };
    }),
});
