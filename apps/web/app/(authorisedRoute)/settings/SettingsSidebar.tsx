'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

// Icons for the settings navigation
import { User, CreditCard, Bell, Sparkles, ShieldCheck } from 'lucide-react';

// Navigation items for the settings section
const settingsNavItems = [
  { title: 'Account', href: '/settings/account', icon: User },
  { title: 'Billing', href: '/settings/billing', icon: CreditCard },
  { title: 'Upgrade', href: '/settings/upgrade', icon: Sparkles },
  { title: 'Notifications', href: '/settings/notifications', icon: Bell },
  { title: 'Security', href: '/settings/security', icon: ShieldCheck },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Settings</SidebarGroupLabel>
        <SidebarMenu>
          {settingsNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={{ pathname: item.href }} className='flex items-center w-full'>
                  <item.icon className='w-4 h-4 mr-3' />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}
