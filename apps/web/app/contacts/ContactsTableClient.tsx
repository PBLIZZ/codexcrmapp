'use client';

import { useState } from 'react';
import { ContactsTable, Contact } from '@/app/contacts/ContactsTable';

interface ContactsTableClientProps {
  initialContacts: Contact[];
}

export default function ContactsTableClient({ initialContacts }: ContactsTableClientProps) {
  // State for sorting and visible columns
  const [sortField, setSortField] = useState<string>('full_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'name', 'notes', 'phone', 'company_name', 'job_title', 'last_contacted_at'
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Handler for sort changes
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handlers for contact actions
  const handleEditContact = (contactId: string) => {
    // This would typically navigate to an edit page or open a modal
    console.log(`Edit contact: ${contactId}`);
  };

  const handleDeleteContact = (contactId: string) => {
    // This would typically show a confirmation dialog and then delete
    console.log(`Delete contact: ${contactId}`);
  };

  return (
    <ContactsTable
      contacts={initialContacts}
      isLoading={isLoading}
      visibleColumns={visibleColumns}
      sortField={sortField}
      sortDirection={sortDirection}
      onSortChange={handleSortChange}
      onEditContact={handleEditContact}
      onDeleteContact={handleDeleteContact}
    />
  );
}
