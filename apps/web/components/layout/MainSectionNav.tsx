'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  CheckSquare,
  Calendar,
  MessageSquare,
  BarChart,
  Megaphone,
} from 'lucide-react';

const mainNavItems = [
  { title: 'Dashboard', href: '/' as const, icon: Home },
  { title: 'Contacts', href: '/contacts' as const, icon: Users },
  { title: 'Tasks', href: '/tasks' as const, icon: CheckSquare },
  { title: 'Calendar', href: '/calendar' as const, icon: Calendar },
  { title: 'Messages', href: '/messages' as const, icon: MessageSquare },
  { title: 'Marketing', href: '/marketing' as const, icon: Megaphone },
  { title: 'Analytics', href: '/analytics' as const, icon: BarChart },
];

export function MainSectionNav() {
  const pathname = usePathname() ?? '/';

  return (
    <nav className='hidden md:flex items-center gap-2 lg:gap-4'>
      {mainNavItems.map((item) => {
        // Handle the root path as a special case for isActive
        const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={{ pathname: item.href }}
            className={`flex items-center gap-2 text-sm font-medium rounded-md px-3 py-1.5 transition-colors ${
              isActive
                ? `bg-primary text-primary-foreground shadow-sm`
                : `text-muted-foreground hover:bg-muted`
            }`}
            title={item.title}
          >
            <item.icon className='h-5 w-5' />
            <span className='hidden lg:inline'>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
