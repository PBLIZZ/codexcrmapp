// /app/contacts/ContactsView.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Plus, SlidersHorizontal, AlertCircle, RefreshCw } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { toast } from 'sonner';

import { Button, DropdownMenu, DropdownMenuTrigger, Input } from '@codexcrm/ui';

import { type ContactFormData } from '../new/ContactForm';
import { ContactsWidgets } from '@/app/(authorisedRoute)/contacts/_components/ContactsWidgets';
import { Contact } from '@codexcrm/database/prisma/generated/client/client';
import { trpc } from '@/lib/trpc/client';

interface ContactsViewProps {
  initialGroupId?: string;
}

export function ContactsView({ initialGroupId }: ContactsViewProps = {}) {
  const utils = trpc.useUtils();
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
    return ['name', 'email', 'phone', 'company_name', 'last_contacted_at', 'source'];
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
  } = trpc.contacts.list.useQuery(
    {
      search: debouncedSearchQuery,
      groupId: currentGroupId, // Pass the groupId to filter contacts if provided
    },
    {
      placeholderData: (prev: Contact[] | undefined) => prev ?? [],
    }
  ) as { data: Contact[]; isLoading: boolean; error: unknown }; // Type assertion to help TypeScript

  // --- Mutations ---
  const saveMutation = trpc.contacts.save.useMutation({
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

  const deleteMutation = trpc.contacts.delete.useMutation({
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
          size='sm'
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
            type='text'
            placeholder='Search by name, email, company...'
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className='pl-10'
          />
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type='button' className='w-full' variant='outline' size='sm'>
                <SlidersHorizontal className='w-4 h-4 mr-2' />
                Columns
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
          <Button className='w-full' variant='outline' size='sm' onClick={openNewContactForm}>
            <Plus className='mr-2 h-4 w-4' />
            New Contact
          </Button>
        </div>
      </div>

      {/* 3. The Table - Takes remaining space and handles overflow */}
      <div className='flex-1 min-h-0'>
        <h1 className='text-2xl font-bold'>Contacts</h1>
        <p>Contact list will be restored here.</p>
      </div>
    </div>
  );
}
