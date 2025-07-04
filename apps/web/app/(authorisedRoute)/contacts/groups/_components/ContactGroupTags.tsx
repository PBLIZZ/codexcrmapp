'use client';

import { Tag } from 'lucide-react';
// Removed useState and useEffect as they're no longer needed

import { Badge } from '@codexcrm/ui/components/ui/badge';
import type { Tables } from '@codexcrm/database/types';
import { api } from '@/lib/trpc';

export function ContactGroupTags({ contactId }: { contactId: string }) {
  // Get isLoading and data directly from the hook
  // No need for separate state management
  const queryResult = api.groups.getGroupsForContact.useQuery(
    { contactId },
    {
      enabled: !!contactId,
      // Removed onSuccess and onError callbacks as they're not needed
      // for simply updating local state that duplicates the hook's state
    }
  );

  const contactGroups = queryResult.data as Tables<'groups'>[] | undefined;
  const isLoading = queryResult.isLoading;

  // Use the hook's isLoading state directly
  if (isLoading) {
    return (
      <div className='flex flex-wrap gap-1 mt-1'>
        <Badge variant='outline' className='bg-gray-100 animate-pulse w-16 h-5'></Badge>
      </div>
    );
  }

  // Use the hook's data directly with nullish coalescing and filter to handle undefined/null
  const groupsToDisplay = contactGroups?.filter((group) => group != null) ?? [];

  if (groupsToDisplay.length === 0) {
    return null;
  }

  // Only show up to 3 groups in the list view to save space
  const displayGroups = groupsToDisplay.slice(0, 3);
  const remainingCount = groupsToDisplay.length - 3;

  return (
    <div className='flex flex-wrap gap-1 mt-1'>
      {displayGroups.map((group: Tables<'groups'>) => (
        <Badge
          key={group.id}
          variant='outline'
          className='flex items-center gap-1 py-0.5 px-2 text-xs'
          style={{
            borderColor: group.color ?? '#3B82F6',
            backgroundColor: `${group.color ?? '#3B82F6'}20`, // 20% opacity
          }}
        >
          <Tag className='h-2.5 w-2.5' />
          {group.name}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant='outline' className='py-0.5 px-2 text-xs'>
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
}
