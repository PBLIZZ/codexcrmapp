# Complete TanStack Table Implementation Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Installation & Setup](#installation--setup)
3. [Basic Implementation](#basic-implementation)
4. [Data Structure & Types](#data-structure--types)
5. [Column Definitions](#column-definitions)
6. [Table State Management](#table-state-management)
7. [Rendering the Table](#rendering-the-table)
8. [Advanced Features](#advanced-features)
9. [Performance Considerations](#performance-considerations)
10. [Common Pitfalls & Solutions](#common-pitfalls--solutions)
11. [Migration from React Table v7](#migration-from-react-table-v7)

## Introduction

### What is TanStack Table?

TanStack Table is a **headless UI library** for building powerful tables & datagrids. Being "headless" means:

- **No pre-built markup or styles** - You have complete control over the UI
- **Framework agnostic core** - Works with React, Vue, Solid, Svelte, and more
- **Logic and state management only** - Handles complex data processing, state management, and business logic
- **Maximum flexibility** - Build exactly what you need without constraints

### Benefits of Headless UI

- **Full control** over markup and styles
- **Smaller bundle sizes** - Only include what you need
- **Better performance** - No unnecessary DOM overhead
- **Framework portable** - Same logic across different frameworks
- **Customizable** - No fighting against pre-built components

## Installation & Setup

### Install the Package

```bash
npm install @tanstack/react-table
```

**Note**: Only install ONE adapter package. For React projects, use `@tanstack/react-table`.

### TypeScript Support

TanStack Table is written in TypeScript and includes types in the base package. No additional `@types` packages needed.

## Basic Implementation

### Minimal Example

```tsx
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'

// Define your data type
type User = {
  id: string
  firstName: string
  lastName: string
  age: number
  email: string
}

function BasicTable() {
  // Sample data (in real app, this would come from props/API)
  const data: User[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      email: 'john@example.com'
    }
    // ... more data
  ]

  // Define columns
  const columns = [
    {
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      accessorKey: 'lastName', 
      header: 'Last Name',
    },
    {
      accessorKey: 'age',
      header: 'Age',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    }
  ]

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

## Data Structure & Types

### Defining Your Data Type

Always define a TypeScript type for your data structure:

```tsx
type User = {
  id: string
  firstName: string
  lastName: string
  age: number
  visits: number
  status: 'single' | 'married' | 'complicated'
  profile: {
    bio: string
    avatar: string
  }
}
```

### Stable Data References

**CRITICAL**: Your data must have a stable reference to prevent infinite re-renders.

```tsx
// ✅ GOOD - Stable references
const data = useMemo(() => [
  // ... your data
], []) // Empty dependency array for static data

// ✅ GOOD - Using useState
const [data, setData] = useState<User[]>([])

// ✅ GOOD - Data from external source (React Query, etc.)
const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
})

// ❌ BAD - Will cause infinite re-renders
function MyTable() {
  const data = [
    // ... data defined inside component
  ]
  
  const table = useReactTable({ data, columns }) // This will re-render infinitely!
}
```

### Nested/Deep Data Access

For nested data structures:

```tsx
type User = {
  name: {
    first: string
    last: string
  }
  profile: {
    age: number
    email: string
  }
}

const columns = [
  {
    accessorKey: 'name.first', // Dot notation for nested access
    header: 'First Name',
  },
  {
    accessorFn: row => row.profile.email, // Function for complex access
    id: 'email',
    header: 'Email',
  }
]
```

## Column Definitions

### Column Types

There are three main types of column definitions:

#### 1. Accessor Columns (Data Columns)
Have underlying data models - can be sorted, filtered, grouped:

```tsx
// Using accessorKey (object property)
{
  accessorKey: 'firstName',
  header: 'First Name',
}

// Using accessorFn (custom function)
{
  accessorFn: row => `${row.firstName} ${row.lastName}`,
  id: 'fullName',
  header: 'Full Name',
}
```

#### 2. Display Columns
No data model - for actions, checkboxes, etc:

```tsx
{
  id: 'actions',
  header: 'Actions',
  cell: ({ row }) => (
    <div>
      <button onClick={() => editUser(row.original.id)}>Edit</button>
      <button onClick={() => deleteUser(row.original.id)}>Delete</button>
    </div>
  ),
}
```

#### 3. Group Columns
Group other columns together:

```tsx
{
  header: 'Name',
  columns: [
    {
      accessorKey: 'firstName',
      header: 'First',
    },
    {
      accessorKey: 'lastName', 
      header: 'Last',
    },
  ],
}
```

### Using Column Helper (Recommended)

For better TypeScript support, use the column helper:

```tsx
import { createColumnHelper } from '@tanstack/react-table'

const columnHelper = createColumnHelper<User>()

const columns = [
  // Display column
  columnHelper.display({
    id: 'actions',
    cell: props => <RowActions row={props.row} />,
  }),
  
  // Accessor column with string key
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: info => info.getValue(),
  }),
  
  // Accessor column with function
  columnHelper.accessor(row => row.lastName, {
    id: 'lastName',
    header: () => <span>Last Name</span>,
  }),
  
  // Group column
  columnHelper.group({
    header: 'Info',
    columns: [
      columnHelper.accessor('age', {
        header: 'Age',
      }),
      columnHelper.accessor('status', {
        header: 'Status',
      }),
    ],
  }),
]
```

### Custom Cell Rendering

```tsx
const columns = [
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<string>()
      return (
        <span className={`status status-${status}`}>
          {status.toUpperCase()}
        </span>
      )
    },
  },
  {
    accessorKey: 'avatar',
    header: 'Avatar',
    cell: ({ row }) => (
      <img 
        src={row.original.profile.avatar} 
        alt={`${row.original.firstName}'s avatar`}
        className="w-8 h-8 rounded-full"
      />
    ),
  }
]
```

## Table State Management

### Internal State (Default)

By default, TanStack Table manages its own internal state:

```tsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  // Table manages its own state internally
})

// Access internal state
console.log(table.getState().sorting)
console.log(table.getState().filtering)
```

### Initial State

Customize initial state without managing it yourself:

```tsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  initialState: {
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
    sorting: [
      {
        id: 'firstName',
        desc: false,
      }
    ],
    columnVisibility: {
      id: false, // Hide ID column initially
    },
  },
})
```

### Controlled State

Control specific state pieces for external access:

```tsx
function MyTable() {
  const [sorting, setSorting] = useState([])
  const [filtering, setFiltering] = useState('')
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,      // Pass controlled state to table
      globalFilter: filtering,
      pagination,
    },
    onSortingChange: setSorting,        // Handle state changes
    onGlobalFilterChange: setFiltering,
    onPaginationChange: setPagination,
  })

  // Now you can use sorting, filtering, pagination in other parts of your app
}
```

### State Change Callbacks

State updaters can be values or functions (like React's setState):

```tsx
const [sorting, setSorting] = useState([])

const table = useReactTable({
  // ...
  state: { sorting },
  onSortingChange: (updater) => {
    // updater can be a value or function
    setSorting(old => {
      const newValue = updater instanceof Function ? updater(old) : updater
      
      // Do something with the new value
      console.log('Sorting changed:', newValue)
      
      return newValue
    })
  },
})
```

## Rendering the Table

### Basic Table Structure

```tsx
<table className="min-w-full divide-y divide-gray-200">
  {/* Header */}
  <thead className="bg-gray-50">
    {table.getHeaderGroups().map(headerGroup => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(header => (
          <th key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())
            }
          </th>
        ))}
      </tr>
    ))}
  </thead>
  
  {/* Body */}
  <tbody className="bg-white divide-y divide-gray-200">
    {table.getRowModel().rows.map(row => (
      <tr key={row.id}>
        {row.getVisibleCells().map(cell => (
          <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>
```

### Using flexRender

**Always use `flexRender`** for headers and cells to handle all possible column definition scenarios:

```tsx
// ✅ GOOD - Handles all cases (string, JSX, function)
{flexRender(header.column.columnDef.header, header.getContext())}

// ❌ BAD - Only works for simple strings
{header.column.columnDef.header}
```

### Handling Empty States

```tsx
<tbody>
  {table.getRowModel().rows.length === 0 ? (
    <tr>
      <td colSpan={columns.length} className="text-center py-4">
        No data available
      </td>
    </tr>
  ) : (
    table.getRowModel().rows.map(row => (
      <tr key={row.id}>
        {/* ... cells */}
      </tr>
    ))
  )}
</tbody>
```

## Advanced Features

### Sorting

```tsx
import { getSortedRowModel } from '@tanstack/react-table'

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(), // Enable sorting
})

// In header rendering
<th 
  key={header.id}
  onClick={header.column.getToggleSortingHandler()}
  className="cursor-pointer"
>
  {flexRender(header.column.columnDef.header, header.getContext())}
  {{
    asc: ' 🔼',
    desc: ' 🔽',
  }[header.column.getIsSorted()] ?? null}
</th>
```

### Filtering

```tsx
import { getFilteredRowModel } from '@tanstack/react-table'

const [globalFilter, setGlobalFilter] = useState('')

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(), // Enable filtering
  state: {
    globalFilter,
  },
  onGlobalFilterChange: setGlobalFilter,
})

// Global filter input
<input
  value={globalFilter ?? ''}
  onChange={e => setGlobalFilter(e.target.value)}
  placeholder="Search all columns..."
/>
```

### Pagination

```tsx
import { getPaginationRowModel } from '@tanstack/react-table'

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(), // Enable pagination
  initialState: {
    pagination: {
      pageSize: 10,
    },
  },
})

// Pagination controls
<div className="flex items-center gap-2">
  <button
    onClick={() => table.setPageIndex(0)}
    disabled={!table.getCanPreviousPage()}
  >
    {'<<'}
  </button>
  <button
    onClick={() => table.previousPage()}
    disabled={!table.getCanPreviousPage()}
  >
    {'<'}
  </button>
  <span>
    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
  </span>
  <button
    onClick={() => table.nextPage()}
    disabled={!table.getCanNextPage()}
  >
    {'>'}
  </button>
  <button
    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
    disabled={!table.getCanNextPage()}
  >
    {'>>'}
  </button>
</div>
```

### Row Selection

```tsx
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'

const [rowSelection, setRowSelection] = useState({})

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  enableRowSelection: true,
  state: {
    rowSelection,
  },
  onRowSelectionChange: setRowSelection,
})

// Add selection column
const columns = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  // ... other columns
]
```

## Performance Considerations

### Data Performance

- **Always memoize data**: Use `useMemo` or `useState` for stable references
- **Avoid inline transformations**: Pre-process data outside the component
- **Use proper keys**: Ensure row IDs are unique and stable

```tsx
// ✅ GOOD
const processedData = useMemo(() => 
  rawData.map(item => ({
    ...item,
    fullName: `${item.firstName} ${item.lastName}`
  })), [rawData]
)

// ❌ BAD - Will cause re-renders
const processedData = rawData.map(item => ({
  ...item,
  fullName: `${item.firstName} ${item.lastName}`
}))
```

### Column Performance

- **Memoize columns**: Especially if they contain complex functions
- **Use column helpers**: Better TypeScript performance

```tsx
// ✅ GOOD
const columns = useMemo(() => [
  columnHelper.accessor('firstName', {
    header: 'First Name',
  }),
  // ... more columns
], [])

// ❌ BAD - Recreated on every render
const columns = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  }
]
```

### Large Dataset Optimization

For datasets with thousands of rows:

- **Use pagination**: Don't render all rows at once
- **Virtual scrolling**: Consider libraries like `@tanstack/react-virtual`
- **Server-side operations**: Move sorting/filtering to the server
- **Lazy loading**: Load data as needed

## Common Pitfalls & Solutions

### 1. Infinite Re-renders

**Problem**: Table re-renders infinitely

**Cause**: Data or columns don't have stable references

**Solution**:
```tsx
// ✅ FIX: Use useMemo for stable references
const data = useMemo(() => [...], [])
const columns = useMemo(() => [...], [])

// ✅ FIX: Define outside component
const columns = [...] // Define outside component
```

### 2. State Not Updating

**Problem**: Controlled state doesn't update the table

**Cause**: Missing state in the `state` option or missing onChange handler

**Solution**:
```tsx
// ✅ FIX: Include both state and onChange
const table = useReactTable({
  // ...
  state: {
    sorting, // Must include controlled state
  },
  onSortingChange: setSorting, // Must include handler
})
```

### 3. TypeScript Errors

**Problem**: TypeScript errors with cell values

**Cause**: Type inference issues

**Solution**:
```tsx
// ✅ FIX: Use column helper for better types
const columnHelper = createColumnHelper<User>()

// ✅ FIX: Explicit type assertion
cell: ({ getValue }) => {
  const value = getValue<string>()
  return <span>{value}</span>
}
```

### 4. Missing Headers/Cells

**Problem**: Headers or cells not rendering

**Cause**: Not using `flexRender`

**Solution**:
```tsx
// ✅ FIX: Always use flexRender
{flexRender(header.column.columnDef.header, header.getContext())}
{flexRender(cell.column.columnDef.cell, cell.getContext())}
```

## Migration from React Table v7

### Key Changes in v8

1. **Package name**: `react-table` → `@tanstack/react-table`
2. **Hook name**: `useTable` → `useReactTable`
3. **Plugin system removed**: Use row model imports instead
4. **New column syntax**: `accessor` → `accessorKey` or `accessorFn`
5. **Prop changes**: `Header` → `header`, `Cell` → `cell`

### Migration Steps

#### 1. Update Installation
```bash
npm uninstall react-table @types/react-table
npm install @tanstack/react-table
```

#### 2. Update Imports
```tsx
// Old v7
import { useTable, usePagination, useSortBy } from 'react-table'

// New v8
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel, 
  getSortedRowModel 
} from '@tanstack/react-table'
```

#### 3. Update Table Setup
```tsx
// Old v7
const tableInstance = useTable(
  { columns, data },
  useSortBy,
  usePagination
)

// New v8
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})
```

#### 4. Update Column Definitions
```tsx
// Old v7
const columns = [
  {
    accessor: 'firstName',
    Header: 'First Name',
    Cell: ({ value }) => <span>{value}</span>
  }
]

// New v8
const columns = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: ({ getValue }) => <span>{getValue()}</span>
  }
]
```

#### 5. Update Rendering
```tsx
// Old v7
<th {...header.getHeaderProps()}>{header.render('Header')}</th>
<td {...cell.getCellProps()}>{cell.render('Cell')}</td>

// New v8
<th key={header.id}>
  {flexRender(header.column.columnDef.header, header.getContext())}
</th>
<td key={cell.id}>
  {flexRender(cell.column.columnDef.cell, cell.getContext())}
</td>
```

## Complete Working Example

Here's a complete, production-ready example with multiple features:

```tsx
import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
} from '@tanstack/react-table'

// Define data type
type User = {
  id: string
  firstName: string
  lastName: string
  age: number
  email: string
  status: 'active' | 'inactive'
}

// Sample data
const sampleData: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    email: 'john@example.com',
    status: 'active'
  },
  // ... more data
]

const columnHelper = createColumnHelper<User>()

export function DataTable() {
  // State for controlled features
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  // Memoize data and columns
  const data = useMemo(() => sampleData, [])
  
  const columns = useMemo(() => [
    columnHelper.accessor('firstName', {
      header: 'First Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('lastName', {
      header: 'Last Name',
    }),
    columnHelper.accessor('age', {
      header: 'Age',
    }),
    columnHelper.accessor('email', {
      header: 'Email',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => {
        const status = getValue()
        return (
          <span className={`px-2 py-1 rounded ${
            status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {status}
          </span>
        )
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="space-x-2">
          <button 
            onClick={() => console.log('Edit', row.original.id)}
            className="text-blue-600 hover:text-blue-900"
          >
            Edit
          </button>
          <button 
            onClick={() => console.log('Delete', row.original.id)}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      ),
    }),
  ], [])

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="space-y-4">
      {/* Global Filter */}
      <div>
        <input
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Search all columns..."
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center space-x-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())
                      }
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {'<'}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            {'>>'}
          </button>
        </div>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
          className="px-3 py-1 border rounded"
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
```

## Summary

This guide covers everything needed to implement TanStack Table successfully:

1. **Start simple** - Begin with basic data and columns
2. **Ensure stable references** - Use `useMemo` for data and columns  
3. **Use TypeScript** - Define your data types properly
4. **Follow the patterns** - Use `flexRender` and column helpers
5. **Add features incrementally** - Start with core, then add sorting, filtering, etc.
6. **Handle state properly** - Choose between internal, initial, or controlled state
7. **Test thoroughly** - Watch for infinite re-renders and performance issues

TanStack Table is incredibly powerful and flexible - take time to understand the core concepts and you'll be able to build sophisticated data tables for any use case.