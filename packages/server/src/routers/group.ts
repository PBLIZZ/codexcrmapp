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
  description: z.string().max(500, 'Description too long').optional().nullable(),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g., #FF0000)')
    .or(z.literal(''))
    .nullable()
    .optional()
    .transform(val => val === '' ? null : val),
  emoji: z.string()
    .max(2, 'Emoji should be 1-2 characters')
    .or(z.literal(''))
    .nullable()
    .optional()
    .transform(val => val === '' ? null : val),
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
        // First, get the group IDs that this contact belongs to
        const { data: memberData, error: memberError } = await ctx.supabaseUser
          .from('group_members')
          .select('group_id')
          .eq('contact_id', input.contactId);

        if (memberError) {
          console.error('Error fetching group members:', memberError);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch group memberships'
          });
        }

        // If there are no groups, return empty array
        if (!memberData || memberData.length === 0) {
          return [];
        }

        // Extract just the group IDs into an array
        const groupIds = memberData.map((item: { group_id: string }) => item.group_id);

        // Then fetch the actual groups using those IDs
        const { data: groupsData, error: groupsError } = await ctx.supabaseUser
          .from('groups')
          .select(`
            id,
            name,
            description,
            color,
            created_at,
            updated_at
          `)
          .eq('user_id', ctx.user.id)
          .in('id', groupIds);

        if (groupsError) {
          console.error('Error fetching groups for contact:', groupsError);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch groups for contact'
          });
        }

        return groupsData || [];
      } catch (err) {
        console.error('Unexpected error in getGroupsForContact:', err);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err instanceof Error ? err.message : 'An unknown error occurred'
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

    // Fetch groups along with their related group_members entries
    const { data, error } = await ctx.supabaseUser
      .from('groups')
      .select('*, group_members(*)')
      .order('name');

    if (error) {
      console.error('Error fetching groups with contact counts:', error);
      throw new TRPCError({ 
        code: 'INTERNAL_SERVER_ERROR', 
        message: 'Failed to fetch groups' 
      });
    }

    // Map to include a contactCount property and strip out raw junction data
    const result = (data || []).map((group: Group) => {
      // group.group_members is an array of contact-group relationships
      const contactCount = Array.isArray(group.group_members)
        ? group.group_members.length
        : 0;
      // Extract core group properties
      const { group_members: _group_members, ...groupFields } = group;
      return {
        ...groupFields,
        contactCount,
      };
    });
    return result;
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
          message: 'Failed to fetch group'
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

      // If creating new group, don't include ID as it will be generated
      if (!isUpdate) {
        delete groupData.id;
      }

      try {
        const { data, error } = await ctx.supabaseUser
          .from('groups')
          .upsert(groupData)
          .select()
          .single();

        if (error) {
          console.error('Error saving group:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to ${isUpdate ? 'update' : 'create'} group`
          });
        }

        return data;
      } catch (err) {
        console.error('Unexpected error in save group procedure:', err);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: err instanceof Error ? err.message : 'An unknown error occurred'
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

      // Delete group (contact_groups will cascade delete due to foreign key constraint)
      const { error } = await ctx.supabaseUser
        .from('groups')
        .delete()
        .eq('id', input.groupId)
        .eq('user_id', ctx.user.id);

      if (error) {
        console.error('Error deleting group:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete group'
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

      // First verify the contact exists
      const { data: _contact, error: contactError } = await ctx.supabaseUser
        .from('contacts')
        .select('id')
        .eq('id', input.contactId)
        .single();

      if (contactError) {
        console.error('Error verifying contact:', contactError);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid contact ID'
        });
      }

      // Then verify the group exists
      const { data: _group, error: groupError } = await ctx.supabaseUser
        .from('groups')
        .select('id')
        .eq('id', input.groupId)
        .single();

      if (groupError) {
        console.error('Error verifying group:', groupError);
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid group ID'
        });
      }

      // Check if the membership already exists
      const { data: existing, error: checkError } = await ctx.supabaseUser
        .from('group_members')
        .select('id')
        .eq('contact_id', input.contactId)
        .eq('group_id', input.groupId)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing membership:', checkError);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to check existing membership'
        });
      }

      // If already exists, return success
      if (existing) {
        return [existing];
      }

      // Otherwise, insert new membership
      const { data, error } = await ctx.supabaseUser
        .from('group_members')
        .insert({
          contact_id: input.contactId,
          group_id: input.groupId,
        })
        .select();

      if (error) {
        console.error('Error adding contact to group:', error, '\nPayload:', {
          contact_id: input.contactId,
          group_id: input.groupId
        });
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add contact to group'
        });
      }

      return data || [];
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
          message: 'Failed to remove contact from group'
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

      // First, verify the group exists and belongs to the user
      const { data: group, error: groupError } = await ctx.supabaseUser
        .from('groups')
        .select('id')
        .eq('id', input.groupId)
        .single();

      if (groupError || !group) {
        console.error('Error verifying group:', groupError);
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Group not found'
        });
      }

      // Get all contacts in the group via the junction table
      const { data, error } = await ctx.supabaseUser
        .from('group_members')
        .select(`
          contact_id,
          contacts:contact_id (*)
        `)
        .eq('group_id', input.groupId);

      if (error) {
        console.error('Error fetching contacts in group:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch contacts in group'
        });
      }

      // Extract the contact data from the joined query
      return data?.map((item: { contacts: Record<string, unknown> }) => item.contacts) || [];
    }),
});
