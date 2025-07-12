'use client';

import { Tag, Plus, X } from 'lucide-react';
import { useState, useMemo } from 'react';

import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from '@codexcrm/ui';
import { api } from '@/lib/trpc';
import { cn } from '@/lib/utils';

interface Group {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
}

/**
 * Maps color hex values to Tailwind CSS classes
 * This approach avoids inline styles by using Tailwind's utility classes
 *
 * @param color - Hex color value from the group object
 * @returns Object with appropriate Tailwind classes for border, background, and dot colors
 */
function getColorClasses(color: string | null | undefined): {
  border: string;
  bg: string;
  dot: string;
} {
  // Define a lookup map for color hex values to Tailwind classes
  // This is more maintainable than a switch statement if the list grows
  const COLOR_MAP: Record<string, { border: string; bg: string; dot: string }> = {
    '#EF4444': { border: 'border-red-500', bg: 'bg-red-50', dot: 'bg-red-500' }, // Red
    '#10B981': { border: 'border-green-500', bg: 'bg-green-50', dot: 'bg-green-500' }, // Green
    '#F59E0B': { border: 'border-amber-500', bg: 'bg-amber-50', dot: 'bg-amber-500' }, // Amber
    '#8B5CF6': { border: 'border-purple-500', bg: 'bg-purple-50', dot: 'bg-purple-500' }, // Purple
    '#EC4899': { border: 'border-pink-500', bg: 'bg-pink-50', dot: 'bg-pink-500' }, // Pink
    '#06B6D4': { border: 'border-cyan-500', bg: 'bg-cyan-50', dot: 'bg-cyan-500' }, // Cyan
  };

  // Default to blue if no color provided or color not in map
  const defaultClasses = { border: 'border-blue-500', bg: 'bg-blue-50', dot: 'bg-blue-500' };
  if (!color) return defaultClasses;
  return COLOR_MAP[color] || defaultClasses;
}

export function ContactGroupsSection({ contactId }: { contactId: string }) {
  const [isAddGroupDialogOpen, setIsAddGroupDialogOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [removingGroupId, setRemovingGroupId] = useState<string | null>(null);

  const utils = api.useUtils();

  // Get all groups for this contact
  const {
    data: contactGroups,
    isLoading: isLoadingContactGroups,
    error: contactGroupsError,
  } = api.groups.getGroupsForContact.useQuery({ contactId }, { enabled: !!contactId });

  // Get all available groups for the dropdown
  const {
    data: allGroups,
    isLoading: isLoadingAllGroups,
    error: allGroupsError,
  } = api.groups.list.useQuery();

  // Mutation to add contact to group
  const addToGroupMutation = api.groups.addContact.useMutation({
    onSuccess: () => {
      utils.groups.getGroupsForContact.invalidate({ contactId });
      setIsAddGroupDialogOpen(false);
      setSelectedGroupId('');
      // Success message would go here if we had a toast component
    },
    onError: (error) => {
      console.error('Add to group error:', error);
      // Error is now handled via addToGroupMutation.error in the UI
    },
  });

  // Mutation to remove contact from group
  const removeFromGroupMutation = api.groups.removeContact.useMutation({
    onMutate: ({ groupId }) => {
      // Track which group is being removed to show loading state only for that button
      setRemovingGroupId(groupId);
    },
    onSuccess: () => {
      utils.groups.getGroupsForContact.invalidate({ contactId });
      // Success message would go here if we had a toast component
    },
    onError: (error) => {
      console.error('Remove from group error:', error);
      // Error feedback is handled in the UI
    },
    onSettled: () => {
      // Reset the removing state regardless of success or failure
      setRemovingGroupId(null);
    },
  });

  // Handle dialog open/close with proper state reset
  const handleDialogOpenChange = (open: boolean) => {
    setIsAddGroupDialogOpen(open);
    if (!open) {
      setSelectedGroupId('');
      // Reset mutation state when closing dialog
      addToGroupMutation.reset();
    }
  };

  // Filter out groups the contact is already in (memoized to prevent recalculation)
  const availableGroups = useMemo(() => {
    if (!allGroups || !contactGroups) return [];

    return allGroups.filter(
      (group: Group) => !contactGroups.some((cg: Group) => cg.id === group.id)
    );
  }, [allGroups, contactGroups]);

  const handleAddToGroup = () => {
    if (!selectedGroupId) return;

    addToGroupMutation.mutate({
      contactId,
      groupId: selectedGroupId,
    });
  };

  const handleRemoveFromGroup = (groupId: string) => {
    removeFromGroupMutation.mutate({
      contactId,
      groupId,
    });
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h3 className='text-lg font-medium'>Groups</h3>
        <Button
          variant='outline'
          size='sm'
          onClick={() => handleDialogOpenChange(true)}
          disabled={isLoadingAllGroups || availableGroups.length === 0}
        >
          <Plus className='h-4 w-4 mr-2' />
          Add to Group
        </Button>
      </div>
      <Separator className='my-4' />

      {/* Handle loading, error, and data states properly */}
      {isLoadingContactGroups ? (
        <div className='flex justify-center py-4'>
          <div className='flex items-center gap-2'>
            <div className='h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent'></div>
            <p className='text-sm text-gray-500'>Loading groups...</p>
          </div>
        </div>
      ) : contactGroupsError ? (
        <div className='py-4 text-center'>
          <p className='text-sm text-red-600'>
            Failed to load contact groups: {contactGroupsError.message}
          </p>
        </div>
      ) : contactGroups && contactGroups.length > 0 ? (
        <div className='flex flex-wrap gap-2 py-2'>
          {contactGroups.map((group: Group) => {
            const colorClasses = getColorClasses(group.color);
            return (
              <Badge
                key={group.id}
                variant='outline'
                className={cn(
                  'flex items-center gap-1 py-1.5 px-3',
                  colorClasses.border,
                  colorClasses.bg
                )}
              >
                <Tag className='h-3 w-3 mr-1' />
                {group.name}
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-4 w-4 ml-1 p-0 hover:bg-transparent'
                  onClick={() => handleRemoveFromGroup(group.id)}
                  disabled={removeFromGroupMutation.isLoading && removingGroupId === group.id}
                >
                  {removeFromGroupMutation.isLoading && removingGroupId === group.id ? (
                    <div className='h-3 w-3 animate-spin rounded-full border border-gray-300 border-t-transparent'></div>
                  ) : (
                    <X className='h-3 w-3' />
                  )}
                </Button>
              </Badge>
            );
          })}
        </div>
      ) : (
        <div className='py-4 text-center'>
          <p className='text-sm text-gray-500'>Not a member of any groups yet.</p>
        </div>
      )}

      {/* Add to Group Dialog */}
      <Dialog open={isAddGroupDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Add to Group</DialogTitle>
            <DialogDescription>Select a group to add this contact to.</DialogDescription>
          </DialogHeader>

          {/* Display errors from queries or mutations */}
          {allGroupsError && (
            <p className='text-sm text-red-600 mt-2'>
              Failed to load groups: {allGroupsError.message}
            </p>
          )}
          {addToGroupMutation.error && (
            <p className='text-sm text-red-600 mt-2'>{addToGroupMutation.error.message}</p>
          )}

          <div className='py-4'>
            <Select
              value={selectedGroupId}
              onValueChange={setSelectedGroupId}
              disabled={isLoadingAllGroups || addToGroupMutation.isLoading}
            >
              <SelectTrigger>
                {isLoadingAllGroups ? (
                  <div className='flex items-center gap-2'>
                    <div className='h-3 w-3 animate-spin rounded-full border border-gray-300 border-t-transparent'></div>
                    <span className='text-gray-400'>Loading groups...</span>
                  </div>
                ) : (
                  <SelectValue placeholder='Select a group' />
                )}
              </SelectTrigger>
              <SelectContent>
                {availableGroups.length === 0 ? (
                  <SelectItem value='no-groups' disabled>
                    {allGroupsError ? 'Error loading groups' : 'No available groups'}
                  </SelectItem>
                ) : (
                  availableGroups.map((group) => {
                    const colorClasses = getColorClasses(group.color);
                    return (
                      <SelectItem key={group.id} value={group.id}>
                        <div className='flex items-center'>
                          <div className={cn('h-3 w-3 rounded-full mr-2', colorClasses.dot)} />
                          {group.name}
                        </div>
                      </SelectItem>
                    );
                  })
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant='secondary' onClick={() => handleDialogOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddToGroup}
              disabled={isLoadingAllGroups || !selectedGroupId || addToGroupMutation.isLoading}
            >
              {addToGroupMutation.isLoading ? 'Adding...' : 'Add to Group'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
