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
import { TableToolbar } from './table-toolbar';
import { TablePagination } from './table-pagination';
import { useTableState } from '@/components/hooks/use-table-state';
import { ContactWithGroups } from './columns';

interface DataTableProps {
  columns: ColumnDef<ContactWithGroups>[];
  data: ContactWithGroups[];
}

export function DataTable({ columns, data }: DataTableProps) {
  const { state, updateState } = useTableState('contacts');
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [activeTagFilter, setActiveTagFilter] = React.useState<string>();
  const [activeGroupFilter, setActiveGroupFilter] = React.useState<string>();

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
      <TablePagination table={table} />
    </div>
  );
}
