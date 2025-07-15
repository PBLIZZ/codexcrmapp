'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState, createContext, useContext, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { SupabaseClient, User } from '@supabase/supabase-js';

import { api } from '@/lib/trpc';
import type { AppRouter } from '@/lib/trpc/root';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { ThemeProvider } from '@codexcrm/ui';

// tRPC types
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

// Auth Context
type AuthContextType = {
  supabase: SupabaseClient;
  user: User | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Auth Provider
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabaseClient] = useState(() => supabase);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabaseClient.auth.getSession();
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    };

    getSession();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabaseClient]);

  const value = {
    supabase: supabaseClient,
    user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Main Providers Component
function getBaseUrl() {
  if (typeof window !== 'undefined') return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3008';
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    })
  );

  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <api.Provider client={trpcClient} queryClient={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </api.Provider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
