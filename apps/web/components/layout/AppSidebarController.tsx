'use client';

import { usePathname } from 'next/navigation';
import { Skeleton } from '@codexcrm/ui';

// 1. Import all possible sidebar components that this controller can render.
import { ContactsSidebar } from './ContactsSidebar';
import { DashboardSidebar } from './DashboardSidebar';
import { TasksSidebar } from './TasksSidebar';

// We'll create placeholder components for the missing sidebars
function AnalyticsSidebar() {
  return (
    <div className='p-4 h-full'>
      <h2 className='font-semibold text-lg mb-4'>Analytics</h2>
      <ul className='space-y-2'>
        <li>
          <a href='#' className='text-sm text-gray-700 hover:text-primary'>
            Overview
          </a>
        </li>
        <li>
          <a href='#' className='text-sm text-gray-700 hover:text-primary'>
            Reports
          </a>
        </li>
        <li>
          <a href='#' className='text-sm text-gray-700 hover:text-primary'>
            Metrics
          </a>
        </li>
      </ul>
    </div>
  );
}

function CalendarSidebar() {
  return (
    <div className='p-4 h-full'>
      <h2 className='font-semibold text-lg mb-4'>Calendar</h2>
      <ul className='space-y-2'>
        <li>
          <a href='#' className='text-sm text-gray-700 hover:text-primary'>
            Today
          </a>
        </li>
        <li>
          <a href='#' className='text-sm text-gray-700 hover:text-primary'>
            This Week
          </a>
        </li>
        <li>
          <a href='#' className='text-sm text-gray-700 hover:text-primary'>
            This Month
          </a>
        </li>
      </ul>
    </div>
  );
}

function MessagesSidebar() {
  return (
    <div className='p-4 h-full'>
      <h2 className='font-semibold text-lg mb-4'>Messages</h2>
      <ul className='space-y-2'>
        <li>
          <a href='#' className='text-sm text-gray-700 hover:text-primary'>
            Inbox
          </a>
        </li>
        <li>
          <a href='#' className='text-sm text-gray-700 hover:text-primary'>
            Sent
          </a>
        </li>
        <li>
          <a href='#' className='text-sm text-gray-700 hover:text-primary'>
            Drafts
          </a>
        </li>
      </ul>
    </div>
  );
}

function SettingsSidebar() {
  return (
    <div className='p-4 h-full'>
      <h2 className='font-semibold text-lg mb-4'>Settings</h2>
      <ul className='space-y-2'>
        <li>
          <a href='#' className='text-sm text-gray-700 hover:text-primary'>
            Profile
          </a>
        </li>
        <li>
          <a href='#' className='text-sm text-gray-700 hover:text-primary'>
            Account
          </a>
        </li>
        <li>
          <a href='#' className='text-sm text-gray-700 hover:text-primary'>
            Security
          </a>
        </li>
      </ul>
    </div>
  );
}

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
      <div className='space-y-4 p-4'>
        <Skeleton className='h-8 w-3/4' />
        <Skeleton className='h-6 w-full' />
        <Skeleton className='h-6 w-5/6' />
        <Skeleton className='h-6 w-full' />
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

  if (settingsRoutes.some((route) => pathname.startsWith(route))) {
    return <SettingsSidebar />;
  }

  // Fallback case: If no specific section matches (e.g., on '/account' page),
  // you can either render a default sidebar or nothing at all.
  // Rendering the DashboardSidebar as a safe default.
  return <DashboardSidebar />;
}
