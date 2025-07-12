import { Suspense } from 'react';

import { ContactDetailView } from './ContactDetailView';

import { Skeleton } from '@codexcrm/ui';

/**
 * Props for the ContactDetailPage component following Next.js App Router conventions
 */
interface ContactDetailPageProps {
  params: {
    contactId: string;
  };
}

/**
 * Loading component for Suspense fallback
 * Displays a skeleton UI while the contact details are loading
 */
function ContactDetailSkeleton() {
  return (
    <div className='container mx-auto py-8 px-4'>
      <div className='flex flex-col space-y-8'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-10 w-64' />
          <Skeleton className='h-10 w-24' />
        </div>

        <div className='rounded-lg border bg-card text-card-foreground shadow-sm'>
          <div className='p-6'>
            <div className='flex flex-col md:flex-row gap-6'>
              <Skeleton className='h-32 w-32 rounded-full' />
              <div className='space-y-4 flex-1'>
                <Skeleton className='h-8 w-64' />
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-40' />
                  <Skeleton className='h-4 w-40' />
                </div>
              </div>
            </div>

            <div className='mt-8 space-y-6'>
              <Skeleton className='h-6 w-40' />
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Skeleton className='h-20 w-full' />
                <Skeleton className='h-20 w-full' />
              </div>

              <Skeleton className='h-6 w-40' />
              <div className='space-y-4'>
                <Skeleton className='h-24 w-full' />
                <Skeleton className='h-24 w-full' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Contact detail page component
 * Uses Next.js App Router conventions for dynamic route parameters
 */
export default async function ContactDetailPage({ params }: ContactDetailPageProps) {
  // Extract contactId from params (await required in Next.js 15)
  const { contactId } = await params;

  return (
    <Suspense fallback={<ContactDetailSkeleton />}>
      <ContactDetailView contactId={contactId} />
    </Suspense>
  );
}
