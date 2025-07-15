// apps/web/app/layout.tsx
'use client';

import { Geist, Geist_Mono } from 'next/font/google'; // Your fonts

import './globals.css';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Providers } from './providers';

import { MainLayout } from '@/components/layout/MainLayout'; // Main app shell
import { Toaster } from '@codexcrm/ui';
import { supabase } from '@/lib/supabase/client'; // Your Supabase client

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
  const isAuthPage = authPages.includes(pathname);

  useEffect(() => {
    const getSessionAndSetUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoadingAuth(false);
    };
    getSessionAndSetUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoadingAuth(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (isLoadingAuth) {
    return (
      <html lang='en'>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <div className='flex items-center justify-center h-screen'>Loading Application...</div>
        </body>
      </html>
    );
  }

  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {' '}
          {/* tRPC, React Query Providers */}
          <Toaster />
          {user && !isAuthPage ? (
            // Authenticated user, not on an auth page: Render MainLayout which includes its own Navbar
            <MainLayout>{children}</MainLayout>
          ) : isAuthPage ? (
            // Unauthenticated (or authenticated but on auth page, middleware will redirect if needed)
            // Render the auth page directly, possibly with a simpler Navbar
            <>{children}</>
          ) : (
            // Unauthenticated and not on an auth page (e.g. public homepage, or middleware will redirect to /log-in)
            <>{children}</>
          )}
        </Providers>
      </body>
    </html>
  );
}
