'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@codexcrm/ui';
import { TooltipProvider } from '@codexcrm/ui';
import { TableToolbar } from './table-toolbar';
import { TablePagination } from './table-pagination';
import { useTableState } from '@/components/hooks/use-table-state';
import { ContactWithGroups } from './columns';
import { Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DataTableProps {
  columns: ColumnDef<ContactWithGroups>[];
  data: ContactWithGroups[];
}

export function DataTable({ columns, data }: DataTableProps) {
  const router = useRouter();
  const { state, updateState } = useTableState('contacts');
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [activeTagFilter, setActiveTagFilter] = React.useState<string>();
  const [activeGroupFilter, setActiveGroupFilter] = React.useState<string>();

  const handleRowClick = (contactId: string, event: React.MouseEvent) => {
    // Don't navigate if user is selecting text or clicking on interactive elements
    if (event.target instanceof HTMLElement) {
      const target = event.target;
      const isInteractive =
        target.closest('input[type="checkbox"]') ||
        target.closest('button') ||
        target.closest('a') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A';

      if (!isInteractive) {
        router.push(`/contacts/${contactId}`);
      }
    }
  };

  // Filter data based on active filters
  const filteredData = React.useMemo(() => {
    let filtered = data;

    if (activeTagFilter) {
      filtered = filtered.filter((contact) => contact.tags?.includes(activeTagFilter));
    }

    if (activeGroupFilter) {
      filtered = filtered.filter((contact) =>
        contact.groups?.some((group) => group.id === activeGroupFilter)
      );
    }

    return filtered;
  }, [data, activeTagFilter, activeGroupFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(state.sorting) : updater;
      updateState({ sorting: newSorting });
    },
    onColumnFiltersChange: (updater) => {
      const newFilters = typeof updater === 'function' ? updater(state.columnFilters) : updater;
      updateState({ columnFilters: newFilters });
    },
    onColumnVisibilityChange: (updater) => {
      const newVisibility =
        typeof updater === 'function' ? updater(state.columnVisibility) : updater;
      updateState({ columnVisibility: newVisibility });
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' ? updater(state.pagination) : updater;
      updateState({ pagination: newPagination });
    },
    onGlobalFilterChange: (value) => {
      updateState({ globalFilter: value });
    },
    onRowSelectionChange: setRowSelection,
    globalFilterFn: 'includesString',
    state: {
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      columnVisibility: state.columnVisibility,
      pagination: state.pagination,
      globalFilter: state.globalFilter,
      rowSelection,
    },
  });

  return (
    <div className='space-y-4'>
      <TableToolbar
        table={table}
        globalFilter={state.globalFilter}
        onGlobalFilterChange={(value) => updateState({ globalFilter: value })}
        activeTagFilter={activeTagFilter}
        activeGroupFilter={activeGroupFilter}
        onClearTagFilter={() => setActiveTagFilter(undefined)}
        onClearGroupFilter={() => setActiveGroupFilter(undefined)}
      />

      <TooltipProvider>
        <div className='rounded-lg border border-teal-700 shadow-md overflow-hidden'>
          <div className='max-h-[500px] overflow-auto'>
            <Table>
              <TableHeader className='bg-teal-50/80'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className='hover:bg-teal-100/50'>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className='font-semibold'>
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
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className={`${row.getIsSelected() ? 'bg-teal-200 hover:bg-teal-300' : index % 2 === 0 ? 'bg-white hover:bg-teal-50' : 'bg-teal-50 hover:bg-teal-100'} transition-colors cursor-pointer`}
                      onClick={(event) => handleRowClick(row.original.id, event)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className='py-3'>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className='h-64 text-center p-8'>
                      <div className='flex flex-col items-center justify-center space-y-3 text-slate-600'>
                        <div className='rounded-full bg-teal-100 p-3 shadow-inner border border-teal-700/20'>
                          <Info className='h-6 w-6' />
                        </div>
                        <div className='text-lg font-medium'>No contacts found</div>
                        <div className='text-sm text-slate-500'>
                          Try adjusting your search or filters, or add a new contact.
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {table.getRowModel().rows?.length > 0 && (
            <div className='border-t border-teal-700/30'>
              <TablePagination table={table} />
            </div>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
}
