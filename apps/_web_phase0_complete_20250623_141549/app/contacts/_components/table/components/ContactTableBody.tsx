'use client';

import { ContactTableRow } from './ContactTableRow';
import type { Contact } from '../types';

interface ContactTableBodyProps {
  contacts: Contact[];
  visibleColumns: string[];
  columnOrder: string[];
  selectedContactIds: string[];
  onSelectContact: (contactId: string, isSelected: boolean) => void;
  onEditContact: (contactId: string) => void;
  onDeleteContact: (contactId: string) => void;
}

/**
 * ContactTableBody component that renders all contact rows
 * Handles empty states and row rendering
 */
export function ContactTableBody({
  contacts,
  visibleColumns,
  columnOrder,
  selectedContactIds,
  onSelectContact,
  onEditContact,
  onDeleteContact,
}: ContactTableBodyProps) {

  // Calculate total columns for empty state colspan
  const totalColumns = visibleColumns.length + 2; // +2 for selection and actions

  if (contacts.length === 0) {
    return (
      <tbody className="bg-white divide-y divide-gray-200">
        <tr>
          <td colSpan={totalColumns} className="px-6 py-10 text-center text-gray-500">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-lg font-medium">No contacts found</span>
              <span className="text-sm">Try adjusting your search or filters</span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="bg-white divide-y divide-gray-200">
      {contacts.map((contact) => (
        <ContactTableRow
          key={contact.id}
          contact={contact}
          visibleColumns={visibleColumns}
          columnOrder={columnOrder}
          isSelected={selectedContactIds.includes(contact.id)}
          onSelectContact={onSelectContact}
          onEditContact={onEditContact}
          onDeleteContact={onDeleteContact}
        />
      ))}
    </tbody>
  );
}