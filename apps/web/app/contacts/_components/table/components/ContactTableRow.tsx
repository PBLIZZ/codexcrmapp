'use client';

import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { ProfileAvatar } from './ProfileAvatar';
import { ContactActions } from './ContactActions';
import { getColumnDefinition } from '../constants';
import type { Contact } from '../types';

interface ContactTableRowProps {
  contact: Contact;
  visibleColumns: string[];
  columnOrder: string[];
  isSelected: boolean;
  onSelectContact: (contactId: string, isSelected: boolean) => void;
  onEditContact: (contactId: string) => void;
  onDeleteContact: (contactId: string) => void;
}

/**
 * ContactTableRow component that renders a single contact row
 * Includes selection, avatar, dynamic columns, and actions
 */
export function ContactTableRow({
  contact,
  visibleColumns,
  columnOrder,
  isSelected,
  onSelectContact,
  onEditContact,
  onDeleteContact,
}: ContactTableRowProps) {

  const handleSelectChange = (checked: boolean) => {
    onSelectContact(contact.id, checked);
  };

  // Sort visible columns based on column order
  const sortedColumns = visibleColumns
    .filter(col => col !== 'name') // Name column is handled separately
    .sort((a, b) => {
      const aIndex = columnOrder.indexOf(a);
      const bIndex = columnOrder.indexOf(b);
      
      // Handle cases where columns are not in columnOrder
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1; // Put unknown columns at the end
      if (bIndex === -1) return -1; // Put unknown columns at the end
      
      return aIndex - bIndex;
    });

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Selection Checkbox */}
      <td className="px-3 py-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={handleSelectChange}
          aria-label={`Select ${contact.full_name}`}
        />
      </td>

      {/* Name Column (always visible) */}
      <td className="px-4 py-4">
        <div className="flex items-center space-x-3">
          <ProfileAvatar contact={contact} />
          <div>
            <Link
              href={`/contacts/${contact.id}`}
              className="text-sm font-medium text-gray-900 hover:text-teal-600 transition-colors"
            >
              {contact.full_name}
            </Link>
          </div>
        </div>
      </td>

      {/* Dynamic Columns */}
      {sortedColumns.map((columnId) => {
        const columnDef = getColumnDefinition(columnId);
        
        if (!columnDef) {
          return (
            <td key={columnId} className="px-4 py-4 text-sm text-gray-500">
              -
            </td>
          );
        }

        return (
          <td key={columnId} className="px-4 py-4 text-sm text-gray-600">
            {columnDef.render ? columnDef.render(contact) : (contact[columnDef.field] ?? '-')}
          </td>
        );
      })}

      {/* Actions Column */}
      <td className="px-4 py-4">
        <ContactActions
          contact={contact}
          onEdit={onEditContact}
          onDelete={onDeleteContact}
        />
      </td>
    </tr>
  );
}