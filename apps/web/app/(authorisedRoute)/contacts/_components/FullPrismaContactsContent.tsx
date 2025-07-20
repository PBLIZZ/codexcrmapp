'use client';

import { AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { Contact } from '@codexcrm/db';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
} from '@codexcrm/ui';
import { api } from '@/lib/trpc';
import { ContactsTable } from './TanstackTable';

export function ContactsContent() {
  const router = useRouter();
  
  // Fetch contacts data
  const { data: contacts, isLoading, error, refetch } = api.contacts.list.useQuery(undefined);
  
  // Delete mutations
  const deleteMutation = api.contacts.delete.useMutation({
    onSuccess: () => {
      toast.success('Contact deleted successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete contact: ${error.message}`);
    },
  });

  const bulkDeleteMutation = api.contacts.bulkDelete.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.deletedCount} contact(s) deleted successfully`);
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete contacts: ${error.message}`);
    },
  });

  // Handle single contact delete
  const handleDelete = (contactIds: string[]) => {
    if (contactIds.length === 1) {
      deleteMutation.mutate({ contactId: contactIds[0]! });
    } else {
      bulkDeleteMutation.mutate({ contactIds });
    }
  };

  // Handle contact edit
  const handleEdit = (contact: Contact) => {
    router.push(`/contacts/${contact.id}/edit`);
  };

  // Handle contact view
  const handleView = (contact: Contact) => {
    router.push(`/contacts/${contact.id}`);
  };

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

        {/* Contacts Table */}
        {contacts && contacts.length > 0 ? (
          <ContactsTable
            data={contacts}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onView={handleView}
          />
        ) : (
          <div className='flex flex-col items-center justify-center py-12 text-center border rounded-lg'>
            <div className='h-12 w-12 text-muted-foreground mb-4'>
              👥
            </div>
            <h3 className='text-lg font-medium'>No contacts yet</h3>
            <p className='text-muted-foreground mt-1'>
              Get started by adding your first contact.
            </p>
            <Button className='mt-4' asChild>
              <Link href='/contacts/new'>
                <Plus className='mr-2 h-4 w-4' />
                Add Contact
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
