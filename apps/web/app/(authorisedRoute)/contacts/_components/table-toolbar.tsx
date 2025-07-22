'use client';

import { Table } from '@tanstack/react-table';
import { Button } from '@codexcrm/ui';
import { Input } from '@codexcrm/ui';
import { Badge } from '@codexcrm/ui';
import { Separator } from '@codexcrm/ui';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@codexcrm/ui';
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
    </div>
  );
}
