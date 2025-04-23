"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

// Import the tRPC client from the correct location
import { api } from '@/lib/trpc';

// Export the api client as trpc for backward compatibility
export const trpc = api;

// Export types for inputs and outputs
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '@codexcrm/server/src/root';
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

/**
 * Helper to get the base URL for API requests depending on environment
 */
function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

/**
 * Provider component for tRPC and React Query
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // Create React Query client once
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  }) as any); // Type assertion to avoid version compatibility issues

  // Create tRPC client once - for tRPC v10 with TanStack Query v4
  const [trpcClient] = React.useState(() => {
    return api.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    });
  });

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </api.Provider>
  );
}