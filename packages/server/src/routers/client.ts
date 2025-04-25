import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure, publicProcedure } from '../trpc';
import { supabaseAdmin } from '../supabaseAdmin';
    
export const clientRouter = router({

  // ===== Test Procedures (for development only) =====
  // These allow testing the client functionality without authentication
  // They should be removed or secured in production

  testList: publicProcedure.query(async () => {
    console.log('Using test list procedure');
    const { data, error } = await supabaseAdmin
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching test clients:", error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch test clients' });
    }
    return data || [];
  }),

  testUpsert: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        first_name: z.string(),
        last_name: z.string(),
        email: z.string().email().optional().nullable(),
      })
    )
    .mutation(async ({ input }) => {
      console.log('Using test upsert procedure');
      
      try {
        // Generate a valid UUID instead of using "mock-user-id"
        const mockUserId = '00000000-0000-4000-a000-000000000000'; // Valid UUID format for testing
        
        const { data, error } = await supabaseAdmin
          .from('clients')
          .upsert({ ...input, user_id: mockUserId })
          .select()
          .single();

        if (error) {
          console.error('Supabase test upsert error:', error);
          throw new TRPCError({ 
            code: 'INTERNAL_SERVER_ERROR', 
            message: `Failed to save test client: ${error.message}` 
          });
        }

        console.log('Test client upsert successful:', data);
        return data;
      } catch (err) {
        console.error('Unexpected error in test upsert procedure:', err);
        throw new TRPCError({ 
          code: 'INTERNAL_SERVER_ERROR', 
          message: err instanceof Error ? err.message : 'An unknown error occurred' 
        });
      }
    }),

  // ===== Protected Procedures (require authentication) =====

  // Protected procedure for listing authenticated user's clients
  // Now uses supabaseUser to properly enforce RLS
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new Error('Unauthorized: User not authenticated');
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
  upsert: protectedProcedure
    .input(
      z.object({
        id: z.number().optional(),
        first_name: z.string(),
        last_name: z.string(),
        email: z.string().email().optional().nullable(), // Accept null values for empty emails
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ 
          code: 'UNAUTHORIZED', 
          message: 'User not authenticated' 
        });
      }
      
      try {
        console.log('Attempting client upsert:', { 
          ...input, 
          user_id: ctx.user.id,
          email_type: input.email === null ? 'null' : typeof input.email  
        });

        // After null check, TypeScript knows ctx.user is not null
        const { data, error } = await supabaseAdmin
          .from('clients')
          .upsert({ ...input, user_id: ctx.user.id })
          .select()
          .single();

        if (error) {
          console.error('Supabase upsert error:', error, { input, userId: ctx.user.id });
          throw new TRPCError({ 
            code: 'INTERNAL_SERVER_ERROR', 
            message: `Failed to save client: ${error.message}` 
          });
        }

        console.log('Client upsert successful:', data);
        return data;
      } catch (err) {
        console.error('Unexpected error in upsert procedure:', err);
        if (err instanceof TRPCError) throw err;
        
        throw new TRPCError({ 
          code: 'INTERNAL_SERVER_ERROR', 
          message: err instanceof Error ? err.message : 'An unknown error occurred' 
        });
      }
    }),
    

});