// /app/contacts/ContactsView.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Plus, SlidersHorizontal, AlertCircle, RefreshCw } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { toast } from 'sonner';

import { api } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Import the refactored modular table components
import type { Contact } from './_components/table/types';
import { ContactsTable } from './_components/table/components/ContactsTable';
import { ContactForm, type ContactFormData } from './ContactForm';
import { ColumnSelector } from './ColumnSelector';
import { ContactsWidgets } from '@/components/contacts/ContactsWidgets';

interface ContactsViewProps {
  initialGroupId?: string;
}

export function ContactsView({ initialGroupId }: ContactsViewProps = {}) {
  const utils = api.useUtils();
  const searchParams = useSearchParams();

  // Get the current group ID from URL search params
  const currentGroupId = searchParams.get('group') ?? initialGroupId;

  // --- State Management ---
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const [sortField, setSortField] = useState('full_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Initialize visibleColumns from localStorage or default
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('contacts-visible-columns');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Fall through to default
        }
      }
    }
    return [
      'name',
      'email',
      'phone',
      'company_name',
      'last_contacted_at',
      'source',
    ];
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Save visible columns to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('contacts-visible-columns', JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  // --- Data Fetching ---
  const {
    data: contactsData = [],
    isLoading,
    error: queryError,
  } = api.contacts.list.useQuery(
    {
      search: debouncedSearchQuery,
      groupId: currentGroupId, // Pass the groupId to filter contacts if provided
    },
    {
      placeholderData: (prev: Contact[] | undefined) => prev ?? [],
    }
  ) as { data: Contact[]; isLoading: boolean; error: unknown }; // Type assertion to help TypeScript

  // --- Mutations ---
  const saveMutation = api.contacts.save.useMutation({
    onSuccess: async () => {
      await utils.contacts.list.invalidate();
      closeForm();
    },
    onError: () => {
      toast.error('Failed to save contact', { duration: 4000 });
    },
  });

  const handleSave = async (data: ContactFormData) => {
    try {
      await saveMutation.mutateAsync(data);
    } catch {
      toast.error('Failed to save contact', { duration: 4000 });
    }
  };

  const deleteMutation = api.contacts.delete.useMutation({
    onSuccess: async () => {
      await utils.contacts.list.invalidate();
    },
    onError: () => {
      toast.error('Failed to delete contact', { duration: 4000 });
    },
  });

  // --- Derived State & Memoization ---
  const sortedContacts = useMemo<Contact[]>(() => {
    const data = Array.isArray(contactsData) ? [...contactsData] : [];
    return data.sort((a, b) => {
      const aVal = (a[sortField as keyof Contact] as string) ?? '';
      const bVal = (b[sortField as keyof Contact] as string) ?? '';
      return sortDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [contactsData, sortField, sortDirection]);

  // --- Event Handlers ---
  const handleSortChange = (field: string) => {
    setSortField(field);
    setSortDirection((prev) => (sortField === field && prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleColumnToggle = (column: string) => {
    setVisibleColumns((prev) =>
      prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column]
    );
  };

  const handleEditContact = (id: string) => {
    const contact = contactsData.find((c) => c.id === id);
    if (contact) {
      setEditingContact(contact);
      setIsFormOpen(true);
    }
  };

  const handleDeleteContact = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteMutation.mutate({ contactId: id });
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
      <div className='p-6 bg-red-50 border-l-4 border-red-500 rounded-md'>
        <div className='flex items-center'>
          <AlertCircle className='h-6 w-6 text-red-500 mr-3' />
          <h3 className='text-lg font-medium text-red-800'>Error loading contacts</h3>
        </div>
        <p className='mt-2 text-sm text-red-700'>
          {queryError instanceof Error ? queryError.message : JSON.stringify(queryError)}
        </p>
        <Button
          variant='outline'
          className='mt-4'
          onClick={() => void utils.contacts.list.invalidate()}
        >
          <RefreshCw className='mr-2 h-4 w-4' /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col space-y-6'>
      {/* 1. Widgets */}
      <ContactsWidgets />

      {/* 2. Toolbar */}
      <div className='flex-shrink-0 flex flex-col md:flex-row items-center justify-between gap-4'>
        <div className='relative w-full md:w-80'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
          <Input
            placeholder='Search by name, email, company...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                <SlidersHorizontal className='w-4 h-4 mr-2' />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Visible Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ColumnSelector visibleColumns={visibleColumns} onToggle={handleColumnToggle} />
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={openNewContactForm} size='sm'>
            <Plus className='mr-2 h-4 w-4' />
            New Contact
          </Button>
        </div>
      </div>

      {/* 3. The Table - Takes remaining space and handles overflow */}
      <div className='flex-1 min-h-0'>
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
      </div>

      {/* 4. The Form Modal (controlled by this component) */}
      {isFormOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto'>
          <div
            className='bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <ContactForm
              isOpen={isFormOpen}
              initialData={
                editingContact
                  ? {
                      id: editingContact.id,
                      full_name: editingContact.full_name,
                      email: editingContact.email ?? '', // Use ??
                      phone: editingContact.phone ?? undefined, // Use ??
                      company_name: editingContact.company_name ?? undefined, // Use ??
                      job_title: editingContact.job_title ?? undefined, // Use ??
                      profile_image_url: editingContact.profile_image_url ?? undefined, // Use ??
                      source: editingContact.source ?? undefined, // Use ??
                      notes: editingContact.notes ?? undefined, // Use ??
                      last_contacted_at: editingContact.last_contacted_at ?? undefined, // Use ??
                      enrichment_status: editingContact.enrichment_status ?? undefined, // Use ??
                      enriched_data:
                        (editingContact.enriched_data as Record<string, unknown> | null) ??
                        undefined, // Use ??
                      address_street: editingContact.address_street ?? undefined, // Use ??
                      address_city: editingContact.address_city ?? undefined, // Use ??
                      address_postal_code: editingContact.address_postal_code ?? undefined, // Use ??
                      address_country: editingContact.address_country ?? undefined, // Use ??
                      website: editingContact.website ?? undefined, // Use ??
                      tags: editingContact.tags ?? undefined, // Use ??
                      social_handles: editingContact.social_handles ?? undefined, // Use ??
                    }
                  : {
                      full_name: '',
                      email: '',
                    }
              }
              onClose={closeForm}
              onSubmit={handleSave}
              isSubmitting={saveMutation.isPending}
              error={saveMutation.error ? JSON.stringify(saveMutation.error) : null}
              editingContactId={editingContact?.id ?? null}
            />
          </div>
        </div>
      )}
    </div>
  );
}
