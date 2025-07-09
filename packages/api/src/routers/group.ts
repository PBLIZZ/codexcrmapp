import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { Prisma } from '@codexcrm/database/prisma/generated/client/client';

import { router, protectedProcedure } from '../trpc';

// Schema for group input validation
const groupInputSchema = z.object({
  id: z.string().uuid().optional(), // Optional for creation
  name: z.string().min(1, 'Group name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional().nullable(),
  color: z
    .string()
    .regex(/^#([0-9a-f]{3}){1,2}$/i, 'Must be a valid hex color')
    .optional()
    .nullable(),
  emoji: z
    .string()
    .max(2, 'Emoji should be 1-2 characters')
    .or(z.literal(''))
    .nullable()
    .optional()
    .transform((val) => (val === '' ? null : val)),
});

// Group to contact relationship schema
const groupContactSchema = z.object({
  groupId: z.string().uuid(),
  contactId: z.string().uuid(),
});

export const groupRouter = router({
  // Get all groups for a specific contact
  getGroupsForContact: protectedProcedure
    .input(z.object({ contactId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        // First verify the contact belongs to this user
        const contact = await ctx.prisma.contact.findUnique({
          where: {
            id: input.contactId,
            userId: ctx.user.id,
          },
        });

        if (!contact) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Contact not found or you do not have permission to access it',
          });
        }

        // Get all groups this contact belongs to
        const groupMembers = await ctx.prisma.groupMember.findMany({
          where: {
            contactId: input.contactId,
          },
          include: {
            group: true,
          },
        });

        // Filter to only include groups that belong to this user (extra security)
        const groups = groupMembers
          .map((member) => member.group)
          .filter((group) => group.userId === ctx.user.id);

        return groups;
      } catch (error) {
        console.error('Error fetching groups for contact:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch groups for contact',
          cause: error,
        });
      }
    }),

  // List all groups for the authenticated user
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    try {
      const groups = await ctx.prisma.group.findMany({
        where: {
          userId: ctx.user.id,
        },
        include: {
          members: true,
        },
        orderBy: {
          name: 'asc',
        },
      });

      return groups.map((group) => {
        const contactCount = group.members.length;
        return {
          id: group.id,
          name: group.name,
          description: group.description,
          color: group.color,
          emoji: group.emoji,
          createdAt: group.createdAt,
          updatedAt: group.updatedAt,
          contactCount,
        };
      });
    } catch (error) {
      console.error('Error fetching groups with contact counts:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch groups',
        cause: error,
      });
    }
  }),

  // Get a single group by ID
  getById: protectedProcedure
    .input(z.object({ groupId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        const group = await ctx.prisma.group.findUnique({
          where: {
            id: input.groupId,
            userId: ctx.user.id, // Ensure user only accesses their own groups
          },
        });

        if (!group) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Group not found',
          });
        }

        return group;
      } catch (error) {
        console.error('Error fetching group by ID:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch group',
          cause: error,
        });
      }
    }),

  // Create or update a group
  save: protectedProcedure.input(groupInputSchema).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    try {
      const isUpdate = !!input.id;

      if (isUpdate) {
        // Update existing group
        // First check if the group exists and belongs to this user
        const existingGroup = await ctx.prisma.group.findUnique({
          where: {
            id: input.id,
            userId: ctx.user.id,
          },
        });

        if (!existingGroup) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Group not found or you do not have permission to update it',
          });
        }

        // Perform update
        return await ctx.prisma.group.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            description: input.description,
            color: input.color,
            emoji: input.emoji,
          },
        });
      } else {
        // Create new group
        return await ctx.prisma.group.create({
          data: {
            name: input.name,
            description: input.description,
            color: input.color,
            emoji: input.emoji,
            user: {
              connect: {
                id: ctx.user.id,
              },
            },
          },
        });
      }
    } catch (error) {
      console.error('Error saving group:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to ${input.id ? 'update' : 'create'} group`,
        cause: error,
      });
    }
  }),

  // Delete a group
  delete: protectedProcedure
    .input(z.object({ groupId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        // First check if the group exists and belongs to this user
        const existingGroup = await ctx.prisma.group.findUnique({
          where: {
            id: input.groupId,
            userId: ctx.user.id,
          },
        });

        if (!existingGroup) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Group not found or you do not have permission to delete it',
          });
        }

        // Cascade will automatically delete related group members thanks to onDelete: Cascade in the Prisma schema
        await ctx.prisma.group.delete({
          where: {
            id: input.groupId,
          },
        });

        return { success: true, deletedGroupId: input.groupId };
      } catch (error) {
        console.error('Error deleting group:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete group',
          cause: error,
        });
      }
    }),

  // Add a contact to a group
  addContact: protectedProcedure.input(groupContactSchema).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    try {
      // First, verify both the group and contact exist and belong to this user
      const [group, contact] = await Promise.all([
        ctx.prisma.group.findUnique({
          where: {
            id: input.groupId,
            userId: ctx.user.id,
          },
        }),
        ctx.prisma.contact.findUnique({
          where: {
            id: input.contactId,
            userId: ctx.user.id,
          },
        }),
      ]);

      if (!group) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Group not found or you do not have permission to access it',
        });
      }

      if (!contact) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Contact not found or you do not have permission to access it',
        });
      }

      // Check if the relationship already exists
      const existingRelationship = await ctx.prisma.groupMember.findUnique({
        where: {
          groupId_contactId: {
            groupId: input.groupId,
            contactId: input.contactId,
          },
        },
      });

      if (existingRelationship) {
        return { success: true, message: 'Contact already in group.' };
      }

      // Create the new relationship
      await ctx.prisma.groupMember.create({
        data: {
          group: {
            connect: { id: input.groupId },
          },
          contact: {
            connect: { id: input.contactId },
          },
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Error adding contact to group:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to add contact to group',
        cause: error,
      });
    }
  }),

  // Remove a contact from a group
  removeContact: protectedProcedure.input(groupContactSchema).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    try {
      // First verify the group belongs to this user
      const group = await ctx.prisma.group.findUnique({
        where: {
          id: input.groupId,
          userId: ctx.user.id,
        },
      });

      if (!group) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Group not found or you do not have permission to modify it',
        });
      }

      // Delete the relationship using the composite unique constraint
      await ctx.prisma.groupMember.delete({
        where: {
          groupId_contactId: {
            groupId: input.groupId,
            contactId: input.contactId,
          },
        },
      });

      return { success: true };
    } catch (error) {
      // Handle the case where the relationship doesn't exist
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        // Record not found - the contact wasn't in the group
        return { success: true }; // Still return success as the end state is what was requested
      }

      console.error('Error removing contact from group:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to remove contact from group',
        cause: error,
      });
    }
  }),

  // Get all contacts in a group
  getContacts: protectedProcedure
    .input(z.object({ groupId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      try {
        // First, verify that the group exists and belongs to this user
        const group = await ctx.prisma.group.findUnique({
          where: {
            id: input.groupId,
            userId: ctx.user.id,
          },
        });

        if (!group) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Group not found or you do not have permission to access it',
          });
        }

        // Get all contacts in this group using the members relation
        const groupWithMembers = await ctx.prisma.group.findUnique({
          where: {
            id: input.groupId,
          },
          include: {
            members: {
              include: {
                contact: true,
              },
            },
          },
        });

        if (!groupWithMembers || !groupWithMembers.members) {
          return [];
        }

        // Return the contact objects from the members relation
        return groupWithMembers.members.map((member) => member.contact);
      } catch (error) {
        console.error('Error fetching contacts in group:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch contacts in group',
          cause: error,
        });
      }
    }),
});
