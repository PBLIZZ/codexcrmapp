import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../trpc';
import { supabaseAdmin } from '../supabaseAdmin';
    
export const clientRouter = router({
  // Public procedure for testing - will be removed in production
  testList: publicProcedure.query(async ({ ctx }) => {
    // Try to fetch from Supabase first
    const { data, error } = await supabaseAdmin
      .from('clients')
      .select('*')
      .limit(10);
    
    // If there's an error or no data, return mock data
    if (error || !data || data.length === 0) {
      console.log('Using mock client data');
      return [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          user_id: 'mock-user-id',
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane.smith@example.com',
          user_id: 'mock-user-id',
          created_at: new Date().toISOString(),
        },
        {
          id: 3,
          first_name: 'Robert',
          last_name: 'Johnson',
          email: 'robert.johnson@example.com',
          user_id: 'mock-user-id',
          created_at: new Date().toISOString(),
        },
        {
          id: 4,
          first_name: 'Emily',
          last_name: 'Williams',
          email: 'emily.williams@example.com',
          user_id: 'mock-user-id',
          created_at: new Date().toISOString(),
        },
        {
          id: 5,
          first_name: 'Michael',
          last_name: 'Brown',
          email: 'michael.brown@example.com',
          user_id: 'mock-user-id',
          created_at: new Date().toISOString(),
        }
      ];
    }
    
    return data;
  }),
  // Protected procedure for listing authenticated user's clients
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new Error('Unauthorized: User not authenticated');
    }
    // TypeScript now knows ctx.user is not null, but we need to ensure it has the right properties
    const { data, error } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('user_id', ctx.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }),

  // Protected procedure for creating/updating clients
  upsert: protectedProcedure
    .input(
      z.object({
        id: z.number().optional(),
        first_name: z.string(),
        last_name: z.string(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new Error('Unauthorized: User not authenticated');
      }
      // After null check, TypeScript knows ctx.user is not null
      const { data, error } = await supabaseAdmin
        .from('clients')
        .upsert({ ...input, user_id: ctx.user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    }),
    
  // Public procedure for testing client creation - will be removed in production
  testUpsert: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        first_name: z.string(),
        last_name: z.string(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Generate a mock user ID for testing
        const mockUserId = 'mock-user-id';
        
        // Try to insert into Supabase
        const { data, error } = await supabaseAdmin
          .from('clients')
          .upsert({ ...input, user_id: mockUserId })
          .select()
          .single();
          
        if (error) {
          console.error('Supabase error:', error);
          // Return mock data for testing
          return {
            id: Math.floor(Math.random() * 1000) + 6, // Random ID starting from 6
            ...input,
            user_id: mockUserId,
            created_at: new Date().toISOString()
          };
        }
        
        return data;
      } catch (err) {
        console.error('Error in testUpsert:', err);
        // Return mock data as fallback
        return {
          id: Math.floor(Math.random() * 1000) + 6,
          ...input,
          user_id: 'mock-user-id',
          created_at: new Date().toISOString()
        };
      }
    }),
});