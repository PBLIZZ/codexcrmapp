/**
 * MainLayout - Application Shell Component
 * 
 * This component serves as the main application shell/frame for CodexCRM and is used by the
 * root layout.tsx as the primary UI container. It provides the consistent structure across
 * all authenticated pages of the application.
 * 
 * Core responsibilities:
 * 1. Main navigation - Primary sidebar with app section links (dashboard, contacts, tasks, etc.)
 * 2. Section-specific sidebars - Contextual navigation based on current section
 *    - TasksSidebar for the Tasks section
 *    - ContactsSidebar for the Contacts section
 *    - DashboardSidebar for the Dashboard section
 * 3. Responsive design - Collapsible sidebar with mobile support
 * 4. Layout structure - Grid layout with sidebar, main content area, and optional panels
 * 5. Global UI elements - OmniBot assistant, user profile, notifications
 * 
 * Component hierarchy:
 * Root layout.tsx (global providers) 
 *  └── MainLayout (application shell)
 *      └── Section-specific layouts (like ThingsTasksLayout, ContactsLayout)
 *          └── Content components (like ThingsMainContent, ContactTable)
 * 
 * Date: June 11, 2025
 */

'use client';

import type { User as SupabaseUser } from '@supabase/supabase-js';
import {
  Home,
  Users,
  CheckSquare,
  Calendar,
  MessageSquare,
  BarChart,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { OmniBot } from '@/components/omni-bot/OmniBot';
import { ContactsSidebar } from './ContactsSidebar';
import { DashboardSidebar } from './DashboardSidebar';
import { TasksSidebar } from './TasksSidebar';
import { AddContactModal } from '@/components/contacts/AddContactModal';
import { api } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// Define type for section paths (used for styling and logic)
type SectionPath =
  | '/dashboard'
  | '/contacts'
  | '/tasks'
  | '/calendar'
  | '/messages'
  | '/analytics';

// Section color schemes - using calming colors for wellness CRM
const sectionColors: Record<SectionPath, { accent: string; text: string }> = {
  '/dashboard': { accent: 'bg-teal-500', text: 'text-white' },
  '/contacts': { accent: 'bg-teal-400', text: 'text-teal-800' },
  '/tasks': { accent: 'bg-teal-600', text: 'text-white' },
  '/calendar': { accent: 'bg-teal-500', text: 'text-white' },
  '/messages': { accent: 'bg-sky-400', text: 'text-white' },
  '/analytics': { accent: 'bg-sky-500', text: 'text-white' },
};

// Main navigation items (used for mobile sheet menu and top navigation)
const mainNavItems = [
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
  user: SupabaseUser;
}

export function MainLayout({ children, user }: MainLayoutProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = React.useState(false);
  const utils = api.useUtils();
  
  // Listen for the custom event to open the add contact modal
  React.useEffect(() => {
    const handleOpenModal = () => {
      setIsAddContactModalOpen(true);
    };
    
    window.addEventListener('open-add-contact-modal', handleOpenModal);
    
    return () => {
      window.removeEventListener('open-add-contact-modal', handleOpenModal);
    };
  }, []);

  // Helper functions to determine current section
  const getCurrentSectionPath = (): SectionPath => {
    if (!pathname) return '/dashboard'; // Default if pathname is null
    
    for (const item of mainNavItems) {
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
    mainNavItems.find((item) => item.href === currentSectionPath)
      ?.title || 'Dashboard';

  // Generate sidebar data based on current section
  const getSidebarData = () => {
    // This is sample data that would be replaced with real data
    const navMainItems = [
      {
        title: 'Secondary Nav',
        url: '#',
        icon: CheckSquare,
        isActive: true,
        items: [
          {
            title: 'Item 1',
            url: '#',
          },
          {
            title: 'Item 2',
            url: '#',
          },
        ],
      },
      // Add more items as needed for each section
    ];

    const favoriteProjects = [
      {
        name: 'Favorite 1',
        url: '#',
        icon: Home,
      },
      {
        name: 'Favorite 2',
        url: '#',
        icon: Calendar,
      },
    ];

    return {
      user: {
        name: user.email?.split('@')[0] || 'User',
        email: user.email || '',
        avatar: user.user_metadata?.avatar_url || '',
      },
      teams: [
        {
          name: 'My Workspace',
          logo: Home,
          plan: 'Pro',
        },
      ],
      navMain: navMainItems,
      projects: favoriteProjects,
    };
  };

  const sidebarData = getSidebarData();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between py-2">
          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle main menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Main Navigation Menu</SheetTitle>
                </SheetHeader>
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
                    {mainNavItems.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.disabled ? '#' : item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                            pathname && (pathname === item.href ||
                              pathname.startsWith(`${item.href}/`))
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
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo and Tagline */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <img src="/images/logo.png" alt="OmniCRM" className="h-8" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-teal-800">OmniCRM</span>
                <span className="text-xs text-gray-600">by Omnipotency ai</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {mainNavItems.map((item) => {
              const isActive = pathname ?
                (pathname === item.href || pathname.startsWith(`${item.href}/`)) : false;
              const sectionColor =
                sectionColors[item.href as SectionPath] || sectionColors['/dashboard'];

              return (
                <Link
                  key={item.href}
                  href={item.disabled ? '#' : item.href}
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

          {/* Section Title (Mobile) */}
          <div className="md:hidden">
            <div
              className={`px-3 py-1.5 rounded-md text-sm font-semibold ${currentSectionColors.accent} ${currentSectionColors.text} shadow-sm`}
            >
              {currentSectionTitle}
            </div>
          </div>
          
          {/* OmniBot - Global AI Assistant */}
          <OmniBot />
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-x-6 lg:gap-x-8 py-4 md:py-6">
        {/* Sidebar */}
        <aside className="hidden md:block">
          {pathname?.startsWith('/dashboard') && <DashboardSidebar />}
          {(pathname?.startsWith('/contacts') || pathname?.startsWith('/groups')) && <ContactsSidebar />}
          {/* Add more sidebars for other sections as they are created */}
          {pathname?.startsWith('/tasks') && <TasksSidebar />}
          {pathname?.startsWith('/calendar') && <DashboardSidebar />}
          {pathname?.startsWith('/messages') && <DashboardSidebar />}
          {pathname?.startsWith('/analytics') && <DashboardSidebar />}
        </aside>

        {/* Main Content Area */}
        <main className="flex w-full flex-col overflow-hidden mt-4 md:mt-0">
          {children}
        </main>
      </div>
      
      {/* Global Add Contact Modal */}
      <AddContactModal
        open={isAddContactModalOpen}
        onOpenChange={setIsAddContactModalOpen}
        onContactAdded={() => {
          setIsAddContactModalOpen(false);
          // Invalidate contacts list to refresh data
          utils.contacts.list.invalidate();
          utils.groups.list.invalidate();
        }}
        showTriggerButton={false}
      />
    </div>
  );
}
