import { Skeleton } from '@codexcrm/ui';

export default function Loading() {
  return (
    <div className='container mx-auto py-8 px-4'>
      {/* Header skeleton */}
      <div className='flex items-center gap-4 mb-6'>
        <Skeleton className='h-10 w-32' /> {/* Back button */}
        <Skeleton className='h-8 w-48' /> {/* Contact name */}
      </div>

      {/* Contact card skeleton */}
      <div className='space-y-6'>
        <div className='bg-card border rounded-lg p-6'>
          <div className='flex items-start gap-6'>
            <Skeleton className='h-20 w-20 rounded-full' /> {/* Avatar */}
            <div className='flex-1 space-y-4'>
              <Skeleton className='h-8 w-64' /> {/* Name */}
              <div className='grid grid-cols-2 gap-4'>
                <Skeleton className='h-4 w-48' /> {/* Email */}
                <Skeleton className='h-4 w-32' /> {/* Phone */}
                <Skeleton className='h-4 w-40' /> {/* Company */}
                <Skeleton className='h-4 w-36' /> {/* Job title */}
              </div>
            </div>
          </div>
        </div>

        {/* Content sections skeleton */}
        <div className='space-y-4'>
          <Skeleton className='h-64 w-full' />
          <Skeleton className='h-48 w-full' />
        </div>
      </div>
    </div>
  );
}
