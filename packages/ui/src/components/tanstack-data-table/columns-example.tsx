// columns.tsx
import React, { useMemo } from "react";
import { createColumnHelper, ColumnDef, Row, Column } from "@tanstack/react-table";
// Assuming these are UI components you'd have defined elsewhere (e.g., in a "@/components/ui" folder)
// These imports are illustrative of what you'd need for the UI elements in the headers/cells.
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react"; // An example icon for sorting indication

// 1. Define your data type [1, 4-8]
// This type is used as a generic (TData) throughout the library's types and APIs for type-safe development. [5, 7]
export type YourRowData = {
  id: string;
  name: string;
  date: Date; // Using Date objects for easier date sorting/filtering [9]
  sales: number;
  tags: string[]; // An array of tags for filtering
  // Add other properties that are part of your table's data
};

// Use createColumnHelper for type-safe column definitions [1, 3, 10, 11]
const columnHelper = createColumnHelper<YourRowData>();

// 2. Define custom filter functions outside of useMemo for reusability [12]
// These functions are pure logic that determine if a row should be included based on a filter value.

// Custom filter function for date ranges (selecting a time period or a day)
const dateRangeFilterFn: ColumnDef<YourRowData>['filterFn'] = (row, columnId, filterValue: { type: 'day' | 'period'; value?: string; from?: string; to?: string } | undefined) => {
  const date = row.getValue<Date>(columnId);
  // Return true if no valid date or no filter value to show all rows [12]
  if (!date || !filterValue) return true;

  if (filterValue.type === 'day' && filterValue.value) {
    // Check if the row's date matches a specific day (e.g., 'YYYY-MM-DD')
    return date.toISOString().slice(0, 10) === filterValue.value;
  }
  if (filterValue.type === 'period' && filterValue.from && filterValue.to) {
    // Check if the row's date falls within a specified period
    const fromDate = new Date(filterValue.from);
    const toDate = new Date(filterValue.to);
    // Ensure the time part is considered for range if necessary, or just compare dates
    return date >= fromDate && date <= toDate;
  }
  return true; // Default to including if filter type is unknown/not matching
};

// Custom filter function for tags (an array of tags within a cell)
// This function checks if the row's tags array includes the filterValue (the clicked tag). [12, 13]
const tagsFilterFn: ColumnDef<YourRowData>['filterFn'] = (row, columnId, filterValue: string) => {
  const rowTags = row.getValue<string[]>(columnId);
  // If the row has no tags or the filter value is empty, do not include (or include all, depending on desired default)
  if (!rowTags || rowTags.length === 0 || !filterValue) return false;

  // Check if the row's tags array contains the filterValue (the single tag clicked)
  return rowTags.includes(filterValue);
};

// Exporting filter functions might be useful if you reference them elsewhere in your table setup.
export const customFilterFns = {
  dateRange: dateRangeFilterFn,
  tagsArray: tagsFilterFn,
};


// 3. Define the columns array using useMemo for stability [14-17]
// This prevents infinite re-renders of your table by ensuring a stable reference to columns. [5, 18, 19]
export const getColumns = (
  // onTagClick is a callback function passed from your data-table.tsx
  // This allows the clickable tag in the cell to update the column filter state in the parent component.
  onTagClick: (tag: string) => void,
): ColumnDef<YourRowData>[] => {
  return useMemo(
    () => [
      // Feature: Multi-select row for bulk actions [20]
      // This is a 'display' column, meaning it doesn't map directly to data but renders UI [4, 21].
      columnHelper.display({
        id: "select", // Unique ID for the column
        header: ({ table }) => (
          // Header checkbox to select/deselect all rows on the current page [20, 22]
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          // Cell checkbox for individual row selection [20, 22]
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false, // Selection columns are typically not sortable
        enableHiding: false, // Typically, you wouldn't hide the selection checkbox column [23]
        enableColumnFilters: false, // Not filterable
      }),

      // Standard Column: Name
      columnHelper.accessor("name", {
        header: "Name", // Header content
        cell: (info) => info.getValue(), // Cell content, displays the raw value
        enableSorting: true, // Feature: Sortable column [24-26]
        enableColumnFilters: true, // You might want a simple text filter for names [27]
        // You could add a custom filterFn here if needed for specific name search logic.
      }),

      // Feature: Sort on Date Columns and Filter on Date Columns
      columnHelper.accessor("date", {
        header: ({ column }) => (
          // Header button to toggle sorting [28, 29]
          <Button
            variant="ghost" // Example styling variant
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} // Toggles 'asc', 'desc', 'none'
          >
            Date
            {/* Sorting indicator icon [28, 29] */}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
          // Note: The UI for date period/day filtering (e.g., a date picker)
          // would typically be rendered here *within your data-table.tsx* component
          // (or a sub-component of it), using `column.setFilterValue()` to apply the filter. [30, 31]
        ),
        cell: (info) => info.getValue().toLocaleDateString(), // Format the Date object for display
        enableSorting: true, // Enable sorting for the date column [24, 25]
        sortingFn: "datetime", // Use TanStack Table's built-in date-time sorting function [9]
        enableColumnFilters: true, // Enable filtering for this column [27]
        filterFn: customFilterFns.dateRange, // Apply our custom date range filter function [12]
      }),

      // Feature: Sort on Total Sales Columns
      columnHelper.accessor("sales", {
        header: ({ column }) => (
          // Header button to toggle sorting for sales
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sales
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: (info) => `$${info.getValue().toFixed(2)}`, // Format sales as currency [32]
        enableSorting: true, // Enable sorting for the sales column [24, 25]
        sortingFn: "alphanumeric", // Good for numerical sorting [9]
        // You might add enableColumnFilters here for numeric range filtering if desired.
      }),

      // Feature: Filter by Tags (an array of tags within a cell)
      columnHelper.accessor("tags", {
        header: "Tags",
        cell: ({ row, column }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer"
                // When a tag is clicked, call the onTagClick callback.
                // This callback (from data-table.tsx) will update the column filter for this 'tags' column.
                onClick={() => onTagClick(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        ),
        enableColumnFilters: true, // Enable filtering for this column [27]
        filterFn: customFilterFns.tagsArray, // Apply our custom tags array filter function [12]
        // Note: Global search will also implicitly search these tags if configured to do so.
      }),

      // Feature: Dropdown menu with row actions
      // This is another 'display' column for UI purposes [4, 21].
      columnHelper.display({
        id: "actions", // Unique ID for the actions column
        header: "Actions", // Column header text
        cell: ({ row }) => (
          // Renders a dropdown menu for row-specific actions [33]
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                {/* Example icon, you would replace this with your actual menu icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Dropdown menu items with specific actions using row.original data [33, 34] */}
              <DropdownMenuItem onClick={() => alert(`View details for ${row.original.name}`)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert(`Edit ${row.original.name}`)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert(`Delete ${row.original.name}`)}>
                Delete
              </DropdownMenuItem>
              {/* Add more row-specific actions as needed */}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false, // Actions column is not sortable
        enableColumnFilters: false, // Not filterable
        enableHiding: false, // Actions column is typically not hidden [23]
      }),
    ],
    // Dependencies for useMemo: Re-memoize columns only if onTagClick changes [14]
    [onTagClick]
  );
};
