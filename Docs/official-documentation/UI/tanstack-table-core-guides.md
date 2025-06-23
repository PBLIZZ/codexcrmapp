# Data Guide

Tables start with your data. Your column definitions and rows will depend on the shape of your data. TanStack Table has some TypeScript features that will help you create the rest of your table code with a great type-safe experience. If you set up your data and types correctly, TanStack Table will be able to infer the shape of your data and enforce that your column definitions are made correctly.

## TypeScript

TypeScript is NOT required to use the TanStack Table packages... BUT TanStack Table is written and organized in such a way that makes the awesome TypeScript experience that you get feel like it is one of the main selling points of the library. If you are not using TypeScript, you will be missing out on a lot of great autocompletion and type-checking features that will both speed up your development time and reduce the number of bugs in your code.

### TypeScript Generics

Having a basic understanding of what TypeScript Generics are and how they work will help you understand this guide better, but it should be easy enough to pick up as you go. The official TypeScript Generics Docs may be helpful for those not yet familiar with TypeScript.

## Defining Data Types

`data` is an array of objects that will be turned into the rows of your table. Each object in the array represents a row of data (under normal circumstances). If you are using TypeScript, we usually define a type for the shape of our data. This type is used as a generic type for all of the other table, column, row, and cell instances. This Generic is usually referred to as `TData` throughout the rest of the TanStack Table types and APIs.

For example, if we have a table that displays a list of users in an array like this:

```json
[
  {
    "firstName": "Tanner",
    "lastName": "Linsley",
    "age": 33,
    "visits": 100,
    "progress": 50,
    "status": "Married"
  },
  {
    "firstName": "Kevin",
    "lastName": "Vandy",
    "age": 27,
    "visits": 200,
    "progress": 100,
    "status": "Single"
  }
]
```

Then we can define a `User` (`TData`) type like this:

```ts
//TData
type User = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: string;
};
```

We can then define our `data` array with this type, and then TanStack Table will be able to intelligently infer lots of types for us later on in our columns, rows, cells, etc. This is because the `data` type is literally defined as the `TData` generic type. Whatever you pass to the `data` table option will become the `TData` type for the rest of the table instance. Just make sure your column definitions use the same `TData` type as the `data` type when you define them later.

```ts
//note: data needs a "stable" reference in order to prevent infinite re-renders
const data: User[] = [];
//or
const [data, setData] = React.useState<User[]>([]);
//or
const data = ref<User[]>([]); //vue
//etc...
```

### Deep Keyed Data

If your data is not a nice flat array of objects, that's okay! Once you get around to defining your columns, there are strategies for accessing deeply nested data in your `accessors`.

If your data looks something like this:

```json
[
  {
    "name": {
      "first": "Tanner",
      "last": "Linsley"
    },
    "info": {
      "age": 33,
      "visits": 100
    }
  },
  {
    "name": {
      "first": "Kevin",
      "last": "Vandy"
    },
    "info": {
      "age": 27,
      "visits": 200
    }
  }
]
```

You can define a type like this:

```ts
type User = {
  name: {
    first: string;
    last: string;
  };
  info: {
    age: number;
    visits: number;
  };
};
```

And you will be able to access the data in your column definitions with either dot notation in an `accessorKey` or simply by using an `accessorFn`.

```ts
const columns = [
  {
    header: 'First Name',
    accessorKey: 'name.first',
  },
  {
    header: 'Last Name',
    accessorKey: 'name.last',
  },
  {
    header: 'Age',
    accessorFn: (row) => row.info.age,
  },
  //...
];
```

This is discussed in more detail in the Column Def Guide.

NOTE: The "keys" in your json data can usually be anything, but any periods in the keys will be interpreted as a deep key and will cause errors.

### Nested Sub-Row Data

If you are using expanding features, it can be common to have nested sub-rows in your data. This results in a recursive type that is a bit different.

So if your data looks like this:

```json
[
  {
    "firstName": "Tanner",
    "lastName": "Linsley",
    "subRows": [
      {
        "firstName": "Kevin",
        "lastName": "Vandy"
      },
      {
        "firstName": "John",
        "lastName": "Doe",
        "subRows": [
          //...
        ]
      }
    ]
  },
  {
    "firstName": "Jane",
    "lastName": "Doe"
  }
]
```

You can define a type like this:

```ts
type User = {
  firstName: string;
  lastName: string;
  subRows?: User[]; //does not have to be called "subRows", can be called anything
};
```

Where `subRows` is an optional array of `User` objects. This is discussed in more detail in the Expanding Guide.

## Give Data a "Stable" Reference

The `data` array that you pass to the table instance MUST have a "stable" reference in order to prevent bugs that cause infinite re-renders (especially in React).

This will depend on which framework adapter you are using, but in React, you should often use `React.useState`, `React.useMemo`, or similar to ensure that both the `data` and `columns` table options have stable references.

```tsx
const fallbackData = []

export default function MyComponent() {
  //✅ GOOD: This will not cause an infinite loop of re-renders because `columns` is a stable reference
  const columns = useMemo(() => [
    // ...
  ], []);

  //✅ GOOD: This will not cause an infinite loop of re-renders because `data` is a stable reference
  const [data, setData] = useState(() => [
    // ...
  ]);

  // Columns and data are defined in a stable reference, will not cause infinite loop!
  const table = useReactTable({
    columns,
    data ?? fallbackData, //also good to use a fallback array that is defined outside of the component (stable reference)
  });

  return <table>...</table>;
}
```

`React.useState` and `React.useMemo` are not the only ways to give your data a stable reference. You can also define your data outside of the component or use a 3rd party state management library like Redux, Zustand, or TanStack Query.

The main thing to avoid is defining the `data` array inside the same scope as the `useReactTable` call. That will cause the `data` array to be redefined on every render, which will cause an infinite loop of re-renders.

```tsx
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
    data ?? [], //❌ Also bad because the fallback array is re-created on every render
  });

  return <table>...</table>;
}
```

## How TanStack Table Transforms Data

Later, in other parts of these docs, you will see how TanStack Table processes the `data` that you pass to the table and generates the `row` and `cell` objects that are used to create the table. The `data` that you pass to the table is never mutated by TanStack Table, but the actual values in the `rows` and `cells` may be transformed by the `accessors` in your column definitions, or by other features performed by row models like grouping or aggregation.

## How Much Data Can TanStack Table Handle?

Believe it or not, TanStack Table was actually built to scale up to handle potentially hundreds of thousands of rows of data in the client. This is obviously not always possible, depending on the size of each column's data and the number of columns. However, the sorting, filtering, pagination, and grouping features are all built with performance in mind for large datasets.

The default mindset of a developer building a data grid is to implement server-side pagination, sorting, and filtering for large datasets. This is still usually a good idea, but a lot of developers underestimate how much data can actually be handled in the client with modern browsers and the right optimizations. If your table will never have more than a few thousand rows, you can probably take advantage of the client-side features in TanStack Table instead of implementing them yourself on the server. Before committing to letting TanStack Table's client-side features handle your large dataset, you should test it with your actual data to see if it performs well enough for your needs, of course.

This is discussed in more detail in the Pagination Guide.

# Columns Guide

## API

- [Table API](https://tanstack.com/table/v8/docs/api/core/table)

## Column Definitions Guide

Column defs are the single most important part of building a table. They are responsible for:

- Building the underlying data model that will be used for everything including sorting, filtering, grouping, etc.
- Formatting the data model into what will be displayed in the table
- Creating header groups, headers and footers
- Creating columns for display-only purposes, eg. action buttons, checkboxes, expanders, sparklines, etc.

### Column Def Types

The following "types" of column defs aren't actually TypeScript types, but more so a way to talk about and describe overall categories of column defs:

- **Accessor Columns**
  - Accessor columns have an underlying data model which means they can be sorted, filtered, grouped, etc.
- **Display Columns**
  - Display columns do not have a data model which means they cannot be sorted, filtered, etc, but they can be used to display arbitrary content in the table, eg. a row actions button, checkbox, expander, etc.
- **Grouping Columns**
  - Group columns do not have a data model so they too cannot be sorted, filtered, etc, and are used to group other columns together. It's common to define a header or footer for a column group.

### Column Helpers

While column defs are just plain objects at the end of the day, a `createColumnHelper` function is exposed from the table core which, when called with a row type, returns a utility for creating different column definition types with the highest type-safety possible.

Here's an example of creating and using a column helper:

```tsx
// Define your row shape
type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};

const columnHelper = createColumnHelper<Person>();

// Make some columns!
const defaultColumns = [
  // Display Column
  columnHelper.display({
    id: 'actions',
    cell: (props) => <RowActions row={props.row} />,
  }),
  // Grouping Column
  columnHelper.group({
    header: 'Name',
    footer: (props) => props.column.id,
    columns: [
      // Accessor Column
      columnHelper.accessor('firstName', {
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      }),
      // Accessor Column
      columnHelper.accessor((row) => row.lastName, {
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
      }),
    ],
  }),
  // Grouping Column
  columnHelper.group({
    header: 'Info',
    footer: (props) => props.column.id,
    columns: [
      // Accessor Column
      columnHelper.accessor('age', {
        header: () => 'Age',
        footer: (props) => props.column.id,
      }),
      // Grouping Column
      columnHelper.group({
        header: 'More Info',
        columns: [
          // Accessor Column
          columnHelper.accessor('visits', {
            header: () => <span>Visits</span>,
            footer: (props) => props.column.id,
          }),
          // Accessor Column
          columnHelper.accessor('status', {
            header: 'Status',
            footer: (props) => props.column.id,
          }),
          // Accessor Column
          columnHelper.accessor('progress', {
            header: 'Profile Progress',
            footer: (props) => props.column.id,
          }),
        ],
      }),
    ],
  }),
];
```

### Creating Accessor Columns

Data columns are unique in that they must be configured to extract primitive values for each item in your data array.

There are 3 ways to do this:

1. If your items are objects, use an object-key that corresponds to the value you want to extract.
2. If your items are nested arrays, use an array index that corresponds to the value you want to extract.
3. Use an accessor function that returns the value you want to extract.

#### Object Keys

If each of your items is an object with the following shape:

```tsx
type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};
```

You could extract the `firstName` value like so:

```tsx
columnHelper.accessor('firstName')

// OR

{
  accessorKey: 'firstName',
}
```

#### Array Indices

If each of your items is an array with the following shape:

```tsx
type Sales = [Date, number];
```

You could extract the `number` value like so:

```tsx
columnHelper.accessor(1)

// OR

{
  accessorKey: 1,
}
```

#### Accessor Functions

If each of your items is an object with the following shape:

```tsx
type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: string;
  progress: number;
};
```

You could extract a computed `full-name` value like so:

```tsx
columnHelper.accessor(row => `${row.firstName} ${row.lastName}`, {
  id: 'fullName',
})

// OR

{
  id: 'fullName',
  accessorFn: row => `${row.firstName} ${row.lastName}`,
}
```

🧠 Remember, the accessed value is what is used to sort, filter, etc. so you'll want to make sure your accessor function returns a primitive value that can be manipulated in a meaningful way. If you return a non-primitive value like an object or array, you will need the appropriate filter/sort/grouping functions to manipulate them, or even supply your own! 😬

### Unique Column IDs

Columns are uniquely identified with 3 strategies:

- If defining an accessor column with an object key or array index, the same will be used to uniquely identify the column.
  - Any periods (`.`) in an object key will be replaced by underscores (`_`).
- If defining an accessor column with an accessor function
  - The columns `id` property will be used to uniquely identify the column OR
  - If a primitive string `header` is supplied, that `header` string will be used to uniquely identify the column

🧠 An easy way to remember: If you define a column with an accessor function, either provide a string header or provide a unique `id` property.

### Column Formatting & Rendering

By default, columns cells will display their data model value as a string. You can override this behavior by providing custom rendering implementations. Each implementation is provided relevant information about the cell, header or footer and returns something your framework adapter can render eg. JSX/Components/strings/etc. This will depend on which adapter you are using.

There are a couple of formatters available to you:

- `cell`: Used for formatting cells.
- `aggregatedCell`: Used for formatting cells when aggregated.
- `header`: Used for formatting headers.
- `footer`: Used for formatting footers.

#### Cell Formatting

You can provide a custom cell formatter by passing a function to the `cell` property and using the `props.getValue()` function to access your cell's value:

```tsx
columnHelper.accessor('firstName', {
  cell: (props) => <span>{props.getValue().toUpperCase()}</span>,
});
```

Cell formatters are also provided the `row` and `table` objects, allowing you to customize the cell formatting beyond just the cell value. The example below provides `firstName` as the accessor, but also displays a prefixed user ID located on the original `row` object:

```tsx
columnHelper.accessor('firstName', {
  cell: (props) => <span>{`${props.row.original.id} - ${props.getValue()}`}</span>,
});
```

#### Aggregated Cell Formatting

For more info on aggregated cells, see [grouping](https://tanstack.com/table/v8/docs/guide/grouping).

#### Header & Footer Formatting

Headers and footers do not have access to row data, but still use the same concepts for displaying custom content.

# Table Instance Guide

## API

- [Table API](https://tanstack.com/table/v8/docs/api/core/table)

## Table Instance Guide

TanStack Table is a headless UI library. When we talk about the `table` or "table instance", we're not talking about a literal `<table>` element. Instead, we're referring to the core table object that contains the table state and APIs. The table instance is created by calling your adapter's `createTable` function (e.g. `useReactTable`, `createSolidTable`, `createSvelteTable`, `useQwikTable`, `useVueTable`).

### Creating a Table Instance

To create a table instance, 2 options are required: `columns` and `data`. There are dozens of other table options to configure features and behavior, but these 2 are required.

#### Defining Data

`data` is an array of objects that will be turned into the rows of your table. Each object in the array represents a row of data (under normal circumstances). If you are using TypeScript, we usually define a type for the shape of our data. This type is used as a generic type for all of the other table, column, row, and cell instances. This type is usually referred to as `TData`.

For example, if we have a table that displays a list of users in an array like this:

```json
[
  {
    "firstName": "Tanner",
    "lastName": "Linsley",
    "age": 33,
    "visits": 100,
    "progress": 50,
    "status": "Married"
  },
  {
    "firstName": "Kevin",
    "lastName": "Vandy",
    "age": 27,
    "visits": 200,
    "progress": 100,
    "status": "Single"
  }
]
```

Then we can define a `User` (`TData`) type like this:

```ts
//TData
type User = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: string;
};
```

We can then define our `data` array with this type, and then TanStack Table will be able to intelligently infer lots of types for us later on in our columns, rows, cells, etc.

```ts
//note: data needs a "stable" reference in order to prevent infinite re-renders
const data: User[] = [];
//or
const [data, setData] = React.useState<User[]>([]);
//or
const data = ref<User[]>([]);
//etc...
```

Note: `data` needs a "stable" reference (especially in React) in order to prevent infinite re-renders. This is why we recommend using `React.useState` or `React.useMemo`, or defining your `data` outside of the same react component that creates the table instance, or using a library like TanStack Query to manage your data state.

#### Defining Columns

Column definitions are covered in detail in the next section in the [Column Def Guide](https://tanstack.com/table/v8/docs/guide/column-defs). We'll note here, however, that when you define the type of your columns, you should use the same `TData` type that you used for you `data`.

```ts
const columns: ColumnDef<User>[] = []; //Pass User type as the generic TData type
//or
const columnHelper = createColumnHelper<User>(); //Pass User type as the generic TData type
```

The column definitions are where we will tell TanStack Table how each column should access and/or transform row data with either an `accessorKey` or `accessorFn`. See the [Column Def Guide](https://tanstack.com/table/v8/docs/guide/column-defs) for more info.

#### Creating the Table Instance

With our `columns` and `data` defined, we can now create our basic table instance.

```ts
//vanilla js
const table = createTable({ columns, data });

//react
const table = useReactTable({ columns, data });

//solid
const table = createSolidTable({ columns, data });

//svelte
const table = createSvelteTable({ columns, data });

//vue
const table = useVueTable({ columns, data });
```

So what's in the table instance? Let's take a look at what interactions we can have with the table instance.

### Table State

The table instance contains all of the table state, which can be accessed via the `table.getState()` API. Each table feature registers various states in the table state. For example, the row selection feature registers `rowSelection` state, the pagination feature registers `pagination` state, etc.

Each feature will also have corresponding state setter APIs and state resetter APIs on the table instance. For example, the row selection feature will have a `setRowSelection` API and a `resetRowSelection`.

```ts
table.getState().rowSelection; //read the row selection state
table.setRowSelection((old) => ({ ...old })); //set the row selection state
table.resetRowSelection(); //reset the row selection state
```

### Table APIs

There are dozens of table APIs created by each feature to help you either read or mutate the table state in different ways.

API reference docs for the core table instance and all other feature APIs can be found throughout the API docs.

For example, you can find the core table instance API docs here: [Table API](https://tanstack.com/table/v8/docs/api/core/table)

### Table Row Models

There is a special set of table instance APIs for reading rows out of the table instance called `row models`. TanStack Table has advanced features where the rows that are generated may be very different than the array of `data` that you originally passed in. To learn more about the different row models that you can pass in as a table option, see the [Row Models Guide](https://tanstack.com/table/v8/docs/guide/row-models).

# Row Models Guide

## Row Models Guide

If you take a look at the most basic example of TanStack Table, you'll see a code snippet like this:

```ts
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

function Component() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(), //row model
  });
}
```

What is this `getCoreRowModel` function? And why do you have to import it from TanStack Table only to just pass it back to itself?

Well, the answer is that TanStack Table is a modular library. Not all code for every single feature is included in the `createTable` functions/hooks by default. You only need to import and include the code that you will need to correctly generate rows based on the features you want to use.

### What are Row Models?

Row models run under the hood of TanStack Table to transform your original `data` in useful ways that are needed for data grid features like filtering, sorting, grouping, expanding, and pagination. The rows that get generated and render on screen won't necessarily be a 1:1 mapping of the original `data` that you passed to the table. They may be sorted, filtered, paginated, etc.

### Import Row Models

You should only import the row models that you need. Here are all of the row models that are available:

```ts
//only import the row models you need
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
}
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  getFacetedMinMaxValues: getFacetedMinMaxValues(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
  getFilteredRowModel: getFilteredRowModel(),
  getGroupedRowModel: getGroupedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

### Customize/Fork Row Models

You don't have to use the exact row models that are provided by TanStack Table. If you need some advanced customization for certain row models, feel free to copy the source code for the row model you want to customize and modify it to your needs.

### Using Row Models

Once your table instance has been created, you can access all of the row models that you may need directly from the table instance. There are even more derived row models available apart from the ones that you may have imported.

For normal rendering use cases, you will probably only need to use the `table.getRowModel()` method, as this row model will use all/any of the other row models depending on which features you have enabled or disabled. All of the other row models are available for you to "dig into" some of the underlying data transformations that are happening in the table.

#### Available Row Models on Table Instance

- `getRowModel` - This is the main row model that you should use for rendering your table rows markup. It will use all of the other row models to generate the final row model that you will use to render your table rows.
- `getCoreRowModel` - returns a basic row model that is just a 1:1 mapping of the original data passed to the table.
- `getFilteredRowModel` - returns a row model that accounts for column filtering and global filtering.
- `getPreFilteredRowModel` - returns a row model before column filtering and global filtering are applied.
- `getGroupedRowModel` - returns a row model that applies grouping and aggregation to the data and creates sub-rows.
- `getPreGroupedRowModel` - returns a row model before grouping and aggregation are applied.
- `getSortedRowModel` - returns a row model that has had sorting applied to it.
- `getPreSortedRowModel` - returns a row model before sorting is applied (rows are in original order).
- `getExpandedRowModel` - returns a row model that accounts for expanded/hidden sub-rows.
- `getPreExpandedRowModel` - returns a row model that only includes root level rows with no expanded sub-rows included. Still includes sorting.
- `getPaginationRowModel` - returns a row model that only includes the rows that should be displayed on the current page based on the pagination state.
- `getPrePaginationRowModel` - returns a row model without pagination applied (includes all rows).
- `getSelectedRowModel` - returns a row model of all selected rows (but only based on the data that was passed to the table). Runs after `getCoreRowModel`.
- `getPreSelectedRowModel` - returns a row model before row selection is applied (Just returns `getCoreRowModel`).
- `getGroupedSelectedRowModel` - returns a row model of selected rows after grouping. Runs after `getSortedRowModel`, which runs after `getGroupedRowModel`, which runs after `getFilteredRowModel`.
- `getFilteredSelectedRowModel` - returns a row model of selected rows after column filtering and global filtering. Runs after `getFilteredRowModel`.

#### The Order of Row Model Execution

Knowing how TanStack Table processes rows internally can help you gain a better understanding of what is happening under the hood, and help you debug any issues you may encounter.

Internally, this is the order in which each of the row models are applied to the data, if their respective features are enabled:

`getCoreRowModel` -> `getFilteredRowModel` -> `getGroupedRowModel` -> `getSortedRowModel` -> `getExpandedRowModel` -> `getPaginationRowModel` -> `getRowModel`

If in any case the respective feature is disabled or turned off with a "manual\*" table option, the `getPre*RowModel` will be used instead in that step of the process.

As you can see above, first the data is filtered, then grouped, then sorted, then expanded, and then finally paginated as the final step.

#### Row Model Data Structure

Each row model will provide you the rows in 3 different useful formats:

- `rows` - An array of rows.
- `flatRows` - An array of rows, but all sub-rows are flattened into the top level.
- `rowsById` - An object of rows, where each row is keyed by its `id`. This is useful for quickly looking up rows by their `id` with better performance.

```ts
console.log(table.getRowModel().rows); // array of rows
console.log(table.getRowModel().flatRows); // array of rows, but all sub-rows are flattened into the top level
console.log(table.getRowModel().rowsById['row-id']); // object of rows, where each row is keyed by its `id`
```

# Rows Guide

## API

- [Row API](https://tanstack.com/table/v8/docs/api/core/row)

## Rows Guide

This quick guide will discuss the different ways you can retrieve and interact with row objects in TanStack Table.

### Where to Get Rows From

There are multiple table instance APIs you can use to retrieve rows from the table instance.

#### `table.getRow`

If you need to access a specific row by its `id`, you can use the `table.getRow` table instance API.

```js
const row = table.getRow(rowId);
```

#### Row Models

The table instance generates row objects and stores them in useful arrays called "Row Models". This is discussed in much more detail in the [Row Models Guide](https://tanstack.com/table/v8/docs/guide/row-models), but here are the most common ways you may access the row models.

##### Render Rows

```jsx
<tbody>
  {table.getRowModel().rows.map((row) => (
    <tr key={row.id}>{/* ... */}</tr>
  ))}
</tbody>
```

##### Get Selected Rows

```js
const selectedRows = table.getSelectedRowModel().rows;
```

### Row Objects

Every row object contains row data and many APIs to either interact with the table state or extract cells from the row based on the state of the table.

#### Row IDs

Every row object has an `id` property that makes it unique within the table instance. By default the `row.id` is the same as the `row.index` that is created in the row model. However, it can be useful to override each row's `id` with a unique identifier from the row's data. You can use the `getRowId` table option to do this.

```js
const table = useReactTable({
  columns,
  data,
  getRowId: (originalRow) => originalRow.uuid, //override the row.id with the uuid from the original row's data
});
```

Note: In some features like grouping and expanding, the `row.id` will have additional string appended to it.

#### Access Row Values

The recommended way to access data values from a row is to use either the `row.getValue` or `row.renderValue` APIs. Using either of these APIs will cache the results of the accessor functions and keep rendering efficient. The only difference between the two is that `row.renderValue` will return either the value or the `renderFallbackValue` if the value is `undefined`, whereas `row.getValue` will return the value or `undefined` if the value is `undefined`.

```js
// Access data from any of the columns
const firstName = row.getValue('firstName'); // read the row value from the firstName column
const renderedLastName = row.renderValue('lastName'); // render the value from the lastName column
```

Note: `cell.getValue` and `cell.renderValue` are shortcuts for the `row.getValue` and `row.renderValue` APIs, respectively.

#### Access Original Row Data

For every row object, you can access the original corresponding data that was passed to the table instance via the `row.original` property. None of the data in the `row.original` will have been modified by the accessors in your column definitions, so if you were doing any sort of data transformations in your accessors, those will not be reflected in the `row.original` object.

```js
// Access any data from the original row
const firstName = row.original.firstName; // { firstName: 'John', lastName: 'Doe' }
```

### Sub Rows

If you are using either grouping or expanding features, your rows may contain sub-rows or parent row references. This is discussed in much more detail in the [Expanding Guide](https://tanstack.com/table/v8/docs/guide/expanding), but here is a quick overview of useful properties and methods for working with sub-rows.

- `row.subRows`: An array of sub-rows for the row.
- `row.depth`: The depth of the row (if nested or grouped) relative to the root row array. 0 for root level rows, 1 for child rows, 2 for grandchild rows, etc.
- `row.parentId`: The unique ID of the parent row for the row (The row that contains this row in its `subRows` array).
- `row.getParentRow`: Returns the parent row for the row, if it exists.

### More Row APIs

Depending on the features that you are using for your table, there are dozens more useful APIs for interacting with rows. See each features' respective API docs or guide for more information.

# Cells Guide

## API

- [Cell API](https://tanstack.com/table/v8/docs/api/core/cell)

## Cells Guide

This quick guide will discuss the different ways you can retrieve and interact with cell objects in TanStack Table.

### Where to Get Cells From

Cells come from Rows. Enough said, right?

There are multiple row instance APIs you can use to retrieve the appropriate cells from a row depending on which features you are using. Most commonly, you will use the `row.getAllCells` or `row.getVisibleCells` APIs (if you are using column visibility features), but there are a handful of other similar APIs that you can use.

### Cell Objects

Every cell object can be associated with a `<td>` or similar cell element in your UI. There are a few properties and methods on cell objects that you can use to interact with the table state and extract cell values from the table based on the state of the table.

#### Cell IDs

Every cell object has an `id` property that makes it unique within the table instance. Each `cell.id` is constructed simply as a union of its parent row and column IDs separated by an underscore.

```js
{
  id: `${row.id}_${column.id}`;
}
```

During grouping or aggregation features, the `cell.id` will have additional string appended to it.

#### Cell Parent Objects

Every cell stores a reference to its parent `row` and `column` objects.

#### Access Cell Values

The recommended way to access data values from a cell is to use either the `cell.getValue` or `cell.renderValue` APIs. Using either of these APIs will cache the results of the accessor functions and keep rendering efficient. The only difference between the two is that `cell.renderValue` will return either the value or the `renderFallbackValue` if the value is `undefined`, whereas `cell.getValue` will return the value or `undefined` if the value is `undefined`.

Note: The `cell.getValue` and `cell.renderValue` APIs are shortcuts `row.getValue` and `row.renderValue` APIs, respectively.

```js
// Access data from any of the columns
const firstName = cell.getValue('firstName'); // read the cell value from the firstName column
const renderedLastName = cell.renderValue('lastName'); // render the value from the lastName column
```

#### Access Other Row Data from Any Cell

Since every cell object is associated with its parent row, you can access any data from the original row that you are using in your table using `cell.row.original`.

```js
// Even if we are in the scope of a different cell, we can still access the original row data
const firstName = cell.row.original.firstName; // { firstName: 'John', lastName: 'Doe' }
```

### More Cell APIs

Depending on the features that you are using for your table, there are dozens more useful APIs for interacting with cells. See each features' respective API docs or guide for more information.

### Cell Rendering

You can just use the `cell.renderValue` or `cell.getValue` APIs to render the cells of your table. However, these APIs will only spit out the raw cell values (from accessor functions). If you are using the `cell: () => JSX` column definition options, you will want to use the `flexRender` API utility from your adapter.

Using the `flexRender` API will allow the cell to be rendered correctly with any extra markup or JSX and it will call the callback function with the correct parameters.

```jsx
import { flexRender } from '@tanstack/react-table'

const columns = [
  {
    accessorKey: 'fullName',
    cell: ({ cell, row }) => {
      return <div><strong>{row.original.firstName}</strong> {row.original.lastName}</div>
    }
    //...
  }
]
//...

<tr>
  {row.getVisibleCells().map(cell => {
    return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
  })}
</tr>
```

# Header Groups Guide

## API

- [Header Group API](https://tanstack.com/table/v8/docs/api/core/headerGroup)

## Header Groups Guide

This quick guide will discuss the different ways you can retrieve and interact with header group objects in TanStack Table.

### What are Header Groups?

Header Groups are simply "rows" of headers. Don't let the name confuse you, it's just that simple. The large majority of tables will only have one row of headers (a single header group), but if you define your column structure with nested columns as with the [Column Groups example](https://tanstack.com/table/v8/docs/examples/basic/column-groups), you can have multiple rows of headers (multiple header groups).

### Where to Get Header Groups From

There are multiple table instance APIs you can use to retrieve header groups from the table instance. `table.getHeaderGroups` is the most common API to use, but depending on the features that you are using, you may need to use other APIs, such as `table.get[Left/Center/Right]HeaderGroups` if you are using column pinning features.

### Header Group Objects

Header Group objects are similar to Row objects, though simpler since there is not as much going on in header rows as there are in the body rows.

By default, header groups only have three properties:

- `id`: The unique identifier for the header group that is generated from its depth (index). This is useful as a key for React components.
- `depth`: The depth of the header group, zero-indexed based. Think of this as the row index amongst all header rows.
- `headers`: An array of Header cell objects that belong to this header group (row).

#### Access Header Cells

To render the header cells in a header group, you just map over the `headers` array from the header group object.

```jsx
<thead>
  {table.getHeaderGroups().map((headerGroup) => {
    return (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(
          (
            header // map over the headerGroup headers array
          ) => (
            <th key={header.id} colSpan={header.colSpan}>
              {/* */}
            </th>
          )
        )}
      </tr>
    );
  })}
</thead>
```

# Headers Guide

## API

- [Header API](https://tanstack.com/table/v8/docs/api/core/header)

## Headers Guide

This quick guide will discuss the different ways you can retrieve and interact with header objects in TanStack Table.

Headers are the equivalent of cells, but meant for the `<thead>` section of the table instead of the `<tbody>` section.

### Where to Get Headers From

Headers come from Header Groups, which are the equivalent of rows, but meant for the `<thead>` section of the table instead of the `<tbody>` section.

#### HeaderGroup Headers

If you are in a header group, the headers are stored as an array in the `headerGroup.headers` property. Usually you will just map over this array to render your headers.

```jsx
<thead>
  {table.getHeaderGroups().map((headerGroup) => {
    return (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(
          (
            header // map over the headerGroup headers array
          ) => (
            <th key={header.id} colSpan={header.colSpan}>
              {/* */}
            </th>
          )
        )}
      </tr>
    );
  })}
</thead>
```

#### Header Table Instance APIs

There are multiple table instance APIs that you can use to retrieve a list of headers depending on the features that you are using. The most common API you might use is `table.getFlatHeaders`, which will return a flat list of all headers in the table, but there are at least a dozen other headers that are useful in tandem with the column visibility and column pinning features. APIs like `table.getLeftLeafHeaders` or `table.getRightFlatHeaders` could be useful depending on your use case.

### Header Objects

Header objects are similar to Cell objects, but meant for the `<thead>` section of the table instead of the `<tbody>` section. Every header object can be associated with a `<th>` or similar cell element in your UI. There are a few properties and methods on header objects that you can use to interact with the table state and extract cell values from the table based on the state of the table.

#### Header IDs

Every header object has an `id` property that makes it unique within the table instance. Usually you only need this `id` as a unique identifier for React keys or if you are following the performant column resizing example.

For simple headers with no advanced nested or grouped headers logic, the `header.id` will be the same as it's parent `column.id`. However, if the header is part group column or a placeholder cell, it will have a more complicated `id` that is constructed from the header family, depth/header row index, column id, and header group id.

#### Nested Grouped Headers Properties

There are a few properties on header objects that are only useful if the header is part of a nested or grouped header structure. These properties include:

- `colspan`: The number of columns that the header should span. This is useful for rendering the `colSpan` attribute on the `<th>` element.
- `rowSpan`: The number of rows that the header should span. This is useful for rendering the `rowSpan` attribute on the `<th>` element. (Currently not implemented in default TanStack Table)
- `depth`: The header group "row index" that the header group belongs to.
- `isPlaceholder`: A boolean flag that is `true` if the header is a placeholder header. Placeholder headers are used to fill in the gaps when a column is hidden or when a column is part of a group column.
- `placeholderId`: The unique identifier for the placeholder header.
- `subHeaders`: The array of sub/child headers that belong to this header. Will be empty if the header is a leaf header.

Note: `header.index` refers to its index within the header group (row of headers), i.e. its position from left to right. It is not the same as `header.depth`, which refers to the header group "row index".

#### Header Parent Objects

Every header stores a reference to its parent `column` object and its parent `headerGroup` object.

### More Header APIs

Headers have a few more useful APIs attached to them that are useful for interacting with the table state. Most of them relate to the [Column sizing and resizing features](https://tanstack.com/table/v8/docs/guide/resizing). See the [Column Sizing Guide](https://tanstack.com/table/v8/docs/guide/resizing) for more information.

### Header Rendering

Since the header `column` option you defined can be either a string, jsx, or a function returning either of those, the best way to render the headers is to use the `flexRender` utility from your adapter, which will handle all of those cases for you.

```jsx
{
  headerGroup.headers.map((header) => (
    <th key={header.id} colSpan={header.colSpan}>
      {/* Handles all possible header column def scenarios for `header` */}
      {flexRender(header.column.columnDef.header, header.getContext())}
    </th>
  ));
}
```

# Columns Guide

## API

- [Column API](https://tanstack.com/table/v8/docs/api/core/column)

## Columns Guide

Note: This guide is about the actual column objects that are generated within the table instance and NOT about setting up the column definitions for your table.

This quick guide will discuss the different ways you can retrieve and interact with column objects in TanStack Table.

### Where to Get Columns From

You can find the column objects in many places. They are often attached

#### Header and Cell Objects

Before you reach for one of the table instance APIs, consider if you actually need to retrieve either headers or cells instead of columns. If you are rending out the markup for your table, you will most likely want to reach for the APIs that return headers or cells instead of columns. The column objects themselves are not really meant to render out the headers or cells, but the header and cell objects will contain references to these column objects from which they can derive the necessary information to render their UI.

```js
const column = cell.column; // get column from cell
const column = header.column; // get column from header
```

#### Column Table Instance APIs

There are dozens of table instance APIs you can use to retrieve columns from the table instance. Which APIs you will use will depend entirely on which features you are using in your table and your use-case.

##### Get Column

If you need to just get a single column by its ID, you can use the `table.getColumn` API.

```js
const column = table.getColumn('firstName');
```

##### Get Columns

The simplest column API is `table.getAllColumns`, which will return a list of all columns in the table. There are dozens of other column APIs that are affected by other features and the state of the table that come alongside this API though. `table.getAllFlatColumns`, `table.getAllLeafColumns`, `getCenterLeafColumns`, `table.getLeftVisibleLeafColumns` are just some examples of other column APIs that you might use in tandem with the column visibility or column pinning features.

### Column Objects

Column objects are not actually meant to be used to render out the table UI directly, so they are not associated 1-to-1 with any `<th>` or `<td>` elements in your table, but they contain a lot of useful properties and methods that you can use to interact with the table state.

#### Column IDs

Every column must have a unique `id` defined in their associated [Column Definition](https://tanstack.com/table/v8/docs/api/core/column-def). Usually, you define this `id` yourself, or it is derived from the `accessorKey` or `header` properties in the column definition.

#### ColumnDef

A reference to the original `columnDef` object that was used to created the column is always available on the column object.

#### Nested Grouped Columns Properties

There are a few properties on column objects that are only useful if the column is part of a nested or grouped column structure. These properties include:

- `columns`: An array of child columns that belong to a group column.
- `depth`: The header group "row index" that the column group belongs to.
- `parent`: The parent column of the column. If the column is a top-level column, this will be `undefined`.

### More Column APIs

There are dozens of Column APIs that you can use to interact with the table state and extract cell values from the table based on the state of the table. See each features column API documentation for more information.

### Column Rendering

Don't necessarily use column objects to render headers or cells directly. Instead, use the header and cell objects, as discussed above.

But if you are just rendering a list of columns somewhere else in your UI for something like a column visibility menu or something similar, you can just map over a columns array and render out the UI as you normally would.

# Table State (React) Guide

## Examples

Want to skip to the implementation? Check out these examples:

- [kitchen sink](https://tanstack.com/table/v8/docs/examples/react/kitchen-sink)
- [fully controlled](https://tanstack.com/table/v8/docs/examples/react/fully-controlled)

## Table State (React) Guide

TanStack Table has a simple underlying internal state management system to store and manage the state of the table. It also lets you selectively pull out any state that you need to manage in your own state management. This guide will walk you through the different ways in which you can interact with and manage the state of the table.

### Accessing Table State

You do not need to set up anything special in order for the table state to work. If you pass nothing into either `state`, `initialState`, or any of the `on[State]Change` table options, the table will manage its own state internally. You can access any part of this internal state by using the `table.getState()` table instance API.

```jsx
const table = useReactTable({
  columns,
  data,
  //...
});

console.log(table.getState()); //access the entire internal state
console.log(table.getState().rowSelection); //access just the row selection state
```

### Custom Initial State

If all you need to do for certain states is customize their initial default values, you still do not need to manage any of the state yourself. You can simply set values in the `initialState` option of the table instance.

```jsx
const table = useReactTable({
  columns,
  data,
  initialState: {
    columnOrder: ['age', 'firstName', 'lastName'], //customize the initial column order
    columnVisibility: {
      id: false, //hide the id column by default
    },
    expanded: true, //expand all rows by default
    sorting: [
      {
        id: 'age',
        desc: true, //sort by age in descending order by default
      },
    ],
  },
  //...
});
```

Note: Only specify each particular state in either `initialState` or `state`, but not both. If you pass in a particular state value to both `initialState` and `state`, the initialized state in `state` will take overwrite any corresponding value in `initialState`.

### Controlled State

If you need easy access to the table state in other areas of your application, TanStack Table makes it easy to control and manage any or all of the table state in your own state management system. You can do this by passing in your own state and state management functions to the `state` and `on[State]Change` table options.

#### Individual Controlled State

You can control just the state that you need easy access to. You do NOT have to control all of the table state if you do not need to. It is recommended to only control the state that you need on a case-by-case basis.

In order to control a particular state, you need to both pass in the corresponding state value and the `on[State]Change` function to the table instance.

Let's take filtering, sorting, and pagination as an example in a "manual" server-side data fetching scenario. You can store the filtering, sorting, and pagination state in your own state management, but leave out any other state like column order, column visibility, etc. if your API does not care about those values.

```jsx
const [columnFilters, setColumnFilters] = React.useState([]); //no default filters
const [sorting, setSorting] = React.useState([
  {
    id: 'age',
    desc: true, //sort by age in descending order by default
  },
]);
const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 15 });

//Use our controlled state values to fetch data
const tableQuery = useQuery({
  queryKey: ['users', columnFilters, sorting, pagination],
  queryFn: () => fetchUsers(columnFilters, sorting, pagination),
  //...
});

const table = useReactTable({
  columns,
  data: tableQuery.data,
  //...
  state: {
    columnFilters, //pass controlled state back to the table (overrides internal state)
    sorting,
    pagination,
  },
  onColumnFiltersChange: setColumnFilters, //hoist columnFilters state into our own state management
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
});
//...
```

#### Fully Controlled State

Alternatively, you can control the entire table state with the `onStateChange` table option. It will hoist out the entire table state into your own state management system. Be careful with this approach, as you might find that raising some frequently changing state values up a react tree, like `columnSizingInfo` state`, might cause bad performance issues.

A couple of more tricks may be needed to make this work. If you use the `onStateChange` table option, the initial values of the state must be populated with all of the relevant state values for all of the features that you want to use. You can either manually type out all of the initial state values, or use the `table.setOptions` API in a special way as shown below.

```jsx
//create a table instance with default state values
const table = useReactTable({
  columns,
  data,
  //... Note: `state` values are NOT passed in yet
});

const [state, setState] = React.useState({
  ...table.initialState, //populate the initial state with all of the default state values from the table instance
  pagination: {
    pageIndex: 0,
    pageSize: 15, //optionally customize the initial pagination state.
  },
});

//Use the table.setOptions API to merge our fully controlled state onto the table instance
table.setOptions((prev) => ({
  ...prev, //preserve any other options that we have set up above
  state, //our fully controlled state overrides the internal state
  onStateChange: setState, //any state changes will be pushed up to our own state management
}));
```

### On State Change Callbacks

So far, we have seen the `on[State]Change` and `onStateChange` table options work to "hoist" the table state changes into our own state management. However, there are a few things about using these options that you should be aware of.

1. State Change Callbacks MUST have their corresponding state value in the `state` option.
   Specifying an `on[State]Change` callback tells the table instance that this will be a controlled state. If you do not specify the corresponding state value, that state will be "frozen" with its initial value.

   ```jsx
   const [sorting, setSorting] = React.useState([]);
   //...
   const table = useReactTable({
     columns,
     data,
     //...
     state: {
       sorting, //required because we are using `onSortingChange`
     },
     onSortingChange: setSorting, //makes the `state.sorting` controlled
   });
   ```

2. Updaters can either be raw values or callback functions.
   The `on[State]Change` and `onStateChange` callbacks work exactly like the `setState` functions in React. The updater values can either be a new state value or a callback function that takes the previous state value and returns the new state value.

   What implications does this have? It means that if you want to add in some extra logic in any of the `on[State]Change` callbacks, you can do so, but you need to check whether or not the new incoming updater value is a function or value.

   ```jsx
   const [sorting, setSorting] = React.useState([])
   const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

   const table = useReactTable({
     columns,
     data,
     //...
     state: {
       pagination,
       sorting,
     }
     //syntax 1
     onPaginationChange: (updater) => {
       setPagination(old => {
         const newPaginationValue = updater instanceof Function ? updater(old) : updater
         //do something with the new pagination value
         //...
         return newPaginationValue
       })
     },
     //syntax 2
     onSortingChange: (updater) => {
       const newSortingValue = updater instanceof Function ? updater(sorting) : updater
       //do something with the new sorting value
       //...
       setSorting(updater) //normal state update
     }
   })
   ```

### State Types

All complex states in TanStack Table have their own TypeScript# Headers Guide

## API

- [Header API](https://tanstack.com/table/v8/docs/api/core/header)

## Headers Guide

This quick guide will discuss the different ways you can retrieve and interact with header objects in TanStack Table.

Headers are the equivalent of cells, but meant for the `<thead>` section of the table instead of the `<tbody>` section.

### Where to Get Headers From

Headers come from Header Groups, which are the equivalent of rows, but meant for the `<thead>` section of the table instead of the `<tbody>` section.

#### HeaderGroup Headers

If you are in a header group, the headers are stored as an array in the `headerGroup.headers` property. Usually you will just map over this array to render your headers.

```jsx
<thead>
  {table.getHeaderGroups().map((headerGroup) => {
    return (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(
          (
            header // map over the headerGroup headers array
          ) => (
            <th key={header.id} colSpan={header.colSpan}>
              {/* */}
            </th>
          )
        )}
      </tr>
    );
  })}
</thead>
```

#### Header Table Instance APIs

There are multiple table instance APIs that you can use to retrieve a list of headers depending on the features that you are using. The most common API you might use is `table.getFlatHeaders`, which will return a flat list of all headers in the table, but there are at least a dozen other headers that are useful in tandem with the column visibility and column pinning features. APIs like `table.getLeftLeafHeaders` or `table.getRightFlatHeaders` could be useful depending on your use case.

### Header Objects

Header objects are similar to Cell objects, but meant for the `<thead>` section of the table instead of the `<tbody>` section. Every header object can be associated with a `<th>` or similar cell element in your UI. There are a few properties and methods on header objects that you can use to interact with the table state and extract cell values from the table based on the state of the table.

#### Header IDs

Every header object has an `id` property that makes it unique within the table instance. Usually you only need this `id` as a unique identifier for React keys or if you are following the performant column resizing example.

For simple headers with no advanced nested or grouped headers logic, the `header.id` will be the same as it's parent `column.id`. However, if the header is part group column or a placeholder cell, it will have a more complicated `id` that is constructed from the header family, depth/header row index, column id, and header group id.

#### Nested Grouped Headers Properties

There are a few properties on header objects that are only useful if the header is part of a nested or grouped header structure. These properties include:

- `colspan`: The number of columns that the header should span. This is useful for rendering the `colSpan` attribute on the `<th>` element.
- `rowSpan`: The number of rows that the header should span. This is useful for rendering the `rowSpan` attribute on the `<th>` element. (Currently not implemented in default TanStack Table)
- `depth`: The header group "row index" that the header group belongs to.
- `isPlaceholder`: A boolean flag that is `true` if the header is a placeholder header. Placeholder headers are used to fill in the gaps when a column is hidden or when a column is part of a group column.
- `placeholderId`: The unique identifier for the placeholder header.
- `subHeaders`: The array of sub/child headers that belong to this header. Will be empty if the header is a leaf header.

Note: `header.index` refers to its index within the header group (row of headers), i.e. its position from left to right. It is not the same as `header.depth`, which refers to the header group "row index".

#### Header Parent Objects

Every header stores a reference to its parent `column` object and its parent `headerGroup` object.

### More Header APIs

Headers have a few more useful APIs attached to them that are useful for interacting with the table state. Most of them relate to the [Column sizing and resizing features](https://tanstack.com/table/v8/docs/guide/resizing). See the [Column Sizing Guide](https://tanstack.com/table/v8/docs/guide/resizing) for more information.

### Header Rendering

Since the header `column` option you defined can be either a string, jsx, or a function returning either of those, the best way to render the headers is to use the `flexRender` utility from your adapter, which will handle all of those cases for you.

```jsx
{
  headerGroup.headers.map((header) => (
    <th key={header.id} colSpan={header.colSpan}>
      {/* Handles all possible header column def scenarios for `header` */}
      {flexRender(header.column.columnDef.header, header.getContext())}
    </th>
  ));
}
```

# Columns Guide

## API

- [Column API](https://tanstack.com/table/v8/docs/api/core/column)

## Columns Guide

Note: This guide is about the actual column objects that are generated within the table instance and NOT about setting up the column definitions for your table.

This quick guide will discuss the different ways you can retrieve and interact with column objects in TanStack Table.

### Where to Get Columns From

You can find the column objects in many places. They are often attached

#### Header and Cell Objects

Before you reach for one of the table instance APIs, consider if you actually need to retrieve either headers or cells instead of columns. If you are rending out the markup for your table, you will most likely want to reach for the APIs that return headers or cells instead of columns. The column objects themselves are not really meant to render out the headers or cells, but the header and cell objects will contain references to these column objects from which they can derive the necessary information to render their UI.

```js
const column = cell.column; // get column from cell
const column = header.column; // get column from header
```

#### Column Table Instance APIs

There are dozens of table instance APIs you can use to retrieve columns from the table instance. Which APIs you will use will depend entirely on which features you are using in your table and your use-case.

##### Get Column

If you need to just get a single column by its ID, you can use the `table.getColumn` API.

```js
const column = table.getColumn('firstName');
```

##### Get Columns

The simplest column API is `table.getAllColumns`, which will return a list of all columns in the table. There are dozens of other column APIs that are affected by other features and the state of the table that come alongside this API though. `table.getAllFlatColumns`, `table.getAllLeafColumns`, `getCenterLeafColumns`, `table.getLeftVisibleLeafColumns` are just some examples of other column APIs that you might use in tandem with the column visibility or column pinning features.

### Column Objects

Column objects are not actually meant to be used to render out the table UI directly, so they are not associated 1-to-1 with any `<th>` or `<td>` elements in your table, but they contain a lot of useful properties and methods that you can use to interact with the table state.

#### Column IDs

Every column must have a unique `id` defined in their associated [Column Definition](https://tanstack.com/table/v8/docs/api/core/column-def). Usually, you define this `id` yourself, or it is derived from the `accessorKey` or `header` properties in the column definition.

#### ColumnDef

A reference to the original `columnDef` object that was used to created the column is always available on the column object.

#### Nested Grouped Columns Properties

There are a few properties on column objects that are only useful if the column is part of a nested or grouped column structure. These properties include:

- `columns`: An array of child columns that belong to a group column.
- `depth`: The header group "row index" that the column group belongs to.
- `parent`: The parent column of the column. If the column is a top-level column, this will be `undefined`.

### More Column APIs

There are dozens of Column APIs that you can use to interact with the table state and extract cell values from the table based on the state of the table. See each features column API documentation for more information.

### Column Rendering

Don't necessarily use column objects to render headers or cells directly. Instead, use the header and cell objects, as discussed above.

But if you are just rendering a list of columns somewhere else in your UI for something like a column visibility menu or something similar, you can just map over a columns array and render out the UI as you normally would.

# Table State (React) Guide

## Examples

Want to skip to the implementation? Check out these examples:

- [kitchen sink](https://tanstack.com/table/v8/docs/examples/react/kitchen-sink)
- [fully controlled](https://tanstack.com/table/v8/docs/examples/react/fully-controlled)

## Table State (React) Guide

TanStack Table has a simple underlying internal state management system to store and manage the state of the table. It also lets you selectively pull out any state that you need to manage in your own state management. This guide will walk you through the different ways in which you can interact with and manage the state of the table.

### Accessing Table State

You do not need to set up anything special in order for the table state to work. If you pass nothing into either `state`, `initialState`, or any of the `on[State]Change` table options, the table will manage its own state internally. You can access any part of this internal state by using the `table.getState()` table instance API.

```jsx
const table = useReactTable({
  columns,
  data,
  //...
});

console.log(table.getState()); //access the entire internal state
console.log(table.getState().rowSelection); //access just the row selection state
```

### Custom Initial State

If all you need to do for certain states is customize their initial default values, you still do not need to manage any of the state yourself. You can simply set values in the `initialState` option of the table instance.

```jsx
const table = useReactTable({
  columns,
  data,
  initialState: {
    columnOrder: ['age', 'firstName', 'lastName'], //customize the initial column order
    columnVisibility: {
      id: false, //hide the id column by default
    },
    expanded: true, //expand all rows by default
    sorting: [
      {
        id: 'age',
        desc: true, //sort by age in descending order by default
      },
    ],
  },
  //...
});
```

Note: Only specify each particular state in either `initialState` or `state`, but not both. If you pass in a particular state value to both `initialState` and `state`, the initialized state in `state` will take overwrite any corresponding value in `initialState`.

### Controlled State

If you need easy access to the table state in other areas of your application, TanStack Table makes it easy to control and manage any or all of the table state in your own state management system. You can do this by passing in your own state and state management functions to the `state` and `on[State]Change` table options.

#### Individual Controlled State

You can control just the state that you need easy access to. You do NOT have to control all of the table state if you do not need to. It is recommended to only control the state that you need on a case-by-case basis.

In order to control a particular state, you need to both pass in the corresponding state value and the `on[State]Change` function to the table instance.

Let's take filtering, sorting, and pagination as an example in a "manual" server-side data fetching scenario. You can store the filtering, sorting, and pagination state in your own state management, but leave out any other state like column order, column visibility, etc. if your API does not care about those values.

```jsx
const [columnFilters, setColumnFilters] = React.useState([]); //no default filters
const [sorting, setSorting] = React.useState([
  {
    id: 'age',
    desc: true, //sort by age in descending order by default
  },
]);
const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 15 });

//Use our controlled state values to fetch data
const tableQuery = useQuery({
  queryKey: ['users', columnFilters, sorting, pagination],
  queryFn: () => fetchUsers(columnFilters, sorting, pagination),
  //...
});

const table = useReactTable({
  columns,
  data: tableQuery.data,
  //...
  state: {
    columnFilters, //pass controlled state back to the table (overrides internal state)
    sorting,
    pagination,
  },
  onColumnFiltersChange: setColumnFilters, //hoist columnFilters state into our own state management
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
});
//...
```

#### Fully Controlled State

Alternatively, you can control the entire table state with the `onStateChange` table option. It will hoist out the entire table state into your own state management system. Be careful with this approach, as you might find that raising some frequently changing state values up a react tree, like `columnSizingInfo` state`, might cause bad performance issues.

A couple of more tricks may be needed to make this work. If you use the `onStateChange` table option, the initial values of the state must be populated with all of the relevant state values for all of the features that you want to use. You can either manually type out all of the initial state values, or use the `table.setOptions` API in a special way as shown below.

```jsx
//create a table instance with default state values
const table = useReactTable({
  columns,
  data,
  //... Note: `state` values are NOT passed in yet
});

const [state, setState] = React.useState({
  ...table.initialState, //populate the initial state with all of the default state values from the table instance
  pagination: {
    pageIndex: 0,
    pageSize: 15, //optionally customize the initial pagination state.
  },
});

//Use the table.setOptions API to merge our fully controlled state onto the table instance
table.setOptions((prev) => ({
  ...prev, //preserve any other options that we have set up above
  state, //our fully controlled state overrides the internal state
  onStateChange: setState, //any state changes will be pushed up to our own state management
}));
```

### On State Change Callbacks

So far, we have seen the `on[State]Change` and `onStateChange` table options work to "hoist" the table state changes into our own state management. However, there are a few things about using these options that you should be aware of.

1. State Change Callbacks MUST have their corresponding state value in the `state` option.
   Specifying an `on[State]Change` callback tells the table instance that this will be a controlled state. If you do not specify the corresponding state value, that state will be "frozen" with its initial value.

   ```jsx
   const [sorting, setSorting] = React.useState([]);
   //...
   const table = useReactTable({
     columns,
     data,
     //...
     state: {
       sorting, //required because we are using `onSortingChange`
     },
     onSortingChange: setSorting, //makes the `state.sorting` controlled
   });
   ```

2. Updaters can either be raw values or callback functions.
   The `on[State]Change` and `onStateChange` callbacks work exactly like the `setState` functions in React. The updater values can either be a new state value or a callback function that takes the previous state value and returns the new state value.

   What implications does this have? It means that if you want to add in some extra logic in any of the `on[State]Change` callbacks, you can do so, but you need to check whether or not the new incoming updater value is a function or value.

   ```jsx
   const [sorting, setSorting] = React.useState([])
   const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

   const table = useReactTable({
     columns,
     data,
     //...
     state: {
       pagination,
       sorting,
     }
     //syntax 1
     onPaginationChange: (updater) => {
       setPagination(old => {
         const newPaginationValue = updater instanceof Function ? updater(old) : updater
         //do something with the new pagination value
         //...
         return newPaginationValue
       })
     },
     //syntax 2
     onSortingChange: (updater) => {
       const newSortingValue = updater instanceof Function ? updater(sorting) : updater
       //do something with the new sorting value
       //...
       setSorting(updater) //normal state update
     }
   })
   ```

### State Types

All complex states in TanStack Table have their own TypeScripttypes that you can import and use. This can be handy for ensuring that you are using the correct data structures and properties for the state values that you are controlling.

```tsx
import { useReactTable, type SortingState } from '@tanstack/react-table';
//...
const [sorting, setSorting] = React.useState<SortingState[]>([
  {
    id: 'age', //you should get autocomplete for the `id` and `desc` properties
    desc: true,
  },
]);
```

And that's it for the Table State (React) Guide! Let me know if you have any other questions.
