"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from '@/lib/trpc';
import { formatDateForInput, parseInputDateString } from '@/lib/dateUtils';
import { ContactForm, ContactFormData } from './ContactForm';
import { ContactList, Contact, NameSortField, DateFilterPeriod, SourceOption } from './ContactList';
import { GroupsProvider } from './ContactGroupManager';

import { ColumnSelector } from './ColumnSelector';

// UI Components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

// Icons
import {
  Download,
  Plus,
  Search,
  SlidersHorizontal,
  Tag,
  Upload,
  Mail,
  Phone,
  MessageSquareText,
  Sparkles,
  X
} from "lucide-react";

export function ContactsContent() {
  // --- State Management ---
  const router = useRouter();
  const searchParams = useSearchParams();
  const groupIdFromUrl = searchParams.get("group") ?? "";
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groupIdFromUrl);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContactFormData | undefined>(undefined);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'name', 'last_contacted', 'notes', 'source'
  ]);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [nameSortField, setNameSortField] = useState<NameSortField>('first_name');
  const [dateFilterPeriod, setDateFilterPeriod] = useState<DateFilterPeriod>('all');
  const [selectedSourceFilters, setSelectedSourceFilters] = useState<SourceOption[]>([]);
  
  // Keep state in sync with URL parameters
  useEffect(() => {
    // Prevent unnecessary re-setting if groupIdFromUrl is the same
    if (selectedGroupId !== groupIdFromUrl) {
      setSelectedGroupId(groupIdFromUrl);
    }
  }, [groupIdFromUrl, selectedGroupId]);

  const utils = api.useUtils(); // Get tRPC context for cache invalidation

  // --- Queries & Mutations ---
  // Fetch groups for filtering
  const { data: groups = [] } = api.groups.list.useQuery(undefined, {
    staleTime: 30000, // Cache for 30 seconds
  });

  // Apply client-side sorting based on sort field and direction
  const { 
    data: contacts = [], // Provide default empty array to avoid undefined
    isLoading, 
    error: queryError 
  } = api.contacts.list.useQuery({
    search: searchQuery,
    groupId: selectedGroupId || undefined // Convert empty string to undefined for tRPC query
  }, {
    // Keep previous data while loading new search/filter results
    keepPreviousData: true,
  });
  
  const sortedContacts = [...contacts].sort((a, b) => {
    // Handle name sorting based on selected name sort field
    if (sortField === 'first_name') {
      const aValue = a.first_name || '';
      const bValue = b.first_name || '';
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (sortField === 'last_name') {
      const aValue = a.last_name || '';
      const bValue = b.last_name || '';
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    // For other fields, sort normally
    const aValue = a[sortField as keyof Contact] as string || '';
    const bValue = b[sortField as keyof Contact] as string || '';
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });
  
  // Filter contacts based on search query
  const filteredContacts = sortedContacts.filter((contact) => {
    const searchRegex = new RegExp(searchQuery, 'i');
    return searchRegex.test(contact.first_name) || searchRegex.test(contact.last_name) || searchRegex.test(contact.email) || searchRegex.test(contact.phone);
  });

  // Groups data is already fetched above

  // Mutations
  const saveMutation = api.contacts.save.useMutation({
    onSuccess: () => {
      utils.contacts.list.invalidate(); // Invalidate list cache after save
      handleCloseForm(); // Close form and reset state on success
    },
    onError: (error) => {
      setFormError(`Failed to save contact: ${error.message}`);
      // Log the full error object for debugging
      console.error("Save Mutation Error:", error);
    }
  });

  // Mutation for deleting a contact
  const deleteMutation = api.contacts.delete.useMutation({
    onSuccess: () => {
      utils.contacts.list.invalidate(); // Invalidate list cache after delete
      setDeleteError(null); // Clear any previous delete error on success
    },
    onError: (error) => {
      setDeleteError(`Failed to delete contact: ${error.message}`);
      // Log the full error object for debugging
      console.error("Delete Mutation Error:", error);
    },
  });
  
  // Helper function to reset form and error states
  const resetFormAndErrorStates = () => {
    setFormError(null);
    setEditingContactId(null);
    setDeleteError(null); // Also clear delete error when interacting with form
    setFormData(undefined);
  };

  // --- Handler Functions ---
  const handleCloseForm = () => {
    setIsFormOpen(false);
    resetFormAndErrorStates();
  };

  const handleAddNewClick = () => {
    resetFormAndErrorStates();
    setIsFormOpen(true);
  };

  const handleEditClick = (contact: Contact) => {
    // Map Contact API data to ContactFormData
    const formData: ContactFormData = {
      id: contact.id,
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email ?? '',
      phone: contact.phone ?? '',
      company_name: contact.company_name ?? '',
      job_title: contact.job_title ?? '',
      profile_image_url: contact.profile_image_url ?? '',
      source: contact.source ?? '',
      notes: contact.notes ?? '',
      last_contacted_at: formatDateForInput(contact.last_contacted_at),
      enrichment_status: contact.enrichment_status ?? '',
      enriched_data: contact.enriched_data ?? null,
    };
    
    setFormData(formData);
    setEditingContactId(contact.id);
    resetFormAndErrorStates(); // Reset errors before opening form
    setIsFormOpen(true);
  };

  const handleDeleteClick = (contactId: string) => {
    setDeleteError(null); // Clear error before attempting delete
    if (window.confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      deleteMutation.mutate({ contactId });
    }
  };

  const handleSubmit = async (data: ContactFormData) => {
    // No need to set formError to null here, as onError handles failure and onSuccess closes form
    
    // Ensure optional fields are null if empty string for the backend API
    const mutationData: ContactFormData = {
      ...data,
      id: editingContactId || undefined, // Use undefined for create, id for update
      first_name: data.first_name.trim(),
      last_name: data.last_name.trim(),
      email: data.email.trim(),
      phone: data.phone?.trim() || null,
      company_name: data.company_name?.trim() || null,
      job_title: data.job_title?.trim() || null,
      profile_image_url: data.profile_image_url?.trim() || null,
      source: data.source?.trim() || null,
      notes: data.notes?.trim() || null,
      last_contacted_at: data.last_contacted_at ? parseInputDateString(data.last_contacted_at) : null,
      enrichment_status: data.enrichment_status?.trim() || null,
      enriched_data: data.enriched_data, // Pass as is
    };
    
    // No need for try-catch here as mutation.onError is the primary handler
    await saveMutation.mutateAsync(mutationData);
    // Success handling is done in the mutation's onSuccess callback
  };

  // --- Additional Handler Functions ---
  
  // Toggle column visibility when a column is clicked
  const handleColumnToggle = (column: string) => {
    setVisibleColumns(prev => 
      prev.includes(column) 
        ? prev.filter(col => col !== column) 
        : [...prev, column]
    );
  };
  
  // Handle date filter change for Last Contacted
  const handleDateFilterChange = (period: DateFilterPeriod) => {
    setDateFilterPeriod(period);
  };
  
  // Handle source filter change
  const handleSourceFilterChange = (sources: SourceOption[]) => {
    setSelectedSourceFilters(sources);
  };
  
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Handle name-specific sorting with different options
  const handleNameSortChange = (field: NameSortField, direction: 'asc' | 'desc') => {
    setNameSortField(field);
    setSortField(field);
    setSortDirection(direction);
  };
  
  // --- Rendering ---
  
  // Show query error only if no data is loaded
  if (queryError && contacts.length === 0) {
    return <p className="p-4 text-red-600">Error loading contacts: {queryError.message}</p>;
  }
  
  // Show initial loading state only when no data is available yet
  if (isLoading && contacts.length === 0) {
    return (
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="bg-teal-400 text-teal-800 px-4 py-2 rounded-md shadow-sm mr-4">
              <h1 className="text-2xl font-bold">Contacts</h1>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-8 flex items-center justify-center border-l-4 border-teal-400">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mr-4"></div>
          <p className="text-gray-700 font-medium">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <GroupsProvider>
      <div className="flex flex-col h-full">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="mb-6">
          {/* Search and filters toolbar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>
            
            {/* Active Group Filter */}
          {selectedGroupId && (
            <div className="flex items-center">
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center mr-4">
                {groups.find((g: { id: string; name: string }) => g.id === selectedGroupId)?.name || "Group"}
                <button 
                  onClick={() => {
                    router.push("/contacts");
                  }}
                  className="ml-2 text-purple-700 hover:text-purple-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="border-gray-300">
                <Tag className="w-4 h-4 mr-2" />
                Filters
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-gray-300">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Visible Columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <ColumnSelector 
                    visibleColumns={visibleColumns}
                    onToggle={handleColumnToggle}
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Alerts */}
          {deleteError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <p>{deleteError}</p>
            </div>
          )}
          
          {/* Contact List */}
          <ContactList 
            contacts={filteredContacts}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            isDeleteMutationLoading={deleteMutation.isLoading}
            isSaveMutationLoading={saveMutation.isLoading}
            searchQuery={searchQuery}
            selectedGroupId={selectedGroupId}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            onNameSortChange={handleNameSortChange}
            nameSortField={nameSortField}
            dateFilterPeriod={dateFilterPeriod}
            onDateFilterChange={handleDateFilterChange}
            selectedSourceFilters={selectedSourceFilters}
            onSourceFilterChange={handleSourceFilterChange}
          />
        </div>
      </div>

      {/* Add/Edit Contact Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingContactId ? 'Edit Contact' : 'Add New Contact'}
                </h2>
                <button 
                  onClick={handleCloseForm}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {formError && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                  <p>{formError}</p>
                </div>
              )}
              
              <ContactForm 
                onSubmit={handleSubmit} 
                initialData={formData}
                isOpen={true}
                onClose={() => setIsFormOpen(false)}
                isSubmitting={saveMutation.isLoading}
                error={formError}
                editingContactId={editingContactId}
              />
            </div>
          </div>
        </div>
      )}
      </div>
    </GroupsProvider>
  );
}
