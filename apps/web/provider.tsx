'use client';

import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  use, // The new React 19 hook
} from 'react';
import type { User } from '@supabase/supabase-js';
// This path assumes your Supabase client is in apps/web/lib.
// A future refactor could move the Supabase client to a shared @codexcrm/lib package.
import { createClient } from '@/lib/supabase/client';

// 1. Define the shape of the data the context will provide.
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
};

// 2. Create the context. It's initialized to null.
// The `use` hook will check for this and throw an error if used outside the provider.
export const AuthContext = createContext<AuthContextType | null>(null);

// Create a single Supabase client instance for this module.
const supabase = createClient();

/**
 * AuthProvider component that wraps the application to provide authentication state.
 * It handles fetching the initial user session and listens for auth state changes.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading immediately

  useEffect(() => {
    // This async function gets the initial user session on component mount.
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false); // Stop loading once the session is fetched
    };

    getInitialSession();

    // Set up a listener for any future authentication state changes (sign-in, sign-out).
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Cleanup function to unsubscribe from the listener when the component unmounts.
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs only once.

  // The value object provided to all consuming components.
  const value = { user, isLoading };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

/**
 * Custom hook `useAuth` to easily access the auth context from any client component.
 * It uses the new React 19 `use` hook for cleaner context consumption.
 */
export function useAuth() {
  const context = use(AuthContext); // Use React.use() here
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
