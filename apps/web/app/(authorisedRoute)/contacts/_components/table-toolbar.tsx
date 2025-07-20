'use client';

import { Table } from '@tanstack/react-table';
import { Button } from '@codexcrm/ui';
import { Input } from '@codexcrm/ui';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@codexcrm/ui';
import { Search, SlidersHorizontal, X, Plus, UserPlus, Trash2 } from 'lucide-react';
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
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelection = selectedRows.length > 0;

  const handleBulkAddTag = () => {
    console.log(
      'Bulk add tag to:',
      selectedRows.map((row) => row.original.id)
    );
  };

  const handleBulkAddToGroup = () => {
    console.log(
      'Bulk add to group:',
      selectedRows.map((row) => row.original.id)
    );
  };

  const handleBulkDelete = () => {
    console.log(
      'Bulk delete:',
      selectedRows.map((row) => row.original.id)
    );
  };

  return (
    <div className='space-y-4'>
      {/* Search and Column Visibility */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <div className='relative'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search contacts...'
              value={globalFilter ?? ''}
              onChange={(event) => onGlobalFilterChange(String(event.target.value))}
              className='pl-8 w-[300px]'
            />
          </div>

          {/* Active Filters */}
          {activeTagFilter && (
            <div className='flex items-center gap-1 px-2 py-1 bg-accent rounded-md text-sm'>
              Tag: {activeTagFilter}
              <Button variant='ghost' size='sm' className='h-4 w-4 p-0' onClick={onClearTagFilter}>
                <X className='h-3 w-3' />
              </Button>
            </div>
          )}

          {activeGroupFilter && (
            <div className='flex items-center gap-1 px-2 py-1 bg-accent rounded-md text-sm'>
              Group Filter Active
              <Button
                variant='ghost'
                size='sm'
                className='h-4 w-4 p-0'
                onClick={onClearGroupFilter}
              >
                <X className='h-3 w-3' />
              </Button>
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm'>
              <SlidersHorizontal className='mr-2 h-4 w-4' />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-[200px]'>
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

      {/* Bulk Actions Bar */}
      {hasSelection && (
        <div className='flex items-center justify-between p-3 bg-accent rounded-lg'>
          <div className='text-sm font-medium'>
            {selectedRows.length} contact{selectedRows.length === 1 ? '' : 's'} selected
          </div>
          <div className='flex items-center space-x-2'>
            <Button variant='outline' size='sm' onClick={handleBulkAddTag}>
              <Plus className='mr-2 h-4 w-4' />
              Add Tag
            </Button>
            <Button variant='outline' size='sm' onClick={handleBulkAddToGroup}>
              <UserPlus className='mr-2 h-4 w-4' />
              Add to Group
            </Button>
            <Button variant='destructive' size='sm' onClick={handleBulkDelete}>
              <Trash2 className='mr-2 h-4 w-4' />
              Delete Selected
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
