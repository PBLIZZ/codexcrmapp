//packages/ui/src/components/tanstack-data-table/columns.tsx

// components/contacts/columns.tsx
'use client';

import {
  ColumnDef,
  createColumnHelper,
  SortingFn,
  sortingFns,
} from '@tanstack/react-table';
import { Contact } from './contact-types';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@codexcrm/ui/components/ui/dropdown-menu';
import { Button } from '@codexcrm/ui/components/ui/button';
import { Badge } from '@codexcrm/ui/components/ui/badge';

const columnHelper = createColumnHelper<Contact>();

// Fuzzy sort helper for tags length
const fuzzyTagSort: SortingFn<Contact> = (a, b) => {
  return a.original.tags.length - b.original.tags.length;
};

export const contactColumns: ColumnDef<Contact, any>[] = [
  // Row selection column (checkbox)
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
    maxSize: 40,
  },
  // Sticky ID column
  columnHelper.accessor('id', {
    header: 'ID',
    size: 140,
    enableColumnFilter: true,
    enablePinning: true,
  }),
  columnHelper.accessor(row => `${row.firstName} ${row.lastName}`, {
    id: 'fullName',
    header: () => (
      <Button variant="ghost" className="p-0 flex items-center">
        Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableHiding: true,
    size: 180,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: info => <div className="lowercase">{info.getValue()}</div>,
    enableColumnFilter: true,
    size: 220,
  }),
  columnHelper.accessor('phone', {
    header: 'Phone',
    enableColumnFilter: true,
    size: 160,
  }),
  columnHelper.accessor('membershipType', {
    header: 'Membership',
    cell: info => <Badge>{info.getValue()}</Badge>,
    enableColumnFilter: true,
    size: 120,
  }),
  columnHelper.accessor('membershipStatus', {
    header: 'Status',
    cell: info => <Badge variant={info.getValue() === 'active' ? 'default' : 'outline'}>{info.getValue()}</Badge>,
    enableColumnFilter: true,
    size: 100,
  }),
  columnHelper.accessor('lastSession', {
    header: 'Last Session',
    cell: info => new Date(info.getValue()).toLocaleDateString(),
    enableColumnFilter: true,
    sortingFn: 'datetime',
    size: 120,
  }),
  columnHelper.accessor('nextSession', {
    header: 'Next Session',
    cell: info => new Date(info.getValue()).toLocaleDateString(),
    enableColumnFilter: true,
    sortingFn: 'datetime',
    size: 120,
  }),
  columnHelper.accessor('tags', {
    header: 'Tags',
    cell: ({ getValue }) => {
      const tags: string[] = getValue();
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map(tag => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      );
    },
    enableSorting: true,
    sortingFn: fuzzyTagSort,
    size: 240,
  }),
  // Row action column
  {
    id: 'actions',
    header: 'Actions',
    enableHiding: false,
    cell: ({ row }) => {
      const contact = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(contact.email)}>
              Copy email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Send reminder</DropdownMenuItem>
            <DropdownMenuItem>Ask AI insight</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 80,
  },
];