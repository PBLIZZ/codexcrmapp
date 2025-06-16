/**
 * Root Layout - Main Application Container (Server Component)
 *
 * This is the top-level layout component. As a Server Component, it is
 * responsible for the static parts of the application shell that are
 * shared across all pages.
 *
 * Responsibilities:
 * 1. Defining the <html> and <body> tags.
 * 2. Configuring and applying global fonts (Geist Sans and Geist Mono).
 * 3. Importing global CSS stylesheets.
 * 4. Rendering the global <Providers> component, which in turn handles
 *    all client-side state and logic (like authentication).
 *
 * Client-side logic, auth state, and conditional rendering based on path
 * are delegated to the <AppContent> component, rendered inside <Providers>.
 *
 * Date: June 11, 2025
 */
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

// Global Styles
import './globals.css';
import './theme.css';

// Providers and Components
import { Providers } from './Providers';
import { AppContent } from '@/components/layout/AppContent'; // The new client logic component
import { Toaster, toast } from 'sonner';

// Third-party tools
import { StagewiseToolbar } from '@stagewise/toolbar-next';
import { ReactPlugin } from '@stagewise-plugins/react';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Toaster />
          <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
          
          {/* AppContent acts as the dynamic boundary. Everything else is static. */}
          {/* It will contain all the logic that was previously in this file. */}
          <AppContent>{children}</AppContent>
        </Providers>
      </body>
    </html>
  );
}
