'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { UserNav } from '@/components/layout/UserNav';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@codexcrm/ui'
import { cn } from '@/lib/utils';
import { SidebarProvider } from '@codexcrm/ui';

// Icons for the settings navigation
import { User, CreditCard, Bell, Sparkles, ShieldCheck } from 'lucide-react';

// Navigation items for the settings section
const settingsNavItems = [
  { title: 'Account', href: '/account', icon: User },
  { title: 'Billing', href: '/billing', icon: CreditCard },
  { title: 'Upgrade', href: '/upgrade', icon: Sparkles },
  { title: 'Notifications', href: '/notifications', icon: Bell },
  { title: 'Security', href: '/security', icon: ShieldCheck },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <img src="/images/logo.png" alt="OmniCRM Logo" className="h-7" />
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span>OmniCRM</span>
                <span className="text-xs">
                  by{' '}
                  <span className="text-teal-500">Omnipotency ai</span>
                </span>
              </div>
            </Link>
          </div>
        </SidebarHeader>
      <SidebarContent>
      <nav className="flex-1 p-2 space-y-1">
          {settingsNavItems.map((item) => (
            <Link
              key={item.href}
              href={{ pathname: item.href }}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/50'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
        <aside className="flex flex-col h-full border-r bg-card text-card-foreground">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold tracking-tight">Settings</h2>
          </div>      
        </aside>
      </SidebarContent>
      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    </SidebarProvider>
  );
}
