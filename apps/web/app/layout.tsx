//apps/web/app/layout.tsx
/**
 * Root Layout - Main Application Container (Server Component)
 */
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@codexcrm/ui/dist/index.css';

import { createClient } from '@/lib/supabase/server';
import MainLayout from '@/components/layout/MainLayout';
import { Providers } from './providers'; // We need this for tRPC

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

// Static metadata, possible because this is now a Server Component.
export const metadata: Metadata = {
  title: 'CodexCRM',
  description: 'The intelligent CRM for modern professionals.',
};

/**
 * This is the root of the entire application.
 * It's a SERVER COMPONENT that determines the top-level layout.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Check for the user on the server.
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 2. Wrap everything in Providers so tRPC works everywhere. */}
        <Providers>
          {/* 3. The Grand Decision: */}
          {user ? (
            // If a user exists, render the full application shell.
            // The actual page (e.g., dashboard, contacts) is passed in as `children`.
            <MainLayout>{children}</MainLayout>
          ) : (
            // If no user, just render the children directly.
            // This will be the login, sign-up, etc., pages.
            children
          )}
        </Providers>
      </body>
    </html>
  );
}
