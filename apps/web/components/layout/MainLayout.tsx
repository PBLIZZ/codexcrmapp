//apps/web/components/layout/MainLayout.tsx
'use client';

import { ReactNode } from 'react';
import { Toaster } from 'sonner';

// Import the layout primitives from your UI library
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@codexcrm/ui/components/ui/sidebar';

// Import your custom layout components
import { AppSidebarController } from './AppSidebarController';
import { MainSectionNav } from './MainSectionNav';
import { OmniBotFloat } from './OmniBotFloat';
import { DynamicBreadcrumb } from './DynamicBreadcrumb';
import { Separator } from '@codexcrm/ui/components/ui/separator';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * MainLayout - The authoritative application shell.
 *
 * This version implements the "floating" UI pattern by setting a background
 * on the main container and adding padding around the SidebarInset, making
 * the main content and sidebar appear to float above the page background.
 */
export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebarController />
      <SidebarInset className='p-4'>
        <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <DynamicBreadcrumb />
          </div>
          <div className='flex items-center gap-2 px-4'>
            <MainSectionNav />
          </div>
        </header>
        <div className='flex flex-col h-full'>{children}</div>
      </SidebarInset>
      <OmniBotFloat />
      <Toaster position='top-center' richColors />
    </SidebarProvider>
  );
}
