'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@codexcrm/auth';

import { Home, Users, CheckSquare, Calendar, MessageSquare, BarChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { MobileMenu } from './MobileMenu';

const mainNavItems = [
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
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Skeleton className="h-8 w-36" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* LEFT-SIDE GROUP: Contains logo and desktop navigation */}
        <div className="flex items-center gap-6">
          
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <img src="/images/logo.png" alt="OmniCRM Logo" className="h-8" />
            <div className="hidden sm:flex flex-col">
              <span className="text-xl font-bold text-teal-800">OmniCRM</span>
              <span className="text-xs text-gray-600">by Omnipotency ai</span>
            </div>
          </Link>

          {/* Desktop Navigation (Icons only on 'md', text appears on 'lg') */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4">
            {mainNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={`flex items-center gap-2 text-sm font-medium rounded-md px-3 py-1.5 transition-colors ${isActive ? `bg-teal-400 text-teal-800 shadow-sm` : `text-gray-600 hover:bg-gray-100`}`}
                  title={item.title}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="hidden lg:inline">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* RIGHT-SIDE: This now ONLY contains the mobile menu trigger. */}
        {/* On md screens and up, this div is hidden. */}
        {/* On small screens, the desktop nav is hidden, and this appears. */}
        {/* `justify-between` pushes this to the far right, which is what we want. */}
        <div className="md:hidden">
          <MobileMenu />
        </div>
        
      </div>
    </header>
  );
}
