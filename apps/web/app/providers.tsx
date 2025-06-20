'use client';

import type { AppRouter } from '@codexcrm/server/src/root';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type {
  ReactNode} from 'react';
import {
  createContext,
  useState,
  useEffect,
  use, // React 19 hook
} from 'react';
import superjson from 'superjson';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

import { api, API_VERSION } from '@/lib/trpc';

// Export types for the entire app
export const trpc = api;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterInputs<AppRouter>;

// ========================
// AUTH PROVIDER (All in one file)
// ========================

// Auth context type
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
};

// Create the context
export const AuthContext = createContext<AuthContextType | null>(null);

// Create a single Supabase client instance
const supabase = createClient();

/**
 * AuthProvider component that manages client-side authentication state
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }
        
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = { 
    user, 
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access auth context using React 19's use() hook
 */
export function useAuth(): AuthContextType {
  const context = use(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook to get the current user (convenience hook)
 */
export function useUser(): User | null {
  const { user } = useAuth();
  return user;
}

/**
 * Hook to check if auth is loading
 */
export function useAuthLoading(): boolean {
  const { isLoading } = useAuth();
  return isLoading;
}

// ========================
// MAIN PROVIDERS
// ========================

/**
 * Helper to get the base URL for API requests
 */
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  if (process.env['VERCEL_URL']) {return `https://${process.env['VERCEL_URL']}`;}
  return 'http://localhost:3008';
}

/**
 * Main Providers component that wraps the entire app
 */
export function Providers({ 
  children, 
  cookies 
}: { 
  children: React.ReactNode;
  cookies: string;
}) {
  // Create React Query client
  const [queryClient] = useState<QueryClient>(
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
  );

  // Create tRPC client
  const [trpcClient] = useState(() => {
    const baseUrl = getBaseUrl();
    console.warn(
      `Creating new tRPC client (version: ${API_VERSION}) with baseUrl: ${baseUrl}`
    );

    return api.createClient({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: `${baseUrl}/api/trpc`,

          fetch: (input, init) => {
            const inputUrl =
              typeof input === 'string'
                ? input
                : input instanceof Request
                  ? input.url
                  : String(input);
            console.warn('tRPC fetch request to:', inputUrl);

            return fetch(input, {
              ...init,
              credentials: 'include',
            });
          },

          headers: () => ({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
            Expires: '0',
            'x-trpc-source': 'react',
            'x-trpc-version': `${API_VERSION}`,
            'x-debug-url': 'true',
            cookie: cookies, // This is the key fix - passing cookies to tRPC
          }),
        }),
      ],
    });
  });

  return (
    <AuthProvider>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </api.Provider>
    </AuthProvider>
  );
}