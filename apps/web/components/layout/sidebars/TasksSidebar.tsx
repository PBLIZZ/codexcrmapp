'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Inbox, Star, Calendar, Sun, Moon, Book } from 'lucide-react';
import { UserNav } from '@/components/layout/UserNav';
import { createRoute } from '@/lib/utils/routes';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar';

// Define our navigation sections
const smartLists = [
  { title: 'Inbox', href: '/tasks/inbox', icon: <Inbox className="h-4 w-4" />, badge: 2 },
  { title: 'Today', href: '/tasks/today', icon: <Star className="h-4 w-4" />, badge: 8 },
  { title: 'Upcoming', href: '/tasks/upcoming', icon: <Calendar className="h-4 w-4" /> },
  { title: 'Anytime', href: '/tasks/anytime', icon: <Sun className="h-4 w-4" /> },
  { title: 'Someday', href: '/tasks/someday', icon: <Moon className="h-4 w-4" /> },
  { title: 'Logbook', href: '/tasks/logbook', icon: <Book className="h-4 w-4" /> },
];

const projects = [
  // This would be fetched from your database
  { title: 'Social Media', href: '/tasks/projects/1', icon: <div className="h-2.5 w-2.5 rounded-full bg-blue-500" /> },
  { title: 'Product Launch', href: '/tasks/projects/2', icon: <div className="h-2.5 w-2.5 rounded-full bg-red-500" /> },
];

export function TasksSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
          <SidebarHeader>
            <div className="flex items-center justify-between">
              <Link href={createRoute("/")} className="flex items-center gap-2 font-semibold">
                <img src="/images/logo.png" alt="OmniCRM Logo" className="h-7" />
                <div className="flex flex-col">
                  <span>OmniCRM</span>
                  <span className="text-xs">
                    by{' '}
                    <span className="text-teal-500">Omnipotency ai</span>
                  </span>
                </div>
              </Link>
            </div>
          </SidebarHeader>
    
          {/* The main scrollable content area of the sidebar */}
          <SidebarContent>
        <SidebarMenu>
          {smartLists.map((item) => (
            <SidebarMenuItem key={item.href}>
              {/* Use the SidebarMenuButton for links */}
              <SidebarMenuButton 
                asChild
                isActive={pathname.startsWith(item.href)}
                // The tooltip is handled automatically when collapsed!
                tooltip={item.title} 
              >
                <Link href={createRoute(item.href)}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
      <SidebarRail />
      </Sidebar>
  );
}