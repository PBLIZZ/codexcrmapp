import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { router, protectedProcedure } from '../trpc';

// Schema for group input validation
const groupInputSchema = z.object({
  id: z.string().uuid().optional(), // Optional for creation
  name: z.string().min(1, 'Group name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional().nullable(),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g., #FF0000)')
    .or(z.literal(''))
    .nullable()
    .optional()
    .transform((val) => (val === '' ? null : val)),
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
        // Get groups for the contact using Prisma
        const groups = await ctx.prisma.group.findMany({
          where: {
            userId: ctx.user.id,
            members: {
              some: {
                contactId: input.contactId,
              },
            },
          },
          select: {
            id: true,
            name: true,
            description: true,
            color: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return groups;
      } catch (err) {
        console.error('Unexpected error in getGroupsForContact:', err);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err instanceof Error ? err.message : 'An unknown error occurred',
        });
      }
    }),

  // List all groups for the authenticated user, including contact counts
  list: protectedProcedure.query(async ({ ctx }) => {
    console.warn('Group router: list procedure called');
    console.warn('Group router: ctx.user:', ctx.user);

    if (!ctx.user) {
      console.error('Group router: No authenticated user found');
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    try {
      // Fetch groups with member count using Prisma
      const groups = await ctx.prisma.group.findMany({
        where: {
          userId: ctx.user.id,
        },
        include: {
          _count: {
            select: {
              members: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      // Map to include contactCount property
      const result = groups.map((group) => ({
        id: group.id,
        name: group.name,
        description: group.description,
        color: group.color,
        emoji: group.emoji,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        contactCount: group._count.members,
      }));

      return result;
    } catch (error) {
      console.error('Error fetching groups with contact counts:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch groups',
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
        const group = await ctx.prisma.group.findFirst({
          where: {
            id: input.groupId,
            userId: ctx.user.id,
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
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch group',
        });
      }
    }),

  // Create or update a group
  save: protectedProcedure.input(groupInputSchema).mutation(async ({ input, ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const isUpdate = !!input.id;
    const groupData = {
      name: input.name,
      description: input.description,
      color: input.color,
      emoji: input.emoji,
    };

    try {
      let group;

      if (isUpdate) {
        // Update existing group
        group = await ctx.prisma.group.update({
          where: {
            id: input.id,
            userId: ctx.user.id, // Ensure user can only update their own groups
          },
          data: groupData,
        });
      } else {
        // Create new group
        group = await ctx.prisma.group.create({
          data: {
            ...groupData,
            userId: ctx.user.id,
          },
        });
      }

      return group;
    } catch (err) {
      console.error('Unexpected error in save group procedure:', err);
      if (err instanceof TRPCError) throw err;
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: err instanceof Error ? err.message : 'An unknown error occurred',
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
        // Delete group (group_members will cascade delete due to foreign key constraint)
        await ctx.prisma.group.delete({
          where: {
            id: input.groupId,
            userId: ctx.user.id, // Ensure user can only delete their own groups
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
      // Verify the contact exists and belongs to the user
      const contact = await ctx.prisma.contact.findFirst({
        where: {
          id: input.contactId,
          userId: ctx.user.id,
        },
      });

      if (!contact) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid contact ID',
        });
      }

      // Verify the group exists and belongs to the user
      const group = await ctx.prisma.group.findFirst({
        where: {
          id: input.groupId,
          userId: ctx.user.id,
        },
      });

      if (!group) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid group ID',
        });
      }

      // Check if the membership already exists
      const existing = await ctx.prisma.groupMember.findFirst({
        where: {
          contactId: input.contactId,
          groupId: input.groupId,
        },
      });

      // If already exists, return success
      if (existing) {
        return [existing];
      }

      // Otherwise, insert new membership
      const groupMember = await ctx.prisma.groupMember.create({
        data: {
          contactId: input.contactId,
          groupId: input.groupId,
        },
      });

      return [groupMember];
    } catch (error) {
      console.error('Error adding contact to group:', error);
      if (error instanceof TRPCError) throw error;
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
      // First verify the group belongs to the user
      const group = await ctx.prisma.group.findFirst({
        where: {
          id: input.groupId,
          userId: ctx.user.id,
        },
      });

      if (!group) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid group ID',
        });
      }

      // Remove the group membership
      const deletedMember = await ctx.prisma.groupMember.deleteMany({
        where: {
          contactId: input.contactId,
          groupId: input.groupId,
        },
      });

      return { success: true, count: deletedMember.count };
    } catch (error) {
      console.error('Error removing contact from group:', error);
      if (error instanceof TRPCError) throw error;
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
        // First, verify the group exists and belongs to the user
        const group = await ctx.prisma.group.findFirst({
          where: {
            id: input.groupId,
            userId: ctx.user.id,
          },
        });

        if (!group) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Group not found',
          });
        }

        // Get all contacts in the group via the junction table
        const contacts = await ctx.prisma.contact.findMany({
          where: {
            userId: ctx.user.id,
            groups: {
              some: {
                groupId: input.groupId,
              },
            },
          },
        });

        return contacts;
      } catch (error) {
        console.error('Error fetching contacts in group:', error);
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch contacts in group',
          cause: error,
        });
      }
    }),
});
