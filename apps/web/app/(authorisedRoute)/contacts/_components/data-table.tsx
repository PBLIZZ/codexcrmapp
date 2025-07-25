'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getGroupedRowModel,
  GroupingState,
  RowSelectionState,
} from '@tanstack/react-table';
import { type Contact } from '@codexcrm/db';
import { columns } from './columns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@codexcrm/ui';
import { TableToolbar } from './table-toolbar';
import { TablePagination } from './table-pagination';

interface DataTableProps {
  data: Contact[];
}

interface TableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  pagination: { pageIndex: number; pageSize: number };
  globalFilter: string;
}

// DataTable component following official shadcn/ui pattern for TanStack Table integration
// Uses CSS variables for dark mode compatibility and proper z-index management for overlays
export function DataTable({ data }: DataTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [grouping, setGrouping] = useState<GroupingState>([]);
  const [state, setState] = useState<TableState>({
    sorting: [],
    columnFilters: [],
    columnVisibility: {
      // Default visible columns: checkbox, avatar, fullname, group, tags, actions
      // Hide all other columns by default
      email: false,
      phone: false,
      businessName: false,
      source: false,
      social_handles: false,
      createdAt: false,
      updatedAt: false,
    },
    pagination: { pageIndex: 0, pageSize: 10 },
    globalFilter: '',
  });

  // Track if component is mounted to prevent state updates during render
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    onSortingChange: (updater) => {
      if (!isMountedRef.current) return;
      setState((prev) => ({
        ...prev,
        sorting: typeof updater === 'function' ? updater(prev.sorting) : updater,
      }));
    },
    onColumnFiltersChange: (updater) => {
      if (!isMountedRef.current) return;
      setState((prev) => ({
        ...prev,
        columnFilters: typeof updater === 'function' ? updater(prev.columnFilters) : updater,
      }));
    },
    onColumnVisibilityChange: (updater) => {
      if (!isMountedRef.current) return;
      setState((prev) => ({
        ...prev,
        columnVisibility: typeof updater === 'function' ? updater(prev.columnVisibility) : updater,
      }));
    },
    onPaginationChange: (updater) => {
      if (!isMountedRef.current) return;
      setState((prev) => ({
        ...prev,
        pagination: typeof updater === 'function' ? updater(prev.pagination) : updater,
      }));
    },
    onGlobalFilterChange: (value) => {
      if (!isMountedRef.current) return;
      setState((prev) => ({ ...prev, globalFilter: value }));
    },
    onRowSelectionChange: setRowSelection,
    onGroupingChange: setGrouping,
    state: {
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      columnVisibility: state.columnVisibility,
      pagination: state.pagination,
      globalFilter: state.globalFilter,
      rowSelection,
      grouping,
    },
  });

  return (
    // Container follows official shadcn pattern: w-full prevents horizontal overflow, space-y-4 for consistent spacing
    <div className='w-full space-y-4'>
      {/* Toolbar - fixed at top, no scrolling */}
      <TableToolbar
        table={table}
        globalFilter={state.globalFilter}
        onGlobalFilterChange={(value) => {
          if (!isMountedRef.current) return;
          setState((prev) => ({ ...prev, globalFilter: value }));
        }}
      />

      {/* Table container - follows official shadcn pattern */}
      {/* overflow-hidden prevents horizontal scroll issues, rounded-md and border for visual containment */}
      <div className='w-full'>
        <div className='overflow-hidden rounded-md border'>
          <Table>
            {/* TableHeader uses bg-background for proper dark mode theming */}
            <TableHeader className='bg-background'>
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination - fixed at bottom, no scrolling */}
      {/* TablePagination handles its own responsive behavior and theming */}
      <TablePagination table={table} />
    </div>
  );
}
