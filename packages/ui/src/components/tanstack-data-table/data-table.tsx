//packages/ui/src/components/tanstack-data-table/data-table.tsx

'use client';

import * as React from "react"
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
} from "@tanstack/react-table"

import { contactColumns } from './columns';
import { testContacts }  from './contact-test-data';
import { Button } from '@codexcrm/ui/components/ui/button';
import { Input  } from '@codexcrm/ui/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@codexcrm/ui/components/ui/dropdown-menu';

export default function ContactsTable() {
  /* ---------------- STATE ---------------- */
  const [data]             = React.useState(() => [...testContacts]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [columnOrder, setColumnOrder]   = React.useState<string[]>([]);
  const [sorting, setSorting]           = React.useState([]);
  const [grouping, setGrouping]         = React.useState<string[]>([]);

  /* --------------- INSTANCE -------------- */
  const table = useReactTable({
    data,
    columns: contactColumns,
    state: {
      globalFilter,
      rowSelection,
      columnVisibility,
      columnOrder,
      sorting,
      grouping,
    },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onSortingChange: setSorting,
    onGroupingChange: setGrouping,
    columnResizeMode: 'onChange',

    /* Row-models for every requested feature */
    getCoreRowModel       : getCoreRowModel(),
    getFilteredRowModel   : getFilteredRowModel(),
    getPaginationRowModel : getPaginationRowModel(),
    getSortedRowModel     : getSortedRowModel(),
    getGroupedRowModel    : getGroupedRowModel(),
    getExpandedRowModel   : getExpandedRowModel(),
    getFacetedRowModel    : getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    enableRowSelection    : true,
    enableMultiRowSelection : true,
    paginateExpandedRows  : false,
  });

  /* --------------- RENDER ---------------- */
  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Global search..."
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        {/* Column visibility toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns()
              .filter(col => col.getCanHide())
              .map(col => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={val => col.toggleVisibility(!!val)}
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* TABLE */}
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-background shadow-sm">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(header => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="px-2 py-1 text-left align-middle whitespace-nowrap"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={row.getIsGrouped() ? 'bg-muted/50' : ''}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    className="px-2 py-2 align-top"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            «
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ‹
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            ›
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            »
          </Button>
        </div>

        <span className="text-sm">
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>

        <select
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
          className="border rounded-md h-8 px-2 text-sm"
        >
          {[10, 25, 100].map(size => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
