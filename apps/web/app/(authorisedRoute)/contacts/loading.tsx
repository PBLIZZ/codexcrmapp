import { Skeleton } from '@codexcrm/ui';

export default function Loading() {
  return (
    <div className='flex h-screen'>
      {/* Sidebar skeleton */}
      <div className='w-80 border-r bg-card p-4 space-y-4'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-32' /> {/* Search */}
          <Skeleton className='h-10 w-full' /> {/* Search input */}
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-6 w-20' /> {/* Groups header */}
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-4 w-28' />
        </div>
      </div>

      {/* Main content skeleton */}
      <div className='flex-1 p-6 space-y-4'>
        <div className='flex justify-between items-center'>
          <Skeleton className='h-8 w-32' /> {/* Page title */}
          <Skeleton className='h-10 w-32' /> {/* New contact button */}
        </div>

        {/* Table skeleton */}
        <div className='space-y-4'>
          <div className='flex gap-4'>
            <Skeleton className='h-10 w-64' /> {/* Search */}
            <Skeleton className='h-10 w-32' /> {/* Filter */}
          </div>

          {/* Table rows */}
          <div className='space-y-2'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='flex items-center gap-4 p-4 border rounded'>
                <Skeleton className='h-10 w-10 rounded-full' /> {/* Avatar */}
                <div className='flex-1 space-y-2'>
                  <Skeleton className='h-4 w-48' /> {/* Name */}
                  <Skeleton className='h-3 w-32' /> {/* Email */}
                </div>
                <Skeleton className='h-4 w-24' /> {/* Company */}
                <Skeleton className='h-4 w-20' /> {/* Group */}
                <Skeleton className='h-8 w-8' /> {/* Actions */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
