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
  { title: 'Dashboard', href: '/' as const, icon: Home, color: 'teal' },
  { title: 'Contacts', href: '/contacts' as const, icon: Users, color: 'rose' },
  { title: 'Tasks', href: '/tasks' as const, icon: CheckSquare, color: 'yellow' },
  { title: 'Calendar', href: '/calendar' as const, icon: Calendar, color: 'indigo' },
  { title: 'Messages', href: '/messages' as const, icon: MessageSquare, color: 'sky' },
  { title: 'Marketing', href: '/marketing' as const, icon: Megaphone, color: 'orange' },
  { title: 'Analytics', href: '/analytics' as const, icon: BarChart, color: 'violet' },
];

// Color mapping for light and dark modes
const getColorClasses = (color: string, isActive: boolean) => {
  const colorMap = {
    teal: {
      bg: 'bg-teal-100/50 dark:bg-teal-400/10',
      border: 'border-b-teal-300 dark:border-b-teal-400',
      borderSubtle: 'border-b-teal-200/60 dark:border-b-teal-400/40',
      text: 'text-teal-700 dark:text-teal-400',
      hover:
        'hover:bg-teal-100 dark:hover:bg-teal-400/20 hover:text-teal-700 dark:hover:text-teal-400',
    },
    rose: {
      bg: 'bg-rose-100/50 dark:bg-rose-400/10',
      border: 'border-b-rose-300 dark:border-b-rose-400',
      borderSubtle: 'border-b-rose-200/60 dark:border-b-rose-400/40',
      text: 'text-rose-700 dark:text-rose-400',
      hover:
        'hover:bg-rose-100 dark:hover:bg-rose-400/20 hover:text-rose-700 dark:hover:text-rose-400',
    },
    yellow: {
      bg: 'bg-yellow-100/50 dark:bg-yellow-400/10',
      border: 'border-b-yellow-300 dark:border-b-yellow-400',
      borderSubtle: 'border-b-yellow-200/60 dark:border-b-yellow-400/40',
      text: 'text-yellow-700 dark:text-yellow-400',
      hover:
        'hover:bg-yellow-100 dark:hover:bg-yellow-400/20 hover:text-yellow-700 dark:hover:text-yellow-400',
    },
    indigo: {
      bg: 'bg-indigo-100/50 dark:bg-indigo-400/10',
      border: 'border-b-indigo-300 dark:border-b-indigo-400',
      borderSubtle: 'border-b-indigo-200/60 dark:border-b-indigo-400/40',
      text: 'text-indigo-700 dark:text-indigo-400',
      hover:
        'hover:bg-indigo-100 dark:hover:bg-indigo-400/20 hover:text-indigo-700 dark:hover:text-indigo-400',
    },
    sky: {
      bg: 'bg-sky-100/50 dark:bg-sky-400/10',
      border: 'border-b-sky-300 dark:border-b-sky-400',
      borderSubtle: 'border-b-sky-200/60 dark:border-b-sky-400/40',
      text: 'text-sky-700 dark:text-sky-400',
      hover: 'hover:bg-sky-100 dark:hover:bg-sky-400/20 hover:text-sky-700 dark:hover:text-sky-400',
    },
    orange: {
      bg: 'bg-orange-100/50 dark:bg-orange-400/10',
      border: 'border-b-orange-300 dark:border-b-orange-400',
      borderSubtle: 'border-b-orange-200/60 dark:border-b-orange-400/40',
      text: 'text-orange-700 dark:text-orange-400',
      hover:
        'hover:bg-orange-100 dark:hover:bg-orange-400/20 hover:text-orange-700 dark:hover:text-orange-400',
    },
    violet: {
      bg: 'bg-violet-100/50 dark:bg-violet-400/10',
      border: 'border-b-violet-300 dark:border-b-violet-400',
      borderSubtle: 'border-b-violet-200/60 dark:border-b-violet-400/40',
      text: 'text-violet-700 dark:text-violet-400',
      hover:
        'hover:bg-violet-100 dark:hover:bg-violet-400/20 hover:text-violet-700 dark:hover:text-violet-400',
    },
  };

  const colors = colorMap[color as keyof typeof colorMap];

  if (isActive) {
    return `${colors.bg} ${colors.border} ${colors.text} border-b-2`;
  }

  return `text-muted-foreground ${colors.hover} ${colors.borderSubtle} border-b border-b-transparent hover:border-b-current`;
};

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
            className={`main-nav-item flex items-center gap-2 text-sm font-medium rounded-md px-3 py-1.5 transition-all duration-200 ${getColorClasses(item.color, isActive)} ${isActive ? 'active' : ''}`}
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
