'use client';

import { ReactNode } from 'react';

// Import the layout primitives from your UI library
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';

// Import your custom layout components
import { AppSidebarController } from './AppSidebarController';
import { MainSectionNav } from './MainSectionNav';
import { OmniBotFloat } from './OmniBotFloat';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';

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
      <SidebarInset className="p-4">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2 px-4">
          <MainSectionNav/>
        </div>
        </header>
        <div className="flex flex-col h-full">
        {children}
        </div>
      </SidebarInset>
      <OmniBotFloat/>
    </SidebarProvider>
  );
}
