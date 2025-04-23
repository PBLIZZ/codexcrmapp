"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

// Import the actual type from the package for tRPC
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

// Import the router from the server package using the correct path alias
import { appRouter } from '@codexcrm/server/src/root';

// Import the tRPC React hook creator
import { createTRPCReact } from '@trpc/react-query';

// Create the React tRPC client properly typed with the router's type
type AppRouter = typeof appRouter;
export const trpc = createTRPCReact<AppRouter>();

// Useful types that infer input/output types from the router
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
  }));

  // Create tRPC client once - for tRPC v10 with TanStack Query v4
  const [trpcClient] = React.useState(() => {
    return trpc.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    });
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}