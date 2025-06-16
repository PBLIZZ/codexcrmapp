'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query'; // For cache invalidation directly
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Users,
  Folder,
  UserPlus,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner'; // For notifications
import * as z from 'zod';

import { BulkContactSelector } from '@/components/groups/BulkContactSelector';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger, // We will trigger dialog programmatically
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // If using for description
import { api } from '@/lib/trpc';

// --- Zod Schema for Form Validation (should match backend) ---
const groupFormSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(100, 'Name too long'),
  description: z
    .string()
    .max(500, 'Description too long')
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
type GroupFormData = z.infer<typeof groupFormSchema>;

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
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null); // Store full group object for editing

  const [isContactSelectorOpen, setIsContactSelectorOpen] = useState(false);
  const [selectedGroupForContacts, setSelectedGroupForContacts] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const queryClient = useQueryClient(); // For direct cache invalidation
  const router = useRouter();

  // --- React Hook Form ---
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting: isFormSubmittingRHF }, // isSubmitting from RHF
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: '',
      description: '',
      emoji: '👍',
    },
  });

  // --- tRPC Queries and Mutations ---
  const {
    data: groups = [],
    isLoading: isLoadingGroups,
    error: groupsQueryError,
    refetch: refetchGroups,
  } = api.groups.list.useQuery(undefined, {
    // staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const saveGroupMutation = api.groups.save.useMutation({
    onSuccess: (savedGroup) => {
      toast.success(editingGroup ? 'Group updated!' : 'Group created!', {
        description: `"${savedGroup.name}" has been saved.`,
      });
      queryClient.invalidateQueries({ queryKey: [['groups', 'list']] }); // Correct way to invalidate
      // refetchGroups(); // Alternatively, directly refetch
      setIsFormDialogOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to save group', {
        description: error.message,
      });
    },
  });

  const deleteGroupMutation = api.groups.delete.useMutation({
    onSuccess: (data) => {
      toast.success('Group deleted successfully!');
      queryClient.invalidateQueries({ queryKey: [['groups', 'list']] });
    },
    onError: (error) => {
      toast.error('Failed to delete group', { description: error.message });
    },
  });

  // --- Event Handlers ---
  const handleOpenNewGroupDialog = () => {
    setEditingGroup(null);
    reset({
      // Reset form to defaults
      name: '',
      description: '',
      emoji: '👍',
    });
    setIsFormDialogOpen(true);
  };

  const handleOpenEditGroupDialog = (group: Group) => {
    setEditingGroup(group);
    reset({
      // Populate form with existing group data
      name: group.name,
      description: group.description || '',
      emoji: group.emoji || '👍',
    });
    setIsFormDialogOpen(true);
  };

  const onFormSubmit: SubmitHandler<GroupFormData> = (formData) => {
    const payload = {
      ...formData,
      id: editingGroup?.id, // Add id if we are editing
    };
    saveGroupMutation.mutate(payload);
  };

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

  // --- Effect to reset form when dialog closes ---
  useEffect(() => {
    if (!isFormDialogOpen) {
      setEditingGroup(null);
      reset(); // Reset RHF state
    }
  }, [isFormDialogOpen, reset]);

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
        <Button
          onClick={handleOpenNewGroupDialog}
          className="bg-purple-500 hover:bg-purple-600 text-white"
        >
          <Plus className="mr-2 h-5 w-5" /> Create New Group
        </Button>
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
          <Button
            onClick={handleOpenNewGroupDialog}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Group
          </Button>
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
                    <span className="text-2xl">{group.emoji || '📁'}</span>
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
                    <UserPlus className="mr-1.5 h-3.5 w-3.5" /> Add Lovely Contacts
                  </Button>

                  {/* Edit and Delete buttons - side by side on all screens */}
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleOpenEditGroupDialog(group);
                      }}
                      className="flex-1 justify-center"
                    >
                      <Edit className="mr-1.5 h-3.5 w-3.5" /> Edit
                    </Button>
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

      {/* Dialog for Create/Edit Group Form */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              {editingGroup ? 'Edit Group' : 'Create New Group'}
            </DialogTitle>
            {editingGroup && (
              <DialogDescription>
                Update the details for the group: {editingGroup.name}
              </DialogDescription>
            )}
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="space-y-4 py-4"
          >
            {/* Top row: Emoji, Group Name, Color Picker */}
            <div className="flex gap-3 items-end">
              {/* Emoji Picker */}
              <div className="flex-shrink-0">
                <Label htmlFor="emoji" className="text-sm font-medium">
                  Emoji
                </Label>
                <Input
                  id="emoji"
                  {...register('emoji')}
                  placeholder="📁"
                  className="w-16 h-10 text-center text-lg mt-1"
                  maxLength={2}
                />
              </div>

              {/* Group Name */}
              <div className="flex-grow">
                <Label htmlFor="name" className="text-sm font-medium">
                  Group Name *
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Enter group name..."
                  className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Add a description for this group..."
                rows={3}
                className="mt-1 resize-none"
                maxLength={500}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormDialogOpen(false)}
                disabled={saveGroupMutation.isPending || isFormSubmittingRHF}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saveGroupMutation.isPending || isFormSubmittingRHF}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                {saveGroupMutation.isPending || isFormSubmittingRHF ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : editingGroup ? (
                  'Save Changes'
                ) : (
                  'Create Group'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
