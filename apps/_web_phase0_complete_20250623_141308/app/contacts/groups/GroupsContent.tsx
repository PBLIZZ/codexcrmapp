'use client';

import { useQueryClient } from '@tanstack/react-query'; // For cache invalidation directly
import {
  Trash2,
  Loader2,
  AlertCircle,
  Users,
  Folder,
  UserPlus,
  Edit,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner'; // For notifications

import { BulkContactSelector } from '@/components/groups/BulkContactSelector';
import { GroupCreateDialog } from '@/components/groups/GroupCreateDialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { api } from '@/lib/trpc';

// --- Interface for Group Data (matching what `api.groups.list` returns) ---
interface Group {
  id: string;
  name: string;
  description?: string | null;
  emoji?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  contactCount?: number;
}

export function GroupsContent() {
  // Group state management is now handled by GroupCreateDialog component

  const [isContactSelectorOpen, setIsContactSelectorOpen] = useState(false);
  const [selectedGroupForContacts, setSelectedGroupForContacts] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const queryClient = useQueryClient(); // For direct cache invalidation
  const router = useRouter();

  // --- tRPC Queries and Mutations ---
  const groupsQuery = api.groups.list.useQuery(undefined, {
    // staleTime: 5 * 60 * 1000, // 5 minutes
  });
  const groups = (groupsQuery.data as Group[]) ?? [];
  const isLoadingGroups = groupsQuery.isLoading;
  const groupsQueryError = groupsQuery.error;

  const deleteGroupMutation = api.groups.delete.useMutation({
    onSuccess: (_data) => {
      // Renamed data to _data
      toast.success('Group deleted successfully!');
      void queryClient.invalidateQueries({ queryKey: [['groups', 'list']] });
    },
    onError: (error) => {
      toast.error('Failed to delete group', { description: error.message });
    },
  });

  // --- Event Handlers ---
  // Edit group dialog handling is now managed by the GroupCreateDialog component

  const handleDeleteGroup = (groupId: string, groupName: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete the group "${groupName}"? This action cannot be undone.`
      )
    ) {
      deleteGroupMutation.mutate({ groupId });
    }
  };

  const handleOpenManageContactsDialog = (
    groupId: string,
    groupName: string
  ) => {
    setSelectedGroupForContacts({ id: groupId, name: groupName });
    setIsContactSelectorOpen(true);
  };

  // Effect to handle any necessary cleanup
  // (Form reset logic has been moved to GroupCreateForm component)

  // --- Render Logic ---
  if (isLoadingGroups) {
    return (
      <div className="p-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" /> Loading groups...
      </div>
    );
  }

  if (groupsQueryError) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Groups</AlertTitle>
        <AlertDescription>{groupsQueryError.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Folder className="h-7 w-7 text-purple-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Manage Groups
          </h1>
        </div>
        <GroupCreateDialog
          triggerButtonLabel="Create New Group"
          triggerButtonClassName="bg-purple-500 hover:bg-purple-600 text-white"
        />
      </div>

      {/* Groups Grid */}
      {groups.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
          <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">
            No groups yet!
          </h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first group.
          </p>
          <GroupCreateDialog
            triggerButtonLabel="Create Group"
            triggerButtonClassName="bg-purple-500 hover:bg-purple-600 text-white"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group: Group) => (
            <Card
              key={group.id}
              className="flex flex-col hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/contacts?group=${group.id}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="text-2xl">{group.emoji ?? '📁'}</span>
                    <span>{group.name}</span>
                  </CardTitle>
                  <Badge variant="secondary">
                    {group.contactCount ?? 0} Contacts
                  </Badge>
                </div>
                {group.description && (
                  <CardDescription className="mt-1 text-sm text-gray-600 h-10 overflow-hidden text-ellipsis">
                    {group.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                {/* Can add more details or a preview here if needed */}
              </CardContent>
              <CardFooter className="border-t pt-3 px-4 pb-4">
                <div className="flex flex-col gap-2 w-full">
                  {/* Add Contacts button - full width on mobile */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click
                      handleOpenManageContactsDialog(group.id, group.name);
                    }}
                    className="w-full justify-center"
                  >
                    <UserPlus className="mr-1.5 h-3.5 w-3.5" /> Add Lovely
                    Contacts
                  </Button>

                  {/* Edit and Delete buttons - side by side on all screens */}
                  <div className="flex gap-2 w-full">
                    <GroupCreateDialog
                      triggerButtonLabel="Edit"
                      triggerButtonVariant="outline"
                      triggerButtonClassName="flex-1 justify-center"
                      group={group}
                      isEditMode={true}
                      customTrigger={
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => e.stopPropagation()} // Prevent card click
                          className="flex-1 justify-center"
                        >
                          <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
                        </Button>
                      }
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleDeleteGroup(group.id, group.name);
                      }}
                      disabled={
                        deleteGroupMutation.isPending &&
                        deleteGroupMutation.variables?.groupId === group.id
                      }
                      className="flex-1 justify-center"
                    >
                      {deleteGroupMutation.isPending &&
                      deleteGroupMutation.variables?.groupId === group.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog for Create/Edit Group Form is now handled by the GroupCreateDialog component */}

      {/* Bulk Contact Selector Dialog */}
      {selectedGroupForContacts && (
        <BulkContactSelector
          groupId={selectedGroupForContacts.id}
          groupName={selectedGroupForContacts.name}
          isOpen={isContactSelectorOpen}
          onClose={() => {
            setIsContactSelectorOpen(false);
            setSelectedGroupForContacts(null);
          }}
        />
      )}
    </div>
  );
}
