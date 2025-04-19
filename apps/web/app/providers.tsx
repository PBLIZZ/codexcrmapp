"use client";

import React from 'react';
import { trpc, trpcClient } from '../../lib/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Client-side providers wrapper for tRPC and React Query
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // Create query client once
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}