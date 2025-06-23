'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image'; // Added Image import
import { ArrowDown, ArrowUp } from 'lucide-react';
import type { Tables } from '@codexcrm/db/src/database.types'; // Import Tables type
import {
  Mail,
  MessageSquareText,
  Phone,
  Sparkles,
  MoreHorizontal,
  Trash2,
  Edit,
  ChevronDown,
  Users,
} from 'lucide-react';
import { api } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ProfileAvatar component to handle profile image display with proper URL signing
function ProfileAvatar({ contact }: { contact: Contact }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Use tRPC to get signed URL if profile_image_url exists and is a storage path
  const { data: fileUrlData } = api.storage.getFileUrl.useQuery(
    { filePath: contact.profile_image_url ?? '' }, // Use nullish coalescing instead of logical OR
    {
      enabled: !!contact.profile_image_url && !contact.profile_image_url.includes('?token='),
      staleTime: 55 * 60 * 1000, // 55 minutes (URLs valid for 1 hour)
    }
  );

  // Update image URL when signed URL is fetched
  useEffect(() => {
    if (fileUrlData?.signedUrl) {
      setImageUrl(fileUrlData.signedUrl);
      setImageError(false);
    }
  }, [fileUrlData]);

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  if (contact.profile_image_url && !imageError && imageUrl) {
    return (
      <Avatar className='h-10 w-10 bg-teal-100 text-teal-800 overflow-hidden'>
        <Image
          src={imageUrl}
          alt={contact.full_name}
          width={40} // Added width
          height={40} // Added height
          className='h-full w-full object-cover'
          onError={handleImageError}
        />
      </Avatar>
    );
  }

  // Fallback to initials avatar
  return (
    <Avatar className='h-10 w-10 bg-teal-100 text-teal-800'>
      <div className='flex items-center justify-center h-full w-full font-medium'>
        {contact.full_name.charAt(0)}
      </div>
    </Avatar>
  );
}

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
  enriched_data?: unknown; // Changed unknown | null to unknown
  created_at?: string | null;
  updated_at?: string | null;
  tags?: string[] | null;
  social_handles?: string[] | null | undefined; // Added social_handles
  address_city?: string | null;
  address_country?: string | null;
  address_postal_code?: string | null;
  address_street?: string | null;
  client_since?: string | null;
  referral_source?: string | null;
  relationship_status?: string | null;
  website?: string | null;
  wellness_status?: string | null;
}

interface Group {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
}

interface ContactsTableProps {
  contacts: Contact[];
  isLoading: boolean;
  visibleColumns: string[];
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: string) => void;
  onEditContact: (contactId: string) => void;
  onDeleteContact: (contactId: string) => void;
}

export function ContactsTable({
  contacts,
  isLoading,
  visibleColumns,
  sortField,
  sortDirection,
  onSortChange,
  onEditContact,
  onDeleteContact,
}: ContactsTableProps) {
  // State for bulk actions
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [isEnrichDialogOpen, setIsEnrichDialogOpen] = useState(false);
  const [isAddToGroupDialogOpen, setIsAddToGroupDialogOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  const utils = api.useUtils();

  // Get all available groups for the dropdown
  const groupsQueryResult = api.groups.list.useQuery(undefined, {
    enabled: isAddToGroupDialogOpen, // Only fetch when dialog is open
  });

  const allGroups = groupsQueryResult.data as Tables<'groups'>[] | undefined;
  const isLoadingGroups = groupsQueryResult.isLoading;
  const groupsError = groupsQueryResult.error;

  // Mutation to add contacts to group
  const addToGroupMutation = api.groups.addContact.useMutation({
    onSuccess: () => {
      // Invalidate any relevant queries
      void utils.groups.list.invalidate(); // Wrapped with void
      setIsAddToGroupDialogOpen(false);
      setSelectedGroupId('');
    },
    onError: (error) => {
      console.error('Add to group error:', error);
    },
  });

  // State for column dragging
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [columnOrder, setColumnOrder] = useState<string[]>([
    'name',
    'actions',
    'email',
    'phone',
    'company_name',
    'job_title',
    'last_contacted_at',
    'notes',
    'source',
    'tags',
  ]);
  const tableRef = useRef<HTMLTableElement>(null);

  // Update isAllSelected when selectedContactIds changes
  const updateIsAllSelected = useCallback(() => {
    setIsAllSelected(contacts.length > 0 && selectedContactIds.length === contacts.length);
  }, [selectedContactIds, contacts.length]); // Added useCallback and its dependencies

  useEffect(() => {
    updateIsAllSelected();
  }, [updateIsAllSelected]); // Dependency array updated to include useCallback

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (isAllSelected || selectedContactIds.length === contacts.length) {
      setSelectedContactIds([]);
      setIsAllSelected(false);
    } else {
      setSelectedContactIds(contacts.map((contact) => contact.id));
      setIsAllSelected(true);
    }
  };

  // Handle individual row selection
  const handleSelectRow = (contactId: string, isSelected: boolean) => {
    setSelectedContactIds((prev) => {
      if (isSelected) {
        return [...prev, contactId];
      } else {
        return prev.filter((id) => id !== contactId);
      }
    });
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    // Here you would implement the actual bulk delete functionality
    // For now, we'll just close the dialog
    setIsBulkDeleteDialogOpen(false);
    setSelectedContactIds([]);
  };

  // Handle bulk enrich
  const handleBulkEnrich = () => {
    // Here you would implement the actual bulk enrich functionality
    // For now, we'll just close the dialog
    setIsEnrichDialogOpen(false);
  };

  // Handle dialog open/close with proper state reset
  const handleAddToGroupDialogOpenChange = (open: boolean) => {
    setIsAddToGroupDialogOpen(open);
    if (!open) {
      setSelectedGroupId('');
      // Reset mutation state when closing dialog
      addToGroupMutation.reset();
    }
  };

  // Handle adding multiple contacts to a group
  const handleAddToGroup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default form submission if any
    if (!selectedGroupId || selectedContactIds.length === 0) {
      return;
    }

    try {
      // Process contacts sequentially to avoid overwhelming the server
      for (const contactId of selectedContactIds) {
        await addToGroupMutation.mutateAsync({
          contactId,
          groupId: selectedGroupId,
        });
      }

      // Explicitly invalidate the groups list query to refresh counts
      void utils.groups.list.invalidate(); // Mark as intentionally not awaited

      // Close dialog and reset selection
      setIsAddToGroupDialogOpen(false);
      setSelectedGroupId('');

      // Optionally, you could clear the selection after adding to group
      // setSelectedContactIds([]);
    } catch (error) {
      console.error('Error adding contacts to group:', error);
    }
  };

  // Handle email action
  const handleEmailAction = (contact: Contact) => {
    // Open chat interface with email prompt
    alert(`Opening chat to email ${contact.full_name}`);
  };

  // Handle phone action
  const handlePhoneAction = (_contact: Contact) => {
    // Renamed contact to _contact
    // Currently non-functional
    alert(`Phone functionality not implemented yet`);
  };

  // Handle message action
  const handleMessageAction = (contact: Contact) => {
    // Open chat with WhatsApp integration
    alert(`Opening chat to message ${contact.full_name} via WhatsApp`);
  };

  // Handle AI insights action
  const handleAIAction = (contact: Contact) => {
    // Ask AI for insights about the contact
    alert(`Getting AI insights for ${contact.full_name}`);
  };

  // Handle column drag start
  const handleDragStart = (e: React.DragEvent<HTMLTableCellElement>, column: string) => {
    setDraggedColumn(column);
    e.dataTransfer.effectAllowed = 'move';
    // Add a custom class to the dragged element for styling
    e.currentTarget.classList.add('dragging');
  };

  // Handle column drag over
  const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>, column: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (draggedColumn && draggedColumn !== column) {
      // Add visual indicator for drop target
      e.currentTarget.classList.add('drag-over');
    }
  };

  // Handle column drag leave
  const handleDragLeave = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.currentTarget.classList.remove('drag-over');
  };

  // Handle column drop
  const handleDrop = (e: React.DragEvent<HTMLTableCellElement>, targetColumn: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    if (draggedColumn && draggedColumn !== targetColumn) {
      // Reorder columns
      const newOrder = [...columnOrder];
      const draggedIndex = newOrder.indexOf(draggedColumn);
      const targetIndex = newOrder.indexOf(targetColumn);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        newOrder.splice(draggedIndex, 1);
        newOrder.splice(targetIndex, 0, draggedColumn);
        setColumnOrder(newOrder);

        // Log the new order for debugging
        console.warn('New column order:', newOrder); // Changed console.log to console.warn
      }
    }

    setDraggedColumn(null);
  };

  // Handle drag end
  const handleDragEnd = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.currentTarget.classList.remove('dragging');
    setDraggedColumn(null);

    // Remove drag-over class from all columns
    if (tableRef.current) {
      const headers = tableRef.current.querySelectorAll('th');
      headers.forEach((header) => {
        header.classList.remove('drag-over');
      });
    }
  };

  // Add CSS styles for drag-and-drop
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .dragging {
        opacity: 0.5;
        border: 2px dashed #ccc;
      }
      .drag-over {
        border: 2px dashed #0ea5e9;
        background-color: rgba(14, 165, 233, 0.1);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Show loading state
  if (isLoading && contacts.length === 0) {
    return (
      <div className='bg-white shadow-md rounded-lg p-8 flex items-center justify-center border-l-4 border-teal-400'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mr-4'></div>
        <p className='text-gray-700 font-medium'>Loading contacts...</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Bulk Actions Toolbar */}
      {selectedContactIds.length > 0 && (
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-2 flex items-center justify-between'>
          <div className='flex items-center'>
            <span className='text-blue-700 font-medium ml-2'>
              {selectedContactIds.length} contact
              {selectedContactIds.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' size='sm' onClick={() => setSelectedContactIds([])}>
              Clear
            </Button>
            <Button variant='outline' size='sm' onClick={() => setIsEnrichDialogOpen(true)}>
              Enrich
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleAddToGroupDialogOpenChange(true)}
              className='flex items-center'
            >
              <Users className='h-4 w-4 mr-1' />
              Add to Group
            </Button>
            <Button
              variant='outline'
              size='sm'
              className='text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center'
              onClick={() => setIsBulkDeleteDialogOpen(true)}
            >
              <Trash2 className='h-4 w-4 mr-1' />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className='overflow-auto rounded-lg border border-gray-200 bg-white'>
        <table ref={tableRef} className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-teal-100 sticky top-0 z-10'>
            <tr className='draggable-header-row'>
              {/* Selection Column */}
              <th className='px-3 py-3 text-left'>
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label='Select all contacts'
                />
              </th>

              {/* Name Column - Always visible */}
              <th
                scope='col'
                className='px-6 py-3 text-left text-xs font-semibold text-teal-800 uppercase tracking-wider cursor-grab'
                draggable='true'
                data-column='name'
                onDragStart={(e) => handleDragStart(e, 'name')}
                onDragOver={(e) => handleDragOver(e, 'name')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'name')}
                onDragEnd={handleDragEnd}
              >
                <div
                  className='flex items-center cursor-pointer'
                  onClick={() => onSortChange('full_name')}
                >
                  Name
                  {sortField === 'full_name' && (
                    <span className='ml-1 flex items-center'>
                      {sortDirection === 'asc' ? (
                        <ArrowUp className='h-3 w-3' />
                      ) : (
                        <ArrowDown className='h-3 w-3' />
                      )}
                    </span>
                  )}
                  {sortField !== 'name' && <ChevronDown className='h-3 w-3 ml-1 text-gray-400' />}
                </div>
              </th>

              {/* Actions Column - Moved to be right after Name */}
              <th
                scope='col'
                className='px-6 py-3 text-center text-xs font-semibold text-teal-800 uppercase tracking-wider cursor-grab'
                draggable='true'
                data-column='actions'
                onDragStart={(e) => handleDragStart(e, 'actions')}
                onDragOver={(e) => handleDragOver(e, 'actions')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'actions')}
                onDragEnd={handleDragEnd}
              >
                Actions
              </th>

              {/* Generate dynamic columns based on visibleColumns and columnOrder */}
              {visibleColumns
                .filter((col) => col !== 'name')
                .sort((a, b) => {
                  const aIndex = columnOrder.indexOf(a);
                  const bIndex = columnOrder.indexOf(b);
                  // Handle cases where columns are not in columnOrder
                  if (aIndex === -1 && bIndex === -1) return 0;
                  if (aIndex === -1) return 1; // Put unknown columns at the end
                  if (bIndex === -1) return -1; // Put unknown columns at the end
                  return aIndex - bIndex;
                })
                .map((columnId) => {
                  // Find the column definition from ColumnSelector
                  const columnDef = [
                    { id: 'email', label: 'Email', field: 'email' },
                    { id: 'phone', label: 'Phone', field: 'phone' },
                    {
                      id: 'company_name',
                      label: 'Company',
                      field: 'company_name',
                    },
                    { id: 'job_title', label: 'Job Title', field: 'job_title' },
                    {
                      id: 'address_city',
                      label: 'City',
                      field: 'address_city',
                    },
                    {
                      id: 'address_country',
                      label: 'Country',
                      field: 'address_country',
                    },
                    {
                      id: 'address_postal_code',
                      label: 'Postal Code',
                      field: 'address_postal_code',
                    },
                    {
                      id: 'address_street',
                      label: 'Street Address',
                      field: 'address_street',
                    },
                    {
                      id: 'client_since',
                      label: 'Client Since',
                      field: 'client_since',
                    },
                    {
                      id: 'last_contacted_at',
                      label: 'Last Contacted',
                      field: 'last_contacted_at',
                    },
                    { id: 'notes', label: 'Notes', field: 'notes' },
                    {
                      id: 'referral_source',
                      label: 'Referral Source',
                      field: 'referral_source',
                    },
                    {
                      id: 'relationship_status',
                      label: 'Relationship Status',
                      field: 'relationship_status',
                    },
                    { id: 'source', label: 'Source', field: 'source' },
                    { id: 'tags', label: 'Tags', field: 'tags' },
                    { id: 'website', label: 'Website', field: 'website' },
                    {
                      id: 'wellness_status',
                      label: 'Wellness Status',
                      field: 'wellness_status',
                    },
                  ].find((col) => col.id === columnId);

                  if (!columnDef) {
                    return null;
                  }

                  return (
                    <th
                      key={columnId}
                      scope='col'
                      className='px-6 py-3 text-left text-xs font-semibold text-teal-800 uppercase tracking-wider cursor-grab'
                      draggable='true'
                      data-column={columnId}
                      onDragStart={(e) => handleDragStart(e, columnId)}
                      onDragOver={(e) => handleDragOver(e, columnId)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, columnId)}
                      onDragEnd={handleDragEnd}
                    >
                      <div
                        className='flex items-center cursor-pointer'
                        onClick={() => onSortChange(columnDef.field)}
                      >
                        {columnDef.label}
                        {sortField === columnDef.field && (
                          <span className='ml-1 flex items-center'>
                            {sortDirection === 'asc' ? (
                              <ArrowUp className='h-3 w-3' />
                            ) : (
                              <ArrowDown className='h-3 w-3' />
                            )}
                          </span>
                        )}
                        {sortField !== columnDef.field && (
                          <ChevronDown className='h-3 w-3 ml-1 text-gray-400' />
                        )}
                      </div>
                    </th>
                  );
                })}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {contacts.length > 0 ? (
              contacts.map((contact) => {
                const isSelected = selectedContactIds.includes(contact.id);

                return (
                  <tr
                    key={contact.id}
                    className={cn('hover:bg-gray-50', isSelected ? 'bg-blue-50' : '')}
                  >
                    {/* Selection Column */}
                    <td className='px-3 py-4'>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleSelectRow(contact.id, checked as boolean)
                        }
                        aria-label={`Select ${contact.full_name}`}
                      />
                    </td>

                    {/* Name Column */}
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <ProfileAvatar contact={contact} />
                        <div className='ml-4'>
                          <Link
                            href={`/contacts/${contact.id}`}
                            className='font-medium text-teal-600 hover:underline'
                          >
                            {contact.full_name}
                          </Link>
                          {contact.job_title && (
                            <div className='text-xs text-gray-500'>{contact.job_title}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Actions Column - Moved to be right after Name */}
                    <td className='px-6 py-4 whitespace-nowrap text-center'>
                      <div className='flex justify-center space-x-3'>
                        <button
                          className='text-blue-600 hover:text-blue-800'
                          onClick={() => handleEmailAction(contact)}
                          aria-label='Email contact'
                          title='Email contact'
                        >
                          <Mail className='h-4 w-4' />
                        </button>

                        <button
                          className='text-green-600 hover:text-green-800'
                          onClick={() => handlePhoneAction(contact)}
                          aria-label='Call contact'
                          title='Call contact'
                        >
                          <Phone className='h-4 w-4' />
                        </button>

                        <button
                          className='text-purple-600 hover:text-purple-800'
                          onClick={() => handleMessageAction(contact)}
                          aria-label='Message contact'
                          title='Message contact'
                        >
                          <MessageSquareText className='h-4 w-4' />
                        </button>

                        <button
                          className='text-amber-600 hover:text-amber-800'
                          onClick={() => handleAIAction(contact)}
                          aria-label='AI assistant'
                          title='AI insights'
                        >
                          <Sparkles className='h-4 w-4' />
                        </button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className='text-gray-600 hover:text-gray-800'
                              aria-label='More options'
                            >
                              <MoreHorizontal className='h-4 w-4' />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem onClick={() => onEditContact(contact.id)}>
                              <Edit className='h-4 w-4 mr-2' />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onDeleteContact(contact.id)}
                              className='text-red-600'
                            >
                              <Trash2 className='h-4 w-4 mr-2' />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>

                    {/* Generate dynamic cell content based on visibleColumns and columnOrder */}
                    {visibleColumns
                      .filter((col) => col !== 'name')
                      .sort((a, b) => {
                        const aIndex = columnOrder.indexOf(a);
                        const bIndex = columnOrder.indexOf(b);
                        // Handle cases where columns are not in columnOrder
                        if (aIndex === -1 && bIndex === -1) return 0;
                        if (aIndex === -1) return 1; // Put unknown columns at the end
                        if (bIndex === -1) return -1; // Put unknown columns at the end
                        return aIndex - bIndex;
                      })
                      .map((columnId) => {
                        // Find the column definition
                        const columnDef = [
                          {
                            id: 'email',
                            label: 'Email',
                            field: 'email',
                            render: (c: Contact) => c.email ?? '-',
                          },
                          {
                            id: 'phone',
                            label: 'Phone',
                            field: 'phone',
                            render: (c: Contact) => c.phone ?? '-',
                          },
                          {
                            id: 'company_name',
                            label: 'Company',
                            field: 'company_name',
                            render: (c: Contact) => c.company_name ?? '-',
                          },
                          {
                            id: 'job_title',
                            label: 'Job Title',
                            field: 'job_title',
                            render: (c: Contact) => c.job_title ?? '-',
                          },
                          {
                            id: 'address_city',
                            label: 'City',
                            field: 'address_city',
                            render: (c: Contact) => c.address_city ?? '-',
                          },
                          {
                            id: 'address_country',
                            label: 'Country',
                            field: 'address_country',
                            render: (c: Contact) => c.address_country ?? '-',
                          },
                          {
                            id: 'address_postal_code',
                            label: 'Postal Code',
                            field: 'address_postal_code',
                            render: (c: Contact) => c.address_postal_code ?? '-',
                          },
                          {
                            id: 'address_street',
                            label: 'Street Address',
                            field: 'address_street',
                            render: (c: Contact) => c.address_street ?? '-',
                          },
                          {
                            id: 'client_since',
                            label: 'Client Since',
                            field: 'client_since',
                            render: (c: Contact) =>
                              c.client_since ? new Date(c.client_since).toLocaleDateString() : '-',
                          },
                          {
                            id: 'last_contacted_at',
                            label: 'Last Contacted',
                            field: 'last_contacted_at',
                            render: (c: Contact) =>
                              c.last_contacted_at ? (
                                <div className='flex flex-col'>
                                  <span>{new Date(c.last_contacted_at).toLocaleDateString()}</span>
                                  <span className='text-xs text-gray-400'>
                                    {formatDistance(new Date(c.last_contacted_at), new Date(), {
                                      addSuffix: true,
                                    })}
                                  </span>
                                </div>
                              ) : (
                                '-'
                              ),
                          },
                          {
                            id: 'notes',
                            label: 'Notes',
                            field: 'notes',
                            render: (c: Contact) => (
                              <div className='max-w-xs truncate'>{c.notes ?? '-'}</div>
                            ),
                          },
                          {
                            id: 'referral_source',
                            label: 'Referral Source',
                            field: 'referral_source',
                            render: (c: Contact) => c.referral_source ?? '-',
                          },
                          {
                            id: 'relationship_status',
                            label: 'Relationship Status',
                            field: 'relationship_status',
                            render: (c: Contact) => c.relationship_status ?? '-',
                          },
                          {
                            id: 'source',
                            label: 'Source',
                            field: 'source',
                            render: (c: Contact) =>
                              c.source ? (
                                <Badge variant='secondary' className='capitalize'>
                                  {c.source.replace('_', ' ')}
                                </Badge>
                              ) : (
                                '-'
                              ),
                          },
                          {
                            id: 'tags',
                            label: 'Tags',
                            field: 'tags',
                            render: (c: Contact) =>
                              c.tags && c.tags.length > 0 ? (
                                <div className='flex flex-wrap gap-1'>
                                  {c.tags.map((tag, i) => (
                                    <Badge key={i} variant='outline' className='text-xs'>
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                '-'
                              ),
                          },
                          {
                            id: 'website',
                            label: 'Website',
                            field: 'website',
                            render: (c: Contact) => c.website ?? '-',
                          },
                          {
                            id: 'wellness_status',
                            label: 'Wellness Status',
                            field: 'wellness_status',
                            render: (c: Contact) => c.wellness_status ?? '-',
                          },
                        ].find((col) => col.id === columnId);

                        if (!columnDef) {
                          return null;
                        }

                        return (
                          <td
                            key={columnId}
                            className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'
                          >
                            {columnDef.render(contact)}
                          </td>
                        );
                      })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={visibleColumns.length + 2}
                  className='px-6 py-10 text-center text-gray-500'
                >
                  <div className='flex flex-col items-center justify-center space-y-3'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-10 w-10 text-gray-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1.5}
                        d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                      />
                    </svg>
                    <p className='font-medium'>No contacts found</p>
                    <p className='text-sm'>Try adjusting your search or filters.</p>
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
              Are you sure you want to delete {selectedContactIds.length} selected contacts? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsBulkDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleBulkDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Enrich Dialog */}
      <Dialog open={isEnrichDialogOpen} onOpenChange={setIsEnrichDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enrich Selected Contacts</DialogTitle>
            <DialogDescription>
              This will use AI to enrich {selectedContactIds.length} selected contacts with
              additional information.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsEnrichDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkEnrich} className='bg-teal-600 hover:bg-teal-700'>
              Enrich Contacts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add to Group Dialog */}
      <Dialog open={isAddToGroupDialogOpen} onOpenChange={handleAddToGroupDialogOpenChange}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Add to Group</DialogTitle>
            <DialogDescription>
              Select a group to add {selectedContactIds.length} selected contact
              {selectedContactIds.length !== 1 ? 's' : ''} to.
            </DialogDescription>
          </DialogHeader>

          {/* Display errors from queries or mutations */}
          {groupsError && (
            <p className='text-sm text-red-600 mt-2'>
              Failed to load groups: {groupsError.message}
            </p>
          )}
          {addToGroupMutation.error && (
            <p className='text-sm text-red-600 mt-2'>{addToGroupMutation.error.message}</p>
          )}

          <div className='py-4'>
            <Select
              value={selectedGroupId}
              onValueChange={setSelectedGroupId}
              disabled={isLoadingGroups || addToGroupMutation.isPending}
            >
              <SelectTrigger>
                {isLoadingGroups ? (
                  <div className='flex items-center gap-2'>
                    <div className='h-3 w-3 animate-spin rounded-full border border-gray-300 border-t-transparent'></div>
                    <span className='text-gray-400'>Loading groups...</span>
                  </div>
                ) : (
                  <SelectValue placeholder='Select a group' />
                )}
              </SelectTrigger>
              <SelectContent>
                {!allGroups || allGroups.length === 0 ? (
                  <SelectItem value='no-groups' disabled>
                    {groupsError ? 'Error loading groups' : 'No available groups'}
                  </SelectItem>
                ) : (
                  allGroups.map((group: Group) => (
                    <SelectItem key={group.id} value={group.id}>
                      <div className='flex items-center'>
                        <div
                          className={cn(
                            'h-3 w-3 rounded-full mr-2',
                            group.color ? `bg-[${group.color}]` : 'bg-blue-500'
                          )}
                        />
                        {group.name}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant='secondary'
              onClick={() => handleAddToGroupDialogOpenChange(false)}
              disabled={addToGroupMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={(e) => {
                void (async () => {
                  await handleAddToGroup(e);
                })();
              }}
              disabled={isLoadingGroups || !selectedGroupId || addToGroupMutation.isPending}
            >
              {addToGroupMutation.isPending ? 'Adding...' : 'Add to Group'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
