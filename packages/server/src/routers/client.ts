import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure, publicProcedure } from '../trpc';
import { supabaseAdmin } from '../supabaseAdmin';
import { Database } from '@codexcrm/db';

const clientInputSchema = z.object({
  id: z.number().int().positive().optional(), // ID is numeric, optional for creation
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').optional().nullable(),
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

  // Protected procedure for creating/updating clients
  save: protectedProcedure
    .input(
      clientInputSchema
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
      
      const { id: clientId, ...clientData } = input;

      const dataToSave = {
        ...clientData,
        email: clientData.email === '' ? null : clientData.email,
      };

      try {
        let savedClient: Database['public']['Tables']['clients']['Row'] | null = null;
        let error: any = null;

        if (clientId) {
          console.log(`Attempting client update for id: ${clientId}`, dataToSave);
          const { data: updateData, error: updateError } = await ctx.supabaseUser
            .from('clients')
            .update({
              first_name: input.first_name,
              last_name: input.last_name,
              email: input.email,
            })
            .match({ id: clientId, user_id: ctx.user.id }) // Match on numeric ID and user_id
            .select()
            .single();

          savedClient = updateData;
          error = updateError;
          if (!error && !savedClient) {
            console.warn(`Client update for id ${clientId} executed but returned no data. Check RLS SELECT policy or if record exists/is owned.`);
            throw new TRPCError({ code: 'NOT_FOUND', message: `Client with ID ${clientId} not found or you don't have permission to edit it.` });
          }
        } else {
          console.log('Attempting client insert with user context', { ...dataToSave, user_id: ctx.user.id });
          // Use user-scoped client for insert to ensure consistency with RLS
          const { data: insertData, error: insertError } = await ctx.supabaseUser 
            .from('clients')
            .insert({ 
              first_name: input.first_name,
              last_name: input.last_name,
              email: input.email,
              user_id: ctx.user.id, // Explicitly set user_id for insert
            }) 
            .select()
            .single();

          savedClient = insertData;
          error = insertError;
        }

        if (error) {
          console.error('Supabase save error:', error, { input, userId: ctx.user.id });
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to save client: ${error.message}`,
            cause: error,
          });
        }

        if (!savedClient) {
          console.error('Supabase save operation returned no data and no error.');
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to save client due to an unexpected issue.' });
        }

        console.log('Client save successful:', savedClient);
        return savedClient;
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
      clientId: z.number().int().positive(), // Expect number ID
    }))
    .mutation(async ({ input, ctx }) => {
      console.log(`Attempting to delete client ID: ${input.clientId} by user ${ctx.user.id}`);
      const { error } = await ctx.supabaseUser
        .from('clients')
        .delete()
        .match({ id: input.clientId, user_id: ctx.user.id }); // Match on numeric ID and user_id

      if (error) {
        console.error('Error deleting client:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to delete client' });
      }

      console.log(`Client ${input.clientId} deleted successfully by user ${ctx.user.id}`);
      return { success: true, deletedClientId: input.clientId };
    }),
});