"use client";
import { createBrowserClient } from '@supabase/ssr';
import { createContext, useState, useContext } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

// Create a Supabase context
export const SupabaseContext = createContext<SupabaseClient | null>(null);

export function useSupabase() {
  return useContext(SupabaseContext);
}

interface SupabaseProviderProps {
  children: React.ReactNode;
}

export default function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [supabaseClient] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ));

  return (
    <SupabaseContext.Provider value={supabaseClient}>
      {children}
    </SupabaseContext.Provider>
  );
}