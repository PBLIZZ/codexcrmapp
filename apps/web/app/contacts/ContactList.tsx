"use client";

import Link from "next/link";
import { ContactGroupManager, GroupsProvider } from './ContactGroupManager';
import { ArrowDown, ArrowUp, Mail, MessageSquareText, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { api } from "@/lib/trpc";

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
}

export function ContactList({
  contacts,
  onEditClick,
  onDeleteClick,
  isDeleteMutationLoading,
  isSaveMutationLoading,
  searchQuery,
  selectedGroupId,
  visibleColumns = ['name', 'email', 'company', 'groups'],
  sortField = 'name',
  sortDirection = 'asc',
  onSortChange = () => {}
}: ContactListProps) {
  // Pre-load groups once for the entire contact list
  const { data: allGroups, isLoading: isLoadingGroups } = api.groups.list.useQuery(undefined, {
    staleTime: 60000, // Cache for 60 seconds
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
  return contacts.length > 0 ? (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {visibleColumns.includes('name') && (
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => onSortChange('name')}
              >
                <div className="flex items-center">
                  Name
                  {sortField === 'name' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? 
                        <ArrowUp className="h-3 w-3" /> : 
                        <ArrowDown className="h-3 w-3" />}
                    </span>
                  )}
                </div>
              </th>
            )}
            {visibleColumns.includes('email') && (
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => onSortChange('email')}
              >
                <div className="flex items-center">
                  Email
                  {sortField === 'email' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? 
                        <ArrowUp className="h-3 w-3" /> : 
                        <ArrowDown className="h-3 w-3" />}
                    </span>
                  )}
                </div>
              </th>
            )}
            {visibleColumns.includes('phone') && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            )}
            {visibleColumns.includes('company') && (
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => onSortChange('company')}
              >
                <div className="flex items-center">
                  Company
                  {sortField === 'company' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? 
                        <ArrowUp className="h-3 w-3" /> : 
                        <ArrowDown className="h-3 w-3" />}
                    </span>
                  )}
                </div>
              </th>
            )}
            {visibleColumns.includes('job_title') && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
            )}
            {visibleColumns.includes('groups') && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Groups</th>
            )}
            {visibleColumns.includes('tags') && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
            )}
            {visibleColumns.includes('source') && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
            )}
            {visibleColumns.includes('last_contacted') && (
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => onSortChange('last_contacted_at')}
              >
                <div className="flex items-center">
                  Last Contacted
                  {sortField === 'last_contacted_at' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? 
                        <ArrowUp className="h-3 w-3" /> : 
                        <ArrowDown className="h-3 w-3" />}
                    </span>
                  )}
                </div>
              </th>
            )}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contacts.map((contact) => (
            <tr key={contact.id} className="hover:bg-gray-50">
              {visibleColumns.includes('name') && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {contact.profile_image_url ? (
                        <img src={contact.profile_image_url} alt={`${contact.first_name} ${contact.last_name}`} className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-gray-500 font-medium">{(contact.first_name?.[0] ?? '')}{(contact.last_name?.[0] ?? '')}</span>
                      )}
                    </div>
                    <div className="ml-4">
                      <Link href={`/contacts/${contact.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                        {contact.first_name || contact.last_name ? `${contact.first_name ?? ''} ${contact.last_name ?? ''}`.trim() : 'Unnamed Contact'}
                      </Link>
                    </div>
                  </div>
                </td>
              )}
              
              {visibleColumns.includes('email') && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{contact.email || '-'}</div>
                </td>
              )}
              
              {visibleColumns.includes('phone') && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{contact.phone || '-'}</div>
                </td>
              )}
              
              {visibleColumns.includes('company') && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {contact.company_name || '-'}
                  </div>
                </td>
              )}
              
              {visibleColumns.includes('job_title') && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {contact.job_title || '-'}
                  </div>
                </td>
              )}
              
              {visibleColumns.includes('groups') && (
                <td className="px-6 py-4 whitespace-nowrap">
                  {isLoadingGroups ? (
                    <div className="text-sm text-gray-400">Loading groups...</div>
                  ) : (
                    <ContactGroupManager 
                      contactId={contact.id} 
                      contactName={`${contact.first_name || ''} ${contact.last_name || ''}`.trim()}
                      preloadedGroups={allGroups}
                    />
                  )}
                </td>
              )}
              
              {visibleColumns.includes('tags') && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {contact.tags ? (
                      Array.isArray(contact.tags) && contact.tags.length > 0 ? (
                        contact.tags.map((tag: any) => (
                          <Badge key={tag.id} variant="secondary" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))
                      ) : <span className="text-gray-400 text-sm">No tags</span>
                    ) : <span className="text-gray-400 text-sm">No tags</span>}
                  </div>
                </td>
              )}
              
              {visibleColumns.includes('source') && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {contact.source || '-'}
                  </div>
                </td>
              )}
              
              {visibleColumns.includes('last_contacted') && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {contact.last_contacted_at ? new Date(contact.last_contacted_at).toLocaleDateString() : 'Never'}
                  </div>
                </td>
              )}
              
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  {contact.email && (
                    <Button size="icon" variant="ghost" className="h-8 w-8" title="Send Email">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </Button>
                  )}
                  
                  {contact.phone && (
                    <Button size="icon" variant="ghost" className="h-8 w-8" title="Call">
                      <Phone className="h-4 w-4 text-green-600" />
                    </Button>
                  )}
                  
                  <Button size="icon" variant="ghost" className="h-8 w-8" title="WhatsApp">
                    <MessageSquareText className="h-4 w-4 text-emerald-600" />
                  </Button>
                  
                  <Button size="icon" variant="ghost" className="h-8 w-8" title="AI Actions">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                  </Button>
                  
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8 ml-2" 
                    onClick={() => onEditClick(contact)}
                    disabled={isSaveMutationLoading || isDeleteMutationLoading}
                    title="Edit Contact"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </Button>
                  
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8" 
                    onClick={() => onDeleteClick(contact.id)}
                    disabled={isSaveMutationLoading || isDeleteMutationLoading}
                    title="Delete Contact"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="bg-white shadow-md rounded-lg p-6 text-center">
      <p className="text-gray-500">
        {searchQuery ? 
          `No contacts found matching "${searchQuery}".` :
          selectedGroupId ?
            `No contacts found in the selected group.` :
            "No contacts found. Add your first contact to get started."}
      </p>
    </div>
  );
}
