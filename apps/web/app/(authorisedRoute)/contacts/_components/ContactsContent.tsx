'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@codexcrm/ui';
import { DataTable } from './data-table';
import { createColumns } from './columns';
import { useContacts } from '@/components/hooks/use-contacts';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

export function ContactsContent() {
  const { data: contacts, isLoading, error } = useContacts();

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
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin' />
        <span className='ml-2'>Loading contacts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='text-center text-destructive'>
            Error loading contacts: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts</CardTitle>
        <CardDescription>Manage your contacts and their group memberships</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={contacts || []} />
      </CardContent>
    </Card>
  );
}
