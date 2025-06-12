'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { ChevronsLeft, Inbox, Star, Calendar, Sun, Moon, Book } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { UserNav } from './UserNav';
import { SidebarNavLink } from './SidebarNavLink';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
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

export function TasksSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="h-[calc(100vh-6rem)] sticky top-20 bg-white rounded-lg shadow-sm border">
      <SidebarHeader>
        {/* You can add a header or search bar here if you want */}
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {smartLists.map((item) => (
            <SidebarMenuItem key={item.href}>
              {/* Use the SidebarMenuButton for links */}
              <SidebarMenuButton 
                href={item.href}
                isActive={pathname.startsWith(item.href)}
                // The tooltip is handled automatically when collapsed!
                tooltip={item.title} 
              >
                {item.icon}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
    </Sidebar>
  );
}
