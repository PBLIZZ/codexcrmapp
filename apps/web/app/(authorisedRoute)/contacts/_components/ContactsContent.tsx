'use client';

import { AlertCircle, Plus, Users, Search, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '@codexcrm/ui';
import { api } from '@/lib/trpc';

// Helper function to get initials from name
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

// Format date helper
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export function ContactsContent() {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch contacts data
  const { data: contacts, isLoading, error } = api.contacts.list.useQuery(undefined);

  // Filter contacts based on search term
  const filteredContacts = contacts?.filter((contact: Record<string, unknown>) => {
    const fullName = typeof contact.full_name === 'string' ? contact.full_name.toLowerCase() : '';
    const email = typeof contact.email === 'string' ? contact.email.toLowerCase() : '';
    const searchLower = searchTerm.toLowerCase();
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  // Loading state
  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[50vh]'>
        <div className='animate-spin rounded-full h-12 w-12 border-2 border-current border-t-transparent text-primary'></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='py-6'>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load contacts: {error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className='py-6'>
      <div className='flex flex-col space-y-6'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Contacts</h1>
            <p className='text-muted-foreground mt-1'>Manage your contacts and relationships</p>
          </div>
          <Button asChild>
            <Link href='/contacts/new'>
              <Plus className='mr-2 h-4 w-4' />
              Add Contact
            </Link>
          </Button>
        </div>

        {/* Search */}
        <div className='relative max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search contacts...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>

        {/* Contacts List */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Users className='h-5 w-5' />
              All Contacts ({filteredContacts?.length || 0})
            </CardTitle>
            <CardDescription>
              {searchTerm ? `Showing results for "${searchTerm}"` : 'Your contact list'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredContacts && filteredContacts.length > 0 ? (
              <div className='rounded-md border'>
                <div className='grid grid-cols-1 divide-y'>
                  {filteredContacts.map((contact: Record<string, unknown>) => {
                    // Type guards for strict safety
                    const id =
                      typeof contact.id === 'string' || typeof contact.id === 'number'
                        ? String(contact.id)
                        : undefined;
                    const fullName = typeof contact.full_name === 'string' ? contact.full_name : '';
                    const avatarUrl =
                      typeof contact.avatar_url === 'string' ? contact.avatar_url : undefined;
                    const email = typeof contact.email === 'string' ? contact.email : '';
                    const phone = typeof contact.phone === 'string' ? contact.phone : '';
                    const createdAt =
                      typeof contact.created_at === 'string' ? contact.created_at : undefined;

                    if (!id) return null;

                    return (
                      <Link
                        key={id}
                        href={`/contacts/${id}`}
                        className='flex items-center p-4 hover:bg-muted/50 transition-colors'
                      >
                        <Avatar className='h-12 w-12 mr-4'>
                          {avatarUrl ? (
                            <AvatarImage src={avatarUrl} alt={fullName} />
                          ) : (
                            <div className='flex items-center justify-center h-full w-full bg-primary/10 text-primary font-medium'>
                              {getInitials(
                                fullName.split(' ')[0] || '',
                                fullName.split(' ')[1] || ''
                              )}
                            </div>
                          )}
                        </Avatar>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-2 mb-1'>
                            <p className='text-sm font-medium truncate'>
                              {fullName || 'Unnamed Contact'}
                            </p>
                          </div>
                          <div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground'>
                            {email && (
                              <div className='flex items-center gap-1'>
                                <Mail className='h-3 w-3' />
                                <span className='truncate'>{email}</span>
                              </div>
                            )}
                            {phone && (
                              <div className='flex items-center gap-1'>
                                <Phone className='h-3 w-3' />
                                <span>{phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className='text-xs text-muted-foreground text-right'>
                          <div>Added</div>
                          <div>{formatDate(createdAt)}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-12 text-center'>
                <Users className='h-12 w-12 text-muted-foreground mb-4' />
                <h3 className='text-lg font-medium'>
                  {searchTerm ? 'No contacts found' : 'No contacts yet'}
                </h3>
                <p className='text-muted-foreground mt-1'>
                  {searchTerm
                    ? `No contacts match "${searchTerm}". Try a different search term.`
                    : 'Get started by adding your first contact.'}
                </p>
                <Button className='mt-4' asChild>
                  <Link href='/contacts/new'>
                    <Plus className='mr-2 h-4 w-4' />
                    Add Contact
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
