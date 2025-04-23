import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { supabaseAdmin } from '../supabaseAdmin';
    
export const clientRouter = router({
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
});