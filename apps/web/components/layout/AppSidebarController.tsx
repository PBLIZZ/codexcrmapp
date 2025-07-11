// path: apps/web/components/layout/AppSidebarController.tsx
'use client';

import type { User } from '@supabase/supabase-js';
import { UserNav } from './UserNav'; // Corrected import

import { usePathname } from 'next/navigation';

import { ContactsSidebar } from '../../app/(authorisedRoute)/contacts/ContactsSidebar';
import { DashboardSidebar } from '../../app/(authorisedRoute)/dashboard/DashboardSidebar';
import { TasksSidebar } from '../../app/(authorisedRoute)/tasks/TasksSidebar';
import { AnalyticsSidebar } from '../../app/(authorisedRoute)/analytics/AnalyticsSidebar';
import { MessagesSidebar } from '../../app/(authorisedRoute)/messages/MessagesSidebar';
import { MarketingSidebar } from '../../app/(authorisedRoute)/marketing/MarketingSidebar';
import { SettingsSidebar } from '../../app/(authorisedRoute)/settings/SettingsSidebar';

import { Skeleton } from '@codexcrm/ui';

/**
 * AppSidebarController declaratively renders the correct contextual sidebar
 * based on the current URL path.
 */
export default function AppSidebarController({ user }: { user: User | null }) {
  const pathname = usePathname();

  // Render a skeleton during the initial server render when pathname might not be available
  if (!pathname) {
    return <Skeleton className='h-full w-full' />;
  }

  // --- Declarative Sidebar Selection ---
  // Determine which sidebar to show based on the current route
  if (!pathname) return <DashboardSidebar className='h-full w-full'>{<></>}</DashboardSidebar>;

  if (pathname === '/' || pathname.startsWith('/dashboard')) {
    return <DashboardSidebar className='h-full w-full'>{<></>}</DashboardSidebar>;
  }

  if (pathname.startsWith('/contacts')) {
    return <ContactsSidebar className='h-full w-full'>{<></>}</ContactsSidebar>;
  }

  if (pathname.startsWith('/tasks')) {
    return <TasksSidebar className='h-full w-full'>{<></>}</TasksSidebar>;
  }

  if (pathname.startsWith('/messages')) {
    return <MessagesSidebar className='h-full w-full'>{<></>}</MessagesSidebar>;
  }

  if (pathname.startsWith('/marketing')) {
    return <MarketingSidebar className='h-full w-full'>{<></>}</MarketingSidebar>;
  }

  if (pathname.startsWith('/analytics')) {
    return <AnalyticsSidebar className='h-full w-full'>{<></>}</AnalyticsSidebar>;
  }

  if (
    pathname.startsWith('/account') ||
    pathname.startsWith('/billing') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/upgrade') ||
    pathname.startsWith('/notifications') ||
    pathname.startsWith('/security')
  ) {
    return <SettingsSidebar className='h-full w-full'>{<></>}</SettingsSidebar>;
  }
  return <DashboardSidebar className='h-full w-full'>{<></>}</DashboardSidebar>;
}
