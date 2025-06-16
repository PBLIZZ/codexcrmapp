'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Import hooks and constants from your shared packages
import { useAuth } from '@/app/Providers';
import { AUTH_PAGES, DASHBOARD_PATH, LOG_IN_PATH } from '@codexcrm/config';

// Import UI components
import { LoadingSpinner } from '@codexcrm/ui';
import MainLayout from '@/components/layout/MainLayout'; 
/**
 * AppContent - The Client-Side Brains of the Layout
 *
 * This component is rendered within the server-side RootLayout. It is responsible for:
 * 1. Consuming the authentication state from `useAuth`.
 * 2. Showing a loading spinner while the auth state is being determined.
 * 3. Handling routing logic:
 *    - Redirecting unauthenticated users from pro'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Import hooks and constants from your shared packages
import { useAuth } from '@/app/Providers';
import { AUTH_PAGES, DASHBOARD_PATH, LOG_IN_PATH } from '@codexcrm/config';

// Import UI components
import { LoadingSpinner } from '@codexcrm/ui';
import MainLayout from '@/components/layout/MainLayout'; 
/**
 * AppContent - The Client-Side Brains of the Layout
 *
 * This component is rendered within the server-side RootLayout. It is responsible for:
 * 1. Consuming the authentication state from `useAuth`.
 * 2. Showing a loading spinner while the auth state is being determined.
 * 3. Handling routing logic:
 *    - Redirecting unauthenticated users from protected pages to the sign-in page.
 *    - Redirecting authenticated users from auth pages to the dashboard.
 * 4. Conditionally rendering the `MainLayout` for authenticated users or the raw `children` for public/auth pages.
 */
export function AppContent({ children }: { children: React.ReactNode }) {
  // 1. Consume the global authentication state
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // 2. Determine the type of page based on the current path
  // Check if the current path is in the AUTH_PAGES array
  const isAuthPage = (AUTH_PAGES as readonly string[]).includes(pathname);
  
  // Any page that is NOT an auth page is considered a protected page
  const isProtectedPage = !isAuthPage;

  // 3. Effect hook to handle all redirection logic
  useEffect(() => {
    // Do nothing until the authentication state is resolved
    if (isLoading) {
      return;
    }

    // Scenario 1: User is logged in but is on an authentication page (e.g., /log-in).
    // Redirect them to the main application dashboard.
    if (user && isAuthPage) {
      router.replace('/');
    }

    // Scenario 2: User is not logged in and is trying to access a protected page.
    // Redirect them to the login page.
    if (!user && isProtectedPage) {
      router.replace(LOG_IN_PATH);
    }
  }, [isLoading, user, isAuthPage, isProtectedPage, router]);

  // 4. Render a loading spinner during critical state transitions to prevent flicker.
  // This covers:
  // - The initial load while checking the session.
  // - The brief moment before a redirect is executed.
  if (isLoading || (!user && isProtectedPage) || (user && isAuthPage)) {
    return <LoadingSpinner />;
  }

  // 5. If the user is authenticated and on a protected page, render the main app shell.
  // The `user` object is now available to any component inside MainLayout via the `useAuth()` hook.
  if (user && isProtectedPage) {
    return (
        <MainLayout>{children}</MainLayout>
    );
  }

  // 6. For all other cases (e.g., an unauthenticated user on an auth page),
  // render the page content directly without the main layout.
  return <>{children}</>;
}
