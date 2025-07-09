import { api } from '@/lib/trpc/server-client';
import { requireAuth } from '@/lib/auth/require-auth';

export const metadata = {
  title: 'Dashboard | CodexCRM',
  description: 'Your business overview with insights, metrics, and quick actions.',
  keywords: ['dashboard', 'analytics', 'business metrics', 'overview'],
};

import DashboardClient from './DashboardClient';
import { Suspense } from 'react';

export default async function DashboardPage() {
  // Auth function handles redirects internally - type assertion for error-typed function
  await (requireAuth as () => Promise<unknown>)();
  
  // Pre-fetch any data required for the dashboard using the tRPC server client
  // For example: await api.dashboard.summary.query();
  // Currently no direct API calls needed as child components handle their own data fetching

  return (
    <main className='flex-1 overflow-y-auto p-4 md:p-6'>
      <Suspense fallback={<div>Loading dashboard...</div>}>
        <DashboardClient />
      </Suspense>
    </main>
  );
}
