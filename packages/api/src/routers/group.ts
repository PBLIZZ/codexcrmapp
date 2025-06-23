import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { router, protectedProcedure } from '../trpc';

interface Group {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  emoji?: string | null;
  group_members?: Array<{ id: string; contact_id: string; group_id: string }>;
}

// Schema for group input validation
const groupInputSchema = z.object({
  id: z.string().uuid().optional(), // Optional for creation
  name: z.string().min(1, 'Group name is required').max(100, 'Name too long'),
  description: z
    .string()
    .max(500, 'Description too long')
    .optional()
    .nullable(),
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
        const { data: memberData, error: memberError } = await ctx.supabaseUser
          .from('group_members')
          .select('group_id')
          .eq('contact_id', input.contactId);

        if (memberError) {
          console.error('Error fetching group members:', memberError);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch group memberships',
          });
        }

        if (!memberData || memberData.length === 0) {
          return [];
        }

        const groupIds = memberData.map(
          (item: { group_id: string }) => item.group_id
        );

        const { data: groupsData, error: groupsError } = await ctx.supabaseUser
          .from('groups')
          .select('id, name, description, color, created_at, updated_at')
          .eq('user_id', ctx.user.id)
          .in('id', groupIds);

        if (groupsError) {
          console.error('Error fetching groups for contact:', groupsError);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch groups for contact',
          });
        }

        return groupsData || [];
      } catch (err) {
        console.error('Unexpected error in getGroupsForContact:', err);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            err instanceof Error ? err.message : 'An unknown error occurred',
        });
      }
    }),

  // List all groups for the authenticated user
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const { data, error } = await ctx.supabaseUser
      .from('groups')
      .select('*, group_members(*)')
      .order('name');

    if (error) {
      console.error('Error fetching groups with contact counts:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch groups',
      });
    }

    return (data || []).map((group: Group) => {
      const contactCount = Array.isArray(group.group_members)
        ? group.group_members.length
        : 0;
      const { group_members, ...groupFields } = group;
      return {
        ...groupFields,
        contactCount,
      };
    });
  }),

  // Get a single group by ID
  getById: protectedProcedure
    .input(z.object({ groupId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const { data, error } = await ctx.supabaseUser
        .from('groups')
        .select('*')
        .eq('id', input.groupId)
        .single();

      if (error) {
        console.error('Error fetching group by ID:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch group',
        });
      }

      return data;
    }),

  // Create or update a group
  save: protectedProcedure
    .input(groupInputSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const isUpdate = !!input.id;
      const groupData = {
        ...input,
        user_id: ctx.user.id,
        updated_at: new Date().toISOString(),
      };

      if (!isUpdate) {
        delete groupData.id;
      }

      const { data, error } = await ctx.supabaseUser
        .from('groups')
        .upsert(groupData)
        .select()
        .single();

      if (error) {
        console.error('Error saving group:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to ${isUpdate ? 'update' : 'create'} group`,
        });
      }

      return data;
    }),

  // Delete a group
  delete: protectedProcedure
    .input(z.object({ groupId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const { error } = await ctx.supabaseUser
        .from('groups')
        .delete()
        .eq('id', input.groupId)
        .eq('user_id', ctx.user.id);

      if (error) {
        console.error('Error deleting group:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete group',
        });
      }

      return { success: true, deletedGroupId: input.groupId };
    }),

  // Add a contact to a group
  addContact: protectedProcedure
    .input(groupContactSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const { data: existing, error: existingError } = await ctx.supabaseUser
        .from('group_members')
        .select('id')
        .eq('group_id', input.groupId)
        .eq('contact_id', input.contactId)
        .single();

      if (existingError && existingError.code !== 'PGRST116') {
        console.error('Error checking for existing group member:', existingError);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Could not verify group membership.',
        });
      }

      if (existing) {
        return { success: true, message: 'Contact already in group.' };
      }

      const { error } = await ctx.supabaseUser.from('group_members').insert([
        {
          group_id: input.groupId,
          contact_id: input.contactId,
          // user_id field removed as it doesn't exist in the table schema
        },
      ]);

      if (error) {
        console.error('Detailed error adding contact to group:', JSON.stringify(error, null, 2));
        console.error('Original error object adding contact to group:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add contact to group',
        });
      }

      return { success: true };
    }),

  // Remove a contact from a group
  removeContact: protectedProcedure
    .input(groupContactSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const { error } = await ctx.supabaseUser
        .from('group_members')
        .delete()
        .eq('contact_id', input.contactId)
        .eq('group_id', input.groupId);

      if (error) {
        console.error('Error removing contact from group:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to remove contact from group',
        });
      }

      return { success: true };
    }),

  // Get all contacts in a group
  getContacts: protectedProcedure
    .input(z.object({ groupId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const { data: group, error: groupError } = await ctx.supabaseUser
        .from('groups')
        .select('id')
        .eq('id', input.groupId)
        .single();

      if (groupError || !group) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Group not found' });
      }

      const { data, error } = await ctx.supabaseUser
        .from('group_members')
        .select('contacts:contact_id (*)')
        .eq('group_id', input.groupId);

      if (error) {
        console.error('Error fetching contacts in group:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch contacts in group',
        });
      }

      if (!data) {
        return [];
      }

      return data.map((item: any) => item.contacts).filter(Boolean);
    }),
});
