// path: apps/web/components/layout/MainLayout.tsx
import { ReactNode } from 'react';
import { createClient } from '@/lib/supabase/server';
import { AppSidebarController } from './AppSidebarController';

// Import the layout primitives from your UI library
import { Separator, SidebarInset, SidebarTrigger } from '@codexcrm/ui';
import { SidebarStateProvider } from './SidebarStateProvider';

// Import your custom layout components
import { MainSectionNav } from './MainSectionNav';
import { OmniBotFloat } from './OmniBotFloat';
import { DynamicBreadcrumb } from './DynamicBreadcrumb';

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
export default async function MainLayout({ children }: MainLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <SidebarStateProvider>
      <AppSidebarController />
      <SidebarInset className='p-4'>
        <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='flex' onClick={() => {}} />
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
    </SidebarStateProvider>
  );
}
