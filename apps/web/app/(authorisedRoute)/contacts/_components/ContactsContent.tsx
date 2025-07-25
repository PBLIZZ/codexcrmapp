'use client';

import { Badge } from '@codexcrm/ui';
import { Skeleton } from '@codexcrm/ui';
import { Alert, AlertDescription } from '@codexcrm/ui';
import { DataTable } from './data-table';
import { api } from '@/lib/trpc';
import { AlertCircle, Users } from 'lucide-react';

// ContactsContent component serves as the main container for the contacts table
// Uses tRPC for server-side data fetching and follows shadcn card patterns for consistent layout
export function ContactsContent() {
  // This component fetches contacts data using tRPC for server-side data integration
  const { data: contacts, isLoading, error } = api.contacts.list.useQuery();

  if (isLoading) {
    return (
      <div className='w-full max-w-none space-y-4'>
        <div className='flex flex-col space-y-1.5 p-6 pb-3'>
          <div className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            <h3 className='text-2xl font-semibold leading-none tracking-tight'>Contacts</h3>
            <Badge variant='outline' className='ml-2'>
              Loading...
            </Badge>
          </div>
          <p className='text-sm text-muted-foreground'>
            Manage your contacts and their information
          </p>
        </div>
        <div className='p-6 pt-0 space-y-4'>
          <div className='flex justify-between items-center'>
            <Skeleton className='h-10 w-[300px]' />
            <Skeleton className='h-10 w-[100px]' />
          </div>
          <Skeleton className='h-[400px] w-full rounded-lg' />
          <Skeleton className='h-10 w-full' />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full max-w-none space-y-4'>
        <div className='flex flex-col space-y-1.5 p-6 pb-3'>
          <div className='flex items-center gap-2'>
            <Users className='h-5 w-5 text-red-500' />
            <h3 className='text-2xl font-semibold leading-none tracking-tight'>Contacts</h3>
            <Badge variant='outline' className='ml-2 border-red-200 text-red-700'>
              Error
            </Badge>
          </div>
          <p className='text-sm text-muted-foreground'>
            Manage your contacts and their information
          </p>
        </div>
        <div className='p-6 pt-0'>
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription className='font-semibold'>Error loading contacts</AlertDescription>
            <AlertDescription>
              {error instanceof Error ? error.message : 'An unknown error occurred'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Main content - follows shadcn card pattern for consistent layout
  return (
    <div className='w-full max-w-none space-y-4'>
      <div className='flex flex-col space-y-1.5 p-6 pb-3'>
        <div className='flex items-center gap-2'>
          <Users className='h-5 w-5' />
          <h3 className='text-2xl font-semibold leading-none tracking-tight'>Contacts</h3>
          <Badge variant='outline' className='ml-2'>
            {contacts?.length || 0} total
          </Badge>
        </div>
        <p className='text-sm text-muted-foreground'>Manage your contacts and their information</p>
      </div>
      <div className='p-6 pt-0'>
        {/* DataTable component handles its own internal layout and scrolling */}
        <DataTable data={contacts || []} />
      </div>
    </div>
  );
}
