/**
 * Root Layout - Main Application Container
 * 
 * This is the top-level layout component defined in the Next.js App Router.
 * While not the absolute root (Next.js itself adds providers above this),
 * it's the highest level layout we control as developers.
 * 
 * It provides core functionality and UI structure that's shared across all pages:
 * 
 * 1. Font configuration (Geist Sans and Geist Mono)
 * 2. Global CSS imports and theme styling
 * 3. Authentication state management via Supabase
 * 4. Global providers (tRPC, auth context, etc.)
 * 5. Main application shell (MainLayout component)
 * 6. Toast notifications system
 * 
 * Every page in the application inherits from this layout, ensuring consistent
 * styling, authentication, and core functionality throughout the app.
 * 
 * Date: June 11, 2025
 */

'use client';

import { Geist, Geist_Mono } from 'next/font/google'; // Your fonts

import './globals.css';
import './theme.css'; // Custom theme for wellness CRM
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Providers } from './providers';
import { StagewiseToolbar } from '@stagewise/toolbar-next';
import { ReactPlugin } from '@stagewise-plugins/react';

import { MainLayout } from '@/components/layout/MainLayout'; // Main app shell
import { Toaster } from '@/components/ui/sonner';
import { createClient } from '@/lib/supabase/client'; // Your Supabase client

const supabase = createClient();

import type { User } from '@supabase/supabase-js';

// Font configuration
const geistSans = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
});

// If you need static metadata, it's often best to keep RootLayout as a Server Component
// and create a new Client Component wrapper inside it for the auth logic.
// However, for simplicity here, making RootLayout client.
// export const metadata: Metadata = { /* ... */ };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const authPages = [
    '/log-in',
    '/sign-up',
    '/forgot-password',
    '/reset-password',
    '/sign-up/confirmation',
  ];
  const isAuthPage = pathname ? authPages.includes(pathname) : false;

  useEffect(() => {
    const getSessionAndSetUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoadingAuth(false);
    };
    getSessionAndSetUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setIsLoadingAuth(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (isLoadingAuth) {
    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="flex items-center justify-center h-screen">
            Loading Application...
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Toaster />
          <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
          {user && !isAuthPage ? (
            // Authenticated user, not on an auth page: Render MainLayout which includes its own Navbar
            <MainLayout
              user={
                user
              } /* Pass totalContacts if MainLayout needs it for Sidebar */
            >
              {children}
            </MainLayout>
          ) : isAuthPage ? (
            // Unauthenticated (or authenticated but on auth page, middleware will redirect if needed)
            // Render the auth page directly
            <>
              {children}
            </>
          ) : (
            // Unauthenticated and not on an auth page (e.g. public homepage, or middleware will redirect to /sign-in)
            <>
              {children}
            </>
          )}
        </Providers>
      </body>
    </html>
  );
}
