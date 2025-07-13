'use client';

import Image from 'next/image';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@codexcrm/ui';
import { AppSidebarController } from './AppSidebarController';
import { UserNav } from './UserNav';
import { DynamicBreadcrumb } from './DynamicBreadcrumb';
import { MainSectionNav } from './MainSectionNav';
import { SidebarFooterControls } from './SidebarFooterControls';

interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * MainLayout - Modern application layout using shadcn sidebar components
 *
 * Layout Structure:
 * - SidebarProvider manages sidebar state
 * - Sidebar contains header, content (route-based), and footer (user nav)
 * - SidebarInset contains the main content with trigger and breadcrumbs
 * - Mobile-responsive with built-in sidebar behavior
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className='flex h-screen w-full'>
        <Sidebar collapsible='icon'>
          <SidebarHeader>
            {/* Logo/Brand Area */}
            <div className='flex items-center gap-2 px-4 py-2'>
              <Image
                src='/images/logo.png'
                alt='OmniCRM'
                width={32}
                height={32}
                className='h-8 w-8'
              />
              <div className='flex flex-col group-data-[collapsible=icon]:hidden'>
                <span className='text-lg font-bold text-teal-800'>OmniCRM</span>
                <span className='text-xs text-gray-500'>by Omnipotency ai</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <AppSidebarController />
          </SidebarContent>

          <SidebarFooter>
            <UserNav />
            <SidebarFooterControls />
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className='sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4'>
            <SidebarTrigger className='-ml-1' variant='ghost' size='icon' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <DynamicBreadcrumb />
            <div className='flex-1' />
            <div className='flex items-center gap-2'>
              <MainSectionNav />
            </div>
          </header>

          <main className='flex flex-1 flex-col gap-4 p-4 overflow-auto'>{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
