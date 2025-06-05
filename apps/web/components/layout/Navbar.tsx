'use client';

import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import {
  Home,
  Users,
  CheckSquare, // Assuming for Tasks
  Calendar,
  MessageSquare, // Assuming for Messages
  BarChart, // Assuming for Analytics
  Settings, // For user menu
  LogOut, // For user menu
  User as UserIcon, // Renamed to avoid conflict with Supabase User type
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SignOutButton } from '@/components/layout/SignOutButton'; // Assuming SignOutButton is in the same directory
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  user: User | null; // Passed from MainLayout (which gets it from RootLayout or its own state)
}

// Helper to get initials from name (or email)
const getInitials = (user: User | null) => {
  if (!user) return 'NN'; // No Name or Not LoggedIn
  const emailPrefix = user.email?.split('@')[0];
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    emailPrefix ||
    '';

  if (name.includes(' ')) {
    const parts = name.split(' ');
    return `${parts[0]?.[0] || ''}${parts[parts.length - 1]?.[0] || ''}`.toUpperCase();
  }
  return `${name?.[0] || ''}${name?.[1] || ''}`.toUpperCase() || 'NN';
};

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  // Main navigation items - these match your MainLayout.tsx header
  const mainNavItems = [
    { title: 'Dashboard', href: '/dashboard', icon: Home },
    { title: 'Contacts', href: '/contacts', icon: Users },
    { title: 'Tasks', href: '/tasks', icon: CheckSquare },
    { title: 'Calendar', href: '/calendar', icon: Calendar },
    { title: 'Messages', href: '/messages', icon: MessageSquare },
    { title: 'Analytics', href: '/analytics', icon: BarChart },
  ];

  // Determine current section color accent - matches logic from your MainLayout.tsx
  const getCurrentSectionPath = (): string => {
    for (const item of mainNavItems) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        return item.href;
      }
    }
    return '/dashboard'; // Default
  };
  const currentSectionPath = getCurrentSectionPath();

  const sectionColors: Record<string, { accent: string; text: string }> = {
    '/dashboard': { accent: 'bg-orange-500', text: 'text-white' },
    '/contacts': { accent: 'bg-teal-400', text: 'text-teal-800' },
    '/tasks': { accent: 'bg-teal-800', text: 'text-white' },
    '/calendar': { accent: 'bg-orange-500', text: 'text-white' },
    '/messages': { accent: 'bg-blue-500', text: 'text-white' },
    '/analytics': { accent: 'bg-indigo-600', text: 'text-white' },
  };
  const currentSectionColors =
    sectionColors[currentSectionPath] || sectionColors['/dashboard'];

  if (!user) {
    // Navbar for unauthenticated users (e.g., on /sign-in page)
    // Or, if your RootLayout handles this, Navbar might not even be rendered.
    // For simplicity, let's assume it might be rendered and show a simple version.
    return (
      <nav className="sticky top-0 z-40 border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between py-2">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="OmniCRM" className="h-8" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-teal-800">OmniCRM</span>
              <span className="text-xs text-gray-600">by Omnipotency ai</span>
            </div>
          </Link>
          <Link href="/sign-in">
            <Button
              variant="default"
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </nav>
    );
  }

  // Navbar for authenticated users
  return (
    <nav className="sticky top-0 z-40 border-b bg-white shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between py-2">
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="OmniCRM" className="h-8" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-teal-800">OmniCRM</span>
              <span className="text-xs text-gray-600">by Omnipotency ai</span>
            </div>
          </Link>
        </div>

        {/* Section Title (Mobile - from MainLayout.tsx's header) */}
        <div className="md:hidden">
          <div
            className={`px-3 py-1.5 rounded-md text-sm font-semibold ${currentSectionColors.accent} ${currentSectionColors.text} shadow-sm`}
          >
            {mainNavItems.find((item) => item.href === currentSectionPath)
              ?.title || 'Dashboard'}
          </div>
        </div>

        {/* Desktop Navigation Items - from MainLayout.tsx's header */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const sectionColor =
              sectionColors[item.href] || sectionColors['/dashboard'];

            return (
              <Link
                key={item.href}
                href={item.href} // Assuming no item.disabled here, add if needed
                className={`flex items-center gap-2 text-sm font-medium rounded-md px-3 py-1 transition-colors
                    ${
                      isActive
                        ? `${sectionColor.accent} ${sectionColor.text} shadow-sm`
                        : `text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 hover:shadow-sm`
                    }`}
              >
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden lg:inline">{item.title}</span>
              </Link>
            );
          })}
        </div>

        {/* User Menu and Actions - from MainLayout.tsx's header */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Placeholder for Notifications/Mail Icon if you re-add it */}
          {/* <Button variant="ghost" size="icon" className="relative text-muted-foreground">
              <Mail className="h-5 w-5" />
            </Button> */}

          {/* System Settings Dropdown - from MainLayout.tsx's header */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-accent"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">System Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>System Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings/general" className="w-full">
                  General
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings/appearance" className="w-full">
                  Appearance
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings/notifications" className="w-full">
                  Notifications
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings/security" className="w-full">
                  Security
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile Dropdown - from MainLayout.tsx's header */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.user_metadata?.avatar_url || undefined}
                    alt={user.user_metadata?.name || user.email}
                  />
                  <AvatarFallback>{getInitials(user)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.user_metadata?.full_name ||
                      user.user_metadata?.name ||
                      user.email?.split('@')[0]}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account" className="w-full">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              {/* Add other items like "Upload Photo", "Change Password" here, linking to /account or specific sub-pages */}
              <DropdownMenuSeparator />
              <SignOutButton />{' '}
              {/* Use the dedicated SignOutButton component */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
