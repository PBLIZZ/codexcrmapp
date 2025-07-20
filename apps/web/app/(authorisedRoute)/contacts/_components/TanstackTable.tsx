'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table as TanStackTable,
  Row,
  Column,
  Header,
  HeaderGroup,
  Cell,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import type { Contact } from '@codexcrm/db';

import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@codexcrm/ui';

interface ContactsTableProps {
  data: Contact[];
  onDelete?: (contactIds: string[]) => void;
  onEdit?: (contact: Contact) => void;
  onView?: (contact: Contact) => void;
}

export function ContactsTable({ data, onDelete, onEdit, onView }: ContactsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    id: false,
    userId: false,
    createdAt: false,
    tags: false,
    socialHandles: false,
    wellnessGoals: false,
    notes: false,
    source: false,
    addressStreet: false,
    addressCity: false,
    addressPostalCode: false,
    addressCountry: false,
    phoneCountryCode: false,
    wellnessJourneyStage: false,
    wellnessStatus: false,
    lastAssessmentDate: false,
    clientSince: false,
    relationshipStatus: false,
    referralSource: false,
    enrichmentStatus: false,
    enrichedData: false,
    communicationPreferences: false,
  });
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState('');

  const columns: ColumnDef<Contact>[] = [
    {
      id: 'select',
      header: ({ table }: { table: TanStackTable<Contact> }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }: { row: Row<Contact> }) => (
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
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }: { row: Row<Contact> }) => (
        <div className='font-mono text-xs'>{row.getValue('id')}</div>
      ),
    },
    {
      accessorKey: 'fullName',
      header: ({ column }: { column: Column<Contact> }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Full Name
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }: { row: Row<Contact> }) => (
        <div className='font-medium'>{row.getValue('fullName')}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }: { column: Column<Contact> }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Email
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }: { row: Row<Contact> }) => (
        <div className='lowercase'>{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }: { row: Row<Contact> }) => {
        const phone = row.getValue('phone') as string | null;
        return <div>{phone || '—'}</div>;
      },
    },
    {
      accessorKey: 'jobTitle',
      header: 'Job Title',
      cell: ({ row }: { row: Row<Contact> }) => {
        const jobTitle = row.getValue('jobTitle') as string | null;
        return <div>{jobTitle || '—'}</div>;
      },
    },
    {
      accessorKey: 'companyName',
      header: 'Company',
      cell: ({ row }: { row: Row<Contact> }) => {
        const company = row.getValue('companyName') as string | null;
        return <div>{company || '—'}</div>;
      },
    },
    {
      accessorKey: 'website',
      header: 'Website',
      cell: ({ row }: { row: Row<Contact> }) => {
        const website = row.getValue('website') as string | null;
        return website ? (
          <a
            href={website.startsWith('http') ? website : `https://${website}`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:underline'
          >
            {website}
          </a>
        ) : (
          <div>—</div>
        );
      },
    },
    {
      accessorKey: 'lastContactedAt',
      header: ({ column }: { column: Column<Contact> }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Last Contacted
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }: { row: Row<Contact> }) => {
        const date = row.getValue('lastContactedAt') as Date | null;
        return <div>{date ? format(date, 'MMM dd, yyyy') : 'Never'}</div>;
      },
      filterFn: (row: Row<Contact>, id: string, value: string) => {
        const date = row.getValue(id) as Date | null;
        if (!date || !value) return true;

        const filterDate = new Date(value);
        const contactDate = new Date(date);

        // Filter by month and year
        return (
          contactDate.getMonth() === filterDate.getMonth() &&
          contactDate.getFullYear() === filterDate.getFullYear()
        );
      },
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }: { column: Column<Contact> }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Last Updated
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }: { row: Row<Contact> }) => {
        const date = row.getValue('updatedAt') as Date;
        return <div>{format(date, 'MMM dd, yyyy HH:mm')}</div>;
      },
      filterFn: (row: Row<Contact>, id: string, value: string) => {
        const date = row.getValue(id) as Date;
        if (!value) return true;

        const filterDate = new Date(value);
        const updatedDate = new Date(date);

        // Filter by month and year
        return (
          updatedDate.getMonth() === filterDate.getMonth() &&
          updatedDate.getFullYear() === filterDate.getFullYear()
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }: { column: Column<Contact> }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Created
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }: { row: Row<Contact> }) => {
        const date = row.getValue('createdAt') as Date;
        return <div>{format(date, 'MMM dd, yyyy')}</div>;
      },
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: ({ row }: { row: Row<Contact> }) => {
        const tags = row.getValue('tags') as string[];
        return (
          <div className='flex flex-wrap gap-1'>
            {tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800'
              >
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className='text-xs text-gray-500'>+{tags.length - 2} more</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'socialHandles',
      header: 'Social',
      cell: ({ row }: { row: Row<Contact> }) => {
        const handles = row.getValue('socialHandles') as string[];
        return (
          <div className='text-sm'>{handles.length > 0 ? `${handles.length} handle(s)` : '—'}</div>
        );
      },
    },
    {
      accessorKey: 'wellnessGoals',
      header: 'Wellness Goals',
      cell: ({ row }: { row: Row<Contact> }) => {
        const goals = row.getValue('wellnessGoals') as string[];
        return <div className='text-sm'>{goals.length > 0 ? `${goals.length} goal(s)` : '—'}</div>;
      },
    },
    {
      accessorKey: 'notes',
      header: 'Notes',
      cell: ({ row }: { row: Row<Contact> }) => {
        const notes = row.getValue('notes') as string | null;
        return <div className='max-w-[200px] truncate'>{notes || '—'}</div>;
      },
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }: { row: Row<Contact> }) => {
        const source = row.getValue('source') as string | null;
        return <div>{source || '—'}</div>;
      },
    },
    {
      accessorKey: 'userId',
      header: 'User ID',
      cell: ({ row }: { row: Row<Contact> }) => (
        <div className='font-mono text-xs'>{row.getValue('userId')}</div>
      ),
    },
    // Address fields
    {
      accessorKey: 'addressStreet',
      header: 'Street',
      cell: ({ row }: { row: Row<Contact> }) => {
        const street = row.getValue('addressStreet') as string | null;
        return <div>{street || '—'}</div>;
      },
    },
    {
      accessorKey: 'addressCity',
      header: 'City',
      cell: ({ row }: { row: Row<Contact> }) => {
        const city = row.getValue('addressCity') as string | null;
        return <div>{city || '—'}</div>;
      },
    },
    {
      accessorKey: 'addressPostalCode',
      header: 'Postal Code',
      cell: ({ row }: { row: Row<Contact> }) => {
        const postal = row.getValue('addressPostalCode') as string | null;
        return <div>{postal || '—'}</div>;
      },
    },
    {
      accessorKey: 'addressCountry',
      header: 'Country',
      cell: ({ row }: { row: Row<Contact> }) => {
        const country = row.getValue('addressCountry') as string | null;
        return <div>{country || '—'}</div>;
      },
    },
    {
      accessorKey: 'phoneCountryCode',
      header: 'Phone Country Code',
      cell: ({ row }: { row: Row<Contact> }) => {
        const code = row.getValue('phoneCountryCode') as string | null;
        return <div>{code || '—'}</div>;
      },
    },
    // Wellness fields
    {
      accessorKey: 'wellnessJourneyStage',
      header: 'Wellness Stage',
      cell: ({ row }: { row: Row<Contact> }) => {
        const stage = row.getValue('wellnessJourneyStage') as string | null;
        return <div>{stage || '—'}</div>;
      },
    },
    {
      accessorKey: 'wellnessStatus',
      header: 'Wellness Status',
      cell: ({ row }: { row: Row<Contact> }) => {
        const status = row.getValue('wellnessStatus') as string | null;
        return <div>{status || '—'}</div>;
      },
    },
    {
      accessorKey: 'lastAssessmentDate',
      header: 'Last Assessment',
      cell: ({ row }: { row: Row<Contact> }) => {
        const date = row.getValue('lastAssessmentDate') as Date | null;
        return <div>{date ? format(date, 'MMM dd, yyyy') : '—'}</div>;
      },
    },
    {
      accessorKey: 'clientSince',
      header: 'Client Since',
      cell: ({ row }: { row: Row<Contact> }) => {
        const date = row.getValue('clientSince') as Date | null;
        return <div>{date ? format(date, 'MMM dd, yyyy') : '—'}</div>;
      },
    },
    {
      accessorKey: 'relationshipStatus',
      header: 'Relationship Status',
      cell: ({ row }: { row: Row<Contact> }) => {
        const status = row.getValue('relationshipStatus') as string | null;
        return <div>{status || '—'}</div>;
      },
    },
    {
      accessorKey: 'referralSource',
      header: 'Referral Source',
      cell: ({ row }: { row: Row<Contact> }) => {
        const source = row.getValue('referralSource') as string | null;
        return <div>{source || '—'}</div>;
      },
    },
    {
      accessorKey: 'enrichmentStatus',
      header: 'Enrichment Status',
      cell: ({ row }: { row: Row<Contact> }) => {
        const status = row.getValue('enrichmentStatus') as string | null;
        return (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
              status === 'completed'
                ? 'bg-green-100 text-green-800'
                : status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
            }`}
          >
            {status || '—'}
          </span>
        );
      },
    },
    {
      accessorKey: 'enrichedData',
      header: 'Enriched Data',
      cell: ({ row }: { row: Row<Contact> }) => {
        const data = row.getValue('enrichedData');
        return <div>{data ? 'Available' : '—'}</div>;
      },
    },
    {
      accessorKey: 'communicationPreferences',
      header: 'Comm. Preferences',
      cell: ({ row }: { row: Row<Contact> }) => {
        const prefs = row.getValue('communicationPreferences');
        return <div>{prefs ? 'Set' : '—'}</div>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }: { row: Row<Contact> }) => {
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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(contact.id)}>
                Copy contact ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {onView && (
                <DropdownMenuItem onClick={() => onView(contact)}>View contact</DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(contact)}>Edit contact</DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem onClick={() => onDelete([contact.id])} className='text-red-600'>
                  Delete contact
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between py-4'>
        <div className='flex items-center space-x-2'>
          <Input
            placeholder='Search all contacts...'
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className='max-w-sm'
          />
          {selectedRows.length > 0 && onDelete && (
            <Button
              variant='destructive'
              size='sm'
              onClick={() => {
                const ids = selectedRows.map((row: Row<Contact>) => row.original.id);
                onDelete(ids);
                setRowSelection({});
              }}
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Delete {selectedRows.length} contact(s)
            </Button>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              Columns <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='max-h-96 overflow-y-auto'>
            {table
              .getAllColumns()
              .filter((column: Column<Contact>) => column.getCanHide())
              .map((column: Column<Contact>) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<Contact>) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: Header<Contact>) => {
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
              table.getRowModel().rows.map((row: Row<Contact>) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell: Cell<Contact>) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {selectedRows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
