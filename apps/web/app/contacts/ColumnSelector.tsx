"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface ColumnSelectorProps {
  visibleColumns: string[];
  onToggle: (column: string) => void;
}

interface ColumnOption {
  id: string;
  label: string;
}

export function ColumnSelector({ visibleColumns, onToggle }: ColumnSelectorProps) {
  // Available columns to display
  const availableColumns: ColumnOption[] = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'company', label: 'Company' },
    { id: 'job_title', label: 'Job Title' },
    { id: 'groups', label: 'Groups' },
    { id: 'tags', label: 'Tags' },
    { id: 'source', label: 'Source' },
    { id: 'last_contacted', label: 'Last Contacted' }
  ];

  return (
    <div className="p-1">
      {availableColumns.map((column) => (
        <div
          key={column.id}
          className={cn(
            "flex items-center justify-between px-2 py-1.5 rounded-sm text-sm cursor-pointer hover:bg-muted",
            visibleColumns.includes(column.id) && "font-medium"
          )}
          onClick={() => onToggle(column.id)}
        >
          <span>{column.label}</span>
          {visibleColumns.includes(column.id) && (
            <Check className="h-4 w-4 text-primary" />
          )}
        </div>
      ))}
    </div>
  );
}
