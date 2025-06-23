'use client';

import { useState } from 'react';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import { ArrowDown, ArrowUp, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProfileAvatar } from './ProfileAvatar';
import type { Contact, ContactsTableProps } from './types';

export function ContactsTableNew({
  contacts,
  isLoading,
  visibleColumns,
  sortField,
  sortDirection,
  onSortChange,
  onEditContact,
  onDeleteContact,
}: ContactsTableProps) {
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedContactIds(checked ? contacts.map(c => c.id) : []);
  };

  const handleSelectContact = (contactId: string, checked: boolean) => {
    setSelectedContactIds(prev => 
      checked 
        ? [...prev, contactId]
        : prev.filter(id => id !== contactId)
    );
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    try {
      return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
    } catch {
      return '-';
    }
  };

  const renderCellContent = (contact: Contact, columnId: string) => {
    switch (columnId) {
      case 'email':
        return contact.email ?? '-';
      case 'phone':
        return contact.phone ?? '-';
      case 'company_name':
        return contact.company_name ?? '-';
      case 'job_title':
        return contact.job_title ?? '-';
      case 'notes':
        return contact.notes ? (
          <div className="max-w-xs truncate" title={contact.notes}>
            {contact.notes}
          </div>
        ) : '-';
      case 'tags':
        return contact.tags && contact.tags.length > 0 ? (
          <div className='flex flex-wrap gap-1'>
            {contact.tags.map((tag, i) => (
              <Badge key={i} variant='outline' className='text-xs'>
                {tag}
              </Badge>
            ))}
          </div>
        ) : '-';
      case 'last_contacted_at':
        return formatDate(contact.last_contacted_at);
      case 'source':
        return contact.source ?? '-';
      case 'website':
        return contact.website ? (
          <a href={contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {contact.website}
          </a>
        ) : '-';
      default:
        return '-';
    }
  };

  const getColumnLabel = (columnId: string) => {
    const labels: Record<string, string> = {
      email: 'Email',
      phone: 'Phone',
      company_name: 'Company',
      job_title: 'Job Title',
      notes: 'Notes',
      tags: 'Tags',
      last_contacted_at: 'Last Contacted',
      source: 'Source',
      website: 'Website',
    };
    return labels[columnId] || columnId;
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Table Container with proper horizontal scroll containment */}
      <div className="flex-1 overflow-auto border border-gray-200 rounded-lg bg-white">
        <div className="min-w-full">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-teal-100 sticky top-0 z-10">
              <tr>
                {/* Selection Column */}
                <th className="px-3 py-3 text-left w-12">
                  <Checkbox
                    checked={selectedContactIds.length === contacts.length && contacts.length > 0}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all contacts"
                  />
                </th>

                {/* Name Column (always visible) */}
                <th className="px-4 py-3 text-left">
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-semibold text-teal-800 hover:text-teal-900"
                    onClick={() => onSortChange('full_name')}
                  >
                    Name {renderSortIcon('full_name')}
                  </Button>
                </th>

                {/* Dynamic Columns */}
                {visibleColumns
                  .filter(col => col !== 'name')
                  .map(columnId => (
                    <th key={columnId} className="px-4 py-3 text-left">
                      <Button
                        variant="ghost"
                        className="p-0 h-auto font-semibold text-teal-800 hover:text-teal-900"
                        onClick={() => onSortChange(columnId)}
                      >
                        {getColumnLabel(columnId)} {renderSortIcon(columnId)}
                      </Button>
                    </th>
                  ))}

                {/* Actions Column */}
                <th className="px-4 py-3 text-left w-20">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={visibleColumns.length + 3} className="px-6 py-10 text-center text-gray-500">
                    No contacts found
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    {/* Selection */}
                    <td className="px-3 py-4">
                      <Checkbox
                        checked={selectedContactIds.includes(contact.id)}
                        onCheckedChange={(checked) => handleSelectContact(contact.id, checked as boolean)}
                      />
                    </td>

                    {/* Name */}
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <ProfileAvatar contact={contact} />
                        <div>
                          <Link
                            href={`/contacts/${contact.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-teal-600"
                          >
                            {contact.full_name}
                          </Link>
                        </div>
                      </div>
                    </td>

                    {/* Dynamic Columns */}
                    {visibleColumns
                      .filter(col => col !== 'name')
                      .map(columnId => (
                        <td key={columnId} className="px-4 py-4 text-sm text-gray-600">
                          {renderCellContent(contact, columnId)}
                        </td>
                      ))}

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEditContact(contact.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onDeleteContact(contact.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}