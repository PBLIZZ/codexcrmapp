'use client';

import { Card } from '@codexcrm/ui';
import { api } from '@/lib/trpc';

export function ContactsWidgets() {
  // We can fetch data here or pass it down. For now, let's fetch.
  const contactsQuery = api.contacts.list.useQuery({});

  const totalContacts = Array.isArray(contactsQuery.data) ? contactsQuery.data.length : 0;
  // ... (you can add back the recently added / needs enrichment logic here)

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      <Card className='p-4'>
        <div className='text-sm text-muted-foreground'>Total Contacts</div>
        <div className='text-2xl font-bold'>{totalContacts}</div>
      </Card>
      <Card className='p-4'>
        <div className='text-sm text-muted-foreground'>Recently Added</div>
        <div className='text-2xl font-bold'>0</div> {/* Placeholder */}
      </Card>
      <Card className='p-4'>
        <div className='text-sm text-muted-foreground'>Needs Enrichment</div>
        <div className='text-2xl font-bold'>0</div> {/* Placeholder */}
      </Card>
    </div>
  );
}
