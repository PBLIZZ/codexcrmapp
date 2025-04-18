"use client";
import Link from 'next/link';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';

export default function Navbar() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };
  return (
    <nav className="p-4 flex justify-between bg-gray-100">
      <Link href="/" className="font-bold">Home</Link>
      <div>
        {session?.user ? (
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