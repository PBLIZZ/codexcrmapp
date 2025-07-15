'use client';

import { usePathname } from 'next/navigation';

import { ContactsSidebar } from '@/app/(authorisedRoute)/contacts/_components/ContactsSidebar';
import { DashboardSidebar } from '@/app/(authorisedRoute)/dashboard/_components/DashboardSidebar';
import { TasksSidebar } from '@/app/(authorisedRoute)/tasks/TasksSidebar';
import { MarketingSidebar } from '@/app/(authorisedRoute)/marketing/_components/MarketingSidebar';
import { MessagesSidebar } from '@/app/(authorisedRoute)/messages/MessagesSidebar';
import { CalendarSidebar } from '@/app/(authorisedRoute)/calendar/CalendarSidebar';
import { SettingsSidebar } from '@/app/(authorisedRoute)/settings/SettingsSidebar';
import { AnalyticsSidebar } from '@/app/(authorisedRoute)/analytics/AnalyticsSidebar';
import { ColoredSidebarWrapper } from './ColoredSidebarWrapper';

export function AppSidebarController() {
  const pathname = usePathname();

  const getSidebarComponent = () => {
    if (pathname.startsWith('/dashboard')) {
      return <DashboardSidebar />;
    }

    if (pathname.startsWith('/contacts')) {
      return <ContactsSidebar />;
    }

    if (pathname.startsWith('/tasks')) {
      return <TasksSidebar />;
    }

    if (pathname.startsWith('/marketing')) {
      return <MarketingSidebar />;
    }

    if (pathname.startsWith('/messages')) {
      return <MessagesSidebar />;
    }

    if (pathname.startsWith('/calendar')) {
      return <CalendarSidebar />;
    }

    if (pathname.startsWith('/settings')) {
      return <SettingsSidebar />;
    }

    if (pathname.startsWith('/analytics')) {
      return <AnalyticsSidebar />;
    }

    return <DashboardSidebar />;
  };

  return <ColoredSidebarWrapper>{getSidebarComponent()}</ColoredSidebarWrapper>;
}
