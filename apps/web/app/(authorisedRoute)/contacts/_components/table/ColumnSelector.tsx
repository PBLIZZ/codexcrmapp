'use client';

import { Checkbox } from '@codexcrm/ui';
import { Label } from '@codexcrm/ui';

interface ColumnSelectorProps {
  visibleColumns: string[];
  onToggle: (column: string) => void;
}

export function ColumnSelector({ visibleColumns, onToggle }: ColumnSelectorProps) {
  // Columns from the contacts table in Supabase, excluding AI-related and timestamp fields
  const availableColumns = [
    { id: 'name', label: 'Name', required: true },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'company_name', label: 'Company' },
    { id: 'job_title', label: 'Job Title' },
    { id: 'address_city', label: 'City' },
    { id: 'address_country', label: 'Country' },
    { id: 'address_postal_code', label: 'Postal Code' },
    { id: 'address_street', label: 'Street Address' },
    { id: 'client_since', label: 'Client Since' },
    { id: 'last_contacted_at', label: 'Last Contacted' },
    { id: 'notes', label: 'Notes' },
    { id: 'referral_source', label: 'Referral Source' },
    { id: 'relationship_status', label: 'Relationship Status' },
    { id: 'source', label: 'Source' },
    { id: 'tags', label: 'Tags' },
    { id: 'website', label: 'Website' },
    { id: 'wellness_status', label: 'Wellness Status' },
  ];

  return (
    <div className="p-2 space-y-2">
      {availableColumns.map((column) => (
        <div key={column.id} className="flex items-center space-x-2">
          <Checkbox
            id={`column-${column.id}`}
            checked={visibleColumns.includes(column.id)}
            onCheckedChange={() => {
              if (!column.required) {
                onToggle(column.id);
              }
            }}
            disabled={column.required}
          />
          <Label
            htmlFor={`column-${column.id}`}
            className={`text-sm ${column.required ? 'font-semibold' : ''}`}
          >
            {column.label}
            {column.required && <span className="text-xs text-gray-500 ml-1">(required)</span>}
          </Label>
        </div>
      ))}
    </div>
  );
}
