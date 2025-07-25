'use client';

import { Table } from '@tanstack/react-table';
import { Input, Button } from '@codexcrm/ui';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Badge,
  Separator,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  toast,
} from '@codexcrm/ui';
import { useState } from 'react';
import { Search, SlidersHorizontal, Tag, Trash2, Loader2, X, Users } from 'lucide-react';
import { api } from '@/lib/trpc/client';
import { type Contact } from '@codexcrm/db';

interface TableToolbarProps {
  table: Table<Contact>;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
}

// TableToolbar component provides search, filtering, column visibility, and bulk actions
// Uses CSS variables for dark mode compatibility and proper z-index for overlay components
export function TableToolbar({ table, globalFilter, onGlobalFilterChange }: TableToolbarProps) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelection = selectedRows.length > 0;

  // State for modals
  const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);
  const [isGroupPopoverOpen, setIsGroupPopoverOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [newGroupInput, setNewGroupInput] = useState('');

  // tRPC hooks
  const utils = api.useUtils();

  const bulkAddTagsMutation = api.contacts.bulkAddTags.useMutation({
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: `Added tags to ${data.updatedCount} contacts`,
        variant: 'default',
      });
      utils.contacts.list.invalidate();
      setIsTagPopoverOpen(false);
      setNewTagInput('');
      table.resetRowSelection();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add tags',
        variant: 'destructive',
      });
    },
  });

  const bulkAddGroupsMutation = api.contacts.bulkAddGroups.useMutation({
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: `Added groups to ${data.updatedCount} contacts`,
        variant: 'default',
      });
      utils.contacts.list.invalidate();
      setIsGroupPopoverOpen(false);
      setNewGroupInput('');
      table.resetRowSelection();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add groups',
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
        description: error.message || 'Failed to delete contacts',
        variant: 'destructive',
      });
    },
  });

  const handleBulkDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    const contactIds = selectedRows.map((row) => row.original.id);
    bulkDeleteMutation.mutate({ contactIds });
  };

  // Get active column filters for display
  const activeFilters = table.getState().columnFilters;

  return (
    <div className='space-y-4'>
      {/* Search and Column Visibility */}
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center space-x-2'>
          <div className='relative'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search contacts...'
              value={globalFilter ?? ''}
              onChange={(event) => onGlobalFilterChange(String(event.target.value))}
              className='pl-8 w-[300px] border-input shadow-sm rounded-md'
            />
          </div>
        </div>
        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className='text-foreground border-border'>
            <span className='text-sm text-muted-foreground'>Filters:</span>{' '}
            {activeFilters.map((filter) => (
              <Badge
                key={filter.id}
                variant='outline'
                className='text-xs bg-secondary border-border'
              >
                {filter.id}: {String(filter.value)}
                <button
                  onClick={() => {
                    const column = table.getColumn(filter.id);
                    column?.setFilterValue(undefined);
                  }}
                  className='ml-1 hover:bg-destructive/20 rounded-full'
                >
                  <X className='h-3 w-3' />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className='bg-background border-border shadow-sm rounded-md'
            >
              <SlidersHorizontal className='mr-2 h-4 w-4' />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='z-50 border-border bg-background shadow-md p-1 rounded-md'
          >
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator className='bg-border' />
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

      {/* Bulk Actions */}
      {hasSelection && (
        <div className='flex items-center justify-between p-3 bg-accent rounded-lg'>
          <div className='text-sm font-medium'>
            <Badge
              variant='outline'
              className='bg-secondary text-secondary-foreground border-border'
            >
              {selectedRows.length} selected
            </Badge>
          </div>
          <div className='flex items-center gap-2'>
            <Popover open={isTagPopoverOpen} onOpenChange={setIsTagPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={!hasSelection}
                  className='bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground shadow-sm rounded-md'
                >
                  <Tag className='mr-1.5 h-4 w-4' />
                  Add Tag
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-80 z-50 bg-background border shadow-md'>
                <div className='space-y-4'>
                  <div>
                    <h4 className='font-medium'>Add Tags to Contacts</h4>
                    <p className='text-sm text-muted-foreground'>
                      Add tags to {selectedRows.length} selected contact
                      {selectedRows.length === 1 ? '' : 's'}. Separate multiple tags with commas.
                    </p>
                  </div>
                  <Input
                    placeholder='Enter tags (comma-separated)'
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newTagInput.trim()) {
                          const tags = newTagInput
                            .split(',')
                            .map((tag) => tag.trim())
                            .filter(Boolean);
                          const contactIds = selectedRows.map((row) => row.original.id);
                          bulkAddTagsMutation.mutate({ contactIds, tags });
                        }
                      }
                    }}
                  />
                  <div className='flex justify-end space-x-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        setIsTagPopoverOpen(false);
                        setNewTagInput('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size='sm'
                      onClick={() => {
                        if (newTagInput.trim()) {
                          const tags = newTagInput
                            .split(',')
                            .map((tag) => tag.trim())
                            .filter(Boolean);
                          const contactIds = selectedRows.map((row) => row.original.id);
                          bulkAddTagsMutation.mutate({ contactIds, tags });
                        }
                      }}
                      disabled={!newTagInput.trim() || bulkAddTagsMutation.isPending}
                    >
                      {bulkAddTagsMutation.isPending ? 'Adding...' : 'Add Tags'}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Popover open={isGroupPopoverOpen} onOpenChange={setIsGroupPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={!hasSelection}
                  className='bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground shadow-sm rounded-md'
                >
                  <Users className='mr-1.5 h-4 w-4' />
                  Add Group
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-80 z-50 bg-background border shadow-md'>
                <div className='space-y-4'>
                  <div>
                    <h4 className='font-medium'>Add Groups to Contacts</h4>
                    <p className='text-sm text-muted-foreground'>
                      Add groups to {selectedRows.length} selected contact
                      {selectedRows.length === 1 ? '' : 's'}. Separate multiple groups with commas.
                    </p>
                  </div>
                  <Input
                    placeholder='Enter groups (comma-separated)'
                    value={newGroupInput}
                    onChange={(e) => setNewGroupInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newGroupInput.trim()) {
                          const groups = newGroupInput
                            .split(',')
                            .map((group) => group.trim())
                            .filter(Boolean);
                          const contactIds = selectedRows.map((row) => row.original.id);
                          bulkAddGroupsMutation.mutate({ contactIds, groups });
                        }
                      }
                    }}
                  />
                  <div className='flex justify-end space-x-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => {
                        setIsGroupPopoverOpen(false);
                        setNewGroupInput('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size='sm'
                      onClick={() => {
                        if (newGroupInput.trim()) {
                          const groups = newGroupInput
                            .split(',')
                            .map((group) => group.trim())
                            .filter(Boolean);
                          const contactIds = selectedRows.map((row) => row.original.id);
                          bulkAddGroupsMutation.mutate({ contactIds, groups });
                        }
                      }}
                      disabled={!newGroupInput.trim() || bulkAddGroupsMutation.isPending}
                    >
                      {bulkAddGroupsMutation.isPending ? 'Adding...' : 'Add Groups'}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Separator orientation='vertical' className='h-6 bg-border' />
            <Button
              variant='outline'
              size='sm'
              className='bg-background border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive shadow-sm rounded-md'
              onClick={handleBulkDelete}
            >
              <Trash2 className='mr-1.5 h-4 w-4' />
              Delete
            </Button>
          </div>
        </div>
      )}

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
