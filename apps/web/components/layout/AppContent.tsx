'use client';

import { usePathname } from 'next/navigation';
import { AUTH_PAGES } from '@codexcrm/config';
import MainLayout from '@/components/layout/MainLayout'; 

export function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = (AUTH_PAGES as readonly string[]).includes(pathname);

  // If it's an auth page, render children directly (login/signup forms)
  if (isAuthPage) {
    return <>{children}</>;
  }

  // For all other pages, wrap in MainLayout (middleware ensures auth)
  return <MainLayout>{children}</MainLayout>;
}
