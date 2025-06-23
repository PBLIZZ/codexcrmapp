# TanStack Table v8 Features Guide

## Column Ordering Guide

### Examples

Want to skip to the implementation? Check out these examples:

- [column-ordering](https://tanstack.com/table/v8/docs/examples/react/column-ordering)
- [column-dnd](https://tanstack.com/table/v8/docs/examples/react/column-dnd)

### API

[Column Ordering API](https://tanstack.com/table/v8/docs/api/features/column-ordering)

### Column Ordering Guide

By default, columns are ordered in the order they are defined in the `columns` array. However, you can manually specify the column order using the `columnOrder` state. Other features like column pinning and grouping can also affect the column order.

### What Affects Column Order

There are 3 table features that can reorder columns, which happen in the following order:

1.  **Column Pinning** - If pinning, columns are split into left, center (unpinned), and right pinned columns.
2.  **Manual Column Ordering** - A manually specified column order is applied.
3.  **Grouping** - If grouping is enabled, a grouping state is active, and `tableOptions.groupedColumnMode` is set to `'reorder' | 'remove'`, then the grouped columns are reordered to the start of the column flow.

**Note:** `columnOrder` state will only affect unpinned columns if used in conjunction with column pinning.

### Column Order State

If you don't provide a `columnOrder` state, TanStack Table will just use the order of the columns in the `columns` array. However, you can provide an array of string column ids to the `columnOrder` state to specify the order of the columns.

#### Default Column Order

If all you need to do is specify the initial column order, you can just specify the `columnOrder` state in the `initialState` table option.

```jsx
const table = useReactTable({
  //...
  initialState: {
    columnOrder: ['columnId1', 'columnId2', 'columnId3'],
  },
  //...
});
```

**Note:** If you are using the `state` table option to also specify the `columnOrder` state, the `initialState` will have no effect. Only specify particular states in either `initialState` or `state`, not both.

#### Managing Column Order State

If you need to dynamically change the column order, or set the column order after the table has been initialized, you can manage the `columnOrder` state just like any other table state.

```jsx
const [columnOrder, setColumnOrder] = useState<string[]>(['columnId1', 'columnId2', 'columnId3']); //optionally initialize the column order
//...
const table = useReactTable({
  //...
  state: {
    columnOrder,
    //...
  }
  onColumnOrderChange: setColumnOrder,
  //...
});
```

### Reordering Columns

If the table has UI that allows the user to reorder columns, you can set up the logic something like this:

```tsx
const [columnOrder, setColumnOrder] = useState<string[]>(columns.map((c) => c.id));

//depending on your dnd solution of choice, you may or may not need state like this
const [movingColumnId, setMovingColumnId] = useState<string | null>(null);
const [targetColumnId, setTargetColumnId] = useState<string | null>(null);

//util function to splice and reorder the columnOrder array
const reorderColumn = <TData extends RowData>(
  movingColumnId: Column<TData>,
  targetColumnId: Column<TData>
): string[] => {
  const newColumnOrder = [...columnOrder];
  newColumnOrder.splice(
    newColumnOrder.indexOf(targetColumnId),
    0,
    newColumnOrder.splice(newColumnOrder.indexOf(movingColumnId), 1)[0]
  );
  setColumnOrder(newColumnOrder);
};

const handleDragEnd = (e: DragEvent) => {
  if (!movingColumnId || !targetColumnId) return;
  setColumnOrder(reorderColumn(movingColumnId, targetColumnId));
};

//use your dnd solution of choice
```

### Drag and Drop Column Reordering Suggestions (React)

There are undoubtedly many ways to implement drag and drop features along-side TanStack Table. Here are a few suggestions in order for you to not have a bad time:

- **Do NOT try to use "react-dnd" if you are using React 18 or newer.** React DnD was an important library for its time, but it now does not get updated very often, and it has incompatibilities with React 18, especially in React Strict Mode. It is still possible to get it to work, but there are newer alternatives that have better compatibility and are more actively maintained. React DnD's Provider may also interfere and conflict with any other DnD solutions you may want to try in your app.
- **Use "@dnd-kit/core".** DnD Kit is a modern, modular and lightweight drag and drop library that is highly compatible with the modern React ecosystem, and it works well with semantic `<table>` markup. Both of the official TanStack DnD examples, Column DnD and Row DnD, now use DnD Kit.
- **Consider other DnD libraries like "react-beautiful-dnd"**, but be aware of their potentially large bundle sizes, maintenance status, and compatibility with `<table>` markup.
- **Consider using native browser events and state management to implement lightweight drag and drop features.** However, be aware that this approach may not be best for mobile users if you do not go the extra mile to implement proper touch events. [Material React Table V2](https://www.material-react-table.com/) is an example of a library that implements TanStack Table with only browser drag and drop events such as `onDragStart`, `onDragEnd`, `onDragEnter` and no other dependencies. Browse its source code to see how it is done.

---

## Column Pinning Guide

### Examples

Want to skip to the implementation? Check out these examples:

- [column-pinning](https://tanstack.com/table/v8/docs/examples/react/column-pinning)
- [sticky-column-pinning](https://tanstack.com/table/v8/docs/examples/react/sticky-column-pinning)

#### Other Examples

- [Svelte column-pinning](https://tanstack.com/table/v8/docs/examples/svelte/column-pinning)
- [Vue column-pinning](https://tanstack.com/table/v8/docs/examples/vue/column-pinning)

### API

[Column Pinning API](https://tanstack.com/table/v8/docs/api/features/column-pinning)

### Column Pinning Guide

TanStack Table offers state and APIs helpful for implementing column pinning features in your table UI. You can implement column pinning in multiple ways. You can either split pinned columns into their own separate tables, or you can keep all columns in the same table, but use the pinning state to order the columns correctly and use sticky CSS to pin the columns to the left or right.

### How Column Pinning Affects Column Order

There are 3 table features that can reorder columns, which happen in the following order:

1.  **Column Pinning** - If pinning, columns are split into left, center (unpinned), and right pinned columns.
2.  **Manual Column Ordering** - A manually specified column order is applied.
3.  **Grouping** - If grouping is enabled, a grouping state is active, and `tableOptions.groupedColumnMode` is set to `'reorder' | 'remove'`, then the grouped columns are reordered to the start of the column flow.

The only way to change the order of the pinned columns is in the `columnPinning.left` and `columnPinning.right` state itself. `columnOrder` state will only affect the order of the unpinned ("center") columns.

### Column Pinning State

Managing the `columnPinning` state is optional, and usually not necessary unless you are adding persistent state features. TanStack Table will already keep track of the column pinning state for you. Manage the `columnPinning` state just like any other table state if you need to.

```jsx
const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
  left: [],
  right: [],
});
//...
const table = useReactTable({
  //...
  state: {
    columnPinning,
    //...
  }
  onColumnPinningChange: setColumnPinning,
  //...
});
```

#### Pin Columns by Default

A very common use case is to pin some columns by default. You can do this by either initializing the `columnPinning` state with the pinned columnIds, or by using the `initialState` table option

```jsx
const table = useReactTable({
  //...
  initialState: {
    columnPinning: {
      left: ['expand-column'],
      right: ['actions-column'],
    },
    //...
  },
  //...
});
```

#### Useful Column Pinning APIs

**Note:** Some of these APIs are new in v8.12.0

There are a handful of useful Column API methods to help you implement column pinning features:

- `column.getCanPin`: Use to determine if a column can be pinned.
- `column.pin`: Use to pin a column to the left or right. Or use to unpin a column.
- `column.getIsPinned`: Use to determine where a column is pinned.
- `column.getStart`: Use to provide the correct `left` CSS value for a pinned column.
- `column.getAfter`: Use to provide the correct `right` CSS value for a pinned column.
- `column.getIsLastColumn`: Use to determine if a column is the last column in its pinned group. Useful for adding a box-shadow
- `column.getIsFirstColumn`: Use to determine if a column is the first column in its pinned group. Useful for adding a box-shadow

### Split Table Column Pinning

If you are just using sticky CSS to pin columns, you can for the most part, just render the table as you normally would with the `table.getHeaderGroups` and `row.getVisibleCells` methods.

However, if you are splitting up pinned columns into their own separate tables, you can make use of the `table.getLeftHeaderGroups`, `table.getCenterHeaderGroups`, `table.getRightHeaderGroups`, `row.getLeftVisibleCells`, `row.getCenterVisibleCells`, and `row.getRightVisibleCells` methods to only render the columns that are relevant to the current table.

---

## Column Sizing Guide

### Examples

Want to skip to the implementation? Check out these examples:

- [column-sizing](https://tanstack.com/table/v8/docs/examples/react/column-sizing)
- [column-resizing-performant](https://tanstack.com/table/v8/docs/examples/react/column-resizing-performant)

### API

[Column Sizing API](https://tanstack.com/table/v8/docs/api/features/column-sizing)

### Column Sizing Guide

The column sizing feature allows you to optionally specify the width of each column including min and max widths. It also allows you and your users the ability to dynamically change the width of all columns at will, eg. by dragging the column headers.

### Column Widths

Columns by default are given the following measurement options:

```tsx
export const defaultColumnSizing = {
  size: 150,
  minSize: 20,
  maxSize: Number.MAX_SAFE_INTEGER,
};
```

These defaults can be overridden by both `tableOptions.defaultColumn` and individual column defs, in that order.

```tsx
const columns = [
  {
    accessorKey: 'col1',
    size: 270, //set column size for this column
  },
  //...
];

const table = useReactTable({
  //override default column sizing
  defaultColumn: {
    size: 200, //starting column size
    minSize: 50, //enforced during column resizing
    maxSize: 500, //enforced during column resizing
  },
});
```

The column "sizes" are stored in the table state as numbers, and are usually interpreted as pixel unit values, but you can hook up these column sizing values to your css styles however you see fit.

As a headless utility, table logic for column sizing is really only a collection of states that you can apply to your own layouts how you see fit (our example above implements 2 styles of this logic). You can apply these width measurements in a variety of ways:

- semantic table elements or any elements being displayed in a table css mode
- div/span elements or any elements being displayed in a non-table css mode
- Block level elements with strict widths
- Absolutely positioned elements with strict widths
- Flexbox positioned elements with loose widths
- Grid positioned elements with loose widths
- Really any layout mechanism that can interpolate cell widths into a table structure.

Each of these approaches has its own tradeoffs and limitations which are usually opinions held by a UI/component library or design system, luckily not you 😉.

### Column Resizing

TanStack Table provides built-in column resizing state and APIs that allow you to easily implement column resizing in your table UI with a variety of options for UX and performance.

#### Enable Column Resizing

By default, the `column.getCanResize()` API will return `true` by default for all columns, but you can either disable column resizing for all columns with the `enableColumnResizing` table option, or disable column resizing on a per-column basis with the `enableResizing` column option.

```tsx
const columns = [
  {
    accessorKey: 'id',
    enableResizing: false, //disable resizing for just this column
    size: 200, //starting column size
  },
  //...
];
```

```tsx
const table = useReactTable({
  //...
  enableColumnResizing: false, //disable column resizing for all columns
});
```

#### Column Resize Mode

By default, the column resize mode is set to "onEnd". This means that the `column.getSize()` API will not return the new column size until the user has finished resizing (dragging) the column. Usually a small UI indicator will be displayed while the user is resizing the column.

In React TanStack Table adapter, where achieving 60 fps column resizing renders can be difficult, depending on the complexity of your table or web page, the "onEnd" column resize mode can be a good default option to avoid stuttering or lagging while the user resizes columns. That is not to say that you cannot achieve 60 fps column resizing renders while using TanStack React Table, but you may have to do some extra memoization or other performance optimizations in order to achieve this.

Advanced column resizing performance tips will be discussed down below.

If you want to change the column resize mode to "onChange" for immediate column resizing renders, you can do so with the `columnResizeMode` table option.

```tsx
const table = useReactTable({
  //...
  columnResizeMode: 'onChange', //change column resize mode to "onChange"
});
```

#### Column Resize Direction

By default, TanStack Table assumes that the table markup is laid out in a left-to-right direction. For right-to-left layouts, you may need to change the column resize direction to "rtl".

```tsx
const table = useReactTable({
  //...
  columnResizeDirection: 'rtl', //change column resize direction to "rtl" for certain locales
});
```

#### Connect Column Resizing APIs to UI

There are a few really handy APIs that you can use to hook up your column resizing drag interactions to your UI.

##### Column Size APIs

To apply the size of a column to the column head cells, data cells, or footer cells, you can use the following APIs:

```ts
header.getSize();
column.getSize();
cell.column.getSize();
```

How you apply these size styles to your markup is up to you, but it is pretty common to use either CSS variables or inline styles to apply the column sizes.

```tsx
<th
  key={header.id}
  colSpan={header.colSpan}
  style={{ width: `${header.getSize()}px` }}
>
```

Though, as discussed in the advanced column resizing performance section, you may want to consider using CSS variables to apply column sizes to your markup.

##### Column Resize APIs

TanStack Table provides a pre-built event handler to make your drag interactions easy to implement. These event handlers are just convenience functions that call other internal APIs to update the column sizing state and re-render the table. Use `header.getResizeHandler()` to connect to your column resize drag interactions, for both mouse and touch events.

```tsx
<ColumnResizeHandle
  onMouseDown={header.getResizeHandler()} //for desktop
  onTouchStart={header.getResizeHandler()} //for mobile
/>
```

##### Column Resize Indicator with ColumnSizingInfoState

TanStack Table keeps track of an state object called `columnSizingInfo` that you can use to render a column resize indicator UI.

```jsx
<ColumnResizeIndicator
  style={{
    transform: header.column.getIsResizing()
      ? `translateX(${table.getState().columnSizingInfo.deltaOffset}px)`
      : '',
  }}
/>
```

### Advanced Column Resizing Performance

If you are creating large or complex tables (and using React 😉), you may find that if you do not add proper memoization to your render logic, your users may experience degraded performance while resizing columns.

We have created a [performant column resizing example](https://tanstack.com/table/v8/docs/examples/react/column-resizing-performant) that demonstrates how to achieve 60 fps column resizing renders with a complex table that may otherwise have slow renders. It is recommended that you just look at that example to see how it is done, but these are the basic things to keep in mind:

- **Don't use `column.getSize()` on every header and every data cell.** Instead, calculate all column widths once upfront, memoized!
- **Memoize your Table Body** while resizing is in progress.
- **Use CSS variables to communicate column widths** to your table cells.

If you follow these steps, you should see significant performance improvements while resizing columns.

If you are not using React, and are using the Svelte, Vue, or Solid adapters instead, you may not need to worry about this as much, but similar principles apply.

---

## Column Visibility Guide

### Examples

Want to skip to the implementation? Check out these examples:

- [column-visibility](https://tanstack.com/table/v8/docs/examples/react/column-visibility)
- [column-ordering](https://tanstack.com/table/v8/docs/examples/react/column-ordering)
- [sticky-column-pinning](https://tanstack.com/table/v8/docs/examples/react/sticky-column-pinning)

#### Other Examples

- [SolidJS column-visibility](https://tanstack.com/table/v8/docs/examples/solid/column-visibility)
- [Svelte column-visibility](https://tanstack.com/table/v8/docs/examples/svelte/column-visibility)

### API

[Column Visibility API](https://tanstack.com/table/v8/docs/api/features/column-visibility)

### Column Visibility Guide

The column visibility feature allows table columns to be hidden or shown dynamically. In previous versions of react-table, this feature was a static property on a column, but in v8, there is a dedicated `columnVisibility` state and APIs for managing column visibility dynamically.

### Column Visibility State

The `columnVisibility` state is a map of column IDs to boolean values. A column will be hidden if its ID is present in the map and the value is `false`. If the column ID is not present in the map, or the value is `true`, the column will be shown.

```jsx
const [columnVisibility, setColumnVisibility] = useState({
  columnId1: true,
  columnId2: false, //hide this column by default
  columnId3: true,
});

const table = useReactTable({
  //...
  state: {
    columnVisibility,
    //...
  },
  onColumnVisibilityChange: setColumnVisibility,
});
```

Alternatively, if you don't need to manage the column visibility state outside of the table, you can still set the initial default column visibility state using the `initialState` option.

**Note:** If `columnVisibility` is provided to both `initialState` and `state`, the state initialization will take precedence and `initialState` will be ignored. Do not provide `columnVisibility` to both `initialState` and `state`, only one or the other.

```jsx
const table = useReactTable({
  //...
  initialState: {
    columnVisibility: {
      columnId1: true,
      columnId2: false, //hide this column by default
      columnId3: true,
    },
    //...
  },
});
```

### Disable Hiding Columns

By default, all columns can be hidden or shown. If you want to prevent certain columns from being hidden, you set the `enableHiding` column option to `false` for those columns.

```jsx
const columns = [
  {
    header: 'ID',
    accessorKey: 'id',
    enableHiding: false, // disable hiding for this column
  },
  {
    header: 'Name',
    accessor: 'name', // can be hidden
  },
];
```

### Column Visibility Toggle APIs

There are several column API methods that are useful for rendering column visibility toggles in the UI.

- `column.getCanHide` - Useful for disabling the visibility toggle for a column that has `enableHiding` set to `false`.
- `column.getIsVisible` - Useful for setting the initial state of the visibility toggle.
- `column.toggleVisibility` - Useful for toggling the visibility of a column.
- `column.getToggleVisibilityHandler` - Shortcut for hooking up the `column.toggleVisibility` method to a UI event handler.

```jsx
{
  table.getAllColumns().map((column) => (
    <label key={column.id}>
      <input
        checked={column.getIsVisible()}
        disabled={!column.getCanHide()}
        onChange={column.getToggleVisibilityHandler()}
        type='checkbox'
      />
      {column.columnDef.header}
    </label>
  ));
}
```

### Column Visibility Aware Table APIs

When you render your header, body, and footer cells, there are a lot of API options available. You may see APIs like `table.getAllLeafColumns` and `row.getAllCells`, but if you use these APIs, they will not take column visibility into account. Instead, you need to use the "visible" variants of these APIs, such as `table.getVisibleLeafColumns` and `row.getVisibleCells`.

```jsx
<table>
  <thead>
    <tr>
      {table.getVisibleLeafColumns().map((column) => ( // takes column visibility into account
        //
      ))}
    </tr>
  </thead>
  <tbody>
    {table.getRowModel().rows.map((row) => (
      <tr key={row.id}>
        {row.getVisibleCells().map((cell) => ( // takes column visibility into account
          //
        ))}
      </tr>
    ))}
  </tbody>
</table>
```

If you are using the Header Group APIs, they will already take column visibility into account.

---

## Column Filtering Guide

### Examples

Want to skip to the implementation? Check out these examples:

- [filters (includes faceting)](https://tanstack.com/table/v8/docs/examples/react/filters)
- [editable-data](https://tanstack.com/table/v8/docs/examples/react/editable-data)
- [expanding](https://tanstack.com/table/v8/docs/examples/react/expanding)
- [grouping](https://tanstack.com/table/v8/docs/examples/react/grouping)
- [pagination](https://tanstack.com/table/v8/docs/examples/react/pagination)
- [row-selection](https://tanstack.com/table/v8/docs/examples/react/row-selection)

### API

[Column Filtering API](https://tanstack.com/table/v8/docs/api/features/column-filtering)

### Column Filtering Guide

Filtering comes in 2 flavors: [Column Filtering](https://tanstack.com/table/v8/docs/guide/column-filtering) and [Global Filtering](https://tanstack.com/table/v8/docs/guide/global-filtering).

This guide will focus on column filtering, which is a filter that is applied to a single column's accessor value.

TanStack table supports both both client-side and manual server-side filtering. This guide will go over how to implement and customize both, and help you decide which one is best for your use-case.

### Client-Side vs Server-Side Filtering

If you have a large dataset, you may not want to load all of that data into the client's browser in order to filter it. In this case, you will most likely want to implement server-side filtering, sorting, pagination, etc.

However, as also discussed in the [Pagination Guide](https://tanstack.com/table/v8/docs/guide/pagination), a lot of developers underestimate how many rows can be loaded client-side without a performance hit. The TanStack table examples are often tested to handle up to 100,000 rows or more with decent performance for client-side filtering, sorting, pagination, and grouping. This doesn't necessarily that your app will be able to handle that many rows, but if your table is only going to have a few thousand rows at most, you might be able to take advantage of the client-side filtering, sorting, pagination, and grouping that TanStack table provides.

**TanStack Table can handle thousands of client-side rows with good performance. Don't rule out client-side filtering, pagination, sorting, etc. without some thought first.**

Every use-case is different and will depend on the complexity of the table, how many columns you have, how large every piece of data is, etc. The main bottlenecks to pay attention to are:

- Can your server query all of the data in a reasonable amount of time (and cost)?
- What is the total size of the fetch? (This might not scale as badly as you think if you don't have many columns.)
- Is the client's browser using too much memory if all of the data is loaded at once?

If you're not sure, you can always start with client-side filtering and pagination and then switch to server-side strategies in the future as your data grows.

### Manual Server-Side Filtering

If you have decided that you need to implement server-side filtering instead of using the built-in client-side filtering, here's how you do that.

No `getFilteredRowModel` table option is needed for manual server-side filtering. Instead, the data that you pass to the table should already be filtered. However, if you have passed a `getFilteredRowModel` table option, you can tell the table to skip it by setting the `manualFiltering` option to `true`.

```jsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  // getFilteredRowModel: getFilteredRowModel(), // not needed for manual server-side filtering
  manualFiltering: true,
});
```

**Note:** When using manual filtering, many of the options that are discussed in the rest of this guide will have no effect. When is `manualFiltering` is set to `true`, the table instance will not apply any filtering logic to the rows that are passed to it. Instead, it will assume that the rows are already filtered and will use the data that you pass to it as-is.

### Client-Side Filtering

If you are using the built-in client-side filtering features, first you need to pass in a `getFilteredRowModel` function to the table options. This function will be called whenever the table needs to filter the data. You can either import the default `getFilteredRowModel` function from TanStack Table or create your own.

```jsx
import { useReactTable, getFilteredRowModel } from '@tanstack/react-table';
//...
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(), // needed for client-side filtering
});
```

### Column Filter State

Whether or not you use client-side or server-side filtering, you can take advantage of the built-in column filter state management that TanStack Table provides. There are many table and column APIs to mutate and interact with the filter state and retrieving the column filter state.

The column filtering state is defined as an array of objects with the following shape:

```ts
interface ColumnFilter {
  id: string;
  value: unknown;
}
type ColumnFiltersState = ColumnFilter[];
```

Since the column filter state is an array of objects, you can have multiple column filters applied at once.

#### Accessing Column Filter State

You can access the column filter state from the table instance just like any other table state using the `table.getState()` API.

```jsx
const table = useReactTable({
  columns,
  data,
  //...
});

console.log(table.getState().columnFilters); // access the column filters state from the table instance
```

However, if you need to access the column filter state before the table is initialized, you can "control" the column filter state like down below.

#### Controlled Column Filter State

If you need easy access to the column filter state, you can control/manage the column filter state in your own state management with the `state.columnFilters` and `onColumnFiltersChange` table options.

```tsx
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]); // can set initial column filter state here
//...
const table = useReactTable({
  columns,
  data,
  //...
  state: {
    columnFilters,
  },
  onColumnFiltersChange: setColumnFilters,
});
```

#### Initial Column Filter State

If you do not need to control the column filter state in your own state management or scope, but you still want to set an initial column filter state, you can use the `initialState` table option instead of `state`.

```jsx
const table = useReactTable({
  columns,
  data,
  //...
  initialState: {
    columnFilters: [
      {
        id: 'name',
        value: 'John', // filter the name column by 'John' by default
      },
    ],
  },
});
```

**NOTE:** Do not use both `initialState.columnFilters` and `state.columnFilters` at the same time, as the initialized state in the `state.columnFilters` will override the `initialState.columnFilters`.

### FilterFns

Each column can have its own unique filtering logic. Choose from any of the filter functions that are provided by TanStack Table, or create your own.

By default there are 10 built-in filter functions to choose from:

- `includesString` - Case-insensitive string inclusion
- `includesStringSensitive` - Case-sensitive string inclusion
- `equalsString` - Case-insensitive string equality
- `equalsStringSensitive` - Case-sensitive string equality
- `arrIncludes` - Item inclusion within an array
- `arrIncludesAll` - All items included in an array
- `arrIncludesSome` - Some items included in an array
- `equals` - Object/referential equality Object.is/===
- `weakEquals` - Weak object/referential equality `==`
- `inNumberRange` - Number range inclusion

You can also define your own custom filter functions either as the `filterFn` column option, or as a global filter function using the `filterFns` table option.

#### Custom Filter Functions

**Note:** These filter functions only run during client-side filtering.

When defining a custom filter function in either the `filterFn` column option or the `filterFns` table option, it should have the following signature:

```ts
const myCustomFilterFn: FilterFn = (
  row: Row,
  columnId: string,
  filterValue: any,
  addMeta: (meta: any) => void
) => boolean;
```

Every filter function receives:

- The row to filter
- The `columnId` to use to retrieve the row's value
- The filter value

and should return `true` if the row should be included in the filtered rows, and `false` if it should be removed.

```jsx
const columns = [
  {
    header: () => 'Name',
    accessorKey: 'name',
    filterFn: 'includesString', // use built-in filter function
  },
  {
    header: () => 'Age',
    accessorKey: 'age',
    filterFn: 'inNumberRange',
  },
  {
    header: () => 'Birthday',
    accessorKey: 'birthday',
    filterFn: 'myCustomFilterFn', // use custom global filter function
  },
  {
    header: () => 'Profile',
    accessorKey: 'profile',
    // use custom filter function directly
    filterFn: (row, columnId, filterValue) => {
      return; // true or false based on your custom logic
    },
  },
];
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  filterFns: {
    //add a custom sorting function
    myCustomFilterFn: (row, columnId, filterValue) => {
      //defined inline here
      return; // true or false based on your custom logic
    },
    startsWith: startsWithFilterFn, // defined elsewhere
  },
});
```

#### Customize Filter Function Behavior

You can attach a few other properties to filter functions to customize their behavior:

- `filterFn.resolveFilterValue` - This optional "hanging" method on any given filterFn allows the filter function to transform/sanitize/format the filter value before it is passed to the filter function.
- `filterFn.autoRemove` - This optional "hanging" method on any given filterFn is passed a filter value and expected to return `true` if the filter value should be removed from the filter state. eg. Some boolean-style filters may want to remove the filter value from the table state if the filter value is set to `false`.

```tsx
const startsWithFilterFn = <TData extends MRT_RowData>(
  row: Row<TData>,
  columnId: string,
  filterValue: number | string //resolveFilterValue will transform this to a string
) =>
  row.getValue<number | string>(columnId).toString().toLowerCase().trim().startsWith(filterValue); // toString, toLowerCase, and trim the filter value in `resolveFilterValue`

// remove the filter value from filter state if it is falsy (empty string in this case)
startsWithFilterFn.autoRemove = (val: any) => !val;

// transform/sanitize/format the filter value before it is passed to the filter function
startsWithFilterFn.resolveFilterValue = (val: any) => val.toString().toLowerCase().trim();
```

### Customize Column Filtering

There are a lot of table and column options that you can use to further customize the column filtering behavior.

#### Disable Column Filtering

By default, column filtering is enabled for all columns. You can disable the column filtering for all columns or for specific columns by using the `enableColumnFilters` table option or the `enableColumnFilter` column option. You can also turn off both column and global filtering by setting the `enableFilters` table option to `false`.

Disabling column filtering for a column will cause the `column.getCanFilter` API to return `false` for that column.

```jsx
const columns = [
  {
    header: () => 'Id',
    accessorKey: 'id',
    enableColumnFilter: false, // disable column filtering for this column
  },
  //...
];
//...
const table = useReactTable({
  columns,
  data,
  enableColumnFilters: false, // disable column filtering for all columns
});
```

#### Filtering Sub-Rows (Expanding)

There are a few additional table options to customize the behavior of column filtering when using features like expanding, grouping, and aggregation.

##### Filter From Leaf Rows

By default, filtering is done from parent rows down, so if a parent row is filtered out, all of its child sub-rows will be filtered out as well. Depending on your use-case, this may be the desired behavior if you only want the user to be searching through the top-level rows, and not the sub-rows. This is also the most performant option.

However, if you want to allow sub-rows to be filtered and searched through, regardless of whether the parent row is filtered out, you can set the `filterFromLeafRows` table option to `true`. Setting this option to `true` will cause filtering to be done from leaf rows up, which means parent rows will be included so long as one of their child or grand-child rows is also included.

```jsx
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  filterFromLeafRows: true, // filter and search through sub-rows
});
```

##### Max Leaf Row Filter Depth

By default, filtering is done for all rows in a tree, no matter if they are root level parent rows or the child leaf rows of a parent row. Setting the `maxLeafRowFilterDepth` table option to `0` will cause filtering to only be applied to the root level parent rows, with all sub-rows remaining unfiltered. Similarly, setting this option to `1` will cause filtering to only be applied to child leaf rows 1 level deep, and so on.

Use `maxLeafRowFilterDepth: 0` if you want to preserve a parent row's sub-rows from being filtered out while the parent row is passing the filter.

```jsx
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  maxLeafRowFilterDepth: 0, // only filter root level parent rows out
});
```

### Column Filter APIs

There are a lot of Column and Table APIs that you can use to interact with the column filter state and hook up to your UI components. Here is a list of the available APIs and their most common use-cases:

- `table.setColumnFilters` - Overwrite the entire column filter state with a new state
- `table.resetColumnFilters` - Useful for a "clear all/reset filters" button
- `column.getFilterValue` - Useful for getting the default initial filter value for an input, or even directly providing the filter value to a filter input
- `column.setFilterValue` - Useful for connecting filter inputs to their `onChange` or `onBlur` handlers
- `column.getCanFilter` - Useful for disabling/enabling filter inputs
- `column.getIsFiltered` - Useful for displaying a visual indicator that a column is currently being filtered
- `column.getFilterIndex` - Useful for displaying in what order the current filter is being applied
- `column.getAutoFilterFn` -
- `column.getFilterFn` - Useful for displaying which filter mode or function is currently being used

---

## Global Filtering Guide

### Examples

Want to skip to the implementation? Check out these examples:

- [Global Filters](https://tanstack.com/table/v8/docs/examples/react/filters)

### API

[Global Filtering API](https://tanstack.com/table/v8/docs/api/features/global-filtering)

### Global Filtering Guide

Filtering comes in 2 flavors: [Column Filtering](https://tanstack.com/table/v8/docs/guide/column-filtering) and [Global Filtering](https://tanstack.com/table/v8/docs/guide/global-filtering).

This guide will focus on global filtering, which is a filter that is applied across all columns.

### Client-Side vs Server-Side Filtering

If you have a large dataset, you may not want to load all of that data into the client's browser in order to filter it. In this case, you will most likely want to implement server-side filtering, sorting, pagination, etc.

However, as also discussed in the [Pagination Guide](https://tanstack.com/table/v8/docs/guide/pagination), a lot of developers underestimate how many rows can be loaded client-side without a performance hit. The TanStack table examples are often tested to handle up to 100,000 rows or more with decent performance for client-side filtering, sorting, pagination, and grouping. This doesn't necessarily mean that your app will be able to handle that many rows, but if your table is only going to have a few thousand rows at most, you might be able to take advantage of the client-side filtering, sorting, pagination, and grouping that TanStack table provides.

**TanStack Table can handle thousands of client-side rows with good performance. Don't rule out client-side filtering, pagination, sorting, etc. without some thought first.**

Every use-case is different and will depend on the complexity of the table, how many columns you have, how large every piece of data is, etc. The main bottlenecks to pay attention to are:

- Can your server query all of the data in a reasonable amount of time (and cost)?
- What is the total size of the fetch? (This might not scale as badly as you think if you don't have many columns.)
- Is the client's browser using too much memory if all of the data is loaded at once?

If you're not sure, you can always start with client-side filtering and pagination and then switch to server-side strategies in the future as your data grows.

### Manual Server-Side Global Filtering

If you have decided that you need to implement server-side global filtering instead of using the built-in client-side global filtering, here's how you do that.

No `getFilteredRowModel` table option is needed for manual server-side global filtering. Instead, the data that you pass to the table should already be filtered. However, if you have passed a `getFilteredRowModel` table option, you can tell the table to skip it by setting the `manualFiltering` option to `true`.

```jsx
const table = useReactTable({
  data,
  columns,
  // getFilteredRowModel: getFilteredRowModel(), // not needed for manual server-side global filtering
  manualFiltering: true,
});
```

**Note:** When using manual global filtering, many of the options that are discussed in the rest of this guide will have no effect. When `manualFiltering` is set to `true`, the table instance will not apply any global filtering logic to the rows that are passed to it. Instead, it will assume that the rows are already filtered and will use the data that you pass to it as-is.

### Client-Side Global Filtering

If you are using the built-in client-side global filtering, first you need to pass in a `getFilteredRowModel` function to the table options.

```jsx
import { useReactTable, getFilteredRowModel } from '@tanstack/react-table';
//...
const table = useReactTable({
  // other options...
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(), // needed for client-side global filtering
});
```

### Global Filter Function

The `globalFilterFn` option allows you to specify the filter function that will be used for global filtering. The filter function can be a string that references a built-in filter function, a string that references a custom filter function provided via the `tableOptions.filterFns` option, or a custom filter function.

```jsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  globalFilterFn: 'text', // built-in filter function
});
```

By default there are 10 built-in filter functions to choose from:

- `includesString` - Case-insensitive string inclusion
- `includesStringSensitive` - Case-sensitive string inclusion
- `equalsString` - Case-insensitive string equality
- `equalsStringSensitive` - Case-sensitive string equality
- `arrIncludes` - Item inclusion within an array
- `arrIncludesAll` - All items included in an array
- `arrIncludesSome` - Some items included in an array
- `equals` - Object/referential equality `Object.is/===`
- `weakEquals` - Weak object/referential equality `==`
- `inNumberRange` - Number range inclusion

You can also define your own custom filter functions either as the `globalFilterFn` table option.

### Global Filter State

The global filter state is stored in the table's internal state and can be accessed via the `table.getState().globalFilter` property. If you want to persist the global filter state outside of the table, you can use the `onGlobalFilterChange` option to provide a callback function that will be called whenever the global filter state changes.

```jsx
const [globalFilter, setGlobalFilter] = useState < any > [];

const table = useReactTable({
  // other options...
  state: {
    globalFilter,
  },
  onGlobalFilterChange: setGlobalFilter,
});
```

The global filtering state is defined as an object with the following shape:

```jsx
interface GlobalFilter {
  globalFilter: any
}
```

### Adding global filter input to UI

TanStack table will not add a global filter input UI to your table. You should manually add it to your UI to allow users to filter the table. For example, you can add an input UI above the table to allow users to enter a search term.

```jsx
return (
  <div>
    <input
      value=''
      onChange={(e) => table.setGlobalFilter(String(e.target.value))}
      placeholder='Search...'
    />
  </div>
);
```

### Custom Global Filter Function

If you want to use a custom global filter function, you can define the function and pass it to the `globalFilterFn` option.

**Note:** It is often a popular idea to use [fuzzy filtering functions](https://tanstack.com/table/v8/docs/guide/fuzzy-filtering) for global filtering. This is discussed in the [Fuzzy Filtering Guide](https://tanstack.com/table/v8/docs/guide/fuzzy-filtering).

```jsx
const customFilterFn = (rows, columnId, filterValue) => {
  // custom filter logic
};

const table = useReactTable({
  // other options...
  globalFilterFn: customFilterFn,
});
```

### Initial Global Filter State

If you want to set an initial global filter state when the table is initialized, you can pass the global filter state as part of the table `initialState` option.

However, you can also just specify the initial global filter state in the `state.globalFilter` option.

```jsx
const [globalFilter, setGlobalFilter] = useState("search term") //recommended to initialize globalFilter state here

const table = useReactTable({
  // other options...
  initialState: {
    globalFilter: 'search term', // if not managing globalFilter state, set initial state here
  }
  state: {
    globalFilter, // pass our managed globalFilter state to the table
  }
})
```

**NOTE:** Do not use both `initialState.globalFilter` and `state.globalFilter` at the same time, as the initialized state in the `state.globalFilter` will override the `initialState.globalFilter`.

### Disable Global Filtering

By default, global filtering is enabled for all columns. You can disable the global filtering for all columns by using the `enableGlobalFilter` table option. You can also turn off both column and global filtering by setting the `enableFilters` table option to `false`.

Disabling global filtering will cause the `column.getCanGlobalFilter` API to return `false` for that column.

```jsx
const columns = [
  {
    header: () => 'Id',
    accessorKey: 'id',
    enableGlobalFilter: false, // disable global filtering for this column
  },
  //...
];
//...
const table = useReactTable({
  // other options...
  columns,
  enableGlobalFilter: false, // disable global filtering for all columns
});
```

---

## Fuzzy Filtering Guide

### Examples

Want to skip to the implementation? Check out these examples:

- [filters-fuzzy](https://tanstack.com/table/v8/docs/examples/react/filters-fuzzy)

### API

[Filters API](https://tanstack.com/table/v8/docs/api/features/filters)

### Fuzzy Filtering Guide

Fuzzy filtering is a technique that allows you to filter data based on approximate matches. This can be useful when you want to search for data that is similar to a given value, rather than an exact match.

You can implement a client side fuzzy filtering by defining a custom filter function. This function should take in the row, columnId, and filter value, and return a boolean indicating whether the row should be included in the filtered data.

Fuzzy filtering is mostly used with global filtering, but you can also apply it to individual columns. We will discuss how to implement fuzzy filtering for both cases.

**Note:** You will need to install the `@tanstack/match-sorter-utils` library to use fuzzy filtering. TanStack Match Sorter Utils is a fork of [match-sorter](https://github.com/kentcdodds/match-sorter) by [Kent C. Dodds](https://kentcdodds.com/). It was forked in order to work better with TanStack Table's row by row filtering approach.

Using the `match-sorter` libraries is optional, but the `@tanstack/match-sorter-utils` library provides a great way to both fuzzy filter and sort by the rank information it returns, so that rows can be sorted by their closest matches to the search query.

### Defining a Custom Fuzzy Filter Function

Here's an example of a custom fuzzy filter function:

```typescript
import { rankItem } from '@tanstack/match-sorter-utils';
import { FilterFn } from '@tanstack/table';

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({ itemRank });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};
```

In this function, we're using the `rankItem` function from the `@tanstack/match-sorter-utils` library to rank the item. We then store the ranking information in the meta data of the row, and return whether the item passed the ranking criteria.

### Using Fuzzy Filtering with Global Filtering

To use fuzzy filtering with global filtering, you can specify the fuzzy filter function in the `globalFilterFn` option of the table instance:

```typescript
const table = useReactTable({
  // or your framework's equivalent function
  columns,
  data,
  filterFns: {
    fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
  },
  globalFilterFn: 'fuzzy', //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(), //client side filtering
  getSortedRowModel: getSortedRowModel(), //client side sorting needed if you want to use sorting too.
});
```

### Using Fuzzy Filtering with Column Filtering

To use fuzzy filtering with column filtering, you should first define the fuzzy filter function in the `filterFns` option of the table instance. You can then specify the fuzzy filter function in the `filterFn` option of the column definition:

```typescript
const column = [
  {
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    id: 'fullName',
    header: 'Full Name',
    cell: (info) => info.getValue(),
    filterFn: 'fuzzy', //using our custom fuzzy filter function
  },
  // other columns...
];
```

In this example, we're applying the fuzzy filter to a column that combines the `firstName` and `lastName` fields of the data.

### Sorting with Fuzzy Filtering

When using fuzzy filtering with column filtering, you might also want to sort the data based on the ranking information. You can do this by defining a custom sorting function:

```typescript
import { compareItems } from '@tanstack/match-sorter-utils';
import { sortingFns } from '@tanstack/table';

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};
```

In this function, we're comparing the ranking information of the two rows. If the ranks are equal, we fall back to alphanumeric sorting.

You can then specify this sorting function in the `sortFn` option of the column definition:

```typescript
{
  accessorFn: row => `${row.firstName} ${row.lastName}`,
  id: 'fullName',
  header: 'Full Name',
  cell: info => info.getValue(),
  filterFn: 'fuzzy', //using our custom fuzzy filter function
  sortFn: 'fuzzySort', //using our custom fuzzy sort function
}
```

---

## Column Faceting Guide

### Examples

Want to skip to the implementation? Check out these examples:

- [filters-faceted](https://tanstack.com/table/v8/docs/examples/react/filters)

### API

[Column Faceting API](https://tanstack.com/table/v8/docs/api/features/column-faceting)

### Column Faceting Guide

Column Faceting is a feature that allows you to generate lists of values for a given column from that column's data. For example, a list of unique values in a column can be generated from all rows in that column to be used as search suggestions in an autocomplete filter component. Or, a tuple of minimum and maximum values can be generated from a column of numbers to be used as a range for a range slider filter component.

### Column Faceting Row Models

In order to use any of the column faceting features, you must include the appropriate row models in your table options.

```ts
//only import the row models you need
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues, //depends on getFacetedRowModel
  getFacetedUniqueValues, //depends on getFacetedRowModel
} from '@tanstack/react-table';
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFacetedRowModel: getFacetedRowModel(), //if you need a list of values for a column (other faceted row models depend on this one)
  getFacetedMinMaxValues: getFacetedMinMaxValues(), //if you need min/max values
  getFacetedUniqueValues: getFacetedUniqueValues(), //if you need a list of unique values
  //...
});
```

First, you must include the `getFacetedRowModel` row model. This row model will generate a list of values for a given column. If you need a list of unique values, include the `getFacetedUniqueValues` row model. If you need a tuple of minimum and maximum values, include the `getFacetedMinMaxValues` row model.

### Use Faceted Row Models

Once you have included the appropriate row models in your table options, you will be able to use the faceting column instance APIs to access the lists of values generated by the faceted row models.

```ts
// list of unique values for autocomplete filter
const autoCompleteSuggestions = Array.from(column.getFacetedUniqueValues().keys())
  .sort()
  .slice(0, 5000);
```

```ts
// tuple of min and max values for range filter
const [min, max] = column.getFacetedMinMaxValues() ?? [0, 1];
```

### Custom (Server-Side) Faceting

If instead of using the built-in client-side faceting features, you can implement your own faceting logic on the server-side and pass the faceted values to the client-side. You can use the `getFacetedUniqueValues` and `getFacetedMinMaxValues` table options to resolve the faceted values from the server-side.

```ts
const facetingQuery = useQuery();
//...

const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: (table, columnId) => {
    const uniqueValueMap = new Map<string, number>();
    //...
    return uniqueValueMap;
  },
  getFacetedMinMaxValues: (table, columnId) => {
    //...
    return [min, max];
  },
  //...
});
```

Alternatively, you don't have to put any of your faceting logic through the TanStack Table APIs at all. Just fetch your lists and pass them to your filter components directly.

---

## Global Faceting Guide

### Examples

Want to skip to the implementation? Check out these examples:

- [filters-faceted](https://tanstack.com/table/v8/docs/examples/react/filters)

### API

[Global Faceting API](https://tanstack.com/table/v8/docs/api/features/global-faceting)

### Global Faceting Guide

Global Faceting allows you to generate lists of values for all columns from the table's data. For example, a list of unique values in a table can be generated from all rows in all columns to be used as search suggestions in an autocomplete filter component. Or, a tuple of minimum and maximum values can be generated from a table of numbers to be used as a range for a range slider filter component.

### Global Faceting Row Models

In order to use any of the global faceting features, you must include the appropriate row models in your table options.

```ts
//only import the row models you need
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues, //depends on getFacetedRowModel
  getFacetedUniqueValues, //depends on getFacetedRowModel
} from '@tanstack/react-table';
//...
const table = useReactTable({
  // other options...
  getCoreRowModel: getCoreRowModel(),
  getFacetedRowModel: getFacetedRowModel(), //Faceting model for client-side faceting (other faceting methods depend on this model)
  getFacetedMinMaxValues: getFacetedMinMaxValues(), //if you need min/max values
  getFacetedUniqueValues: getFacetedUniqueValues(), //if you need a list of unique values
  //...
});
```

### Use Global Faceted Row Models

Once you have included the appropriate row models in your table options, you will be able to use the faceting table instance APIs to access the lists of values generated by the faceted row models.

```ts
// list of unique values for autocomplete filter
const autoCompleteSuggestions = Array.from(table.getGlobalFacetedUniqueValues().keys())
  .sort()
  .slice(0, 5000);
```

```ts
// tuple of min and max values for range filter
const [min, max] = table.getGlobalFacetedMinMaxValues() ?? [0, 1];
```

### Custom Global (Server-Side) Faceting

If instead of using the built-in client-side faceting features, you can implement your own faceting logic on the server-side and pass the faceted values to the client-side. You can use the `getGlobalFacetedUniqueValues` and `getGlobalFacetedMinMaxValues` table options to resolve the faceted values from the server-side.

```ts
const facetingQuery = useQuery(
  'faceting',
  async () => {
    const response = await fetch('/api/faceting');
    return response.json();
  },
  {
    onSuccess: (data) => {
      table.getGlobalFacetedUniqueValues = () => data.uniqueValues;
      table.getGlobalFacetedMinMaxValues = () => data.minMaxValues;
    },
  }
);
```

In this example, we use the `useQuery` hook from react-query to fetch faceting data from the server. Once the data is fetched, we set the `getGlobalFacetedUniqueValues` and `getGlobalFacetedMinMaxValues` table options to return the faceted values from the server response. This will allow the table to use the server-side faceting data for generating autocomplete suggestions and range filters.

---

## Grouping Guide

### Examples

Want to skip to the implementation? Check out these examples:

- [grouping](https://tanstack.com/table/v8/docs/examples/react/grouping)

### API

[Grouping API](https://tanstack.com/table/v8/docs/api/features/grouping)

### Grouping Guide

There are 3 table features that can reorder columns, which happen in the following order:

1.  **Column Pinning** - If pinning, columns are split into left, center (unpinned), and right pinned columns.
2.  **Manual Column Ordering** - A manually specified column order is applied.
3.  **Grouping** - If grouping is enabled, a grouping state is active, and `tableOptions.groupedColumnMode` is set to `'reorder' | 'remove'`, then the grouped columns are reordered to the start of the column flow.

Grouping in TanStack table is a feature that applies to columns and allows you to categorize and organize the table rows based on specific columns. This can be useful in cases where you have a large amount of data and you want to group them together based on certain criteria.

To use the grouping feature, you will need to use the grouped row model. This model is responsible for grouping the rows based on the grouping state.

```tsx
import { getGroupedRowModel } from '@tanstack/react-table';

const table = useReactTable({
  // other options...
  getGroupedRowModel: getGroupedRowModel(),
});
```

When grouping state is active, the table will add matching rows as subRows to the grouped row. The grouped row will be added to the table rows at the same index as the first matching row. The matching rows will be removed from the table rows. To allow the user to expand and collapse the grouped rows, you can use the expanding feature.

```tsx
import { getGroupedRowModel, getExpandedRowModel } from '@tanstack/react-table';

const table = useReactTable({
  // other options...
  getGroupedRowModel: getGroupedRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
});
```

### Grouping state

The grouping state is an array of strings, where each string is the ID of a column to group by. The order of the strings in the array determines the order of the grouping. For example, if the grouping state is `['column1', 'column2']`, then the table will first group by column1, and then within each group, it will group by column2. You can control the grouping state using the `setGrouping` function:

```tsx
table.setGrouping(['column1', 'column2']);
```

You can also reset the grouping state to its initial state using the `resetGrouping` function:

```tsx
table.resetGrouping();
```

By default, when a column is grouped, it is moved to the start of the table. You can control this behavior using the `groupedColumnMode` option. If you set it to `'reorder'`, then the grouped columns will be moved to the start of the table. If you set it to `'remove'`, then the grouped columns will be removed from the table. If you set it to `false`, then the grouped columns will not be moved or removed.

```tsx
const table = useReactTable({
  // other options...
  groupedColumnMode: 'reorder',
});
```

### Aggregations

When rows are grouped, you can aggregate the data in the grouped rows by columns using the `aggregationFn` option. This is a string that is the ID of the aggregation function. You can define the aggregation functions using the `aggregationFns` option.

```tsx
const column = columnHelper.accessor('key', {
  aggregationFn: 'sum',
});
```

In the above example, the `sum` aggregation function will be used to aggregate the data in the grouped rows. By default, numeric columns will use the `sum` aggregation function, and non-numeric columns will use the `count` aggregation function. You can override this behavior by specifying the `aggregationFn` option in the column definition.

There are several built-in aggregation functions that you can use:

- `sum` - Sums the values in the grouped rows.
- `count` - Counts the number of rows in the grouped rows.
- `min` - Finds the minimum value in the grouped rows.
- `max` - Finds the maximum value in the grouped rows.
- `extent` - Finds the extent (min and max) of the values in the grouped rows.
- `mean` - Finds the mean of the values in the grouped rows.
- `median` - Finds the median of the values in the grouped rows.
- `unique` - Returns an array of unique values in the grouped rows.
- `uniqueCount` - Counts the number of unique values in the grouped rows.

### Custom Aggregations

When rows are grouped, you can aggregate the data in the grouped rows using the `aggregationFns` option. This is a record where the keys are the IDs of the aggregation functions, and the values are the aggregation functions themselves. You can then reference these aggregation functions in a column's `aggregationFn` option.

```tsx
const table = useReactTable({
  // other options...
  aggregationFns: {
    myCustomAggregation: (columnId, leafRows, childRows) => {
      // return the aggregated value
    },
  },
});
```

In the above example, `myCustomAggregation` is a custom aggregation function that takes the column ID, the leaf rows, and the child rows, and returns the aggregated value. You can then use this aggregation function in a column's `aggregationFn` option:

```tsx
const column = columnHelper.accessor('key', {
  aggregationFn: 'myCustomAggregation',
});
```

### Manual Grouping

If you are doing server-side grouping and aggregation, you can enable manual grouping using the `manualGrouping` option. When this option is set to `true`, the table will not automatically group rows using `getGroupedRowModel()` and instead will expect you to manually group the rows before passing them to the table.

```tsx
const table = useReactTable({
  // other options...
  manualGrouping: true,
});
```

**Note:** There are not currently many known easy ways to do server-side grouping with TanStack Table. You will need to do lots of custom cell rendering to make this work.

### Grouping Change Handler

If you want to manage the grouping state yourself, you can use the `onGroupingChange` option. This option is a function that is called when the grouping state changes. You can pass the managed state back to the table via the `tableOptions.state.grouping` option.

```tsx
const [grouping, setGrouping] = useState<string[]>([]);

const table = useReactTable({
  // other options...
  state: {
    grouping: grouping,
  },
  onGroupingChange: setGrouping,
});
```

---

## Expanding Guide

### Examples

Want to skip to the implementation? Check out these examples:

- [expanding](https://tanstack.com/table/v8/docs/examples/react/expanding)
- [grouping](https://tanstack.com/table/v8/docs/examples/react/grouping)
- [sub-components](https://tanstack.com/table/v8/docs/examples/react/sub-components)

### API

[Expanding API](https://tanstack.com/table/v8/docs/api/features/expanding)

### Expanding Feature Guide

Expanding is a feature that allows you to show and hide additional rows of data related to a specific row. This can be useful in cases where you have hierarchical data and you want to allow users to drill down into the data from a higher level. Or it can be useful for showing additional information related to a row.

### Different use cases for Expanding Features

There are multiple use cases for expanding features in TanStack Table that will be discussed below.

- Expanding sub-rows (child rows, aggregate rows, etc.)
- Expanding custom UI (detail panels, sub-tables, etc.)

### Enable Client-Side Expanding

To use the client-side expanding features, you need to define the `getExpandedRowModel` function in your table options. This function is responsible for returning the expanded row model.

```ts
const table = useReactTable({
  // other options...
  getExpandedRowModel: getExpandedRowModel(),
});
```

Expanded data can either contain table rows or any other data you want to display. We will discuss how to handle both cases in this guide.

#### Table rows as expanded data

Expanded rows are essentially child rows that inherit the same column structure as their parent rows. If your data object already includes these expanded rows data, you can utilize the `getSubRows` function to specify these child rows. However, if your data object does not contain the expanded rows data, they can be treated as custom expanded data, which is discussed in next section.

For example, if you have a data object like this:

```ts
type Person = {
  id: number;
  name: string;
  age: number;
  children?: Person[] | undefined;
};

const data: Person[] = [
  {
    id: 1,
    name: 'John',
    age: 30,
    children: [
      { id: 2, name: 'Jane', age: 5 },
      { id: 5, name: 'Jim', age: 10 },
    ],
  },
  { id: 3, name: 'Doe', age: 40, children: [{ id: 4, name: 'Alice', age: 10 }] },
];
```

Then you can use the `getSubRows` function to return the `children` array in each row as expanded rows. The table instance will now understand where to look for the sub rows on each row.

```ts
const table = useReactTable({
  // other options...
  getSubRows: (row) => row.children, // return the children array as sub-rows
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
});
```

**Note:** You can have a complicated `getSubRows` function, but keep in mind that it will run for every row and every sub-row. This can be expensive if the function is not optimized. Async functions are not supported.

#### Custom Expanding UI

In some cases, you may wish to show extra details or information, which may or may not be part of your table data object, such as expanded data for rows. This kind of expanding row UI has gone by many names over the years including "expandable rows", "detail panels", "sub-components", etc.

By default, the `row.getCanExpand()` row instance API will return `false` unless it finds `subRows` on a row. This can be overridden by implementing your own `getRowCanExpand` function in the table instance options.

```ts
//...
const table = useReactTable({
  // other options...
  getRowCanExpand: (row) => true, // Add your logic to determine if a row can be expanded. True means all rows include expanded data
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
})
//...
<tbody>
  {table.getRowModel().rows.map((row) => (
    <React.Fragment key={row.id}>
     {/* Normal row UI */}
      <tr>
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id}>
            <FlexRender
              render={cell.column.columnDef.cell}
              props={cell.getContext()}
            />
          </td>
        ))}
      </tr>
      {/* If the row is expanded, render the expanded UI as a separate row with a single cell that spans the width of the table */}
      {row.getIsExpanded() && (
        <tr>
          <td colSpan={row.getAllCells().length}> // The number of columns you wish to span for the expanded data if it is not a row that shares the same columns as the parent row
            // Your custom UI goes here
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>
//...
```

### Expanded rows state

If you need to control the expanded state of the rows in your table, you can do so by using the `expanded` state and the `onExpandedChange` option. This allows you to manage the expanded state according to your requirements.

```ts
const [expanded, setExpanded] = useState<ExpandedState>({});

const table = useReactTable({
  // other options...
  state: {
    expanded: expanded, // must pass expanded state back to the table
  },
  onExpandedChange: setExpanded,
});
```

The `ExpandedState` type is defined as follows:

```ts
type ExpandedState = true | Record<string, boolean>;
```

If the `ExpandedState` is `true`, it means all rows are expanded. If it's a record, only the rows with IDs present as keys in the record and have their value set to `true` are expanded. For example, if the expanded state is `{ row1: true, row2: false }`, it means the row with ID `row1` is expanded and the row with ID `row2` is not expanded. This state is used by the table to determine which rows are expanded and should display their `subRows`, if any.

### UI toggling handler for expanded rows

TanStack table will not add a toggling handler UI for expanded data to your table. You should manually add it within each row's UI to allow users to expand and collapse the row. For example, you can add a button UI within the columns definition.

```ts
const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    header: 'Children',
    cell: ({ row }) => {
      return row.getCanExpand() ?
        <button
          onClick={row.getToggleExpandedHandler()}
          style={{ cursor: 'pointer' }}
        >
        {row.getIsExpanded() ? '👇' : '👉'}
        </button>
       : '';
    },
  },
]
```

### Filtering Expanded Rows

By default, the filtering process starts from the parent rows and moves downwards. This means if a parent row is excluded by the filter, all its child rows will also be excluded. However, you can change this behavior by using the `filterFromLeafRows` option. When this option is enabled, the filtering process starts from the leaf (child) rows and moves upwards. This ensures that a parent row will be included in the filtered results as long as at least one of its child or grandchild rows meets the filter criteria. Additionally, you can control how deep into the child hierarchy the filter process goes by using the `maxLeafRowFilterDepth` option. This option allows you to specify the maximum depth of child rows that the filter should consider.

```ts
//...
const table = useReactTable({
  // other options...
  getSubRows: (row) => row.subRows,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  filterFromLeafRows: true, // search through the expanded rows
  maxLeafRowFilterDepth: 1, // limit the depth of the expanded rows that are searched
});
```

### Paginating Expanded Rows

By default, expanded rows are paginated along with the rest of the table (which means expanded rows may span multiple pages). If you want to disable this behavior (which means expanded rows will always render on their parents page. This also means more rows will be rendered than the set page size) you can use the `paginateExpandedRows` option.

```ts
const table = useReactTable({
  // other options...
  paginateExpandedRows: false,
});
```

### Pinning Expanded Rows

Pinning expanded rows works the same way as pinning regular rows. You can pin expanded rows to the top or bottom of the table. Please refer to the [Pinning Guide](https://tanstack.com/table/v8/docs/guide/row-pinning) for more information on row pinning.

### Sorting Expanded Rows

By default, expanded rows are sorted along with the rest of the table.

### Manual Expanding (server-side)

If you are doing server-side expansion, you can enable manual row expansion by setting the `manualExpanding` option to `true`. This means that the `getExpandedRowModel` will not be used to expand rows and you would be expected to perform the expansion in your own data model.

```ts
const table = useReactTable({
  // other options...
  manualExpanding: true,
});
```

---

## Pagination Guide

### Examples

Want to skip to the implementation? Check out these examples:

- [pagination](https://tanstack.com/table/v8/docs/examples/react/pagination)
- [pagination-controlled (React Query)](https://tanstack.com/table/v8/docs/examples/react/pagination-controlled)
- [editable-data](https://tanstack.com/table/v8/docs/examples/react/editable-data)
- [expanding](https://tanstack.com/table/v8/docs/examples/react/expanding)
- [filters](https://tanstack.com/table/v8/docs/examples/react/filters)
- [fully-controlled](https://tanstack.com/table/v8/docs/examples/react/fully-controlled)
- [row-selection](https://tanstack.com/table/v8/docs/examples/react/row-selection)

### API

[Pagination API](https://tanstack.com/table/v8/docs/api/features/pagination)

### Pagination Guide

TanStack Table has great support for both client-side and server-side pagination. This guide will walk you through the different ways to implement pagination in your table.

### Client-Side Pagination

Using client-side pagination means that the data that you fetch will contain ALL of the rows for the table, and the table instance will handle pagination logic in the front-end.

#### Should You Use Client-Side Pagination?

Client-side pagination is usually the simplest way to implement pagination when using TanStack Table, but it might not be practical for very large datasets.

However, a lot of people underestimate just how much data can be handled client-side. If your table will only ever have a few thousand rows or less, client-side pagination can still be a viable option. TanStack Table is designed to scale up to 10s of thousands of rows with decent performance for pagination, filtering, sorting, and grouping. The official pagination example loads 100,000 rows and still performs well, albeit with only handful of columns.

Every use-case is different and will depend on the complexity of the table, how many columns you have, how large every piece of data is, etc. The main bottlenecks to pay attention to are:

- Can your server query all of the data in a reasonable amount of time (and cost)?
- What is the total size of the fetch? (This might not scale as badly as you think if you don't have many columns.)
- Is the client's browser using too much memory if all of the data is loaded at once?

If you're not sure, you can always start with client-side pagination and then switch to server-side pagination in the future as your data grows.

#### Should You Use Virtualization Instead?

Alternatively, instead of paginating the data, you can render all rows of a large dataset on the same page, but only use the browser's resources to render the rows that are visible in the viewport. This strategy is often called "virtualization" or "windowing". TanStack offers a virtualization library called [TanStack Virtual](https://tanstack.com/virtual/v3) that can work well with TanStack Table. The UI/UX of both virtualization and pagination have their own trade-offs, so see which one works best for your use-case.

#### Pagination Row Model

If you want to take advantage of the built-in client-side pagination in TanStack Table, you first need to pass in the pagination row model.

```jsx
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(), //load client-side pagination code
});
```

### Manual Server-Side Pagination

If you decide that you need to use server-side pagination, here is how you can implement it.

No pagination row model is needed for server-side pagination, but if you have provided it for other tables that do need it in a shared component, you can still turn off the client-side pagination by setting the `manualPagination` option to `true`. Setting the `manualPagination` option to `true` will tell the table instance to use the `table.getPrePaginationRowModel` row model under the hood, and it will make the table instance assume that the data that you pass in is already paginated.

#### Page Count and Row Count

The table instance will have no way of knowing how many rows/pages there are in total in your back-end unless you tell it. Provide either the `rowCount` or `pageCount` table option to let the table instance know how many pages there are in total. If you provide a `rowCount`, the table instance will calculate the `pageCount` internally from `rowCount` and `pageSize`. Otherwise, you can directly provide the `pageCount` if you already have it. If you don't know the page count, you can just pass in `-1` for the `pageCount`, but the `getCanNextPage` and `getCanPreviousPage` row model functions will always return `true` in this case.

```jsx
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  // getPaginationRowModel: getPaginationRowModel(), //not needed for server-side pagination
  manualPagination: true, //turn off client-side pagination
  rowCount: dataQuery.data?.rowCount, //pass in the total row count so the table knows how many pages there are (pageCount calculated internally if not provided)
  // pageCount: dataQuery.data?.pageCount, //alternatively directly pass in pageCount instead of rowCount
});
```

**Note:** Setting the `manualPagination` option to `true` will make the table instance assume that the data that you pass in is already paginated.

### Pagination State

Whether or not you are using client-side or manual server-side pagination, you can use the built-in pagination state and APIs.

The pagination state is an object that contains the following properties:

- `pageIndex`: The current page index (zero-based).
- `pageSize`: The current page size.

You can manage the pagination state just like any other state in the table instance.

```jsx
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
//...
const [pagination, setPagination] = useState({
  pageIndex: 0, //initial page index
  pageSize: 10, //default page size
});

const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  onPaginationChange: setPagination, //update the pagination state when internal APIs mutate the pagination state
  state: {
    //...
    pagination,
  },
});
```

Alternatively, if you have no need for managing the pagination state in your own scope, but you need to set different initial values for the `pageIndex` and `pageSize`, you can use the `initialState` option.

```jsx
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: {
    pagination: {
      pageIndex: 2, //custom initial page index
      pageSize: 25, //custom default page size
    },
  },
});
```

**Note:** Do NOT pass the pagination state to both the `state` and `initialState` options. `state` will overwrite `initialState`. Only use one or the other.

### Pagination Options

Besides the `manualPagination`, `pageCount`, and `rowCount` options which are useful for manual server-side pagination (and discussed above), there is one other table option that is useful to understand.

#### Auto Reset Page Index

By default, `pageIndex` is reset to `0` when page-altering state changes occur, such as when the data is updated, filters change, grouping changes, etc. This behavior is automatically disabled when `manualPagination` is `true` but it can be overridden by explicitly assigning a boolean value to the `autoResetPageIndex` table option.

```jsx
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  autoResetPageIndex: false, //turn off auto reset of pageIndex
});
```

Be aware, however, that if you turn off `autoResetPageIndex`, you may need to add some logic to handle resetting the `pageIndex` yourself to avoid showing empty pages.

### Pagination APIs

There are several pagination table instance APIs that are useful for hooking up your pagination UI components.

#### Pagination Button APIs

- `getCanPreviousPage`: Useful for disabling the "previous page" button when on the first page.
- `getCanNextPage`: Useful for disabling the "next page" button when there are no more pages.
- `previousPage`: Useful for going to the previous page. (Button click handler)
- `nextPage`: Useful for going to the next page. (Button click handler)
- `firstPage`: Useful for going to the first page. (Button click handler)
- `lastPage`: Useful for going to the last page. (Button click handler)
- `setPageIndex`: Useful for a "go to page" input.
- `resetPageIndex`: Useful for resetting the table state to the original page index.
- `setPageSize`: Useful for a "page size" input/select.
- `resetPageSize`: Useful for resetting the table state to the original page size.
- `setPagination`: Useful for setting all of the pagination state at once.
- `resetPagination`: Useful for resetting the table state to the original pagination state.

**Note:** Some of these APIs are new in v8.13.0.

```jsx
<Button
  onClick={() => table.firstPage()}
  disabled={!table.getCanPreviousPage()}
>
  {'<<'}
</Button>
<Button
  onClick={() => table.previousPage()}
  disabled={!table.getCanPreviousPage()}
>
  {'<'}
</Button>
<Button
  onClick={() => table.nextPage()}
  disabled={!table.getCanNextPage()}
>
  {'>'}
</Button>
<Button
  onClick={() => table.lastPage()}
  disabled={!table.getCanNextPage()}
>
  {'>>'}
</Button>
<select
  value={table.getState().pagination.pageSize}
  onChange={e => {
    table.setPageSize(Number(e.target.value))
  }}
>
  {[10, 20, 30, 40, 50].map(pageSize => (
    <option key={pageSize} value={pageSize}>
      {pageSize}
    </option>
  ))}
</select>
```

#### Pagination Info APIs

- `getPageCount`: Useful for showing the total number of pages.
- `getRowCount`: Useful for showing the total number of rows.

---

## Row Pinning Guide

### Examples

Want to skip to the implementation? Check out these examples:

- [row-pinning](https://tanstack.com/table/v8/docs/examples/react/row-pinning)

### API

[Row Pinning API](https://tanstack.com/table/v8/docs/api/features/row-pinning)

### Row Pinning Guide

There are 2 table features that can reorder rows, which happen in the following order:

1.  **Row Pinning** - If pinning, rows are split into top, center (unpinned), and bottom pinned rows.
2.  **Sorting**

---

## Row Selection Guide

### Examples

Want to skip to the implementation? Check out these examples:

- [React row-selection](https://tanstack.com/table/v8/docs/examples/react/row-selection)
- [Vue row-selection](https://tanstack.com/table/v8/docs/examples/vue/row-selection)
- [React expanding](https://tanstack.com/table/v8/docs/examples/react/expanding)

### API

[Row Selection API](https://tanstack.com/table/v8/docs/api/features/row-selection)

### Row Selection Guide

The row selection feature keeps track of which rows are selected and allows you to toggle the selection of rows in a myriad of ways. Let's take a look at some common use cases.

### Access Row Selection State

The table instance already manages the row selection state for you (though as seen down below, it may be more convenient to manage the row selection state in your own scope). You can access the internal row selection state or the selected rows from a few APIs.

- `getState().rowSelection` - returns the internal row selection state
- `getSelectedRowModel()` - returns selected rows
- `getFilteredSelectedRowModel()` - returns selected rows after filtering
- `getGroupedSelectedRowModel()` - returns selected rows after grouping and sorting

```ts
console.log(table.getState().rowSelection); //get the row selection state - { 1: true, 2: false, etc... }
console.log(table.getSelectedRowModel().rows); //get full client-side selected rows
console.log(table.getFilteredSelectedRowModel().rows); //get filtered client-side selected rows
console.log(table.getGroupedSelectedRowModel().rows); //get grouped client-side selected rows
```

**Note:** If you are using `manualPagination`, be aware that the `getSelectedRowModel` API will only return selected rows on the current page because table row models can only generate rows based on the data that is passed in. Row selection state, however, can contain row ids that are not present in the data array just fine.

### Manage Row Selection State

Even though the table instance will already manage the row selection state for you, it is usually more convenient to manage the state yourself in order to have easy access to the selected row ids that you can use to make API calls or other actions.

Use the `onRowSelectionChange` table option to hoist up the row selection state to your own scope. Then pass the row selection state back to the table instance using in the `state` table option.

```ts
const [rowSelection, setRowSelection] = useState<RowSelectionState>({}); //manage your own row selection state

const table = useReactTable({
  //...
  onRowSelectionChange: setRowSelection, //hoist up the row selection state to your own scope
  state: {
    rowSelection, //pass the row selection state back to the table instance
  },
});
```

### Useful Row Ids

By default, the row id for each row is simply the `row.index`. If you are using row selection features, you most likely want to use a more useful row identifier, since the row selection state is keyed by row id. You can use the `getRowId` table option to specify a function that returns a unique row id for each row.

```ts
const table = useReactTable({
  //...
  getRowId: (row) => row.uuid, //use the row's uuid from your database as the row id
});
```

Now as rows are selected, the row selection state will look something like this:

```json
{
  "13e79140-62a8-4f9c-b087-5da737903b76": true,
  "f3e2a5c0-5b7a-4d8a-9a5c-9c9b8a8e5f7e": false
  //...
}
```

instead of this:

```json
{
  "0": true,
  "1": false
  //...
}
```

### Enable Row Selection Conditionally

Row selection is enabled by default for all rows. To either enable row selection conditionally for certain rows or disable row selection for all rows, you can use the `enableRowSelection` table option which accepts either a boolean or a function for more granular control.

```ts
const table = useReactTable({
  //...
  enableRowSelection: (row) => row.original.age > 18, //only enable row selection for adults
});
```

To enforce whether a row is selectable or not in your UI, you can use the `row.getCanSelect()` API for your checkboxes or other selection UI.

### Single Row Selection

By default, the table allows multiple rows to be selected at once. If, however, you only want to allow a single row to be selected at once, you can set the `enableMultiRowSelection` table option to `false` to disable multi-row selection, or pass in a function to disable multi-row selection conditionally for a row's sub-rows.

This is useful for making tables that have radio buttons instead of checkboxes.

```ts
const table = useReactTable({
  //...
  enableMultiRowSelection: false, //only allow a single row to be selected at once
  // enableMultiRowSelection: row => row.original.age > 18, //only allow a single row to be selected at once for adults
});
```

### Sub-Row Selection

By default, selecting a parent row will select all of its sub-rows. If you want to disable auto sub-row selection, you can set the `enableSubRowSelection` table option to `false` to disable sub-row selection, or pass in a function to disable sub-row selection conditionally for a row's sub-rows.

```ts
const table = useReactTable({
  //...
  enableSubRowSelection: false, //disable sub-row selection
  // enableSubRowSelection: row => row.original.age > 18, //disable sub-row selection for adults
});
```

### Render Row Selection UI

TanStack table does not dictate how you should render your row selection UI. You can use checkboxes, radio buttons, or simply hook up click events to the row itself. The table instance provides a few APIs to help you render your row selection UI.

#### Connect Row Selection APIs to Checkbox Inputs

TanStack Table provides some handler functions that you can connect directly to your checkbox inputs to make it easy to toggle row selection. These function automatically call other internal APIs to update the row selection state and re-render the table.

Use the `row.getToggleSelectedHandler()` API to connect to your checkbox inputs to toggle the selection of a row.

Use the `table.getToggleAllRowsSelectedHandler()` or `table.getToggleAllPageRowsSelectedHandler` APIs to connect to your "select all" checkbox input to toggle the selection of all rows.

If you need more granular control over these function handlers, you can always just use the `row.toggleSelected()` or `table.toggleAllRowsSelected()` APIs directly. Or you can even just call the `table.setRowSelection()` API to directly set the row selection state just as you would with any other state updater. These handler functions are just a convenience.

```tsx
const columns = [
  {
    id: 'select-col',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()} //or getToggleAllPageRowsSelectedHandler
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  //... more column definitions...
];
```

#### Connect Row Selection APIs to UI

If you want a simpler row selection UI, you can just hook up click events to the row itself. The `row.getToggleSelectedHandler()` API is also useful for this use case.

```tsx
<tbody>
  {table.getRowModel().rows.map((row) => {
    return (
      <tr
        key={row.id}
        className={row.getIsSelected() ? 'selected' : null}
        onClick={row.getToggleSelectedHandler()}
      >
        {row.getVisibleCells().map((cell) => {
          return <td key={cell.id}>{/* */}</td>;
        })}
      </tr>
    );
  })}
</tbody>
```

## Sorting Guide

### Examples

Want to skip to the implementation? Check out these examples:

- [sorting](https://tanstack.com/table/v8/docs/examples/react/sorting)
- [filters](https://tanstack.com/table/v8/docs/examples/react/filters)

---

### API

### Sorting API

TanStack Table provides solutions for just about any sorting use-case you might have. This guide will walk you through the various options that you can use to customize the built-in client-side sorting functionality, as well as how to opt out of client-side sorting in favor of manual server-side sorting.

### Sorting State

The sorting state is defined as an array of objects with the following shape:

```tsx
type ColumnSort = {
  id: string;
  desc: boolean;
};
type SortingState = ColumnSort[];
```

Since the sorting state is an array, it is possible to sort by multiple columns at once. Read more about the multi-sorting customizations down below.

#### Accessing Sorting State

You can access the sorting state directly from the table instance just like any other state using the `table.getState()` API.

```tsx
const table = useReactTable({
  columns,
  data,
  //...
});

console.log(table.getState().sorting); // access the sorting state from the table instance
```

However, if you need to access the sorting state before the table is initialized, you can "control" the sorting state like down below.

### Controlled Sorting State

If you need easy access to the sorting state, you can control/manage the sorting state in your own state management with the `state.sorting` and `onSortingChange` table options.

```tsx
const [sorting, setSorting] = useState<SortingState>([]); // can set initial sorting state here
//...
// use sorting state to fetch data from your server or something...
//...
const table = useReactTable({
  columns,
  data,
  //...
  state: {
    sorting,
  },
  onSortingChange: setSorting,
});
```

### Initial Sorting State

If you do not need to control the sorting state in your own state management or scope, but you still want to set an initial sorting state, you can use the `initialState` table option instead of `state`.

```jsx
const table = useReactTable({
  columns,
  data,
  //...
  initialState: {
    sorting: [
      {
        id: 'name',
        desc: true, // sort by name in descending order by default
      },
    ],
  },
});
```

**NOTE:** Do not use both `initialState.sorting` and `state.sorting` at the same time, as the initialized state in the `state.sorting` will override the `initialState.sorting`.

### Client-Side vs Server-Side Sorting

Whether or not you should use client-side or server-side sorting depends entirely on whether you are also using client-side or server-side pagination or filtering. Be consistent, because using client-side sorting with server-side pagination or filtering will only sort the data that is currently loaded, and not the entire dataset.

#### Manual Server-Side Sorting

If you plan to just use your own server-side sorting in your back-end logic, you do not need to provide a sorted row model. But if you have provided a sorting row model, but you want to disable it, you can use the `manualSorting` table option.

```jsx
const [sorting, setSorting] = useState < SortingState > [];
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  //getSortedRowModel: getSortedRowModel(), //not needed for manual sorting
  manualSorting: true, //use pre-sorted row model instead of sorted row model
  state: {
    sorting,
  },
  onSortingChange: setSorting,
});
```

**NOTE:** When `manualSorting` is set to `true`, the table will assume that the data that you provide is already sorted, and will not apply any sorting to it.

#### Client-Side Sorting

To implement client-side sorting, first you have to provide a sorting row model to the table. You can import the `getSortedRowModel` function from TanStack Table, and it will be used to transform your rows into sorted rows.

```jsx
import { useReactTable } from '@tanstack/react-table';
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(), //provide a sorting row model
});
```

### Sorting Fns

The default sorting function for all columns is inferred from the data type of the column. However, it can be useful to define the exact sorting function that you want to use for a specific column, especially if any of your data is nullable or not a standard data type.

You can determine a custom sorting function on a per-column basis using the `sortingFn` column option.

By default, there are 6 built-in sorting functions to choose from:

- `alphanumeric` - Sorts by mixed alphanumeric values without case-sensitivity. Slower, but more accurate if your strings contain numbers that need to be naturally sorted.
- `alphanumericCaseSensitive` - Sorts by mixed alphanumeric values with case-sensitivity. Slower, but more accurate if your strings contain numbers that need to be naturally sorted.
- `text` - Sorts by text/string values without case-sensitivity. Faster, but less accurate if your strings contain numbers that need to be naturally sorted.
- `textCaseSensitive` - Sorts by text/string values with case-sensitivity. Faster, but less accurate if your strings contain numbers that need to be naturally sorted.
- `datetime` - Sorts by time, use this if your values are `Date` objects.
- `basic` - Sorts using a basic/standard `a > b ? 1 : a < b ? -1 : 0` comparison. This is the fastest sorting function, but may not be the most accurate.

You can also define your own custom sorting functions either as the `sortingFn` column option, or as a global sorting function using the `sortingFns` table option.

#### Custom Sorting Functions

When defining a custom sorting function in either the `sortingFns` table option or as a `sortingFn` column option, it should have the following signature:

```tsx
//optionally use the SortingFn to infer the parameter types
const myCustomSortingFn: SortingFn<TData> = (
  rowA: Row<TData>,
  rowB: Row<TData>,
  columnId: string
) => {
  return; //-1, 0, or 1 - access any row data using rowA.original and rowB.original
};
```

**Note:** The comparison function does not need to take whether or not the column is in descending or ascending order into account. The row models will take of that logic. `sortingFn` functions only need to provide a consistent comparison.

Every sorting function receives 2 rows and a column ID and are expected to compare the two rows using the column ID to return -1, 0, or 1 in ascending order. Here's a cheat sheet:

| Return | Ascending Order |
| :----- | :-------------- |
| -1     | `a < b`         |
| 0      | `a === b`       |
| 1      | `a > b`         |

```jsx
const columns = [
  {
    header: () => 'Name',
    accessorKey: 'name',
    sortingFn: 'alphanumeric', // use built-in sorting function by name
  },
  {
    header: () => 'Age',
    accessorKey: 'age',
    sortingFn: 'myCustomSortingFn', // use custom global sorting function
  },
  {
    header: () => 'Birthday',
    accessorKey: 'birthday',
    sortingFn: 'datetime', // recommended for date columns
  },
  {
    header: () => 'Profile',
    accessorKey: 'profile',
    // use custom sorting function directly
    sortingFn: (rowA, rowB, columnId) => {
      return rowA.original.someProperty - rowB.original.someProperty;
    },
  },
];
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  sortingFns: {
    //add a custom sorting function
    myCustomSortingFn: (rowA, rowB, columnId) => {
      return rowA.original[columnId] > rowB.original[columnId]
        ? 1
        : rowA.original[columnId] < rowB.original[columnId]
          ? -1
          : 0;
    },
  },
});
```

### Customize Sorting

There are a lot of table and column options that you can use to further customize the sorting UX and behavior.

#### Disable Sorting

You can disable sorting for either a specific column or the entire table using the `enableSorting` column option or table option.

```jsx
const columns = [
  {
    header: () => 'ID',
    accessorKey: 'id',
    enableSorting: false, // disable sorting for this column
  },
  {
    header: () => 'Name',
    accessorKey: 'name',
  },
  //...
];
//...
const table = useReactTable({
  columns,
  data,
  enableSorting: false, // disable sorting for the entire table
});
```

#### Sorting Direction

By default, the first sorting direction when cycling through the sorting for a column using the `toggleSorting` APIs is ascending for string columns and descending for number columns. You can change this behavior with the `sortDescFirst` column option or table option.

```jsx
const columns = [
  {
    header: () => 'Name',
    accessorKey: 'name',
    sortDescFirst: true, //sort by name in descending order first (default is ascending for string columns)
  },
  {
    header: () => 'Age',
    accessorKey: 'age',
    sortDescFirst: false, //sort by age in ascending order first (default is descending for number columns)
  },
  //...
];
//...
const table = useReactTable({
  columns,
  data,
  sortDescFirst: true, //sort by all columns in descending order first (default is ascending for string columns and descending for number columns)
});
```

**NOTE:** You may want to explicitly set the `sortDescFirst` column option on any columns that have nullable values. The table may not be able to properly determine if a column is a number or a string if it contains nullable values.

#### Invert Sorting

Inverting sorting is not the same as changing the default sorting direction. If `invertSorting` column option is `true` for a column, then the "desc/asc" sorting states will still cycle like normal, but the actual sorting of the rows will be inverted. This is useful for values that have an inverted best/worst scale where lower numbers are better, eg. a ranking (1st, 2nd, 3rd) or golf-like scoring.

```jsx
const columns = [
  {
    header: () => 'Rank',
    accessorKey: 'rank',
    invertSorting: true, // invert the sorting for this column. 1st -> 2nd -> 3rd -> ... even if "desc" sorting is applied
  },
  //...
];
```

#### Sort Undefined Values

Any undefined values will be sorted to the beginning or end of the list based on the `sortUndefined` column option or table option. You can customize this behavior for your specific use-case.

In not specified, the default value for `sortUndefined` is `1`, and undefined values will be sorted with lower priority (descending), if ascending, undefined will appear on the end of the list.

- `'first'` - Undefined values will be pushed to the beginning of the list
- `'last'` - Undefined values will be pushed to the end of the list
- `false` - Undefined values will be considered tied and need to be sorted by the next column filter or original index (whichever applies)
- `-1` - Undefined values will be sorted with higher priority (ascending) (if ascending, undefined will appear on the beginning of the list)
- `1` - Undefined values will be sorted with lower priority (descending) (if ascending, undefined will appear on the end of the list)

**NOTE:** `'first'` and `'last'` options are new in v8.16.0

```jsx
const columns = [
  {
    header: () => 'Rank',
    accessorKey: 'rank',
    sortUndefined: -1, // 'first' | 'last' | 1 | -1 | false
  },
];
```

#### Sorting Removal

By default, the ability to remove sorting while cycling through the sorting states for a column is enabled. You can disable this behavior using the `enableSortingRemoval` table option. This behavior is useful if you want to ensure that at least one column is always sorted.

The default behavior when using either the `getToggleSortingHandler` or `toggleSorting` APIs is to cycle through the sorting states like this:

`'none'` -> `'desc'` -> `'asc'` -> `'none'` -> `'desc'` -> `'asc'` -> ...

If you disable sorting removal, the behavior will be like this:

`'none'` -> `'desc'` -> `'asc'` -> `'desc'` -> `'asc'` -> ...

Once a column is sorted and `enableSortingRemoval` is `false`, toggling the sorting on that column will never remove the sorting. However, if the user sorts by another column and it is not a multi-sort event, then the sorting will be removed from the previous column and just applied to the new column.

Set `enableSortingRemoval` to `false` if you want to ensure that at least one column is always sorted.

```jsx
const table = useReactTable({
  columns,
  data,
  enableSortingRemoval: false, // disable the ability to remove sorting on columns (always none -> asc -> desc -> asc)
});
```

### Multi-Sorting

Sorting by multiple columns at once is enabled by default if using the `column.getToggleSortingHandler` API. If the user holds the Shift key while clicking on a column header, the table will sort by that column in addition to the columns that are already sorted. If you use the `column.toggleSorting` API, you have to manually pass in whether or not to use multi-sorting. (`column.toggleSorting(desc, multi)`).

#### Disable Multi-Sorting

You can disable multi-sorting for either a specific column or the entire table using the `enableMultiSort` column option or table option. Disabling multi-sorting for a specific column will replace all existing sorting with the new column's sorting.

```jsx
const columns = [
  {
    header: () => 'Created At',
    accessorKey: 'createdAt',
    enableMultiSort: false, // always sort by just this column if sorting by this column
  },
  //...
];
//...
const table = useReactTable({
  columns,
  data,
  enableMultiSort: false, // disable multi-sorting for the entire table
});
```

#### Customize Multi-Sorting Trigger

By default, the Shift key is used to trigger multi-sorting. You can change this behavior with the `isMultiSortEvent` table option. You can even specify that all sorting events should trigger multi-sorting by returning `true` from the custom function.

```jsx
const table = useReactTable({
  columns,
  data,
  isMultiSortEvent: (e) => true, // normal click triggers multi-sorting
  //or
  isMultiSortEvent: (e) => e.ctrlKey || e.shiftKey, // also use the `Ctrl` key to trigger multi-sorting
});
```

#### Multi-Sorting Limit

By default, there is no limit to the number of columns that can be sorted at once. You can set a limit using the `maxMultiSortColCount` table option.

```jsx
const table = useReactTable({
  columns,
  data,
  maxMultiSortColCount: 3, // only allow 3 columns to be sorted at once
});
```

#### Multi-Sorting Removal

By default, the ability to remove multi-sorts is enabled. You can disable this behavior using the `enableMultiRemove` table option.

```jsx
const table = useReactTable({
  columns,
  data,
  enableMultiRemove: false, // disable the ability to remove multi-sorts
});
```

### Sorting APIs

There are a lot of sorting related APIs that you can use to hook up to your UI or other logic. Here is a list of all of the sorting APIs and some of their use-cases.

- `table.setSorting` - Set the sorting state directly.
- `table.resetSorting` - Reset the sorting state to the initial state or clear it.
- `column.getCanSort` - Useful for enabling/disabling the sorting UI for a column.
- `column.getIsSorted` - Useful for showing a visual sorting indicator for a column.
- `column.getToggleSortingHandler` - Useful for hooking up the sorting UI for a column. Add to a sort arrow (icon button), menu item, or simply the entire column header cell. This handler will call `column.toggleSorting` with the correct parameters.
- `column.toggleSorting` - Useful for hooking up the sorting UI for a column. If using instead of `column.getToggleSortingHandler`, you have to manually pass in whether or not to use multi-sorting. (`column.toggleSorting(desc, multi)`)
- `column.clearSorting` - Useful for a "clear sorting" button or menu item for a specific column.
- `column.getNextSortingOrder` - Useful for showing which direction the column will sort by next. (`asc`/`desc`/`clear` in a tooltip/menu item/aria-label or something)
- `column.getFirstSortDir` - Useful for showing which direction the column will sort by first. (`asc`/`desc` in a tooltip/menu item/aria-label or something)
- `column.getAutoSortDir` - Determines whether the first sorting direction will be ascending or descending for a column.
- `column.getAutoSortingFn` - Used internally to find the default sorting function for a column if none is specified.
- `column.getSortingFn` - Returns the exact sorting function being used for a column.
- `column.getCanMultiSort` - Useful for enabling/disabling the multi-sorting UI for a column.
- `column.getSortIndex` - Useful for showing a badge or indicator of the column's sort order in a multi-sort scenario. i.e. whether or not it is the first, second, third, etc. column to be sorted.
  Here's the continuation of the TanStack Table documentation, formatted in Markdown:

## Virtualization Guide

### Examples

Want to skip to the implementation? Check out these examples:

- [virtualized-columns](https://tanstack.com/table/v8/docs/examples/react/virtualized-columns)
- [virtualized-rows (dynamic row height)](https://tanstack.com/table/v8/docs/examples/react/virtualized-rows-dynamic-row-height)
- [virtualized-rows (fixed row height)](https://tanstack.com/table/v8/docs/examples/react/virtualized-rows-fixed-row-height)
- [virtualized-infinite-scrolling](https://tanstack.com/table/v8/docs/examples/react/virtualized-infinite-scrolling)

The TanStack Table packages do not come with any virtualization APIs or features built-in, but TanStack Table can easily work with other virtualization libraries like [react-window](https://react-window.dev/) or TanStack's own [TanStack Virtual](https://tanstack.com/virtual). This guide will show some strategies for using TanStack Table with TanStack Virtual.

---

## Custom Features Guide

### Examples

Want to skip to the implementation? Check out these examples:

- [custom-features](https://tanstack.com/table/v8/docs/examples/react/custom-features)

In this guide, we'll cover how to extend TanStack Table with custom features, and along the way, we'll learn more about how the TanStack Table v8 codebase is structured and how it works.

### TanStack Table Strives to be Lean

TanStack Table has a core set of features that are built into the library such as sorting, filtering, pagination, etc. We've received a lot of requests and sometimes even some well thought out PRs to add even more features to the library. While we are always open to improving the library, we also want to make sure that TanStack Table remains a lean library that does not include too much bloat and code that is unlikely to be used in most use cases. Not every PR can, or should, be accepted into the core library, even if it does solve a real problem. This can be frustrating to developers where TanStack Table solves 90% of their use case, but they need a little bit more control.

TanStack Table has always been built in a way that allows it to be highly extensible (at least since v7). The table instance that is returned from whichever framework adapter that you are using (`useReactTable`, `useVueTable`, etc) is a plain JavaScript object that can have extra properties or APIs added to it. It has always been possible to use composition to add custom logic, state, and APIs to the table instance. Libraries like Material React Table have simply created custom wrapper hooks around the `useReactTable` hook to extend the table instance with custom functionality.

However, starting in **version 8.14.0**, TanStack Table has exposed a new `_features` table option that allows you to more tightly and cleanly integrate custom code into the table instance in exactly the same way that the built-in table features are already integrated.

**TanStack Table v8.14.0 introduced a new `_features` option that allows you to add custom features to the table instance.**

With this new tighter integration, you can easily add more complex custom features to your tables, and possibly even package them up and share them with the community. We'll see how this evolves over time. In a future v9 release, we may even lower the bundle size of TanStack Table by making all features opt-in, but that is still being explored.

### How TanStack Table Features Work

TanStack Table's source code is arguably somewhat simple (at least we think so). All code for each feature is split up into its own object/file with instantiation methods to create initial state, default table and column options, and API methods that can be added to the table, header, column, row, and cell instances.

All of the functionality of a feature object can be described with the `TableFeature` type that is exported from TanStack Table. This type is a TypeScript interface that describes the shape of a feature object needed to create a feature.

```ts
export interface TableFeature<TData extends RowData = any> {
  createCell?: (
    cell: Cell<TData, unknown>,
    column: Column<TData>,
    row: Row<TData>,
    table: Table<TData>
  ) => void;
  createColumn?: (column: Column<TData, unknown>, table: Table<TData>) => void;
  createHeader?: (header: Header<TData, unknown>, table: Table<TData>) => void;
  createRow?: (row: Row<TData>, table: Table<TData>) => void;
  createTable?: (table: Table<TData>) => void;
  getDefaultColumnDef?: () => Partial<ColumnDef<TData, unknown>>;
  getDefaultOptions?: (table: Table<TData>) => Partial<TableOptionsResolved<TData>>;
  getInitialState?: (initialState?: InitialTableState) => Partial<TableState>;
}
```

This might be a bit confusing, so let's break down what each of these methods do:

#### Default Options and Initial State

##### `getDefaultOptions`

The `getDefaultOptions` method in a table feature is responsible for setting the default table options for that feature. For example, in the Column Sizing feature, the `getDefaultOptions` method sets the default `columnResizeMode` option with a default value of "onEnd".

##### `getDefaultColumnDef`

The `getDefaultColumnDef` method in a table feature is responsible for setting the default column options for that feature. For example, in the Sorting feature, the `getDefaultColumnDef` method sets the default `sortUndefined` column option with a default value of `1`.

##### `getInitialState`

The `getInitialState` method in a table feature is responsible for setting the default state for that feature. For example, in the Pagination feature, the `getInitialState` method sets the default `pageSize` state with a value of `10` and the default `pageIndex` state with a value of `0`.

#### API Creators

##### `createTable`

The `createTable` method in a table feature is responsible for adding methods to the table instance. For example, in the Row Selection feature, the `createTable` method adds many table instance API methods such as `toggleAllRowsSelected`, `getIsAllRowsSelected`, `getIsSomeRowsSelected`, etc. So then, when you call `table.toggleAllRowsSelected()`, you are calling a method that was added to the table instance by the RowSelection feature.

##### `createHeader`

The `createHeader` method in a table feature is responsible for adding methods to the header instance. For example, in the Column Sizing feature, the `createHeader` method adds many header instance API methods such as `getStart`, and many others. So then, when you call `header.getStart()`, you are calling a method that was added to the header instance by the ColumnSizing feature.

##### `createColumn`

The `createColumn` method in a table feature is responsible for adding methods to the column instance. For example, in the Sorting feature, the `createColumn` method adds many column instance API methods such as `getNextSortingOrder`, `toggleSorting`, etc. So then, when you call `column.toggleSorting()`, you are calling a method that was added to the column instance by the RowSorting feature.

##### `createRow`

The `createRow` method in a table feature is responsible for adding methods to the row instance. For example, in the Row Selection feature, the `createRow` method adds many row instance API methods such as `toggleSelected`, `getIsSelected`, etc. So then, when you call `row.toggleSelected()`, you are calling a method that was added to the row instance by the RowSelection feature.

##### `createCell`

The `createCell` method in a table feature is responsible for adding methods to the cell instance. For example, in the Column Grouping feature, the `createCell` method adds many cell instance API methods such as `getIsGrouped`, `getIsAggregated`, etc. So then, when you call `cell.getIsGrouped()`, you are calling a method that was added to the cell instance by the ColumnGrouping feature.

### Adding a Custom Feature

Let's walk through making a custom table feature for a hypothetical use case. Let's say we want to add a feature to the table instance that allows the user to change the "density" (padding of cells) of the table.

Check out the full [custom-features example](https://tanstack.com/table/v8/docs/examples/react/custom-features) to see the full implementation, but here's an in-depth look at the steps to create a custom feature.

#### Step 1: Set up TypeScript Types

Assuming you want the same full type-safety that the built-in features in TanStack Table have, let's set up all of the TypeScript types for our new feature. We'll create types for new table options, state, and table instance API methods.

These types are following the naming convention used internally within TanStack Table, but you can name them whatever you want. We are not adding these types to TanStack Table yet, but we'll do that in the next step.

```ts
// define types for our new feature's custom state
export type DensityState = 'sm' | 'md' | 'lg';
export interface DensityTableState {
  density: DensityState;
}

// define types for our new feature's table options
export interface DensityOptions {
  enableDensity?: boolean;
  onDensityChange?: OnChangeFn<DensityState>;
}

// Define types for our new feature's table APIs
export interface DensityInstance {
  setDensity: (updater: Updater<DensityState>) => void;
  toggleDensity: (value?: DensityState) => void;
}
```

#### Step 2: Use Declaration Merging to Add New Types to TanStack Table

We can tell TypeScript to modify the exported types from TanStack Table to include our new feature's types. This is called "declaration merging" and it's a powerful feature of TypeScript. This way, we should not have to use any TypeScript hacks such as `as unknown as CustomTable` or `// @ts-ignore` in our new feature's code or in our application code.

```ts
// Use declaration merging to add our new feature APIs and state types to TanStack Table's existing types.
declare module '@tanstack/react-table' {
  // or whatever framework adapter you are using
  //merge our new feature's state with the existing table state
  interface TableState extends DensityTableState {}
  //merge our new feature's options with the existing table options
  interface TableOptionsResolved<TData extends RowData> extends DensityOptions {}
  //merge our new feature's instance APIs with the existing table instance APIs
  interface Table<TData extends RowData> extends DensityInstance {}
  // if you need to add cell instance APIs...
  // interface Cell<TData extends RowData, TValue> extends DensityCell
  // if you need to add row instance APIs...
  // interface Row<TData extends RowData> extends DensityRow
  // if you need to add column instance APIs...
  // interface Column<TData extends RowData, TValue> extends DensityColumn
  // if you need to add header instance APIs...
  // interface Header<TData extends RowData, TValue> extends DensityHeader

  // Note: declaration merging on `ColumnDef` is not possible because it is a complex type, not an interface.
  // But you can still use declaration merging on `ColumnDef.meta`
}
```

Once we do this correctly, we should have no TypeScript errors when we try to both create our new feature's code and use it in our application.

##### Caveats of Using Declaration Merging

One caveat of using declaration merging is that it will affect the TanStack Table types for every table across your codebase. This is not a problem if you plan on loading the same feature set for every table in your application, but it could be a problem if some of your tables load extra features and some do not. Alternatively, you can just make a bunch of custom types that extend off of the TanStack Table types with your new features added. This is what Material React Table does in order to avoid affecting the types of vanilla TanStack Table tables, but it's a bit more tedious, and requires a lot of type casting at certain points.

#### Step 3: Create the Feature Object

With all of that TypeScript setup out of the way, we can now create the feature object for our new feature. This is where we define all of the methods that will be added to the table instance.

Use the `TableFeature` type to ensure that you are creating the feature object correctly. If the TypeScript types are set up correctly, you should have no TypeScript errors when you create the feature object with the new state, options, and instance APIs.

```ts
export const DensityFeature: TableFeature<any> = {
  //Use the TableFeature type!!
  // define the new feature's initial state
  getInitialState: (state): DensityTableState => {
    return {
      density: 'md',
      ...state,
    };
  },

  // define the new feature's default options
  getDefaultOptions: <TData extends RowData>(table: Table<TData>): DensityOptions => {
    return {
      enableDensity: true,
      onDensityChange: makeStateUpdater('density', table),
    } as DensityOptions;
  },
  // if you need to add a default column definition...
  // getDefaultColumnDef: <TData extends RowData>(): Partial<ColumnDef<TData>> => {
  //   return { meta: {} } //use meta instead of directly adding to the columnDef to avoid typescript stuff that's hard to workaround
  // },

  // define the new feature's table instance methods
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setDensity = (updater) => {
      const safeUpdater: Updater<DensityState> = (old) => {
        let newState = functionalUpdate(updater, old);
        return newState;
      };
      return table.options.onDensityChange?.(safeUpdater);
    };
    table.toggleDensity = (value) => {
      table.setDensity((old) => {
        if (value) return value;
        return old === 'lg' ? 'md' : old === 'md' ? 'sm' : 'lg'; //cycle through the 3 options
      });
    };
  },

  // if you need to add row instance APIs...
  // createRow: <TData extends RowData>(row, table): void => {},
  // if you need to add cell instance APIs...
  // createCell: <TData extends RowData>(cell, column, row, table): void => {},
  // if you need to add column instance APIs...
  // createColumn: <TData extends RowData>(column, table): void => {},
  // if you need to add header instance APIs...
  // createHeader: <TData extends RowData>(header, table): void => {},
};
```

#### Step 4: Add the Feature to the Table

Now that we have our feature object, we can add it to the table instance by passing it to the `_features` option when we create the table instance.

```ts
const table = useReactTable({
  _features: [DensityFeature], //pass the new feature to merge with all of the built-in features under the hood
  columns,
  data,
  //..
});
```

#### Step 5: Use the Feature in Your Application

Now that the feature is added to the table instance, you can use the new instance APIs options, and state in your application.

```tsx
const table = useReactTable({
  _features: [DensityFeature], //pass our custom feature to the table to be instantiated upon creation
  columns,
  data,
  //...
  state: {
    density, //passing the density state to the table, TS is still happy :)
  },
  onDensityChange: setDensity, //using the new onDensityChange option, TS is still happy :)
});
//...
const { density } = table.getState();
return (
  <td
    key={cell.id}
    style={{
      //using our new feature in the code
      padding: density === 'sm' ? '4px' : density === 'md' ? '8px' : '16px',
      transition: 'padding 0.2s',
    }}
  >
    {flexRender(cell.column.columnDef.cell, cell.getContext())}
  </td>
);
```

### Do We Have to Do It This Way?

This is just a new way to integrate custom code along-side the built-in features in TanStack Table. In our example up above, we could have just as easily stored the density state in a `React.useState`, defined our own `toggleDensity` handler wherever, and just used it in our code separately from the table instance. Building table features along-side TanStack Table instead of deeply integrating them into the table instance is still a perfectly valid way to build custom features. Depending on your use case, this may or may not be the cleanest way to extend TanStack Table with custom features.
