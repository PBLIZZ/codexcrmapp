'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@codexcrm/auth';

import { Home, Users, CheckSquare, Calendar, MessageSquare, BarChart, LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { MobileMenu } from './MobileMenu';

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: Home },
    { title: 'Contacts', href: '/contacts', icon: Users },
    { title: 'Tasks', href: '/tasks', icon: CheckSquare },
    { title: 'Calendar', href: '/calendar', icon: Calendar },
    { title: 'Messages', href: '/messages', icon: MessageSquare },
    { title: 'Analytics', href: '/analytics', icon: BarChart },
];

export function Header() {
  const { isLoading } = useAuth();
  const pathname = usePathname() ?? '/';

  if (isLoading) {
    // Skeleton loader for when auth state is being determined
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-white">
        <div className="flex h-16 items-center px-4 w-full">
          <Skeleton className="h-8 w-36" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
      <div className="flex h-16 items-center px-4 w-full">
        
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 mr-6">
          <Image src="/images/logo.png" alt="OmniCRM Logo" width={32} height={32} className="h-8 w-auto" />
          <div className="hidden sm:flex flex-col">
            <span className="text-xl font-bold text-teal-800">OmniCRM</span>
            <span className="text-xs text-gray-600">by Omnipotency ai</span>
          </div>
        </Link>

        {/* Desktop Navigation - Takes up all available space */}
        <nav className="hidden md:flex items-center justify-center flex-1 gap-4 lg:gap-8">
          {mainNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={{ pathname: item.href }}
                className={`flex items-center gap-2 text-sm font-medium rounded-md px-3 py-1.5 transition-colors ${isActive ? `bg-teal-400 text-teal-800 shadow-sm` : `text-gray-600 hover:bg-gray-100`}`}
                title={item.title}
              >
                {React.createElement(item.icon, { className: "h-5 w-5" })}
                <span className="hidden lg:inline">{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu - Right aligned */}
        <div className="md:hidden ml-auto">
          <MobileMenu />
        </div>
        
      </div>
    </header>
  );
}
