import { Suspense } from 'react';
import { ClientDetailView } from './ClientDetailView';
import { Skeleton } from '@/components/ui/skeleton';

// Loading component for Suspense fallback
function ClientDetailSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="space-y-4 flex-1">
                <Skeleton className="h-8 w-64" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full max-w-md" />
                  <Skeleton className="h-4 w-full max-w-sm" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 pt-0">
            <Skeleton className="h-10 w-full max-w-md mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientDetailPage({ params }: any) {
  return (
    <Suspense fallback={<ClientDetailSkeleton />}>
      <ClientDetailView clientId={params.clientId} />
    </Suspense>
  );
}
