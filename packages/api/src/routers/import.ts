import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { Prisma } from '@codexcrm/database/prisma/generated/client/client';

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
        // Transform data format for Prisma - especially handling nullable fields properly
        const prismaContacts = contactsToInsert.map((contact) => {
          // Create a properly typed contact object for Prisma
          const prismaContact: Prisma.ContactCreateInput = {
            fullName: contact.full_name,
            // Email is required in the schema, provide an empty string if missing
            email: contact.email || '',
            // Handle nullable fields properly
            phone: contact.phone ?? undefined,
            phoneCountryCode: contact.phone_country_code ?? undefined,
            companyName: contact.company_name ?? undefined,
            jobTitle: contact.job_title ?? undefined,
            website: contact.website ?? undefined,
            notes: contact.notes ?? undefined,
            // Required arrays - provide empty arrays if null/undefined
            tags: contact.tags ?? [],
            socialHandles: contact.social_handles ?? [],
            // For wellness goals (required array in schema)
            wellnessGoals: [],
            // Optional fields
            addressStreet: contact.address_street ?? undefined,
            // Connect to the user
            user: {
              connect: {
                id: ctx.user.id,
              },
            },
          };

          return prismaContact;
        });

        // Create multiple contacts using Prisma
        // We use createMany for better performance with large imports
        // but need to handle the relations separately
        const createdContacts = await Promise.all(
          prismaContacts.map((contactData) =>
            ctx.prisma.contact.create({
              data: contactData,
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            })
          )
        );

        importResults.imported = createdContacts.length;
        return importResults;
      } catch (error) {
        importResults.success = false;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        importResults.errors.push(errorMessage);
        console.error('Error importing contacts:', error);
        return importResults;
      }
    }),
});
