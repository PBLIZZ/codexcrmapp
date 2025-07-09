'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import { createRoute } from '@/lib/utils/routes';
import * as React from 'react';

// UI and Icon Imports
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Menu,
  Home,
  Users,
  CheckSquare,
  Calendar,
  MessageSquare,
  BarChart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mainNavItems = [
  { title: 'Dashboard', href: '/dashboard', icon: Home },
  { title: 'Contacts', href: '/contacts', icon: Users },
  { title: 'Tasks', href: '/tasks', icon: CheckSquare },
  { title: 'Calendar', href: '/calendar', icon: Calendar },
  { title: 'Messages', href: '/messages', icon: MessageSquare },
  { title: 'Analytics', href: '/analytics', icon: BarChart },
];

/**
 * MobileMenu provides the slide-out navigation panel for smaller viewports.
 * It is triggered by a hamburger icon and contains the primary navigation links.
 * It does NOT contain its own logo, as the main header is always visible.
 */
export function MobileMenu() {
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle main menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] pt-10"> {/* Added top padding */}
          {/* The SheetHeader with the logo has been REMOVED. */}
          
          <nav className="flex flex-col p-4 space-y-1">
            {mainNavItems.map((item) => (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href as Route}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-lg font-medium transition-colors', // Made text slightly larger for mobile tap targets
                    pathname.startsWith(item.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}