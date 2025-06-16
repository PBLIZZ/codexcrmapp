'use client';

import { usePathname } from 'next/navigation';

import { ContactsSidebar } from './sidebars/ContactsSidebar';
import { DashboardSidebar } from './sidebars/DashboardSidebar';
import { TasksSidebar } from './sidebars/TasksSidebar';
import { AnalyticsSidebar } from './sidebars/AnalyticsSidebar';
import { CalendarSidebar } from './sidebars/CalendarSidebar';
import { MessagesSidebar } from './sidebars/MessagesSidebar';
import { MarketingSidebar } from './sidebars/MarketingSidebar';
import { SettingsSidebar } from './sidebars/SettingsSidebar';

import { Skeleton } from '@/components/ui/skeleton';

/**
 * AppSidebarController declaratively renders the correct contextual sidebar
 * based on the current URL path.
 */
export function AppSidebarController() {
  const pathname = usePathname();

  // Render a skeleton during the initial server render when pathname might not be available
  if (!pathname) {
    return <Skeleton className="h-full w-full" />;
  }

  // --- Declarative Sidebar Selection ---
  // Determine which sidebar to show based on the current route
  if (!pathname) return <DashboardSidebar />;

  if (pathname === '/' || pathname.startsWith('/dashboard')) {
    return <DashboardSidebar />;
  }
  
  if (pathname.startsWith('/contacts')) {
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
  
  if (pathname.startsWith('/marketing')) {
    return <MarketingSidebar />;
  }

  if (pathname.startsWith('/analytics')) {
    return <AnalyticsSidebar />;
  }

  if (pathname.startsWith('/account') || pathname.startsWith('/billing') || pathname.startsWith('/settings') || pathname.startsWith('/upgrade') || pathname.startsWith('/notifications') || pathname.startsWith('/security')) {
    return <SettingsSidebar />;
  }
  return <DashboardSidebar />;
}