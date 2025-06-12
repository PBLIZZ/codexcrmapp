'use client';

import { usePathname } from 'next/navigation';

// 1. Import all possible sidebar components that this controller can render.
import { ContactsSidebar } from './ContactsSidebar';
import { DashboardSidebar } from './DashboardSidebar';
import { TasksSidebar } from './TasksSidebar';
import { AnalyticsSidebar } from './AnalyticsSidebar';
import { CalendarSidebar } from './CalendarSidebar';
import { MessagesSidebar } from './MessagesSidebar';
import { SettingsSidebar } from './SettingsSidebar';

// You can create a skeleton component for a nicer loading state.
import { Skeleton } from '@/components/ui/skeleton';

/**
 * AppSidebarController is a client component responsible for dynamically rendering
 * the correct contextual sidebar based on the current URL path.
 * This centralizes the sidebar selection logic, keeping MainLayout clean.
 */
export function AppSidebarController() {
  const pathname = usePathname();
  const settingsRoutes = ['/account', '/billing', '/upgrade', '/notifications', '/security'];

  // While the pathname is not yet available on initial render,
  // show a skeleton or return null to prevent layout shifts.
  if (!pathname) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  // 2. The core routing logic.
  // Using a series of 'if' statements is clear and easy to extend.
  // The order matters: check for more specific paths first if needed,
  // but for top-level sections, this order is fine.

  if (pathname.startsWith('/dashboard')) {
    return <DashboardSidebar />;
  }

  // The '/groups' route should also show the Contacts sidebar.
  if (pathname.startsWith('/contacts') || pathname.startsWith('/groups')) {
    return <ContactsSidebar />;
  }

  if (pathname.startsWith('/tasks')) {
    return <TasksSidebar />;
  }

  if (pathname.startsWith('/calendar')) {
    return <CalendarSidebar />;
  }
  
  if (pathname.startsWith('/messages')) {
    return <MessagesSidebar />;
  }
  
  if (pathname.startsWith('/analytics')) {
    return <AnalyticsSidebar />;
  }
  
  if (settingsRoutes.some(route => pathname.startsWith(route))) {
    return <SettingsSidebar />;
  }

  // Fallback case: If no specific section matches (e.g., on '/account' page),
  // you can either render a default sidebar or nothing at all.
  // Rendering the SettingsSidebar is a safe default.
  return <SettingsSidebar />;
}
