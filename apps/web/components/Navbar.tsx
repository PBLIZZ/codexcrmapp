"use client";
import Link from 'next/link';
import { useSupabase } from './SupabaseProvider';
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = useSupabase();
  const router = useRouter();
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
    console.log('Attempting sign out...'); // Log start
    // Add null check for supabase client
    if (!supabase) {
      console.error('Sign out failed: Supabase client not available.');
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase sign out error:', error);
        throw error;
      }
      console.log('Supabase signOut successful. Clearing user state.'); // Log success
      setSession(null); // Clear user state locally
      console.log('Pushing to / route...'); // Log before redirect
      router.push('/'); // Redirect to home page
      console.log('router.push called.'); // Log after redirect call
      // router.refresh(); // Keep refresh commented out for now
    } catch (error) { 
      console.error('Error during sign out process:', error);
      // Handle error display if necessary
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