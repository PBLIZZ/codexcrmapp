// /app/contacts/page.tsx
import { requireAuth } from '@/lib/auth/require-auth';
import { ContactsView } from './ContactsView'; // We will create this new component
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Contacts | CodexCRM',
  description: 'Manage your contacts, groups, and relationships efficiently.',
};

// Loading skeleton for the entire page
function ContactsPageSkeleton() {
  return (
    <div className='p-4 md:p-6 space-y-6'>
      <Skeleton className='h-12 w-full' />
      <Skeleton className='h-24 w-full' />
      <Skeleton className='h-96 w-full' />
    </div>
  );
}

export default async function ContactsPage() {
  // Ensure user is authenticated - redirects to login if not
  await (requireAuth as () => Promise<unknown>)();

  return (
    <main className='flex-1 p-4 md:p-6 bg-slate-50'>
      <Suspense fallback={<ContactsPageSkeleton />}>
        <ContactsView />
      </Suspense>
    </main>
  );
}
