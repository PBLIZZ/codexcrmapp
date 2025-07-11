// path: packages/api/src/routers/contact.ts

import type { Prisma } from '@codexcrm/database/prisma/generated/client/client';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../trpc';

// Use Prisma namespace directly for all operations

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
  website: z.string().url({ message: 'Invalid URL' }).optional().nullable(), // New
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
        groupId: z.string().optional(), // Optional group ID to filter contacts by
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, groupId } = input;
      const userId = ctx.user?.id;

      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        // If a groupId is provided, first get contact IDs from group_members
        if (groupId) {
          // Get contact IDs from group_members for this group
          const groupMembers = await ctx.prisma.groupMember.findMany({
            where: {
              groupId: groupId,
              group: {
                userId: userId, // Ensure user has access to this group
              },
            },
            select: {
              contactId: true,
            },
          });

          // If no contacts in the group, return empty array
          if (!groupMembers || groupMembers.length === 0) {
            return [];
          }

          // Extract contact IDs
          const contactIds = groupMembers.map((member) => member.contactId);

          // Query contacts filtered by both group membership and search term
          return await ctx.prisma.contact.findMany({
            where: {
              id: { in: contactIds },
              userId: userId,
              ...(search
                ? {
                    OR: [
                      { fullName: { contains: search, mode: 'insensitive' } },
                      { email: { contains: search, mode: 'insensitive' } },
                    ],
                  }
                : {}),
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
        }

        // If no groupId is provided, query all user's contacts
        return await ctx.prisma.contact.findMany({
          where: {
            userId: userId,
            ...(search
              ? {
                  OR: [
                    { fullName: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                  ],
                }
              : {}),
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      } catch (error) {
        console.error('Error fetching contacts:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve contacts',
          cause: error instanceof Error ? error : undefined,
        });
      }
    }),
  // Fetch a single contact by ID
  getById: protectedProcedure
    .input(z.object({ contactId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.user?.id;
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const contact = await ctx.prisma.contact.findUnique({
          where: {
            id: input.contactId,
            userId: userId, // Ensures users can only see their own contacts
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
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch contact',
          cause: error instanceof Error ? error : undefined,
        });
      }
    }),

  save: protectedProcedure
    .input(contactInputSchema) // Uses the schema defined above this router
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user?.id;
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const contactId = input.id;

      // Create properly typed update object for Prisma
      const contactData: Prisma.ContactUpdateInput = {
        fullName: input.full_name, // Required field
      };

      // Add optional fields only if they have values
      // Use proper Prisma field update syntax for nullable fields
      if (input.email !== undefined)
        contactData.email = input.email === null ? { set: '' } : input.email;
      if (input.phone !== undefined)
        contactData.phone = input.phone === null ? { set: null } : input.phone;
      if (input.phone_country_code !== undefined)
        contactData.phoneCountryCode =
          input.phone_country_code === null ? { set: null } : input.phone_country_code;
      if (input.company_name !== undefined)
        contactData.companyName = input.company_name === null ? { set: null } : input.company_name;
      if (input.job_title !== undefined)
        contactData.jobTitle = input.job_title === null ? { set: null } : input.job_title;
      if (input.address_street !== undefined)
        contactData.addressStreet =
          input.address_street === null ? { set: null } : input.address_street;
      if (input.address_city !== undefined)
        contactData.addressCity = input.address_city === null ? { set: null } : input.address_city;
      if (input.address_postal_code !== undefined)
        contactData.addressPostalCode =
          input.address_postal_code === null ? { set: null } : input.address_postal_code;
      if (input.address_country !== undefined)
        contactData.addressCountry =
          input.address_country === null ? { set: null } : input.address_country;
      if (input.website !== undefined)
        contactData.website = input.website === null ? { set: null } : input.website;
      if (input.profile_image_url !== undefined)
        contactData.profileImageUrl =
          input.profile_image_url === null ? { set: null } : input.profile_image_url;
      if (input.notes !== undefined)
        contactData.notes = input.notes === null ? { set: null } : input.notes;
      if (input.tags !== undefined)
        contactData.tags = input.tags === null ? { set: [] } : input.tags;
      if (input.social_handles !== undefined)
        contactData.socialHandles =
          input.social_handles === null ? { set: [] } : input.social_handles;
      if (input.source !== undefined)
        contactData.source = input.source === null ? { set: null } : input.source;
      if (input.last_contacted_at !== undefined)
        contactData.lastContactedAt =
          input.last_contacted_at === null ? { set: null } : input.last_contacted_at;
      if (input.enriched_data !== undefined)
        contactData.enrichedData =
          input.enriched_data === null ? { set: null } : input.enriched_data;
      if (input.enrichment_status !== undefined)
        contactData.enrichmentStatus =
          input.enrichment_status === null ? { set: null } : input.enrichment_status;

      try {
        let result;

        if (contactId) {
          // UPDATE LOGIC
          console.warn(`Attempting contact update for id: ${contactId}`);

          // First check if the contact belongs to this user
          const existingContact = await ctx.prisma.contact.findUnique({
            where: {
              id: contactId,
              userId: userId,
            },
          });

          if (!existingContact) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Contact not found or you do not have permission to update it',
            });
          }

          // Update the contact
          result = await ctx.prisma.contact.update({
            where: {
              id: contactId,
            },
            data: contactData,
          });
        } else {
          // INSERT LOGIC
          console.warn('[DEBUG] Attempting contact insert');

          // Check for email uniqueness if email is provided
          if (input.email) {
            const existingContactWithEmail = await ctx.prisma.contact.findFirst({
              where: {
                email: input.email,
                userId: userId,
              },
            });

            if (existingContactWithEmail) {
              throw new TRPCError({
                code: 'CONFLICT',
                message: `A contact with this email (${input.email}) already exists.`,
              });
            }
          }

          // For creating a new contact, explicitly type to match Prisma schema
          const createData: Prisma.ContactCreateInput = {
            fullName: input.full_name, // Required field
            email: input.email ?? '', // Required by Prisma schema, provide empty string if null
            user: { connect: { id: userId } }, // Required: use connect to link to existing user
          };

          // Add optional fields with proper null handling
          // Email is already set above as it's required
          if (input.phone !== undefined && input.phone !== null) createData.phone = input.phone;
          if (input.phone_country_code !== undefined && input.phone_country_code !== null)
            createData.phoneCountryCode = input.phone_country_code;
          if (input.company_name !== undefined && input.company_name !== null)
            createData.companyName = input.company_name;
          if (input.job_title !== undefined && input.job_title !== null)
            createData.jobTitle = input.job_title;
          if (input.address_street !== undefined && input.address_street !== null)
            createData.addressStreet = input.address_street;
          if (input.address_city !== undefined && input.address_city !== null)
            createData.addressCity = input.address_city;
          if (input.address_postal_code !== undefined && input.address_postal_code !== null)
            createData.addressPostalCode = input.address_postal_code;
          if (input.address_country !== undefined && input.address_country !== null)
            createData.addressCountry = input.address_country;
          if (input.website !== undefined && input.website !== null)
            createData.website = input.website;
          if (input.profile_image_url !== undefined && input.profile_image_url !== null)
            createData.profileImageUrl = input.profile_image_url;
          if (input.notes !== undefined && input.notes !== null) createData.notes = input.notes;
          if (input.tags !== undefined) createData.tags = input.tags === null ? [] : input.tags;
          if (input.social_handles !== undefined)
            createData.socialHandles = input.social_handles === null ? [] : input.social_handles;
          if (input.source !== undefined && input.source !== null) createData.source = input.source;
          if (input.last_contacted_at !== undefined)
            createData.lastContactedAt = input.last_contacted_at;
          if (input.enriched_data !== undefined) createData.enrichedData = input.enriched_data;
          if (input.enrichment_status !== undefined)
            createData.enrichmentStatus = input.enrichment_status;

          // Create the contact
          result = await ctx.prisma.contact.create({
            data: createData,
          });
        }

        console.warn('Contact save successful:', result);
        return result;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Unhandled error in contact save procedure:', error);
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
      const userId = ctx.user?.id;
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        // Check if contact exists and belongs to user
        const contact = await ctx.prisma.contact.findUnique({
          where: {
            id: input.contactId,
            userId: userId,
          },
        });

        if (!contact) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Contact not found or you do not have permission to delete it',
          });
        }

        // Delete the contact
        await ctx.prisma.contact.delete({
          where: {
            id: input.contactId,
            userId: userId, // Ensures users can only delete their own contacts
          },
        });

        return { success: true, contactId: input.contactId };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Unhandled error in delete procedure:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete contact due to an unexpected error',
          cause: error instanceof Error ? error : undefined,
        });
      }
    }),

  // Update just the notes field of a contact
  updateNotes: protectedProcedure
    .input(
      z.object({
        contactId: z.string().uuid(),
        notes: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.user?.id;
      if (!userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const { contactId, notes } = input;

      try {
        // Check if contact exists and belongs to user
        const existingContact = await ctx.prisma.contact.findUnique({
          where: {
            id: contactId,
            userId: userId,
          },
          select: { id: true },
        });

        if (!existingContact) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Contact not found or you do not have permission to update it',
          });
        }

        // Update only the notes field
        await ctx.prisma.contact.update({
          where: {
            id: contactId,
            userId: userId, // Ensures users can only update their own contacts
          },
          data: {
            notes,
            updatedAt: new Date(),
          },
        });

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Unhandled error in updateNotes procedure:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update contact notes due to an unexpected error',
          cause: error instanceof Error ? error : undefined,
        });
      }
    }),

  // Get total count of contacts for the authenticated user
  getTotalContactsCount: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user?.id;
    if (!userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    try {
      // Use Prisma's count method to get total contacts for the user
      const count = await ctx.prisma.contact.count({
        where: {
          userId: userId, // Ensures we only count user's own contacts
        },
      });

      return { count };
    } catch (error) {
      console.error('Failed to get total contact count:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Could not retrieve contact count.',
        cause: error instanceof Error ? error : undefined,
      });
    }
  }),
});
