'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  format,
  formatDistance,
  subDays,
  startOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isAfter,
  isBefore,
  parseISO,
} from 'date-fns';
import {
  ArrowDown,
  ArrowUp,
  Mail,
  MessageSquareText,
  Phone,
  Sparkles,
  ChevronDown,
  Calendar,
  Clock,
  Check,
  Download,
  MoreHorizontal,
  Trash2,
  Edit,
  UserPlus,
  Tag,
  FileText,
  Filter,
  X,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
// Removed virtual scrolling for now as it requires additional package
// import { useVirtualizer } from '@tanstack/react-virtual';

import { ContactGroupManager, GroupsProvider } from './ContactGroupManager';

import { AvatarImage } from '@/components/ui/avatar-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { api } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface Contact {
  id: string;
  full_name: string;
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

// Define date filter options
export type DateFilterPeriod =
  | 'today'
  | 'this_week'
  | 'last_week'
  | 'this_month'
  | 'last_month'
  | 'older'
  | 'all';

// Define source types for filtering
export type SourceOption =
  | 'conference'
  | 'referral'
  | 'website'
  | 'event'
  | 'social_media'
  | 'cold_outreach'
  | 'other';

interface EnhancedContactListProps {
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
  dateFilterPeriod?: DateFilterPeriod;
  onDateFilterChange?: (period: DateFilterPeriod) => void;
  selectedSourceFilters?: SourceOption[];
  onSourceFilterChange?: (sources: SourceOption[]) => void;
}

export function EnhancedContactList({
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
  dateFilterPeriod = 'all',
  onDateFilterChange = () => {},
  selectedSourceFilters = [],
  onSourceFilterChange = () => {},
}: EnhancedContactListProps) {
  // State for selected contacts (for bulk actions)
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
  const [exportFields, setExportFields] = useState<string[]>(['full_name', 'email', 'phone']);
  
  // Virtualization container ref
  const parentRef = useRef<HTMLDivElement>(null);

  // Query groups for contact group management
  const { data: allGroups = [], isLoading: isLoadingGroups } =
    api.groups.list.useQuery(undefined, {
      staleTime: 60000, // Cache for 60 seconds
      refetchOnWindowFocus: false, // Don't refetch on window focus
    });

  // Get contacts filtered by date period
  const getFilteredContactsByDate = (
    contacts: Contact[],
    period: DateFilterPeriod
  ): Contact[] => {
    if (period === 'all') return contacts;

    const today = new Date();
    const startOfToday = startOfDay(today);

    return contacts.filter((contact) => {
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
          return (
            isAfter(contactDate, weekStart) && isBefore(contactDate, weekEnd)
          );
        }

        case 'last_week': {
          const lastWeekStart = startOfWeek(subDays(today, 7), {
            weekStartsOn: 1,
          });
          const lastWeekEnd = endOfWeek(subDays(today, 7), { weekStartsOn: 1 });
          return (
            isAfter(contactDate, lastWeekStart) &&
            isBefore(contactDate, lastWeekEnd)
          );
        }

        case 'this_month': {
          const monthStart = startOfMonth(today);
          const monthEnd = endOfMonth(today);
          return (
            isAfter(contactDate, monthStart) && isBefore(contactDate, monthEnd)
          );
        }

        case 'last_month': {
          const lastMonthStart = startOfMonth(subDays(today, 30));
          const lastMonthEnd = endOfMonth(subDays(today, 30));
          return (
            isAfter(contactDate, lastMonthStart) &&
            isBefore(contactDate, lastMonthEnd)
          );
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
    'other',
  ];

  // First filter by date period
  const dateFilteredContacts = getFilteredContactsByDate(
    contacts,
    dateFilterPeriod
  );

  // Then filter by source if any source filters are selected
  const sourceFilteredContacts =
    selectedSourceFilters.length > 0
      ? dateFilteredContacts.filter((contact) => {
          // If contact has no source and we're filtering, exclude it
          if (!contact.source) return false;

          // Keep contact if its source is in the selected sources
          return selectedSourceFilters.includes(contact.source as SourceOption);
        })
      : dateFilteredContacts;

  // Then filter by search query
  const filteredContacts = sourceFilteredContacts.filter((contact) => {
    // Apply search filter
    if (searchQuery.trim() === '') return true;

    const searchLower = searchQuery.toLowerCase();
    const fullName = (contact.full_name || '').toLowerCase();
    const email = (contact.email || '').toLowerCase();
    const phone = (contact.phone || '').toLowerCase();
    const company = (contact.company_name || '').toLowerCase();
    const notes = (contact.notes || '').toLowerCase();
    const source = (contact.source || '').toLowerCase();

    return (
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      phone.includes(searchLower) ||
      company.includes(searchLower) ||
      notes.includes(searchLower) ||
      source.includes(searchLower)
    );
  });

  // Set up virtualization for the table rows
  // Temporarily removed virtualization
  // const rowVirtualizer = useVirtualizer({
  //   count: filteredContacts.length,
  //   getScrollElement: () => parentRef.current,
  //   estimateSize: () => 72, // Estimated row height
  //   overscan: 10,
  // });

  // Handle select all checkbox
  const handleSelectAll = useCallback(() => {
    if (isAllSelected || selectedContactIds.length === filteredContacts.length) {
      setSelectedContactIds([]);
      setIsAllSelected(false);
    } else {
      setSelectedContactIds(filteredContacts.map(contact => contact.id));
      setIsAllSelected(true);
    }
  }, [filteredContacts, isAllSelected, selectedContactIds.length]);

  // Handle individual row selection
  const handleSelectRow = useCallback((contactId: string, isSelected: boolean) => {
    setSelectedContactIds(prev => {
      if (isSelected) {
        return [...prev, contactId];
      } else {
        return prev.filter(id => id !== contactId);
      }
    });
  }, []);

  // Update isAllSelected when selectedContactIds changes
  useEffect(() => {
    setIsAllSelected(
      filteredContacts.length > 0 && 
      selectedContactIds.length === filteredContacts.length
    );
  }, [selectedContactIds, filteredContacts]);

  // Handle bulk delete
  const handleBulkDelete = useCallback(() => {
    // Here you would implement the actual bulk delete functionality
    // For now, we'll just close the dialog
    setIsBulkDeleteDialogOpen(false);
    setSelectedContactIds([]);
  }, [selectedContactIds]);

  // Handle export
  const handleExport = useCallback(() => {
    // Get selected contacts or all filtered contacts if none selected
    const contactsToExport = selectedContactIds.length > 0
      ? filteredContacts.filter(contact => selectedContactIds.includes(contact.id))
      : filteredContacts;
    
    // Create export data based on selected fields
    const exportData = contactsToExport.map(contact => {
      const exportItem: Record<string, any> = {};
      exportFields.forEach(field => {
        exportItem[field] = contact[field as keyof Contact] || '';
      });
      return exportItem;
    });
    
    // Convert to selected format and download
    let dataStr = '';
    let filename = '';
    
    if (exportFormat === 'csv') {
      // Create CSV header
      const header = exportFields.join(',');
      // Create CSV rows
      const rows = exportData.map(item => 
        exportFields.map(field => 
          typeof item[field] === 'string' ? `"${item[field].replace(/"/g, '""')}"` : item[field]
        ).join(',')
      );
      dataStr = [header, ...rows].join('\n');
      filename = 'contacts-export.csv';
    } else {
      // JSON format
      dataStr = JSON.stringify(exportData, null, 2);
      filename = 'contacts-export.json';
    }
    
    // Create download link
    const blob = new Blob([dataStr], { type: exportFormat === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsExportDialogOpen(false);
  }, [exportFormat, exportFields, filteredContacts, selectedContactIds]);

  // Available export fields
  const availableExportFields = [
    { id: 'full_name', label: 'Full Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'company_name', label: 'Company' },
    { id: 'job_title', label: 'Job Title' },
    { id: 'source', label: 'Source' },
    { id: 'notes', label: 'Notes' },
    { id: 'last_contacted_at', label: 'Last Contacted' },
    { id: 'created_at', label: 'Created Date' },
  ];

  // Toggle export field selection
  const toggleExportField = (fieldId: string) => {
    setExportFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions Toolbar */}
      {selectedContactIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-blue-700 font-medium ml-2">
              {selectedContactIds.length} contact{selectedContactIds.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedContactIds([])}
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExportDialogOpen(true)}
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              <Tag className="h-4 w-4 mr-1" />
              Add to Group
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBulkDeleteDialogOpen(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div
        ref={parentRef}
        className="overflow-auto rounded-lg border border-gray-200"
        style={{ height: '600px' }}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-teal-50 to-teal-100 sticky top-0 z-10">
            <tr>
              {/* Selection Column */}
              <th className="px-3 py-3 text-left">
                <Checkbox 
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all contacts"
                />
              </th>

              {/* Name Column - Always visible */}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold bg-gradient-to-r from-teal-50 to-teal-100 text-teal-800 uppercase tracking-wider"
              >
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => onSortChange && onSortChange('name')}
                >
                  Name
                  {sortField === 'name' && (
                    <span className="ml-1 flex items-center">
                      {sortDirection === 'asc' ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                    </span>
                  )}
                  {sortField !== 'name' && (
                    <ChevronDown className="h-3 w-3 ml-1 text-gray-400" />
                  )}
                </div>
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
                          {dateFilterPeriod === 'all' && (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDateFilterChange('today')}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>Today</span>
                          {dateFilterPeriod === 'today' && (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDateFilterChange('this_week')}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>This Week</span>
                          {dateFilterPeriod === 'this_week' && (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDateFilterChange('last_week')}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>Last Week</span>
                          {dateFilterPeriod === 'last_week' && (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDateFilterChange('this_month')}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>This Month</span>
                          {dateFilterPeriod === 'this_month' && (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDateFilterChange('last_month')}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>Last Month</span>
                          {dateFilterPeriod === 'last_month' && (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDateFilterChange('older')}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>More than a Month</span>
                          {dateFilterPeriod === 'older' && (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </th>
              )}

              {/* Notes Column */}
              {visibleColumns.includes('notes') && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Notes
                </th>
              )}

              {/* Source Column */}
              {visibleColumns.includes('source') && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center cursor-pointer">
                        <span>Source</span>
                        <span className="ml-1 flex items-center">
                          {sortField === 'source' ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )
                          ) : (
                            <ChevronDown className="h-3 w-3 ml-1" />
                          )}
                        </span>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-52">
                      {/* Sorting options */}
                      <div className="px-2 py-1.5 text-xs font-semibold">
                        Sort By
                      </div>
                      <DropdownMenuItem onClick={() => onSortChange('source')}>
                        <div className="flex items-center justify-between w-full">
                          <span>A-Z</span>
                          {sortField === 'source' && sortDirection === 'asc' && (
                            <ArrowUp className="h-3 w-3" />
                          )}
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          if (sortField === 'source' && sortDirection === 'asc') {
                            onSortChange('source'); // This will toggle to desc
                          } else {
                            onSortChange('source');
                            if (sortDirection === 'asc') onSortChange('source'); // Toggle to desc
                          }
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>Z-A</span>
                          {sortField === 'source' && sortDirection === 'desc' && (
                            <ArrowDown className="h-3 w-3" />
                          )}
                        </div>
                      </DropdownMenuItem>

                      <div className="h-px bg-slate-200 my-1" />

                      {/* Filter options */}
                      <div className="px-2 py-1.5 text-xs font-semibold">
                        Filter By
                      </div>

                      {availableSourceOptions.map((source) => (
                        <DropdownMenuItem
                          key={source}
                          onSelect={(e) => {
                            e.preventDefault();
                            const isSelected =
                              selectedSourceFilters.includes(source);
                            const updatedSources = isSelected
                              ? selectedSourceFilters.filter((s) => s !== source)
                              : [...selectedSourceFilters, source];
                            onSourceFilterChange(updatedSources);
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-4 h-4 border rounded flex items-center justify-center ${selectedSourceFilters.includes(source) ? 'bg-primary border-primary' : 'border-gray-300'}`}
                            >
                              {selectedSourceFilters.includes(source) && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <span className="capitalize">
                              {source.replace('_', ' ')}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))}

                      {selectedSourceFilters.length > 0 && (
                        <>
                          <div className="h-px bg-slate-200 my-1" />
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault();
                              onSourceFilterChange([]);
                            }}
                          >
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
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => {
                const isSelected = selectedContactIds.includes(contact.id);
                
                return (
                  <tr
                    key={contact.id}
                    className={cn(
                      "hover:bg-gray-50",
                      isSelected ? "bg-blue-50" : ""
                    )}
                  >
                      {/* Selection Column */}
                      <td className="px-3 py-4">
                        <Checkbox 
                          checked={isSelected}
                          onCheckedChange={(checked) => 
                            handleSelectRow(contact.id, checked === true)
                          }
                          aria-label={`Select ${contact.full_name}`}
                        />
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <AvatarImage
                            src={contact.profile_image_url || null}
                            alt={contact.full_name}
                            size="md"
                          />
                          <div className="ml-4">
                            <Link
                              href={`/contacts/${contact.id}`}
                              className="font-medium text-teal-600 hover:underline"
                            >
                              {contact.full_name}
                            </Link>
                            {contact.email && (
                              <div className="text-xs text-gray-500">
                                {contact.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Last Contact Column */}
                      {visibleColumns.includes('last_contacted') && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {contact.last_contacted_at ? (
                            <div className="flex flex-col">
                              <span>
                                {new Date(contact.last_contacted_at).toLocaleDateString()}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatDistance(
                                  new Date(contact.last_contacted_at),
                                  new Date(),
                                  { addSuffix: true }
                                )}
                              </span>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                      )}

                      {/* Notes Column */}
                      {visibleColumns.includes('notes') && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="max-w-xs truncate">
                            {contact.notes || '-'}
                          </div>
                        </td>
                      )}

                      {/* Source Column */}
                      {visibleColumns.includes('source') && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {contact.source ? (
                            <Badge variant="outline" className="capitalize">
                              {contact.source.replace('_', ' ')}
                            </Badge>
                          ) : (
                            '-'
                          )}
                        </td>
                      )}

                      {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-3">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          aria-label="Email contact"
                          title="Email contact"
                        >
                          <Mail className="h-4 w-4" />
                        </button>
                        
                        <button
                          className="text-green-600 hover:text-green-800"
                          aria-label="Call contact"
                          title="Call contact"
                        >
                          <Phone className="h-4 w-4" />
                        </button>
                        
                        <button
                          className="text-purple-600 hover:text-purple-800"
                          aria-label="Message contact"
                          title="Message contact"
                        >
                          <MessageSquareText className="h-4 w-4" />
                        </button>
                        
                        <button
                          className="text-amber-600 hover:text-amber-800"
                          aria-label="AI assistant"
                          title="AI assistant"
                        >
                          <Sparkles className="h-4 w-4" />
                        </button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="text-gray-600 hover:text-gray-800"
                              aria-label="More options"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEditClick(contact)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDeleteClick(contact.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={visibleColumns.length + 2}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <p className="font-medium">No contacts found</p>
                    <p className="text-sm">
                      {selectedSourceFilters.length > 0 &&
                        'Try adjusting your source filters.'}
                      {dateFilterPeriod !== 'all' &&
                        ' Try a different date range.'}
                      {searchQuery && ' Try a different search term.'}
                      {!selectedSourceFilters.length &&
                        dateFilterPeriod === 'all' &&
                        !searchQuery &&
                        'No contacts available in this view.'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Bulk Delete Dialog */}
      <Dialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Contacts</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedContactIds.length} selected contacts? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleBulkDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Contacts</DialogTitle>
            <DialogDescription>
              Choose export format and fields to include
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="csv-format"
                    checked={exportFormat === 'csv'}
                    onCheckedChange={() => setExportFormat('csv')}
                  />
                  <Label htmlFor="csv-format">CSV</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="json-format"
                    checked={exportFormat === 'json'}
                    onCheckedChange={() => setExportFormat('json')}
                  />
                  <Label htmlFor="json-format">JSON</Label>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Fields to Export</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableExportFields.map(field => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`field-${field.id}`}
                      checked={exportFields.includes(field.id)}
                      onCheckedChange={() => toggleExportField(field.id)}
                    />
                    <Label htmlFor={`field-${field.id}`}>{field.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              Export {selectedContactIds.length > 0 ? selectedContactIds.length : 'All'} Contacts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}