# Introduction

TanStack Table is a Headless UI library for building powerful tables & datagrids for TS/JS, React, Vue, Solid, Qwik, and Svelte.

## What is "headless" UI?

Headless UI is a term for libraries and utilities that provide the logic, state, processing and API for UI elements and interactions, but do not provide markup, styles, or pre-built implementations. Scratching your head yet? 😉 Headless UI has a few main goals:

- The hardest parts of building complex UIs usually revolve around state, events, side-effects, data computation/management. By removing these concerns from the markup, styles and implementation details, our logic and components can be more modular and reusable.
- Building UI is a very branded and custom experience, even if that means choosing a design system or adhering to a design spec. To support this custom experience, component-based UI libraries need to support a massive (and seemingly endless) API surface around markup and style customization. Headless UI libraries decouple your logic from your UI
- When you use a headless UI library, the complex task of data-processing, state-management, and business logic are handled for you, leaving you to worry about higher-cardinality decisions that differ across implementations and use cases.

Want to dive deeper? Read more about Headless UI.

## Component-based libraries vs Headless libraries

In the ecosystem of table/datagrid libraries, there are two main categories:

- Component-based table libraries
- Headless table libraries

### Which kind of table library should I use?

Each approach has subtle tradeoffs. Understanding these subtleties will help you make the right decision for your application and team.

### Component-based Table Libraries

Component-based table libraries will typically supply you with a feature-rich drop-in solution and ready-to-use components/markup complete with styles/theming. AG Grid is a great example of this type of table library.

Pros:

- Ship with ready-to-use markup/styles
- Little setup required
- Turn-key experience

Cons:

- Less control over markup
- Custom styles are typically theme-based
- Larger bundle-sizes
- Highly coupled to framework adapters and platforms

If you want a ready-to-use table and design/bundle-size are not hard requirements, then you should consider using a component-based table library.

There are a lot of component-based table libraries out there, but we believe AG Grid is the gold standard and is by far our favorite grid-sibling (don't tell the others 🤫).

### Headless Table Libraries

Headless table libraries will typically supply you with functions, state, utilities and event listeners to build your own table markup or attach to existing table markups.

Pros:

- Full control over markup and styles
- Supports all styling patterns (CSS, CSS-in-JS, UI libraries, etc)
- Smaller bundle-sizes
- Portable. Run anywhere JS runs!

Cons:

- More setup required
- No markup, styles or themes provided

If you want a lighter-weight table or full control over the design, then you should consider using a headless table library.

There are very few headless table libraries out there and obviously, TanStack Table is our favorite!
Here is the text formatted as Markdown, continuing the hierarchy:

# Overview

TanStack Table's core is framework agnostic, which means its API is the same regardless of the framework you're using. Adapters are provided to make working with the table core easier depending on your framework. See the Adapters menu for available adapters.

## Typescript

While TanStack Table is written in TypeScript, using TypeScript in your application is optional (but recommended as it comes with outstanding benefits to both you and your codebase)

## Headless

As it was mentioned extensively in the Intro section, TanStack Table is headless. This means that it doesn't render any DOM elements, and instead relies on you, the UI/UX developer to provide the table's markup and styles. This is a great way to build a table that can be used in any UI framework, including React, Vue, Solid, Svelte, Qwik, and even JS-to-native platforms like React Native!

## Core Objects and Types

The table core uses the following abstractions, commonly exposed by adapters:

- Column Defs
  - Objects used to configure a column and its data model, display templates, and more
- Table
  - The core table object containing both state and API
- Table Data
  - The core data array you provide the table
- Columns
  - Each column mirrors its respective column def and also provides column-specific APIs
- Rows
  - Each row mirrors its respective row data and provides row-specific APIs
- Header Groups
  - Header groups are computed slices of nested header levels, each containing a group of headers
- Headers
  - Each header is either directly associated with or derived from its column def and provides header-specific APIs
- Cells
  - Each cell mirrors its respective row-column intersection and provides cell-specific APIs

There are even more structures that pertain to specific features like filtering, sorting, grouping, etc, which you can find in the features section.

# Installation

Before we dig in to the API, let's get you set up!

Install your table adapter as a dependency using your favorite npm package manager.

## React Table

```bash
npm install @tanstack/react-table
```

The `@tanstack/react-table` package works with React 16.8, React 17, React 18, and React 19.

NOTE: Even though the react adapter works with React 19, it may not work with the new React Compiler that's coming out along-side React 19. This may be fixed in future TanStack Table updates.

## Table Core (no framework)

```bash
npm install @tanstack/table-core
```

Don't see your favorite framework (or favorite version of your framework) listed? You can always just use the `@tanstack/table-core` package and build your own adapter in your own codebase. Usually, only a thin wrapper is needed to manage state and rendering for your specific framework. Browse the source code of all of the other adapters to see how they work.

# Migrating to V8 Guide

## Migrating to V8

TanStack Table V8 was a major rewrite of React Table v7 from the ground up in TypeScript. The overall structure/organization of your markup and CSS will largely remain the same, but many of the APIs have been renamed or replaced.

### Notable Changes

- Full rewrite to TypeScript with types included in the base package
- Removal of plugin system to favor more inversion of control
- Vastly larger and improved API (and new features like pinning)
- Better controlled state management
- Better support for server-side operations
- Complete (but optional) data pipeline control
- Agnostic core with framework adapters for React, Solid, Svelte, Vue, and potentially more in the future
- New Dev Tools

### Install the new Version

The new version of TanStack Table is published under the `@tanstack` scope. Install the new package using your favorite package manager:

```bash
npm uninstall react-table @types/react-table
npm install @tanstack/react-table
```

```tsx
- import { useTable } from 'react-table'

+ import { useReactTable } from '@tanstack/react-table'
```

Types are now included in the base package, so you can remove the `@types/react-table` package.

If you want, you can keep the old `react-table` packages installed so that you can gradually migrate your code. You should be able to use both packages side-by-side for separate tables without any issues.

### Update Table Options

- Rename `useTable` to `useReactTable`
- The old hook and plugin systems have been removed, but they have replaced with tree-shakable row model imports for each feature.

```tsx
- import { useTable, usePagination, useSortBy } from 'react-table';

+ import {
+     useReactTable,
+     getCoreRowModel,
+     getPaginationRowModel,
+     getSortedRowModel
+ } from '@tanstack/react-table';

// ...

- const tableInstance = useTable(
-     { columns,  data },
-     useSortBy,
-     usePagination, //order of hooks used to matter
-     // etc.
- );

+ const tableInstance = useReactTable({
+     columns,
+     data,
+     getCoreRowModel: getCoreRowModel(),
+     getPaginationRowModel: getPaginationRowModel(),
+     getSortedRowModel: getSortedRowModel(), //order doesn't matter anymore!
+     // etc.
+ });
```

- All `disable*` table options were renamed to `enable*` table options. (e.g. `disableSortBy` is now `enableSorting`, `disableGroupBy` is now `enableGrouping`, etc.)
- ...

### Update column definitions

- `accessor` was renamed to either `accessorKey` or `accessorFn` (depending on whether you are using a string or function)
- `width`, `minWidth`, `maxWidth` were renamed to `size`, `minSize`, `maxSize`
- Optionally, you can use the new `createColumnHelper` function around each column definition for better TypeScript hints. (You can still just use an array of column definitions if you prefer.)
  - The first parameter is the accessor function or accessor string.
  - The second parameter is an object of column options.

```tsx
const columns = [
-   {
-     accessor: 'firstName',
-     Header: 'First Name',
-   },
-   {
-     accessor: row => row.lastName,
-     Header: () => <span>Last Name</span>,
-   },

// Best TypeScript experience, especially when using `cell.getValue()` later on

+   columnHelper.accessor('firstName', { //accessorKey
+     header: 'First Name',
+   }),
+   columnHelper.accessor(row => row.lastName, { //accessorFn
+     header: () => <span>Last Name</span>,
+   }),

// OR (if you prefer)

+   {
+     accessorKey: 'firstName',
+     header: 'First Name',
+   },
+   {
+     accessorFn: row => row.lastName,
+     header: () => <span>Last Name</span>,
+   },
]
```

Note: If defining columns inside a component, you should still try to give the column definitions a stable identity. This will help with performance and prevent unnecessary re-renders. Store the column definitions in either a `useMemo` or `useState` hook.

#### Column Option Name Changes

- `Header` was renamed to `header`
- `Cell` was renamed to `cell` (The cell render function has also changed. See below)
- `Footer` was renamed to `footer`
- All `disable*` column options were renamed to `enable*` column options. (e.g. `disableSortBy` is now `enableSorting`, `disableGroupBy` is now `enableGrouping`, etc.)
- `sortType` ➡️ `sortingFn`
- ...

#### Changes to custom cell renderers

- `value` was renamed `getValue` (Throughout the upgrade, instead of providing the `value` directly, a function `getValue` is exposed for evaluating the value. This change aims to improve performance by evaluating the value only when `getValue()` is called and then caching it.)
- `cell: { isGrouped, isPlaceholder, isAggregated }` is now `cell: { getIsGrouped, getIsPlaceholder, getIsAggregated }`
- `column`: The base level props are now RT-specific. Values that you added to the object when defining it are now one level deeper in `columnDef`.
- `table`: Props passed into the `useTable` hook now appear under `options`.

### Migrate Table Markup

- Use `flexRender()` instead of `cell.render('Cell')` or `column.render('Header')`, etc.
- `getHeaderProps`, `getFooterProps`, `getCellProps`, `getRowProps`, etc. have all been deprecated.
- TanStack Table does not provide any default style or accessibility attributes like `role` anymore. These are still important for you to get right, but it had to be removed in order to support being framework-agnostic.
- You will need to define `onClick` handlers manually, but there are new `get*Handler` helpers to keep this simple.
- You will need to define the `key` props manually
- You will need to define the `colSpan` prop manually if using features that require it (grouped headers, aggregation, etc.)

```tsx
- <th {...header.getHeaderProps()}>{cell.render('Header')}</th>

+ <th colSpan={header.colSpan} key={column.id}>
+   {flexRender(
+     header.column.columnDef.header,
+     header.getContext()
+   )}
+ </th>
```

```tsx
- <td {...cell.getCellProps()}>{cell.render('Cell')}</td>

+ <td key={cell.id}>
+   {flexRender(
+     cell.column.columnDef.cell,
+     cell.getContext()
+   )}
+ </td>
```

```tsx
// in column definitions in this case

- Header: ({ getToggleAllRowsSelectedProps }) => (
-   <input type="checkbox" {...getToggleAllRowsSelectedProps()} />
- ),
- Cell: ({ row }) => (
-   <input type="checkbox" {...row.getToggleRowSelectedProps()} />
- ),

+ header: ({ table }) => (
+   <Checkbox
+     checked={table.getIsAllRowsSelected()}
+     indeterminate={table.getIsSomeRowsSelected()}
+     onChange={table.getToggleAllRowsSelectedHandler()}
+   />
+ ),
+ cell: ({ row }) => (
+   <Checkbox
+     checked={row.getIsSelected()}
+     disabled={!row.getCanSelect()}
+     indeterminate={row.getIsSomeSelected()}
+     onChange={row.getToggleSelectedHandler()}
+   />
+ ),
```

### Other Changes

- custom `filterTypes` (now called `filterFns`) have a new function signature as it only returns a boolean for whether the row should be included or not.

```tsx
- (rows: Row[], id: string, filterValue: any) => Row[]

+ (row: Row, id: string, filterValue: any) => boolean
```

# FAQ

## How do I stop infinite rendering loops?

If you are using React, there is a very common pitfall that can cause infinite rendering. If you fail to give your columns, data, or state a stable reference, React will enter an infinite loop of re-rendering upon any change to the table state.

Why does this happen? Is this a bug in TanStack Table? No, it is not. This is fundamentally how React works, and properly managing your columns, data, and state will prevent this from happening.

TanStack Table is designed to trigger a re-render whenever either the data or columns that are passed into the table change, or whenever any of the table's state changes.

Failing to give columns or data stable references can cause an infinite loop of re-renders.

### Pitfall 1: Creating new columns or data on every render

```js
export default function MyComponent() {
  //😵 BAD: This will cause an infinite loop of re-renders because `columns` is redefined as a new array on every render!
  const columns = [
    // ...
  ];

  //😵 BAD: This will cause an infinite loop of re-renders because `data` is redefined as a new array on every render!
  const data = [
    // ...
  ];

  //❌ Columns and data are defined in the same scope as `useReactTable` without a stable reference, will cause infinite loop!
  const table = useReactTable({
    columns,
    data,
  });

  return <table>...</table>;
}
```

### Solution 1: Stable references with useMemo or useState

In React, you can give a "stable" reference to variables by defining them outside/above the component, or by using `useMemo` or `useState`, or by using a 3rd party state management library (like Redux or React Query 😉)

```js
//✅ OK: Define columns outside of the component
const columns = [
  // ...
];

//✅ OK: Define data outside of the component
const data = [
  // ...
];

// Usually it's more practical to define columns and data inside the component, so use `useMemo` or `useState` to give them stable references
export default function MyComponent() {
  //✅ GOOD: This will not cause an infinite loop of re-renders because `columns` is a stable reference
  const columns = useMemo(
    () => [
      // ...
    ],
    []
  );

  //✅ GOOD: This will not cause an infinite loop of re-renders because `data` is a stable reference
  const [data, setData] = useState(() => [
    // ...
  ]);

  // Columns and data are defined in a stable reference, will not cause infinite loop!
  const table = useReactTable({
    columns,
    data,
  });

  return <table>...</table>;
}
```

### Pitfall 2: Mutating columns or data in place

Even if you give your initial columns and data stable references, you can still run into infinite loops if you mutate them in place. This is a common pitfall that you may not notice that you are doing at first. Something as simple as an inline `data.filter()` can cause an infinite loop if you are not careful.

```js
export default function MyComponent() {
  //✅ GOOD
  const columns = useMemo(
    () => [
      // ...
    ],
    []
  );

  //✅ GOOD (React Query provides stable references to data automatically)
  const { data, isLoading } = useQuery({
    //...
  });

  const table = useReactTable({
    columns,
    //❌ BAD: This will cause an infinite loop of re-renders because `data` is mutated in place (destroys stable reference)
    data: data?.filter((d) => d.isActive) ?? [],
  });

  return <table>...</table>;
}
```

#### Solution 2: Memoize your data transformations

To prevent infinite loops, you should always memoize your data transformations. This can be done with `useMemo` or similar.

```js
export default function MyComponent() {
  //✅ GOOD
  const columns = useMemo(
    () => [
      // ...
    ],
    []
  );

  //✅ GOOD
  const { data, isLoading } = useQuery({
    //...
  });

  //✅ GOOD: This will not cause an infinite loop of re-renders because `filteredData` is memoized
  const filteredData = useMemo(() => data?.filter((d) => d.isActive) ?? [], [data]);

  const table = useReactTable({
    columns,
    data: filteredData, // stable reference!
  });

  return <table>...</table>;
}
```

##### React Forget

When React Forget is released, these problems might be a thing of the past. Or just use Solid.js... 🤓

## How do I stop my table state from automatically resetting when my data changes?

Most plugins use state that should normally reset when the data sources changes, but sometimes you need to suppress that from happening if you are filtering your data externally, or immutably editing your data while looking at it, or simply doing anything external with your data that you don't want to trigger a piece of table state to reset automatically.

For those situations, each plugin provides a way to disable the state from automatically resetting internally when data or other dependencies for a piece of state change. By setting any of them to `false`, you can stop the automatic resets from being triggered.

Here is a React-based example of stopping basically every piece of state from changing as they normally do while we edit the data source for a table:

```js
const [data, setData] = React.useState([])
const skipPageResetRef = React.useRef()

const updateData = newData => {
  // When data gets updated with this function, set a flag
  // to disable all of the auto resetting
  skipPageResetRef.current = true

  setData(newData)
}

React.useEffect(() => {
  // After the table has updated, always remove the flag
  skipPageResetRef.current = false
})

useReactTable({
  ...
  autoResetPageIndex: !skipPageResetRef.current,
  autoResetExpanded: !skipPageResetRef.current,
})
```

Now, when we update our data, the above table states will not automatically reset!

# React Table

The `@tanstack/react-table` adapter is a wrapper around the core table logic. Most of its job is related to managing state the "react" way, providing types and the rendering implementation of cell/header/footer templates.

## useReactTable

Takes an options object and returns a table.

```tsx
import { useReactTable } from '@tanstack/react-table';

function App() {
  const table = useReactTable(options);

  // ...render your table
}
```
