'use client';

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";
import { ContactWithGroups } from '@/app/(authorisedRoute)/contacts/_components/columns';
import { Tables } from '@/lib/types';

export const useContacts = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async (): Promise<ContactWithGroups[]> => {
      // Fetch all contacts
      const { data: contacts, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (contactsError) {
        throw new Error(`Failed to fetch contacts: ${contactsError.message}`);
      }

      // Fetch all group memberships
      const { data: groupMemberships, error: membershipsError } = await supabase.from(
        'group_members'
      ).select(`
          contact_id,
          groups (
            id,
            name,
            emoji,
            color
          )
        `);

      if (membershipsError) {
        throw new Error(`Failed to fetch group memberships: ${membershipsError.message}`);
      }

      // Create a map of contact ID to groups
      const contactGroupsMap = new Map<string, Array<Tables<'groups'>>>();
      groupMemberships?.forEach((membership) => {
        const contactId = membership.contact_id;
        if (!contactGroupsMap.has(contactId)) {
          contactGroupsMap.set(contactId, []);
        }
        if (membership.groups) {
          contactGroupsMap.get(contactId)!.push(membership.groups);
        }
      });

      // Combine contacts with their groups
      const contactsWithGroups: ContactWithGroups[] =
        contacts?.map((contact) => ({
          ...contact,
          groups: contactGroupsMap.get(contact.id) || [],
        })) || [];

      return contactsWithGroups;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};