'use client';

import { Table } from '@tanstack/react-table';
import {
  Button,
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  Badge,
  Separator,
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
  toast,
} from '@codexcrm/ui';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/trpc';
import { useState } from 'react';

import {
  Search,
  SlidersHorizontal,
  X,
  Plus,
  UserPlus,
  Trash2,
  Tag,
  Users,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { ContactWithGroups } from './columns';

interface TableToolbarProps {
  table: Table<ContactWithGroups>;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  activeTagFilter?: string;
  activeGroupFilter?: string;
  onClearTagFilter?: () => void;
  onClearGroupFilter?: () => void;
}

export function TableToolbar({
  table,
  globalFilter,
  onGlobalFilterChange,
  activeTagFilter,
  activeGroupFilter,
  onClearTagFilter,
  onClearGroupFilter,
}: TableToolbarProps) {
  const router = useRouter();
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelection = selectedRows.length > 0;

  // State for modals
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  // tRPC hooks
  const utils = api.useUtils();
  const { data: groups } = api.groups.list.useQuery();
  const { data: allTags } = api.contacts.getAllTags.useQuery();

  const bulkAddTagsMutation = api.contacts.bulkAddTags.useMutation({
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: `Added tags to ${data.updatedCount} contacts`,
        variant: 'default',
      });
      utils.contacts.list.invalidate();
      setIsTagModalOpen(false);
      setNewTagInput('');
      table.resetRowSelection();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add tags: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const bulkAddToGroupMutation = api.groups.bulkAddContacts.useMutation({
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: `Added ${data.addedCount} contacts to group`,
        variant: 'default',
      });
      if (data.skippedCount > 0) {
        toast({
          title: 'Info',
          description: `${data.skippedCount} contacts were already in the group`,
          variant: 'default',
        });
      }
      utils.contacts.list.invalidate();
      utils.groups.list.invalidate();
      setIsGroupModalOpen(false);
      setSelectedGroupId('');
      table.resetRowSelection();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add contacts to group: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const bulkDeleteMutation = api.contacts.bulkDelete.useMutation({
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: `Deleted ${data.deletedCount} contacts`,
        variant: 'default',
      });
      utils.contacts.list.invalidate();
      setIsDeleteModalOpen(false);
      table.resetRowSelection();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete contacts: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleBulkAddTag = () => {
    setIsTagModalOpen(true);
  };

  const handleBulkAddToGroup = () => {
    setIsGroupModalOpen(true);
  };

  const handleBulkDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmAddTags = () => {
    if (!newTagInput.trim()) return;

    const tags = newTagInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    const contactIds = selectedRows.map((row) => row.original.id);

    bulkAddTagsMutation.mutate({ contactIds, tags });
  };

  const confirmAddToGroup = () => {
    if (!selectedGroupId) return;

    const contactIds = selectedRows.map((row) => row.original.id);
    bulkAddToGroupMutation.mutate({ groupId: selectedGroupId, contactIds });
  };

  const confirmDelete = () => {
    const contactIds = selectedRows.map((row) => row.original.id);
    bulkDeleteMutation.mutate({ contactIds });
  };

  return (
    <div className='space-y-4'>
      {/* Search and Column Visibility */}
      <div className='flex items-center justify-between p-2 rounded-md bg-teal-50/80 shadow-sm border border-teal-700/30'>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <Search className='absolute left-3 top-2.5 h-4 w-4 text-slate-500' />
            <Input
              placeholder='Search contacts...'
              value={globalFilter ?? ''}
              onChange={(event) => onGlobalFilterChange(String(event.target.value))}
              className='pl-9 w-[280px] border-teal-700/30 focus:border-teal-500 focus:ring-teal-500/30 bg-white rounded-md'
            />
          </div>

          {/* Active Filters */}
          <div className='flex gap-2'>
            {activeTagFilter && (
              <Badge
                variant='outline'
                className='flex items-center gap-1 bg-teal-100 text-teal-800 hover:bg-teal-200 border-teal-200'
              >
                <Tag className='h-3 w-3 mr-1' /> {activeTagFilter}
                <button
                  className='ml-1 rounded-full hover:bg-teal-200/80 p-0.5'
                  onClick={onClearTagFilter}
                >
                  <X className='h-3 w-3' />
                </button>
              </Badge>
            )}

            {activeGroupFilter && (
              <Badge
                variant='outline'
                className='flex items-center gap-1 bg-sky-100 text-sky-800 hover:bg-sky-200 border-sky-200'
              >
                <Users className='h-3 w-3 mr-1' /> Group Filter
                <button
                  className='ml-1 rounded-full hover:bg-sky-200/80 p-0.5'
                  onClick={onClearGroupFilter}
                >
                  <X className='h-3 w-3' />
                </button>
              </Badge>
            )}
          </div>
        </div>

        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='bg-white border-teal-700/30 hover:bg-teal-50 hover:text-teal-700 shadow-sm rounded-md'
            onClick={() => router.push('/contacts/new')}
          >
            <Plus className='mr-2 h-4 w-4' />
            New Contact
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className='bg-white border-teal-700/30 shadow-sm rounded-md'
              >
                <SlidersHorizontal className='mr-2 h-4 w-4' />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='border-teal-700/30 bg-white shadow-md p-1 rounded-md'
            >
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator className='bg-teal-100/60' />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id.replace(/_/g, ' ')}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {hasSelection && (
        <div className='flex items-center justify-between p-3 bg-teal-50 border border-teal-700/30 rounded-lg shadow-md'>
          <div className='flex items-center gap-2'>
            <CheckCircle2 className='h-5 w-5 text-teal-600' />
            <div className='font-medium text-teal-800'>
              <span className='font-semibold'>{selectedRows.length}</span> contact
              {selectedRows.length === 1 ? '' : 's'} selected
            </div>
            <Badge
              variant='outline'
              className='ml-1.5 bg-teal-50 border border-teal-700/30 text-teal-700 hover:bg-teal-100 shadow-sm rounded-md'
            >
              {Math.round((selectedRows.length / table.getFilteredRowModel().rows.length) * 100)}%
            </Badge>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='bg-white border-teal-700/30 text-teal-700 hover:bg-teal-50 hover:text-teal-800 shadow-sm rounded-md'
              onClick={handleBulkAddTag}
            >
              <Tag className='mr-1.5 h-4 w-4' />
              Add Tag
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='bg-white border-teal-700/30 text-teal-700 hover:bg-teal-50 hover:text-teal-800 shadow-sm rounded-md'
              onClick={handleBulkAddToGroup}
            >
              <UserPlus className='mr-1.5 h-4 w-4' />
              Add to Group
            </Button>
            <Separator orientation='vertical' className='h-6 bg-teal-200' />
            <Button
              variant='outline'
              size='sm'
              className='bg-white border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 shadow-sm rounded-md'
              onClick={handleBulkDelete}
            >
              <Trash2 className='mr-1.5 h-4 w-4' />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Tag Assignment Modal */}
      <Dialog open={isTagModalOpen} onOpenChange={setIsTagModalOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Add Tags to Contacts</DialogTitle>
            <DialogDescription>
              Add tags to {selectedRows.length} selected contact
              {selectedRows.length === 1 ? '' : 's'}. Separate multiple tags with commas.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium'>Tags</label>
              <Input
                placeholder='Enter tags separated by commas (e.g., client, vip, follow-up)'
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                className='mt-1'
              />
            </div>
            {allTags && allTags.length > 0 && (
              <div>
                <label className='text-sm font-medium text-slate-600'>Existing tags:</label>
                <div className='flex flex-wrap gap-1 mt-2'>
                  {allTags.slice(0, 10).map((tag) => (
                    <Badge
                      key={tag}
                      variant='outline'
                      className='cursor-pointer hover:bg-teal-50 text-xs'
                      onClick={() => {
                        const currentTags = newTagInput
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean);
                        if (!currentTags.includes(tag)) {
                          setNewTagInput(currentTags.length > 0 ? `${newTagInput}, ${tag}` : tag);
                        }
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {allTags.length > 10 && (
                    <Badge variant='outline' className='text-xs'>
                      +{allTags.length - 10} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsTagModalOpen(false);
                setNewTagInput('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAddTags}
              disabled={!newTagInput.trim() || bulkAddTagsMutation.isPending}
            >
              {bulkAddTagsMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Add Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Group Assignment Modal */}
      <Dialog open={isGroupModalOpen} onOpenChange={setIsGroupModalOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Add Contacts to Group</DialogTitle>
            <DialogDescription>
              Add {selectedRows.length} selected contact{selectedRows.length === 1 ? '' : 's'} to a
              group.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <label className='text-sm font-medium'>Select Group</label>
              <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                <SelectTrigger className='mt-1'>
                  <SelectValue placeholder='Choose a group' />
                </SelectTrigger>
                <SelectContent>
                  {groups && groups.length > 0 ? (
                    groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        <div className='flex items-center gap-2'>
                          {group.emoji && <span>{group.emoji}</span>}
                          <span>{group.name}</span>
                          <Badge variant='outline' className='ml-auto text-xs'>
                            {group.contactCount || 0}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value='no-groups' disabled>
                      No groups available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            {groups && groups.length === 0 && (
              <div className='text-center py-4'>
                <p className='text-sm text-slate-500 mb-2'>No groups found</p>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setIsGroupModalOpen(false);
                    router.push('/contacts/groups/new');
                  }}
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Create Group
                </Button>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsGroupModalOpen(false);
                setSelectedGroupId('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAddToGroup}
              disabled={!selectedGroupId || bulkAddToGroupMutation.isPending}
            >
              {bulkAddToGroupMutation.isPending && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Add to Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Delete Contacts</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedRows.length} selected contact
              {selectedRows.length === 1 ? '' : 's'}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className='bg-red-50 border border-red-200 rounded-md p-3 mt-4'>
            <div className='flex items-start gap-2'>
              <Trash2 className='h-4 w-4 text-red-600 mt-0.5' />
              <div className='text-sm text-red-800'>
                <p className='font-medium'>This will permanently delete:</p>
                <ul className='mt-1 list-disc list-inside'>
                  <li>
                    {selectedRows.length} contact{selectedRows.length === 1 ? '' : 's'}
                  </li>
                  <li>All associated data and relationships</li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={confirmDelete}
              disabled={bulkDeleteMutation.isPending}
            >
              {bulkDeleteMutation.isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Delete Contacts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
