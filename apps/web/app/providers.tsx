'use client';

import type { AppRouter } from '@codexcrm/server/src/root';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import * as React from 'react';
import superjson from 'superjson';
import { AuthProvider } from '@codexcrm/auth'; // Import AuthProvider

// Import the tRPC client from the correct location
import { api, API_VERSION } from '@/lib/trpc';

// Export types for inputs and outputs

// Export the api client as trpc for backward compatibility
export const trpc = api;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

/**
 * Helper to get the base URL for API requests depending on environment
 */
function getBaseUrl() {
  // In the browser, we use an absolute URL without domain to avoid CORS issues
  if (typeof window !== 'undefined') {
    // Make sure we return the absolute path from the root
    return window.location.origin;
  }
  // SSR should use vercel url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // Dev SSR should use localhost
  return 'http://localhost:3008';
}

/**
 * Provider component for tRPC and React Query
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // AuthProvider should be placed here, wrapping other client-side providers if necessary,
  // or directly wrapping children if it doesn't depend on them.
  // Create React Query client with better error handling
  const [queryClient] = React.useState<QueryClient>(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error: Error) => {
            console.error('React Query error:', error);
          },
        }),
        mutationCache: new MutationCache({
          onError: (error: Error) => {
            console.error('Mutation error:', error);
          },
        }),
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {},
        },
      })
  ); // Type assertion to avoid version compatibility issues

  // Force reset the cache on component mount to avoid stale references
  // React.useEffect(() => {
  //   // Clear all queries on initial load to prevent stale cache issues
  //   // queryClient.clear(); // <-- Commented out: Likely causing issues with mutation updates
  //   // console.warn('React Query cache cleared');
  // }, [queryClient]);

  // Create tRPC client with better error handling
  const [trpcClient] = React.useState(() => {
    const baseUrl = getBaseUrl();
    console.warn(
      `Creating new tRPC client (version: ${API_VERSION}) with baseUrl: ${baseUrl}`
    );

    return api.createClient({
      links: [
        httpBatchLink({
          transformer: superjson,
          // Ensure we have a proper absolute URL
          url: `${baseUrl}/api/trpc`,

          // Custom fetch handler for debugging
          fetch: (input, init) => {
            // Log request details
            const inputUrl =
              typeof input === 'string'
                ? input
                : input instanceof Request
                  ? input.url
                  : String(input);
            console.warn('tRPC fetch request to:', inputUrl);

            // Use the standard fetch API
            return fetch(input, {
              ...init,
              credentials: 'include', // Include cookies for auth
            });
          },

          // Add headers for cache busting and debugging
          headers: () => ({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
            'x-trpc-source': 'react',
            'x-trpc-version': `${API_VERSION}`,
            // Add additional debug header
            'x-debug-url': 'true',
          }),
        }),
      ],
    });
  });

  return (
    <AuthProvider>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </api.Provider>
    </AuthProvider>
  );
}
