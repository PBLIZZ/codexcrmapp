import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { supabaseAdmin } from '../supabaseAdmin';

export const clientRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const { data, error } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('user_id', ctx.user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }),

  upsert: publicProcedure
    .input(
      z.object({
        id: z.number().optional(),
        first_name: z.string(),
        last_name: z.string(),
        email: z.string().email().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await supabaseAdmin
        .from('clients')
        .upsert({ ...input, user_id: ctx.user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    }),
});