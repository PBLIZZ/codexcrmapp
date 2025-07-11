// path: apps/web/app/(authorisedRoute)/layout.tsx
// @/SERVER-COMPONENT
// This is the main shell for all authenticated parts of the application.

import { Providers } from '@/app/providers';
import MainLayout from '@/components/layout/MainLayout';

export default function AuthorisedLayout({ children }: { children: React.ReactNode }) {
  return (
    // First, we apply our client-side providers for tRPC and React Query.
    <Providers>
      {/* 
        Then, we render the MainLayout component, which contains the
        persistent UI shell (sidebar, header, etc.). The actual page 
        content (e.g., the dashboard or contacts list) will be passed 
        in as `children` and rendered inside MainLayout.
      */}
      <MainLayout>{children}</MainLayout>
    </Providers>
  );
}
