# ContactsTable and ContactsContent

src/components/contacts/ContactsContent.tsx

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from './data-table';
import { columns } from './columns';
import { useContacts } from '@/hooks/use-contacts';
import { Loader2 } from 'lucide-react';

export function ContactsContent() {
  const { data: contacts, isLoading, error } = useContacts();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin' />
        <span className='ml-2'>Loading contacts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='text-center text-destructive'>
            Error loading contacts: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts</CardTitle>
        <CardDescription>Manage your contacts and their group memberships</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={contacts || []} />
      </CardContent>
    </Card>
  );
}
```

src/components/contacts/columns.tsx

```tsx
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Tables } from '@/integrations/supabase/types';

type Contact = Tables<'contacts'>;
type Group = Tables<'groups'>;

export interface ContactWithGroups extends Contact {
  groups?: Group[];
}

export const columns: ColumnDef<ContactWithGroups>[] = [
  {
    accessorKey: 'full_name',
    header: 'Full Name',
    cell: ({ row }) => {
      const name = row.getValue('full_name') as string;
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
    accessorKey: 'social_handles',
    header: 'Social Handles',
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
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const tags = row.getValue('tags') as string[] | null;
      return tags && tags.length > 0 ? (
        <div className='flex flex-wrap gap-1'>
          {tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant='outline' className='text-xs'>
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
            <Badge key={group.id} variant='default' className='text-xs'>
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
];
```

src/components/contacts/data-table.tsx

```tsx
import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-2'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search contacts...'
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className='pl-8'
          />
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No contacts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex items-center justify-between space-x-2 py-4'>
        <div className='text-sm text-muted-foreground'>
          Showing {table.getFilteredRowModel().rows.length} of {table.getCoreRowModel().rows.length}{' '}
          contacts
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className='h-4 w-4' />
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

src/hooks/use-contacts.ts

```tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ContactWithGroups } from '@/components/contacts/columns';

export const useContacts = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: async (): Promise<ContactWithGroups[]> => {
      // Fetch all contacts
      const { data: contacts, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (contactsError) {
        throw new Error(`Failed to fetch contacts: ${contactsError.message}`);
      }

      // Fetch all group memberships
      const { data: groupMemberships, error: membershipsError } = await supabase.from(
        'group_members'
      ).select(`
          contact_id,
          groups (
            id,
            name,
            emoji,
            color
          )
        `);

      if (membershipsError) {
        throw new Error(`Failed to fetch group memberships: ${membershipsError.message}`);
      }

      // Create a map of contact ID to groups
      const contactGroupsMap = new Map<string, any[]>();
      groupMemberships?.forEach((membership) => {
        const contactId = membership.contact_id;
        if (!contactGroupsMap.has(contactId)) {
          contactGroupsMap.set(contactId, []);
        }
        if (membership.groups) {
          contactGroupsMap.get(contactId)!.push(membership.groups);
        }
      });

      // Combine contacts with their groups
      const contactsWithGroups: ContactWithGroups[] =
        contacts?.map((contact) => ({
          ...contact,
          groups: contactGroupsMap.get(contact.id) || [],
        })) || [];

      return contactsWithGroups;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

src/pages/Index.tsx

```tsx
// Update this page (the content is just a fallback if you fail to update the page)
import { ContactsContent } from '@/components/contacts/ContactsContent';

const Index = () => {
  return (
    <div className='min-h-screen bg-background p-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold'>CRM Dashboard</h1>
          <p className='text-muted-foreground'>Manage your contacts and relationships</p>
        </div>
        <ContactsContent />
      </div>
    </div>
  );
};

export default Index;
```
