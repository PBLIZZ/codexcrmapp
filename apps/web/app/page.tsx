//apps/web/app/(authorisedRoute)/dashboard/page.tsx
import React from 'react';
import { DashboardWidgets } from './(authorisedRoute)/dashboard/components/DashboardWidgets';

/**
 * The primary page for the application, serving as the main dashboard.
 *
 * This Server Component defines the content for the root URL ('/'). It is responsible
 * for orchestrating the layout of the main dashboard widgets.
 */
export default function DashboardPage() {
  return (
    // This root div will fill the <SidebarInset> area provided by MainLayout.
    <div className='flex flex-col h-full'>
      {/* The <main> tag contains the primary content for this page. */}
      <main className='flex-1 overflow-y-auto p-4 md:p-6'>
        {/* Render the container for all dashboard widgets. */}
        <DashboardWidgets />
      </main>
    </div>
  );
}
