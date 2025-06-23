import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { router, protectedProcedure } from '../trpc';

// Schema for CSV import contact data
const csvContactInputSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address').optional().nullable(),
  phone: z.string().optional().nullable(),
  phone_country_code: z.string().optional().nullable(),
  company: z.string().optional().nullable(), // Note: maps to company_name in DB
  job_title: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().nullable(), // Already converted to array by CSV processing
  social_handles: z.array(z.string()).optional().nullable(),
  address: z.string().optional().nullable(),
});

export const importRouter = router({
  // Bulk import contacts from CSV
  contacts: protectedProcedure
    .input(z.array(csvContactInputSchema))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      if (input.length === 0) {
        return { success: true, imported: 0, errors: [] };
      }

      const importResults = {
        success: true,
        imported: 0,
        errors: [] as string[],
        skipped: 0,
      };

      // Transform CSV data to database format
      const contactsToInsert = input.map((contact) => ({
        full_name: contact.full_name,
        email: contact.email,
        phone: contact.phone,
        phone_country_code: contact.phone_country_code,
        company_name: contact.company, // Map company to company_name
        job_title: contact.job_title,
        website: contact.website,
        notes: contact.notes,
        tags: contact.tags, // Already converted to array by CSV processing
        social_handles: contact.social_handles,
        address_street: contact.address, // Map address to address_street
        user_id: ctx.user.id,
      }));

      try {
        const { data, error } = await ctx.supabaseUser
          .from('contacts')
          .insert(contactsToInsert)
          .select('id, full_name, email');

        if (error) {
          importResults.success = false;
          importResults.errors.push(`Database error: ${error.message}`);
          return importResults;
        }

        importResults.imported = data?.length ?? 0;
        return importResults;

      } catch (error) {
        importResults.success = false;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        importResults.errors.push(errorMessage);
        return importResults;
      }
    }),
});