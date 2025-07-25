'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { type Contact } from '@codexcrm/db';
import { Badge, Button, Checkbox } from '@codexcrm/ui';
import { ArrowUpDown, Bot, Mail, FileText, Edit, Trash2 } from 'lucide-react';
import { ContactAvatar } from './ContactAvatar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/trpc';

// Actions cell component that can use hooks
function ActionsCell({ contact }: { contact: Contact }) {
  const router = useRouter();
  const deleteMutation = api.contacts.delete.useMutation();

  const handleEdit = () => {
    router.push(`/contacts/${contact.id}/edit`);
  };

  const handleDelete = async () => {
    console.log('Delete attempt for contact:', { id: contact.id, fullName: contact.fullName });
    if (
      window.confirm(
        `Are you sure you want to delete ${contact.fullName}? This action cannot be undone.`
      )
    ) {
      try {
        console.log('Sending delete request with:', { contactId: contact.id });
        const result = await deleteMutation.mutateAsync({ contactId: contact.id });
        console.log('Delete result:', result);
        window.location.reload(); // Refresh the page after successful deletion
      } catch (error: unknown) {
        console.error('Error deleting contact:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error details:', {
          message: errorMessage,
          error,
        });
        alert(`Failed to delete contact: ${errorMessage}`);
      }
    }
  };

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='ghost'
        size='sm'
        className='h-8 w-8 p-0 hover:bg-accent'
        onClick={() => console.log('AI Chat with:', contact.fullName)}
        title='Chat with AI about this contact'
      >
        <Bot className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        className='h-8 w-8 p-0 hover:bg-accent'
        onClick={() => console.log('Send message to:', contact.fullName)}
        title='Send personalized message'
      >
        <Mail className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        className='h-8 w-8 p-0 hover:bg-accent'
        onClick={() => console.log('Expand notes for:', contact.fullName)}
        title='View notes and AI summary'
      >
        <FileText className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        className='h-8 w-8 p-0 hover:bg-accent'
        onClick={handleEdit}
        title='Edit contact'
      >
        <Edit className='h-4 w-4 text-teal-700' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        className='h-8 w-8 p-0 hover:bg-accent'
        onClick={handleDelete}
        title='Delete contact'
        disabled={deleteMutation.isPending}
      >
        <Trash2 className='h-4 w-4 text-red-500' />
      </Button>
    </div>
  );
}

// Standard columns export following TanStack Table patterns
// Uses CSS variables (text-foreground, bg-secondary, etc.) for proper dark mode support
// All dropdown menus have z-50 for proper layering above table content
export const columns: ColumnDef<Contact>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        className='text-foreground'
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className='text-foreground'
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'profileImageUrl',
    header: '',
    cell: ({ row }) => {
      const contact = row.original;
      return (
        <ContactAvatar
          profileImageUrl={contact.profileImageUrl}
          fullName={contact.fullName}
          size='sm'
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'fullName',
    header: ({ column }) => {
      return (
        <Button
          className='text-violet-700/80 h-auto p-0 font-medium'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Full Name
          <ArrowUpDown className='h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const contact = row.original;
      return (
        <Link href={`/contacts/${contact.id}`} className='font-medium hover:underline'>
          {row.getValue('fullName')}
        </Link>
      );
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          className='text-violet-700/80 h-auto p-0 font-medium'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className='h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='lowercase'>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'phone',
    header: () => <div className='text-foreground font-medium'>Phone</div>,
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string | null;
      return phone ? (
        <div className='font-medium'>{phone}</div>
      ) : (
        <span className='text-muted-foreground'>—</span>
      );
    },
  },
  {
    accessorKey: 'businessName',
    header: () => <div className='text-foreground font-medium'>Business</div>,
    cell: ({ row }) => {
      const businessName = row.getValue('businessName') as string | null;
      return businessName ? (
        <div className='font-medium'>{businessName}</div>
      ) : (
        <span className='text-muted-foreground'>—</span>
      );
    },
  },
  {
    accessorKey: 'tags',
    header: () => <div className='text-foreground font-medium'>Tags</div>,
    filterFn: (row, columnId, filterValue) => {
      const tags = row.getValue(columnId) as string[] | null;
      if (!tags || !filterValue) return true;
      return tags.some((tag) => tag.toLowerCase().includes(filterValue.toLowerCase()));
    },
    cell: ({ row, table }) => {
      const tags = row.getValue('tags') as string[] | null;
      return tags && tags.length > 0 ? (
        <div className='flex flex-wrap gap-1'>
          {tags.slice(0, 5).map((tag, index) => (
            <Badge
              key={index}
              variant='outline'
              className='text-xs bg-secondary cursor-pointer hover:bg-accent'
              onClick={() => {
                const column = table.getColumn('tags');
                column?.setFilterValue(tag);
              }}
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 2 && (
            <Badge variant='outline' className='text-xs bg-secondary'>
              +{tags.length - 2} more
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
    header: () => <div className='text-foreground font-medium'>Group</div>,
    filterFn: (row, columnId, filterValue) => {
      const groups = row.getValue(columnId) as string[] | null;
      if (!groups || !filterValue) return true;
      return groups.some((group) => group.toLowerCase().includes(filterValue.toLowerCase()));
    },
    cell: ({ row, table }) => {
      const groups = row.getValue('groups') as string[] | null;
      return groups && groups.length > 0 ? (
        <div className='flex flex-wrap gap-1'>
          {groups.slice(0, 2).map((group, index) => (
            <Badge
              key={index}
              variant='secondary'
              className='text-xs bg-secondary cursor-pointer hover:bg-accent'
              onClick={() => {
                const column = table.getColumn('groups');
                column?.setFilterValue(group);
              }}
            >
              {group}
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
    accessorKey: 'source',
    header: () => <div className='text-foreground font-medium'>Source</div>,
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
    accessorKey: 'social_handles',
    header: () => <div className='text-foreground font-medium'>Social Handles</div>,
    cell: ({ row }) => {
      const handles = row.getValue('social_handles') as string[] | null;
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
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button
        variant='ghost'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className='text-violet-700/80 h-auto p-0 font-medium'
      >
        Created
        <ArrowUpDown className='h-4 w-4' />
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
        className='text-violet-700/80 h-auto p-0 font-medium'
      >
        Updated
        <ArrowUpDown className='h-4 w-4' />
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
    header: () => <div className='text-foreground font-medium'>Actions</div>,
    cell: ({ row }) => {
      const contact = row.original;
      return <ActionsCell contact={contact} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];
