// /app/contacts/ContactsView.tsx
'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Plus, SlidersHorizontal, AlertCircle, RefreshCw } from 'lucide-react';
import { useDebounce } from 'use-debounce';

import { api } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Import the BEST components we decided to keep
import { ContactsTable, Contact } from './ContactsTable';
import { ContactForm } from './ContactForm';
import { ColumnSelector } from './ColumnSelector';
import { ContactsWidgets } from '@/components/contacts/ContactsWidgets';

interface ContactsViewProps {
  initialGroupId?: string;
}

export function ContactsView({ initialGroupId }: ContactsViewProps = {}) {
  const utils = api.useUtils();
  const searchParams = useSearchParams();

  // Get the current group ID from URL search params
  const currentGroupId = searchParams.get('group') || initialGroupId;

  // --- State Management ---
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  
  const [sortField, setSortField] = useState('full_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'name', 'email', 'phone', 'company_name', 'last_contacted_at', 'source'
  ]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // --- Data Fetching ---
  const { data: contactsData = [], isLoading, error: queryError } = api.contacts.list.useQuery(
    { 
      search: debouncedSearchQuery,
      groupId: currentGroupId // Pass the groupId to filter contacts if provided
    },
    { placeholderData: (prev: Contact[] | undefined) => prev }
  );

  // --- Mutations ---
  const saveMutation = api.contacts.save.useMutation({
    onSuccess: () => {
      utils.contacts.list.invalidate();
      closeForm();
    },
    onError: (error) => {
      console.error("Failed to save contact:", error);
      // Here you would show a toast notification
    },
  });

  const deleteMutation = api.contacts.delete.useMutation({
    onSuccess: () => {
      utils.contacts.list.invalidate();
    },
    onError: (error) => {
      console.error("Failed to delete contact:", error);
      // Here you would show a toast notification
    },
  });

  // --- Derived State & Memoization ---
  const sortedContacts = useMemo(() => {
    return [...contactsData].sort((a, b) => {
      const aVal = a[sortField as keyof Contact] || '';
      const bVal = b[sortField as keyof Contact] || '';
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }, [contactsData, sortField, sortDirection]);

  // --- Event Handlers ---
  const handleSortChange = (field: string) => {
    setSortField(field);
    setSortDirection(prev => (sortField === field && prev === 'asc' ? 'desc' : 'asc'));
  };
  
  const handleColumnToggle = (column: string) => {
    setVisibleColumns(prev =>
      prev.includes(column) ? prev.filter(col => col !== column) : [...prev, column]
    );
  };
  
  const handleEditContact = (contactId: string) => {
    const contactToEdit = contactsData.find((c: Contact) => c.id === contactId);
    if (contactToEdit) {
      setEditingContact(contactToEdit);
      setIsFormOpen(true);
    }
  };

  const handleDeleteContact = (contactId: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteMutation.mutate({ contactId });
    }
  };

  const openNewContactForm = () => {
    setEditingContact(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingContact(null);
  };
  
  // --- Render Logic ---
  if (queryError) {
    return (
      <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-md">
        <div className="flex items-center">
          <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
          <h3 className="text-lg font-medium text-red-800">Error loading contacts</h3>
        </div>
        <p className="mt-2 text-sm text-red-700">{queryError.message}</p>
        <Button variant="outline" className="mt-4" onClick={() => utils.contacts.list.invalidate()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* 1. Widgets */}
      <ContactsWidgets />

      {/* 2. Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, email, company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Visible Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ColumnSelector visibleColumns={visibleColumns} onToggle={handleColumnToggle} />
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={openNewContactForm} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Contact
          </Button>
        </div>
      </div>
      
      {/* 3. The Table */}
      <ContactsTable
        contacts={sortedContacts}
        isLoading={isLoading}
        visibleColumns={visibleColumns}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        onEditContact={handleEditContact}
        onDeleteContact={handleDeleteContact}
      />

      {/* 4. The Form Modal (controlled by this component) */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
             <ContactForm
                isOpen={isFormOpen}
                initialData={editingContact ? {
                  id: editingContact.id,
                  full_name: editingContact.full_name,
                  email: editingContact.email || '',
                  phone: editingContact.phone,
                  company_name: editingContact.company_name,
                  job_title: editingContact.job_title,
                  profile_image_url: editingContact.profile_image_url,
                  source: editingContact.source,
                  notes: editingContact.notes,
                  last_contacted_at: editingContact.last_contacted_at,
                  enrichment_status: editingContact.enrichment_status,
                  enriched_data: editingContact.enriched_data as Record<string, unknown> | null,
                  address_street: editingContact.address_street,
                  address_city: editingContact.address_city,
                  address_postal_code: editingContact.address_postal_code,
                  address_country: editingContact.address_country,
                  website: editingContact.website,
                  tags: editingContact.tags?.map(tag => tag.name) || [],
                  social_handles: [] // Contact doesn't have social_handles, initialize as empty
                } : undefined}
                onClose={closeForm}
                onSubmit={async (data) => {
                  await saveMutation.mutateAsync(data);
                }}
                isSubmitting={saveMutation.isPending}
                error={saveMutation.error?.message || null}
                editingContactId={editingContact?.id || null}
              />
          </div>
        </div>
      )}
    </div>
  );
}