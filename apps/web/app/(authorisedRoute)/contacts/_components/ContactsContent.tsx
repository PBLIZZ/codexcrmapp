'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@codexcrm/ui';
import { Badge } from '@codexcrm/ui';
import { Skeleton } from '@codexcrm/ui';
import { Alert, AlertDescription } from '@codexcrm/ui';
import { DataTable } from './data-table';
import { createColumns } from './columns';
import { api } from '@/lib/trpc';
import { AlertCircle, Users } from 'lucide-react';
import * as React from 'react';

export function ContactsContent() {
  const { data: contacts, isLoading, error } = api.contacts.list.useQuery();

  const columns = React.useMemo(
    () =>
      createColumns({
        onTagFilter: (tag) => console.log('Filter by tag:', tag),
        onGroupFilter: (groupId) => console.log('Filter by group:', groupId),
      }),
    []
  );

  if (isLoading) {
    return (
      <Card className='bg-white border-teal-700/30 shadow-md'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-xl flex items-center gap-2'>
            <Users className='h-5 w-5 text-sky-600' />
            <span>Contacts</span>
            <Badge
              variant='outline'
              className='ml-2 bg-sky-50 border border-teal-700/30 text-sky-700 hover:bg-sky-100 shadow-sm'
            >
              Loading...
            </Badge>
          </CardTitle>
          <CardDescription>Manage your contacts and their information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <Skeleton className='h-10 w-[300px]' />
              <Skeleton className='h-10 w-[100px]' />
            </div>
            <Skeleton className='h-[400px] w-full rounded-lg bg-slate-100/70' />
            <Skeleton className='h-10 w-full' />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='bg-white border-teal-700/30 shadow-md'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-xl flex items-center gap-2'>
            <Users className='h-5 w-5 text-red-500' />
            <span>Contacts</span>
            <Badge
              variant='outline'
              className='ml-2 bg-red-50 border border-teal-700/40 text-red-700 hover:bg-red-100 shadow-sm'
            >
              Error
            </Badge>
          </CardTitle>
          <CardDescription>Manage your contacts and their information</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert
            variant='destructive'
            className='mt-2 border-teal-700/40 text-red-800 bg-red-50 shadow-sm'
          >
            <AlertCircle className='h-4 w-4' />
            <AlertDescription className='font-semibold'>Error loading contacts</AlertDescription>
            <AlertDescription>
              {error instanceof Error ? error.message : 'An unknown error occurred'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='bg-white border-slate-200 shadow-md'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-xl flex items-center gap-2'>
          <Users className='h-5 w-5 text-teal-600' />
          <span>Contacts</span>
          <Badge
            variant='outline'
            className='ml-2 bg-teal-50 border border-teal-700/40 text-teal-700 hover:bg-teal-100 shadow-sm'
          >
            {contacts?.length || 0} total
          </Badge>
        </CardTitle>
        <CardDescription>Manage your contacts and their information</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={contacts || []} />
      </CardContent>
    </Card>
  );
}
