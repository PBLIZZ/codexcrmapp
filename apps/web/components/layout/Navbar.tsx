"use client";

import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setIsLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    console.warn('Layout Navbar: Attempting sign out...');
    try {
      // Add more detailed debugging
      console.warn('Layout Navbar: Current user state before sign out:', user);
      console.warn('Layout Navbar: QueryClient state:', queryClient);
      
      // Perform the sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Layout Navbar: Error signing out:', error);
        console.error('Layout Navbar: Error details:', JSON.stringify(error, null, 2));
        // Optionally show an error message to the user
      } else {
        console.warn('Layout Navbar: Sign out successful.');
        
        // Clear user state immediately
        setUser(null);
        setIsLoading(true);
        
        // Clear React Query cache to prevent stale data fetches
        console.warn('Layout Navbar: Clearing query cache...');
        try {
          queryClient.clear();
          console.warn('Layout Navbar: Query cache cleared successfully');
        } catch (cacheError) {
          console.error('Layout Navbar: Error clearing query cache:', cacheError);
        }
        
        // Add a small delay before redirecting to ensure state updates are processed
        console.warn('Layout Navbar: Preparing to redirect...');
        try {
          // Use router for client-side navigation when possible
          console.warn('Layout Navbar: Redirecting to /sign-in via router...');
          router.push('/sign-in');
        } catch (routerError) {
          console.error('Layout Navbar: Router navigation failed:', routerError);
          // Fallback to window.location if router fails
          console.warn('Layout Navbar: Falling back to direct location change...');
          window.location.href = '/sign-in';
        }
      }
    } catch (error) {
      console.error('Layout Navbar: Unexpected error during sign out:', error);
      console.error('Layout Navbar: Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    }
  };

  const navItems = [
    { name: "Dashboard", href: "/" },
    { name: "Contacts", href: "/contacts" },
    { name: "Groups", href: "/groups" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-purple-600">CodexCRM</span>
            </div>
            {!isLoading && user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`${
                      pathname === item.href
                        ? "border-purple-600 text-purple-900"
                        : "border-transparent text-gray-600 hover:border-purple-300 hover:text-purple-700"
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center">
            {isLoading ? (
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  {user?.email?.split("@")[0]}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/sign-in">
                <Button variant="default" size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
