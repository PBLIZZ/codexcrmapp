//apps/web/app/layout.tsx
/**
 * Root Layout - Main Application Container (Server Component)
 */
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cookies } from 'next/headers'; // Add this import
import './globals.css'; // Global Styles
import './theme.css';
import { Providers } from './providers'; // Providers and Components
import { AppContent } from '@/components/layout/AppContent';
import { Toaster } from 'sonner';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieString = (await cookies()).toString();

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers cookies={cookieString}>
          <Toaster />
          <AppContent>{children}</AppContent>
        </Providers>
      </body>
    </html>
  );
}
