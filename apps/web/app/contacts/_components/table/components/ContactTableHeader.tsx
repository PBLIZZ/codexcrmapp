'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { getColumnDefinition } from '@/app/contacts/_components/table/constants';
import type { Contact } from '@/app/contacts/_components/table/types';

interface ContactTableHeaderProps {
  contacts: Contact[];
  visibleColumns: string[];
  columnOrder: string[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
  isAllSelected: boolean;
  draggedColumn: string | null;
  onSortChange: (field: string) => void;
  onSelectAll: () => void;
  onDragStart: (e: React.DragEvent, columnId: string) => void;
  onDragOver: (e: React.DragEvent, columnId: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetColumnId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

/**
 * ContactTableHeader component that renders the table header
 * Includes sorting, drag & drop reordering, and select all functionality
 */
export function ContactTableHeader({
  contacts,
  visibleColumns,
  columnOrder,
  sortField,
  sortDirection,
  isAllSelected,
  draggedColumn,
  onSortChange,
  onSelectAll,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: ContactTableHeaderProps) {

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4 ml-1" /> : 
      <ArrowDown className="w-4 h-4 ml-1" />;
  };

  // Sort visible columns based on column order
  const sortedColumns = visibleColumns
    .filter(col => col !== 'name') // Name column is handled separately
    .sort((a, b) => {
      const aIndex = columnOrder.indexOf(a);
      const bIndex = columnOrder.indexOf(b);
      
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      
      return aIndex - bIndex;
    });

  return (
    <thead className="bg-teal-100 sticky top-0 z-10">
      <tr>
        {/* Selection Column */}
        <th className="px-3 py-3 text-left w-12">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={onSelectAll}
            aria-label="Select all contacts"
          />
        </th>

        {/* Name Column (always visible, not draggable) */}
        <th className="px-4 py-3 text-left">
          <Button
            variant="ghost"
            className="p-0 h-auto font-semibold text-teal-800 hover:text-teal-900"
            onClick={() => onSortChange('full_name')}
          >
            <span className="flex items-center">
              Name
              {renderSortIcon('full_name')}
            </span>
          </Button>
        </th>

        {/* Dynamic Columns (draggable) */}
        {sortedColumns.map((columnId) => {
          const columnDef = getColumnDefinition(columnId);
          
          if (!columnDef) {
            return (
              <th key={columnId} className="px-4 py-3 text-left">
                <span className="font-semibold text-teal-800">
                  {columnId}
                </span>
              </th>
            );
          }

          const isDragging = draggedColumn === columnId;
          
          return (
            <th
              key={columnId}
              scope="col"
              className={`px-4 py-3 text-left cursor-grab transition-opacity ${
                isDragging ? 'opacity-50' : ''
              }`}
              draggable="true"
              data-column={columnId}
              onDragStart={(e) => onDragStart(e, columnId)}
              onDragOver={(e) => onDragOver(e, columnId)}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, columnId)}
              onDragEnd={onDragEnd}
            >
              {columnDef.sortable !== false ? (
                <Button
                  variant="ghost"
                  className="p-0 h-auto font-semibold text-teal-800 hover:text-teal-900"
                  onClick={() => onSortChange(columnDef.field)}
                >
                  <span className="flex items-center">
                    {columnDef.label}
                    {renderSortIcon(columnDef.field)}
                  </span>
                </Button>
              ) : (
                <span className="font-semibold text-teal-800">
                  {columnDef.label}
                </span>
              )}
            </th>
          );
        })}

        {/* Actions Column */}
        <th className="px-4 py-3 text-left w-20">
          <span className="font-semibold text-teal-800">
            Actions
          </span>
        </th>
      </tr>
    </thead>
  );
}