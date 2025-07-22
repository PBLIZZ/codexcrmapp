import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { Prisma } from '@codexcrm/db';

import { router, protectedProcedure } from '../trpc';

const contactInputSchema = z.object({
  id: z.string().uuid().optional(), // ID is UUID string, optional for creation
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address').optional().nullable(),
  phone: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  profileImageUrl: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  lastContactedAt: z.preprocess((arg) => {
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

// Defines tRPC procedures for contacts.
export const contactRouter = router({
  // ===== Protected Procedures (require authentication) =====

  // Protected procedure for listing authenticated user's contacts
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    try {
      const contacts = await ctx.prisma.contact.findMany({
        where: {
          userId: ctx.user.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Return contacts with current Prisma schema format
      const transformedContacts = contacts.map((contact) => ({
        id: contact.id,
        fullName: contact.fullName,
        email: contact.email,
        phone: contact.phone,
        jobTitle: contact.jobTitle,
        companyName: contact.companyName,
        profileImageUrl: contact.profileImageUrl,
        website: contact.website,
        tags: contact.tags,
        socialHandles: contact.socialHandles,
        addressStreet: contact.addressStreet,
        addressCity: contact.addressCity,
        addressPostalCode: contact.addressPostalCode,
        addressCountry: contact.addressCountry,
        phoneCountryCode: contact.phoneCountryCode,
        notes: contact.notes,
        source: contact.source,
        lastContactedAt: contact.lastContactedAt,
        wellnessGoals: contact.wellnessGoals,
        wellnessJourneyStage: contact.wellnessJourneyStage,
        wellnessStatus: contact.wellnessStatus,
        lastAssessmentDate: contact.lastAssessmentDate,
        clientSince: contact.clientSince,
        relationshipStatus: contact.relationshipStatus,
        referralSource: contact.referralSource,
        enrichmentStatus: contact.enrichmentStatus,
        enrichedData: contact.enrichedData,
        communicationPreferences: contact.communicationPreferences,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
        userId: contact.userId,
        // Add empty groups array to match ContactWithGroups interface
        groups: [],
      }));

      return transformedContacts;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch contacts' });
    }
  }),
  // Fetch a single contact by ID
  getById: protectedProcedure
    .input(z.object({ contactId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const contact = await ctx.prisma.contact.findFirst({
          where: {
            id: input.contactId,
            userId: ctx.user.id,
          },
        });

        if (!contact) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Contact not found',
          });
        }

        return contact;
      } catch (error) {
        console.error('Error fetching contact by id:', error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch contact',
          cause: error,
        });
      }
    }),

  // Protected procedure for creating/updating contacts
  save: protectedProcedure.input(contactInputSchema).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const contactId = input.id;
    // Prepare fields to update/insert using Prisma field names
    const fields = {
      fullName: input.fullName,
      email: input.email || null,
      phone: input.phone || null,
      companyName: input.companyName || null,
      jobTitle: input.jobTitle || null,
      profileImageUrl: input.profileImageUrl || null,
      notes: input.notes || null,
      source: input.source || null,
      lastContactedAt: input.lastContactedAt || null,
    };

    try {
      let contact;

      if (contactId) {
        // Update existing contact
        console.warn(`Attempting contact update for id: ${contactId}`, fields);

        // For updates, filter out null values and use proper Prisma update syntax
        const updateData: Prisma.ContactUpdateInput = {};
        Object.entries(fields).forEach(([key, value]) => {
          const typedKey = key as keyof Prisma.ContactUpdateInput;
          if (value !== null) {
            (updateData as Record<string, unknown>)[typedKey] = value;
          } else {
            // Explicitly set null using Prisma's set operation
            (updateData as Record<string, unknown>)[typedKey] = { set: null };
          }
        });

        contact = await ctx.prisma.contact.update({
          where: {
            id: contactId,
            userId: ctx.user.id, // Ensure user can only update their own contacts
          },
          data: updateData,
        });
      } else {
        // Create new contact
        console.warn('Attempting contact insert with user context', fields);

        // Check for existing contact with same email for this user
        if (fields.email) {
          const existingContact = await ctx.prisma.contact.findFirst({
            where: {
              userId: ctx.user.id,
              email: fields.email,
            },
          });

          if (existingContact) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: `A contact with email "${fields.email}" already exists.`,
            });
          }
        }

        const insertData: Prisma.ContactCreateInput = {
          userId: ctx.user.id,
          fullName: fields.fullName || '', // Ensure fullName is never null/undefined
          email: fields.email || null, // Handle optional email properly
          phone: fields.phone,
          companyName: fields.companyName,
          jobTitle: fields.jobTitle,
          profileImageUrl: fields.profileImageUrl,
          notes: fields.notes,
          source: fields.source,
          lastContactedAt: fields.lastContactedAt,
        };

        contact = await ctx.prisma.contact.create({
          data: insertData,
        });
      }

      console.warn('Contact save successful:', contact);
      return contact;
    } catch (err) {
      console.error('Unexpected error in save procedure:', err);
      if (err instanceof TRPCError) throw err;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message:
          err instanceof Error
            ? err.message
            : 'An unknown error occurred while saving the contact.',
      });
    }
  }),

  // Procedure to delete a contact
  delete: protectedProcedure
    .input(
      z.object({
        contactId: z.string().uuid(), // Expect UUID string ID
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        console.warn(`Attempting to delete contact ID: ${input.contactId} by user ${ctx.user.id}`);

        await ctx.prisma.contact.delete({
          where: {
            id: input.contactId,
            userId: ctx.user.id, // Ensure user can only delete their own contacts
          },
        });

        console.warn(`Contact ${input.contactId} deleted successfully by user ${ctx.user.id}`);
        return { success: true, deletedContactId: input.contactId };
      } catch (error) {
        console.error('Error deleting contact:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete contact',
          cause: error,
        });
      }
    }),

  // Procedure to bulk delete contacts
  bulkDelete: protectedProcedure
    .input(
      z.object({
        contactIds: z.array(z.string().uuid()).min(1, 'At least one contact ID is required'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        console.warn(
          `Attempting to bulk delete contact IDs: ${input.contactIds.join(', ')} by user ${ctx.user.id}`
        );

        const result = await ctx.prisma.contact.deleteMany({
          where: {
            id: { in: input.contactIds },
            userId: ctx.user.id, // Ensure user can only delete their own contacts
          },
        });

        console.warn(`${result.count} contacts deleted successfully by user ${ctx.user.id}`);
        return { success: true, deletedCount: result.count, deletedContactIds: input.contactIds };
      } catch (error) {
        console.error('Error bulk deleting contacts:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete contacts',
          cause: error,
        });
      }
    }),
});
