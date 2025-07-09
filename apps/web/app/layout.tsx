//apps/web/app/layout.tsx
/**
 * Root Layout - Main Application Container (Server Component)
 */
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@codexcrm/ui/dist/index.css';

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
    <html lang='en' suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
