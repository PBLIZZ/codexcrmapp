'use client';

import { Table } from '@tanstack/react-table';
import { Button } from '@codexcrm/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@codexcrm/ui';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface TablePaginationProps<TData> {
  table: Table<TData>;
}

export function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
  return (
    <div className='flex items-center justify-between px-4 py-3 bg-white border-t border-teal-700/30'>
      <div className='flex-1 text-sm text-teal-700'>
        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
          <span>
            <span className='font-semibold'>{table.getFilteredSelectedRowModel().rows.length}</span>{' '}
            of <span className='font-semibold'>{table.getFilteredRowModel().rows.length}</span>{' '}
            {table.getFilteredRowModel().rows.length === 1 ? 'contact' : 'contacts'} selected
          </span>
        ) : (
          <span>
            <span className='font-semibold'>{table.getFilteredRowModel().rows.length}</span>{' '}
            {table.getFilteredRowModel().rows.length === 1 ? 'contact' : 'contacts'} total
          </span>
        )}
      </div>
      <div className='flex items-center gap-6 lg:gap-8'>
        <div className='flex items-center gap-2'>
          <p className='text-sm font-medium text-teal-700'>Rows</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className='h-8 w-[70px] border-teal-700/30 rounded-md shadow-sm focus:ring-teal-500/30 focus:border-teal-500 bg-white'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top' className='border-teal-700/30 rounded-md bg-white shadow-md'>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center justify-center text-sm font-medium text-teal-700 bg-teal-50 px-3 py-1 rounded-md border border-teal-700/30 min-w-[100px] shadow-sm'>
          Page{' '}
          <span className='font-semibold text-teal-900 mx-1'>
            {table.getState().pagination.pageIndex + 1}
          </span>{' '}
          of <span className='font-semibold text-teal-900 ml-1'>{table.getPageCount() || 1}</span>
        </div>
        <div className='flex items-center gap-1'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex bg-white border-teal-700/30 hover:bg-teal-50 hover:text-teal-700 disabled:opacity-50 disabled:pointer-events-none rounded-md shadow-sm'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Go to first page</span>
            <ChevronsLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0 bg-white border-teal-700/30 hover:bg-teal-50 hover:text-teal-700 disabled:opacity-50 disabled:pointer-events-none rounded-md shadow-sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0 bg-white border-teal-700/30 hover:bg-teal-50 hover:text-teal-700 disabled:opacity-50 disabled:pointer-events-none rounded-md shadow-sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Go to next page</span>
            <ChevronRight className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex bg-white border-teal-700/30 hover:bg-teal-50 hover:text-teal-700 disabled:opacity-50 disabled:pointer-events-none rounded-md shadow-sm'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className='sr-only'>Go to last page</span>
            <ChevronsRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
