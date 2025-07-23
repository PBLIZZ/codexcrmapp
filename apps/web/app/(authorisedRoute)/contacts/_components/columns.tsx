'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@codexcrm/ui';
import { Contact, Group } from '@codexcrm/db';
import { MoreHorizontal, Eye, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { ContactAvatar } from './ContactAvatar';

// Using Prisma types directly from @codexcrm/db

export interface ContactWithGroups extends Contact {
  groups?: Pick<Group, 'id' | 'name' | 'emoji' | 'color'>[];
}

interface ColumnsProps {
  onTagFilter?: (tag: string) => void;
  onGroupFilter?: (groupId: string) => void;
}

export const createColumns = ({
  onTagFilter,
  onGroupFilter,
}: ColumnsProps = {}): ColumnDef<ContactWithGroups>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? 'indeterminate'
              : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'avatar',
    header: '',
    cell: ({ row }) => (
      <ContactAvatar
        profileImageUrl={row.original.profileImageUrl}
        fullName={row.original.fullName}
        size='sm'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='h-auto p-0 font-medium'
      >
        Full Name
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const name = row.getValue('fullName') as string;
      return <div className='font-medium'>{name}</div>;
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => {
      const email = row.getValue('email') as string;
      return <div className='text-muted-foreground'>{email}</div>;
    },
  },
  {
    accessorKey: 'source',
    header: 'Source',
    cell: ({ row }) => {
      const source = row.getValue('source') as string | null;
      return source ? (
        <Badge variant='outline'>{source}</Badge>
      ) : (
        <span className='text-muted-foreground'>—</span>
      );
    },
  },
  {
    accessorKey: 'socialHandles',
    header: 'Social Handles',
    cell: ({ row }) => {
      const handles = row.getValue('socialHandles') as string[] | null;
      return handles && handles.length > 0 ? (
        <div className='flex flex-wrap gap-1'>
          {handles.slice(0, 2).map((handle, index) => (
            <Badge key={index} variant='secondary' className='text-xs'>
              {handle}
            </Badge>
          ))}
          {handles.length > 2 && (
            <Badge variant='secondary' className='text-xs'>
              +{handles.length - 2}
            </Badge>
          )}
        </div>
      ) : (
        <span className='text-muted-foreground'>—</span>
      );
    },
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const tags = row.getValue('tags') as string[] | null;
      return tags && tags.length > 0 ? (
        <div className='flex flex-wrap gap-1'>
          {tags.slice(0, 2).map((tag, index) => (
            <Badge
              key={index}
              variant='outline'
              className='text-xs cursor-pointer hover:bg-accent'
              onClick={() => onTagFilter?.(tag)}
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 2 && (
            <Badge variant='outline' className='text-xs'>
              +{tags.length - 2}
            </Badge>
          )}
        </div>
      ) : (
        <span className='text-muted-foreground'>—</span>
      );
    },
  },
  {
    accessorKey: 'groups',
    header: 'Groups',
    cell: ({ row }) => {
      const groups = row.original.groups;
      return groups && groups.length > 0 ? (
        <div className='flex flex-wrap gap-1'>
          {groups.slice(0, 2).map((group) => (
            <Badge
              key={group.id}
              variant='default'
              className='text-xs cursor-pointer hover:bg-primary/80'
              onClick={() => onGroupFilter?.(group.id)}
            >
              {group.emoji && <span className='mr-1'>{group.emoji}</span>}
              {group.name}
            </Badge>
          ))}
          {groups.length > 2 && (
            <Badge variant='default' className='text-xs'>
              +{groups.length - 2}
            </Badge>
          )}
        </div>
      ) : (
        <span className='text-muted-foreground'>—</span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='h-auto p-0 font-medium'
      >
        Created
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const dateValue = row.getValue('createdAt') as string | null;
      if (!dateValue) {
        return <div className='text-sm text-muted-foreground'>—</div>;
      }
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        return <div className='text-sm text-muted-foreground'>Invalid date</div>;
      }
      return <div className='text-sm'>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='h-auto p-0 font-medium'
      >
        Updated
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const dateValue = row.getValue('updatedAt') as string | null;
      if (!dateValue) {
        return <div className='text-sm text-muted-foreground'>—</div>;
      }
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        return <div className='text-sm text-muted-foreground'>Invalid date</div>;
      }
      return <div className='text-sm'>{date.toLocaleDateString()}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const contact = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => console.log('View', contact.id)}>
              <Eye className='mr-2 h-4 w-4' />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log('Edit', contact.id)}>
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log('Delete', contact.id)}
              className='text-destructive'
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
