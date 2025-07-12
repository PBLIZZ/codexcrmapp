'use client';

import { Tag, Plus, X, Loader2 } from 'lucide-react';
import { useState, useContext, createContext, ReactNode } from 'react';

import {
  Alert,
  AlertDescription,
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
} from '@codexcrm/ui';
import { api } from '@/lib/trpc';

// Define the Group type
interface Group {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
}

interface ContactGroupManagerProps {
  contactId: string;
  contactName: string;
  // Use pre-loaded groups when available
  preloadedGroups?: Group[];
}

// Create a context to share groups data across components
interface GroupsContextType {
  allGroups: Group[] | undefined;
  isLoading: boolean;
  refetch: () => void;
}

const GroupsContext = createContext<GroupsContextType>({
  allGroups: undefined,
  isLoading: false,
  refetch: () => {},
});

// Provider component for groups data
export function GroupsProvider({ children }: { children: ReactNode }) {
  // Only fetch groups once for the entire contacts list
  const {
    data: allGroups,
    isLoading,
    refetch,
  } = api.groups.list.useQuery(undefined, {
    staleTime: 30000, // Cache for 30 seconds
    refetchOnWindowFocus: false, // Don't refetch on window focus for performance
  });

  return (
    <GroupsContext.Provider value={{ allGroups, isLoading, refetch }}>
      {children}
    </GroupsContext.Provider>
  );
}

// Hook to use the groups context
export function useGroups() {
  return useContext(GroupsContext);
}

export function ContactGroupManager({
  contactId,
  contactName,
  preloadedGroups,
}: ContactGroupManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [removingGroupId, setRemovingGroupId] = useState<string | null>(null);

  // Use the shared groups context if available
  const groupsContext = useGroups();

  const utils = api.useUtils();

  // Get all groups for this contact - but ONLY when the dialog is open to avoid excessive API calls
  const { data: contactGroups, isLoading: isLoadingContactGroups } =
    api.groups.getGroupsForContact.useQuery(
      { contactId },
      {
        enabled: !!contactId && isDialogOpen, // Only fetch when dialog is open
        onError: (err) => setQueryError(`Failed to load contact groups: ${err.message}`),
        staleTime: 30000, // Cache for 30 seconds
      }
    );

  // Use groups from context if available, otherwise fetch them (but only when dialog is open)
  const { data: localGroups, isLoading: isLoadingLocalGroups } = api.groups.list.useQuery(
    undefined,
    {
      enabled: isDialogOpen && !groupsContext.allGroups, // Only fetch when dialog is open and context doesn't have data
      staleTime: 30000, // Cache for 30 seconds
      onError: (err) => setQueryError(`Failed to load all groups: ${err.message}`),
    }
  );

  // Use groups from context, or local query, or preloaded groups
  const allGroups = groupsContext.allGroups || localGroups || preloadedGroups;
  const isLoadingAllGroups = groupsContext.isLoading || isLoadingLocalGroups;

  // Mutation to add contact to group
  const addToGroupMutation = api.groups.addContact.useMutation({
    onSuccess: () => {
      // Invalidate queries to refresh data after mutations
      utils.groups.getGroupsForContact.invalidate({ contactId });
      utils.contacts.list.invalidate(); // Refresh contacts list to show updated groups
      utils.groups.list.invalidate(); // Refresh all groups data
      setIsDialogOpen(false);
      setSelectedGroupId('');
      setError(null);
      setQueryError(null);
      // Refresh the context data
      if (groupsContext) groupsContext.refetch();
    },
    onError: (error) => {
      setError(`Failed to add to group: ${error.message}`);
    },
  });

  // Mutation to remove contact from group
  const removeFromGroupMutation = api.groups.removeContact.useMutation({
    onSuccess: () => {
      // Invalidate queries to refresh data after mutations
      utils.groups.getGroupsForContact.invalidate({ contactId });
      utils.contacts.list.invalidate(); // Refresh contacts list to show updated groups
      utils.groups.list.invalidate(); // Refresh all groups data
      setError(null);
      setQueryError(null);
      setRemovingGroupId(null); // Clear ID on success
      // Refresh the context data
      if (groupsContext) groupsContext.refetch();
    },
    onError: (error) => {
      setError(`Failed to remove from group: ${error.message}`);
      setRemovingGroupId(null); // Clear ID on error
    },
  });

  // Filter out groups the contact is already in to prevent duplicate assignments
  const availableGroups = allGroups?.filter(
    (group: Group) => !contactGroups?.some((cg: Group) => cg.id === group.id)
  );

  const handleAddToGroup = () => {
    if (!selectedGroupId) {
      setError('Please select a group');
      return;
    }

    addToGroupMutation.mutate({
      contactId,
      groupId: selectedGroupId,
    });
  };

  const handleRemoveFromGroup = (groupId: string) => {
    setRemovingGroupId(groupId); // Set ID before mutation
    removeFromGroupMutation.mutate({
      contactId,
      groupId,
    });
  };

  // Combine error states for display
  const displayError = error || queryError;

  return (
    <div className='flex flex-wrap gap-1 items-center'>
      {/* Display any errors */}
      {displayError && (
        <Alert variant='destructive' className='w-full mb-2'>
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      {/* Show current groups as badges */}
      {contactGroups?.map((group: Group) => (
        <Badge
          key={group.id}
          variant='secondary'
          className={`flex items-center gap-1 text-xs px-2 py-1 ${group.color ? '' : 'bg-gray-100'}`}
          style={{
            backgroundColor: group.color ? `${group.color}20` : undefined,
            borderColor: group.color || undefined,
          }}
        >
          <Tag className='h-3 w-3' />
          {group.name}
          <button
            onClick={() => handleRemoveFromGroup(group.id)}
            className='ml-1 hover:bg-red-100 rounded-full p-0.5'
            disabled={removingGroupId === group.id}
          >
            {removingGroupId === group.id ? (
              <Loader2 className='h-3 w-3 animate-spin' />
            ) : (
              <X className='h-3 w-3' />
            )}
          </button>
        </Badge>
      ))}

      {/* Add to group button */}
      <Button
        variant='outline'
        size='sm'
        onClick={() => setIsDialogOpen(true)}
        className='h-6 px-2 text-xs'
        disabled={isLoadingAllGroups || !availableGroups?.length}
      >
        <Plus className='h-3 w-3 mr-1' />
        {contactGroups?.length ? 'Add' : 'Assign Group'}
      </Button>

      {/* Loading indicator for initial data load */}
      {isLoadingContactGroups && !contactGroups && (
        <span className='text-xs text-muted-foreground ml-2 flex items-center'>
          <Loader2 className='h-3 w-3 mr-1 animate-spin' />
          Loading groups...
        </span>
      )}

      {/* Add to group dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            // Clear state when dialog closes
            setSelectedGroupId('');
            setError(null);
          }
        }}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Tag className='h-5 w-5' />
              Add {contactName} to Group
            </DialogTitle>
            <DialogDescription>Select a group to add this contact to.</DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            {error && (
              <Alert variant='destructive'>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className='space-y-2'>
              <label className='text-sm font-medium'>Select Group</label>
              <Select
                value={selectedGroupId}
                onValueChange={setSelectedGroupId}
                disabled={isLoadingAllGroups || !availableGroups?.length}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isLoadingAllGroups
                        ? 'Loading groups...'
                        : !availableGroups?.length
                          ? 'No groups available'
                          : 'Select a group'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableGroups?.map((group: Group) => (
                    <SelectItem key={group.id} value={group.id}>
                      <div className='flex items-center gap-2'>
                        {/* Use Tailwind classes for background color when possible */}
                        <div
                          className={`w-3 h-3 rounded-full ${!group.color ? 'bg-gray-500' : ''}`}
                          style={group.color ? { backgroundColor: group.color } : undefined}
                        />
                        {group.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsDialogOpen(false);
                setSelectedGroupId('');
                setError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddToGroup}
              disabled={!selectedGroupId || addToGroupMutation.isLoading}
            >
              {addToGroupMutation.isLoading ? (
                <>
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                  Adding...
                </>
              ) : (
                'Add to Group'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
