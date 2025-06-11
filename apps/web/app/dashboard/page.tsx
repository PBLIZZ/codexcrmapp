import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardContent from './DashboardContent';

export default function Dashboard() {
  return (
    <Suspense fallback={<Skeleton className="h-screen w-full" />}>
      <DashboardContent />
    </Suspense>
  );
}
