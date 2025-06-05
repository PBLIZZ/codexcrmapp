'use client';

import type { User as SupabaseUser } from '@supabase/supabase-js'; // Renamed to avoid conflict
import {
  Menu,
  Home,
  Users,
  CheckSquare,
  Calendar,
  MessageSquare,
  BarChart,
  // Icons below are used in the Navbar component, not directly here anymore
  // Settings, PlusCircle, UserPlus, FileText, Tag, Mail, Phone, Upload, User, LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'; // Import React

// Import UI Components used directly in MainLayout

// Import Custom Layout Components
import { ContactsSidebar } from './ContactsSidebar';
// Import other sidebar components as you create them
import { DashboardSidebar } from './DashboardSidebar';
import { GroupsAdminSidebar } from './GroupsAdminSidebar';
import { Navbar } from './Navbar'; // Your consolidated Navbar
import { TasksSidebar } from './TasksSidebar';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { api } from '@/lib/trpc';
import { cn } from '@/lib/utils';

// Import Icons used directly in MainLayout (for mobile menu and nav items)

// Define type for section paths (used for styling and logic)
type SectionPath =
  | '/dashboard'
  | '/contacts'
  | '/tasks'
  | '/calendar'
  | '/messages'
  | '/analytics';

// Section color schemes (remains as it's used for mobile header accent)
const sectionColors: Record<SectionPath, { accent: string; text: string }> = {
  '/dashboard': { accent: 'bg-orange-500', text: 'text-white' },
  '/contacts': { accent: 'bg-teal-400', text: 'text-teal-800' },
  '/tasks': { accent: 'bg-teal-800', text: 'text-white' },
  '/calendar': { accent: 'bg-orange-500', text: 'text-white' },
  '/messages': { accent: 'bg-blue-500', text: 'text-white' },
  '/analytics': { accent: 'bg-indigo-600', text: 'text-white' },
};

// Main navigation items (used for mobile sheet menu)
const mainNavItemsForSheet = [
  { title: 'Dashboard', href: '/dashboard', icon: Home, disabled: false },
  { title: 'Contacts', href: '/contacts', icon: Users, disabled: false },
  { title: 'Tasks', href: '/tasks', icon: CheckSquare, disabled: false },
  { title: 'Calendar', href: '/calendar', icon: Calendar, disabled: false },
  {
    title: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    disabled: false,
  },
  { title: 'Analytics', href: '/analytics', icon: BarChart, disabled: false },
];

interface MainLayoutProps {
  children: React.ReactNode;
  user: SupabaseUser; // Expect a non-null user here, RootLayout ensures this
}

export function MainLayout({ children, user }: MainLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // --- Data Fetching for Sidebars (Consider moving to individual sidebars if specific) ---
  // Fetch total contacts count, only if on contacts page and sidebar needs it
  const { data: contactsData } = api.contacts.list.useQuery({}, {
    enabled: pathname.startsWith('/contacts'), // Only fetch if relevant
  });
  const totalContacts = contactsData?.length || 0;

  // --- Helper functions to determine current section ---
  const getCurrentSectionPath = (): SectionPath => {
    for (const item of mainNavItemsForSheet) {
      // Use a consistent nav item list
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        if (Object.keys(sectionColors).includes(item.href)) {
          return item.href as SectionPath;
        }
      }
    }
    return '/dashboard'; // Default
  };

  const currentSectionPath = getCurrentSectionPath();
  const currentSectionColors =
    sectionColors[currentSectionPath] || sectionColors['/dashboard'];
  const currentSectionTitle =
    mainNavItemsForSheet.find((item) => item.href === currentSectionPath)
      ?.title || 'Dashboard';

  // --- Logic to render the appropriate sidebar ---
  const renderSidebar = () => {
    if (pathname.startsWith('/contacts')) {
      return <ContactsSidebar totalContacts={totalContacts} />;
    }
    if (pathname.startsWith('/groups')) {
      return <GroupsAdminSidebar />;
    }
    if (pathname.startsWith('/dashboard') || pathname === '/') {
      return <DashboardSidebar />;
    }
    if (pathname.startsWith('/tasks')) {
      return <TasksSidebar />;
    }
    // Add more conditions for /calendar, /messages, /analytics sidebars
    // Fallback sidebar or null
    return <div className="p-4 h-full">Default/Other Section Sidebar</div>;
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {' '}
      {/* Added a light bg to body */}
      <Navbar user={user} /> {/* Use the consolidated Navbar component */}
      <div className="container mx-auto flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-x-6 lg:gap-x-8 py-4 md:py-6">
        {/* Mobile Menu Sheet Trigger (part of the header logic but placed here for layout) */}
        {/* This Sheet is for the main navigation on mobile, distinct from contextual sidebar */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden fixed top-3 left-3 z-50">
            {/* Positioned fixed for mobile */}
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle main menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[260px] p-0">
            {/* Content for the Mobile Main Navigation Sheet */}
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <Link
                  href="/"
                  className="flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <img src="/images/logo.png" alt="OmniCRM" className="h-7" />
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-teal-800">
                      OmniCRM
                    </span>
                    <span className="text-xs text-gray-500">
                      by Omnipotency ai
                    </span>
                  </div>
                </Link>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                {mainNavItemsForSheet.map((item) => (
                  <SheetClose asChild key={item.href}>
                    <Link
                      href={item.disabled ? '#' : item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        pathname === item.href ||
                          pathname.startsWith(`${item.href}/`)
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        item.disabled && 'pointer-events-none opacity-60'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              {/* You can add settings or account link at the bottom of sheet too */}
            </div>
          </SheetContent>
        </Sheet>

        {/* Contextual Sidebar (Desktop) */}
        <aside className="hidden h-[calc(100vh-6rem)] md:sticky md:block top-20 bg-white rounded-lg shadow-sm border">
          {/* top-20 to account for navbar height + py-4 of parent. Adjust as needed */}
          {/* Added bg, rounded, shadow, border for better visual separation */}
          {renderSidebar()}
        </aside>

        {/* Main Content Area */}
        <main className="flex w-full flex-col overflow-hidden mt-4 md:mt-0">
          {/* Added mt-4 for mobile where sidebar is not taking space */}
          {children}
        </main>
      </div>
    </div>
  );
}
