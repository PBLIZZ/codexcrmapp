'use client';

import { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Plus,
  Filter
} from 'lucide-react';
import { api } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ContactsTable } from './ContactsTable';
import { ColumnSelector } from './ColumnSelector';
import { ContactForm } from './ContactForm';
import { AddContactModal } from '@/components/contacts/AddContactModal';

// Define Contact interface
interface Contact {
  id: string;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  phone_country_code?: string | null;
  company_name?: string | null;
  job_title?: string | null;
  profile_image_url?: string | null;
  source?: string | null;
  notes?: string | null;
  last_contacted_at?: string | null;
  enrichment_status?: string | null;
  enriched_data?: any | null;
  created_at?: string | null;
  updated_at?: string | null;
  tags?: Array<{ id: string; name: string }> | null;
  [key: string]: any; // Allow for additional properties
}

interface ContactsMainContentProps {
  selectedGroupId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ContactsMainContent({
  selectedGroupId,
  searchQuery,
  onSearchChange
}: ContactsMainContentProps) {
  // State for UI controls
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  
  // Check for URL parameters
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const groupIdFromUrl = searchParams.get('group');
  
  // Use groupId from URL if available, otherwise use the selectedGroupId prop
  const effectiveGroupId = groupIdFromUrl || selectedGroupId;
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'name',
    'email',
    'phone',
    'company_name',
    'job_title',
    'last_contacted_at',
    'notes',
  ]);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [dateFilterPeriod, setDateFilterPeriod] = useState('all');
  const [selectedSourceFilters, setSelectedSourceFilters] = useState<string[]>([]);

  // Fetch contacts
  const {
    data: contactsData = [],
    isLoading,
    error: queryError
  } = api.contacts.list.useQuery(
    {
      search: searchQuery,
      groupId: effectiveGroupId || undefined,
    },
    {
      // Keep previous data while loading new search/filter results
      placeholderData: (previousData: Contact[] | undefined) => previousData,
    }
  );

  // Sort contacts based on sortField and sortDirection
  const contacts = [...contactsData].sort((a, b) => {
    // Handle nested fields like tags
    const getFieldValue = (obj: any, field: string) => {
      if (field === 'name') field = 'full_name';
      
      // Handle null or undefined values
      const aVal = obj[field] ?? '';
      const bVal = obj[field] ?? '';
      
      // Compare based on type
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else if (aVal instanceof Date && bVal instanceof Date) {
        return sortDirection === 'asc'
          ? aVal.getTime() - bVal.getTime()
          : bVal.getTime() - aVal.getTime();
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      // Default string comparison for mixed types
      return sortDirection === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    };
    
    return getFieldValue(a, sortField);
  });

  // Mutations
  const utils = api.useUtils();
  
  const deleteMutation = api.contacts.delete.useMutation({
    onSuccess: () => {
      utils.contacts.list.invalidate();
    },
  });

  const saveMutation = api.contacts.save.useMutation({
    onSuccess: () => {
      utils.contacts.list.invalidate();
      setIsContactFormOpen(false);
      setEditingContactId(null);
    },
  });

  // Handlers
  const handleEditContact = (contactId: string) => {
    const contact = contacts.find((c: Contact) => c.id === contactId);
    if (contact) {
      setEditingContactId(contactId);
      setIsContactFormOpen(true);
    }
  };

  const handleDeleteContact = (contactId: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteMutation.mutate({ contactId });
    }
  };

  const handleColumnToggle = (column: string) => {
    setVisibleColumns(prev => 
      prev.includes(column)
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };

  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Widgets data
  const totalContacts = contacts.length;
  const recentlyAddedCount = contacts.filter(
    (c: Contact) => c.created_at && new Date(c.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;
  const needsEnrichmentCount = contacts.filter(
    (c: Contact) => !c.enrichment_status || c.enrichment_status === 'pending'
  ).length;

  return (
    <div className="flex-1 p-6 overflow-auto bg-slate-100">
      {/* Header with search and actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter Contacts</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>By Date Added</DropdownMenuItem>
                <DropdownMenuItem>By Last Contact</DropdownMenuItem>
                <DropdownMenuItem>By Source</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Visible Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ColumnSelector
                  visibleColumns={visibleColumns}
                  onToggle={handleColumnToggle}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            onClick={() => {
              setEditingContactId(null);
              setIsContactFormOpen(true);
            }}
            className="bg-teal-500 hover:bg-teal-600"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Contact
          </Button>
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Total Contacts</span>
            <span className="text-2xl font-bold text-teal-600">{totalContacts}</span>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Recently Added</span>
            <span className="text-2xl font-bold text-blue-600">{recentlyAddedCount}</span>
            <span className="text-xs text-gray-400">Last 7 days</span>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Needs Enrichment</span>
            <span className="text-2xl font-bold text-amber-600">{needsEnrichmentCount}</span>
            <Button
              variant="link"
              className="p-0 h-auto text-xs text-amber-600 hover:text-amber-800 text-left"
            >
              Enrich All
            </Button>
          </div>
        </Card>
      </div>

      {/* Contacts Table */}
      <ContactsTable
        contacts={contacts}
        isLoading={isLoading}
        visibleColumns={visibleColumns}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        onEditContact={handleEditContact}
        onDeleteContact={handleDeleteContact}
      />

      {/* Add Contact Modal */}
      <AddContactModal
        open={isAddContactModalOpen}
        onOpenChange={setIsAddContactModalOpen}
        onContactAdded={() => {
          setIsAddContactModalOpen(false);
          utils.contacts.list.invalidate();
        }}
        showTriggerButton={false}
      />

      {/* Edit Contact Form Modal */}
      {isContactFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Edit Contact
                </h2>
                <button
                  onClick={() => setIsContactFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <ContactForm
                onSubmit={async (data) => {
                  await saveMutation.mutateAsync({
                    ...data,
                    id: editingContactId || undefined,
                  });
                }}
                initialData={contacts.find((c: Contact) => c.id === editingContactId)}
                isOpen={true}
                onClose={() => setIsContactFormOpen(false)}
                isSubmitting={saveMutation.isPending}
                error={saveMutation.error?.message || null}
                editingContactId={editingContactId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}