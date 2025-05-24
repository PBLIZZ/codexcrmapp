'use client';

import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

// Import the tRPC client from the correct location
import { api, API_VERSION } from '@/lib/trpc';
import { logDebugInfo } from '@/lib/debug-helper';

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
  return 'http://localhost:3000';
}

/**
 * Client-side providers component that wraps the app with tRPC and React Query providers
 * This is extracted as a separate client component to avoid issues with server components
 */
export default function ClientProviders({ children }: { children: React.ReactNode }) {
  // Run debugging utilities on mount in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      logDebugInfo();
    }
  }, []);

  // Create React Query client with better error handling
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1, // Only retry once
        onError: (error) => {
          console.error('React Query error:', error);
        },
      },
      mutations: {
        onError: (error) => {
          console.error('Mutation error:', error);
        },
      },
    },
  }) as any); // Type assertion to avoid version compatibility issues

  // Create tRPC client with better error handling
  const [trpcClient] = React.useState(() => {
    const baseUrl = getBaseUrl();
    console.log(`Creating new tRPC client (version: ${API_VERSION}) with baseUrl: ${baseUrl}`);
    
    return api.createClient({
      transformer: superjson,
      links: [
        httpBatchLink({
          // Ensure we have a proper absolute URL
          url: `${baseUrl}/api/trpc`,
          
          // Custom fetch handler for debugging
          fetch: (input, init) => {
            // Log request details
            const inputUrl = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input);
            console.log('tRPC fetch request to:', inputUrl);
            
            // Use the standard fetch API
            return fetch(input, {
              ...init,
              credentials: 'include', // Include cookies for auth
            });
          },
          
          // Add headers for cache busting and debugging
          headers: () => ({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'x-trpc-source': 'react',
            'x-trpc-version': `${API_VERSION}`,
            // Add additional debug header
            'x-debug-url': 'true'
          }),
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
