"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

// Import the actual type from the package for tRPC
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

// Import the router from the server package using relative path
// since path aliases might not be configured to reach into packages directory
import { appRouter } from '../../../packages/server/src/routers/client';

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
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * Client-side providers wrapper for tRPC and React Query
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // Create React Query client once
  const [queryClient] = React.useState(() => new QueryClient());
  
  // Create tRPC client once
  const [trpcClient] = React.useState(() => {
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
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