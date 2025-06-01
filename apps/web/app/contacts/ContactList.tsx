"use client";

import { format, formatDistance, subDays, startOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isAfter, isBefore, parseISO } from 'date-fns';
import { ArrowDown, ArrowUp, Mail, MessageSquareText, Phone, Sparkles, ChevronDown, Calendar, Clock, Check } from "lucide-react";
import Link from "next/link";

import { ContactGroupManager, GroupsProvider } from './ContactGroupManager';

import { AvatarImage } from "@/components/ui/avatar-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/trpc";
import { cn } from "@/lib/utils";



export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  company_name?: string | null;
  job_title?: string | null;
  profile_image_url?: string | null;
  source?: string | null;
  notes?: string | null;
  last_contacted_at?: string | null;
  enrichment_status?: string | null;
  enriched_data?: unknown | null;
  created_at?: string | null;
  updated_at?: string | null;
  tags?: Array<{ id: string; name: string }> | null;
}

// Define name sort options
export type NameSortField = 'first_name' | 'last_name';

// Define date filter options
export type DateFilterPeriod = 'today' | 'this_week' | 'last_week' | 'this_month' | 'last_month' | 'older' | 'all';

// Define source types for filtering
export type SourceOption = 'conference' | 'referral' | 'website' | 'event' | 'social_media' | 'cold_outreach' | 'other';

interface ContactListProps {
  contacts: Contact[];
  onEditClick: (contact: Contact) => void;
  onDeleteClick: (contactId: string) => void;
  isDeleteMutationLoading: boolean;
  isSaveMutationLoading: boolean;
  searchQuery: string;
  selectedGroupId: string;
  visibleColumns?: string[];
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (field: string) => void;
  onNameSortChange?: (field: NameSortField, direction: 'asc' | 'desc') => void;
  nameSortField?: NameSortField;
  dateFilterPeriod?: DateFilterPeriod;
  onDateFilterChange?: (period: DateFilterPeriod) => void;
  selectedSourceFilters?: SourceOption[];
  onSourceFilterChange?: (sources: SourceOption[]) => void;
}

export function ContactList({
  contacts,
  onEditClick,
  onDeleteClick,
  isDeleteMutationLoading,
  isSaveMutationLoading,
  searchQuery,
  selectedGroupId,
  visibleColumns = ['name', 'last_contacted', 'notes', 'source'],
  sortField = 'name',
  sortDirection = 'asc',
  onSortChange = () => {},
  onNameSortChange = () => {},
  nameSortField = 'first_name',
  dateFilterPeriod = 'all',
  onDateFilterChange = () => {},
  selectedSourceFilters = [],
  onSourceFilterChange = () => {}
}: ContactListProps) {
  // Query groups for contact group management
  const { data: allGroups = [], isLoading: isLoadingGroups } = api.groups.list.useQuery(undefined, {
    staleTime: 60000, // Cache for 60 seconds
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  // Get contacts filtered by date period
  const getFilteredContactsByDate = (contacts: Contact[], period: DateFilterPeriod): Contact[] => {
    if (period === 'all') return contacts;
    
    const today = new Date();
    const startOfToday = startOfDay(today);
    
    return contacts.filter(contact => {
      if (!contact.last_contacted_at) {
        // If no last_contacted_at date and filtering for 'older', include it
        return period === 'older';
      }
      
      const contactDate = parseISO(contact.last_contacted_at);
      
      switch (period) {
        case 'today':
          return isAfter(contactDate, startOfToday);
          
        case 'this_week': {
          const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday as week start
          const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
          return isAfter(contactDate, weekStart) && isBefore(contactDate, weekEnd);
        }
          
        case 'last_week': {
          const lastWeekStart = startOfWeek(subDays(today, 7), { weekStartsOn: 1 });
          const lastWeekEnd = endOfWeek(subDays(today, 7), { weekStartsOn: 1 });
          return isAfter(contactDate, lastWeekStart) && isBefore(contactDate, lastWeekEnd);
        }
          
        case 'this_month': {
          const monthStart = startOfMonth(today);
          const monthEnd = endOfMonth(today);
          return isAfter(contactDate, monthStart) && isBefore(contactDate, monthEnd);
        }
          
        case 'last_month': {
          const lastMonthStart = startOfMonth(subDays(today, 30));
          const lastMonthEnd = endOfMonth(subDays(today, 30));
          return isAfter(contactDate, lastMonthStart) && isBefore(contactDate, lastMonthEnd);
        }
          
        case 'older':
          // More than a month ago
          return isBefore(contactDate, startOfMonth(subDays(today, 30)));
          
        default:
          return true;
      }
    });
  };
  
  // Available source options for filtering
  const availableSourceOptions: SourceOption[] = [
    'conference',
    'referral', 
    'website',
    'event',
    'social_media',
    'cold_outreach',
    'other'
  ];

  // First filter by date period
  const dateFilteredContacts = getFilteredContactsByDate(contacts, dateFilterPeriod);
  
  // Then filter by source if any source filters are selected
  const sourceFilteredContacts = selectedSourceFilters.length > 0
    ? dateFilteredContacts.filter(contact => {
        // If contact has no source and we're filtering, exclude it
        if (!contact.source) return false;
        
        // Keep contact if its source is in the selected sources
        return selectedSourceFilters.includes(contact.source as SourceOption);
      })
    : dateFilteredContacts;
  
  // Then filter by search query
  const filteredContacts = sourceFilteredContacts
    .filter(contact => {
      // Apply search filter
      if (searchQuery.trim() === '') return true;
      
      const searchLower = searchQuery.toLowerCase();
      const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.toLowerCase();
      const email = (contact.email || '').toLowerCase();
      const phone = (contact.phone || '').toLowerCase();
      const company = (contact.company_name || '').toLowerCase();
      const notes = (contact.notes || '').toLowerCase();
      const source = (contact.source || '').toLowerCase();
      
      return fullName.includes(searchLower) ||
        email.includes(searchLower) ||
        phone.includes(searchLower) ||
        company.includes(searchLower) ||
        notes.includes(searchLower) ||
        source.includes(searchLower);
    });

  // We'll always render the table and headers, but show a message in the table body if no contacts are found

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-teal-50 to-teal-100">
          <tr>
            {/* Name Column - Always visible */}
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-semibold bg-gradient-to-r from-teal-50 to-teal-100 text-teal-800 uppercase tracking-wider"
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center cursor-pointer">
                    <span>Name</span>
                    <span className="ml-1 flex items-center">
                      {sortField.includes('name') || sortField === 'first_name' || sortField === 'last_name' ? (
                        sortDirection === 'asc' ? 
                          <ArrowUp className="h-3 w-3" /> : 
                          <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3 ml-1" />
                      )}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem onClick={() => onNameSortChange('first_name', 'asc')}>
                    <div className="flex items-center justify-between w-full">
                      <span>First Name (A-Z)</span>
                      {nameSortField === 'first_name' && sortDirection === 'asc' && <ArrowUp className="h-3 w-3" />}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNameSortChange('first_name', 'desc')}>
                    <div className="flex items-center justify-between w-full">
                      <span>First Name (Z-A)</span>
                      {nameSortField === 'first_name' && sortDirection === 'desc' && <ArrowDown className="h-3 w-3" />}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNameSortChange('last_name', 'asc')}>
                    <div className="flex items-center justify-between w-full">
                      <span>Last Name (A-Z)</span>
                      {nameSortField === 'last_name' && sortDirection === 'asc' && <ArrowUp className="h-3 w-3" />}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNameSortChange('last_name', 'desc')}>
                    <div className="flex items-center justify-between w-full">
                      <span>Last Name (Z-A)</span>
                      {nameSortField === 'last_name' && sortDirection === 'desc' && <ArrowDown className="h-3 w-3" />}
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </th>
            
            {/* Last Contact Column */}
            {visibleColumns.includes('last_contacted') && (
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center cursor-pointer">
                      <span>Last Contacted</span>
                      <span className="ml-1 flex items-center">
                        <ChevronDown className="h-3 w-3 ml-1" />
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem onClick={() => onDateFilterChange('all')}>
                      <div className="flex items-center justify-between w-full">
                        <span>All Contacts</span>
                        {dateFilterPeriod === 'all' && <Check className="h-3 w-3" />}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDateFilterChange('today')}>
                      <div className="flex items-center justify-between w-full">
                        <span>Today</span>
                        {dateFilterPeriod === 'today' && <Check className="h-3 w-3" />}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDateFilterChange('this_week')}>
                      <div className="flex items-center justify-between w-full">
                        <span>This Week</span>
                        {dateFilterPeriod === 'this_week' && <Check className="h-3 w-3" />}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDateFilterChange('last_week')}>
                      <div className="flex items-center justify-between w-full">
                        <span>Last Week</span>
                        {dateFilterPeriod === 'last_week' && <Check className="h-3 w-3" />}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDateFilterChange('this_month')}>
                      <div className="flex items-center justify-between w-full">
                        <span>This Month</span>
                        {dateFilterPeriod === 'this_month' && <Check className="h-3 w-3" />}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDateFilterChange('last_month')}>
                      <div className="flex items-center justify-between w-full">
                        <span>Last Month</span>
                        {dateFilterPeriod === 'last_month' && <Check className="h-3 w-3" />}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDateFilterChange('older')}>
                      <div className="flex items-center justify-between w-full">
                        <span>More than a Month</span>
                        {dateFilterPeriod === 'older' && <Check className="h-3 w-3" />}
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </th>
            )}
            
            {/* Notes Column */}
            {visibleColumns.includes('notes') && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
            )}
            
            {/* Source Column */}
            {visibleColumns.includes('source') && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center cursor-pointer">
                      <span>Source</span>
                      <span className="ml-1 flex items-center">
                        {sortField === 'source' ? (
                          sortDirection === 'asc' ? 
                            <ArrowUp className="h-3 w-3" /> : 
                            <ArrowDown className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3 ml-1" />
                        )}
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-52">
                    {/* Sorting options */}
                    <div className="px-2 py-1.5 text-xs font-semibold">Sort By</div>
                    <DropdownMenuItem onClick={() => onSortChange('source')}>
                      <div className="flex items-center justify-between w-full">
                        <span>A-Z</span>
                        {sortField === 'source' && sortDirection === 'asc' && <ArrowUp className="h-3 w-3" />}
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      if (sortField === 'source' && sortDirection === 'asc') {
                        onSortChange('source'); // This will toggle to desc
                      } else {
                        onSortChange('source');
                        if (sortDirection === 'asc') onSortChange('source'); // Toggle to desc
                      }
                    }}>
                      <div className="flex items-center justify-between w-full">
                        <span>Z-A</span>
                        {sortField === 'source' && sortDirection === 'desc' && <ArrowDown className="h-3 w-3" />}
                      </div>
                    </DropdownMenuItem>
                    
                    <div className="h-px bg-slate-200 my-1" />
                    
                    {/* Filter options */}
                    <div className="px-2 py-1.5 text-xs font-semibold">Filter By</div>
                    
                    {availableSourceOptions.map((source) => (
                      <DropdownMenuItem key={source} onSelect={(e) => {
                        e.preventDefault();
                        const isSelected = selectedSourceFilters.includes(source);
                        const updatedSources = isSelected
                          ? selectedSourceFilters.filter(s => s !== source)
                          : [...selectedSourceFilters, source];
                        onSourceFilterChange(updatedSources);
                      }}>
                        <div className="flex items-center space-x-2">
                          <div className={`w-4 h-4 border rounded flex items-center justify-center ${selectedSourceFilters.includes(source) ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                            {selectedSourceFilters.includes(source) && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <span className="capitalize">{source.replace('_', ' ')}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    
                    {selectedSourceFilters.length > 0 && (
                      <>
                        <div className="h-px bg-slate-200 my-1" />
                        <DropdownMenuItem onSelect={(e) => {
                          e.preventDefault();
                          onSourceFilterChange([]);
                        }}>
                          <div className="flex items-center justify-center w-full text-xs text-red-500 font-medium">
                            Clear Filters
                          </div>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </th>
            )}
            
            {/* Actions Column - Always visible */}
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <AvatarImage
                      src={contact.profile_image_url || null}
                      alt={`${contact.first_name || ''} ${contact.last_name || ''}`.trim()}
                      size="md"
                    />
                    <div className="ml-4">
                      <Link href={`/contacts/${contact.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                        {contact.first_name || contact.last_name ? `${contact.first_name ?? ''} ${contact.last_name ?? ''}`.trim() : 'Unnamed Contact'}
                      </Link>
                    </div>
                  </div>
                </td>
                
                {/* Last Contact Column */}
                {visibleColumns.includes('last_contacted') && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contact.last_contacted_at ? new Date(contact.last_contacted_at).toLocaleDateString() : '-'}
                  </td>
                )}
                  
                {/* Notes Column */}
                {visibleColumns.includes('notes') && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="max-w-xs truncate">{contact.notes || '-'}</div>
                  </td>
                )}
                  
                {/* Source Column */}
                {visibleColumns.includes('source') && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contact.source || '-'}
                  </td>
                )}
                  
                {/* Actions Column */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-3">
                    <button className="text-blue-600 hover:text-blue-800" aria-label="Email contact">
                      <Mail className="h-4 w-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-800" aria-label="Call contact">
                      <Phone className="h-4 w-4" />
                    </button>
                    <button className="text-purple-600 hover:text-purple-800" aria-label="Message contact">
                      <MessageSquareText className="h-4 w-4" />
                    </button>
                    <button className="text-amber-600 hover:text-amber-800" aria-label="AI assistant">
                      <Sparkles className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={visibleColumns.length + 1} className="px-6 py-10 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="font-medium">No contacts found</p>
                  <p className="text-sm">
                    {selectedSourceFilters.length > 0 && 'Try adjusting your source filters.'}
                    {dateFilterPeriod !== 'all' && ' Try a different date range.'}
                    {searchQuery && ' Try a different search term.'}
                    {!selectedSourceFilters.length && dateFilterPeriod === 'all' && !searchQuery && 'No contacts available in this view.'}
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
  }