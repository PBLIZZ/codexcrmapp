"use client";
import Link from 'next/link';
import { useSupabase } from './SupabaseProvider';
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';

export default function Navbar() {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = useSupabase();
  useEffect(() => {
    if (!supabase) return;
    
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };
    
    getSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    
    return () => subscription.unsubscribe();
  }, [supabase]);
  
  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
  };
  return (
    <nav className="p-4 flex justify-between bg-gray-100">
      <Link href="/" className="font-bold">Home</Link>
      <div>
        {session ? (
          <>
            <span className="mr-4">{session.user.email}</span>
            <button onClick={signOut} className="bg-red-500 text-white px-3 py-1 rounded">Sign out</button>
          </>
        ) : (
          <Link href="/sign-in" className="bg-blue-500 text-white px-3 py-1 rounded">Sign In</Link>
        )}
      </div>
    </nav>
  );
}