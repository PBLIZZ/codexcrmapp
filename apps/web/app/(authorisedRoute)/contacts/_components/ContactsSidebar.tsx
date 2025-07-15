'use client';

import { Users, UserPlus, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function ContactsSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  // Handler for selecting "All Contacts"
  const handleAllContactsSelect = () => {
    router.push('/contacts');
  };

  return (
    <SidebarContent>
      {/* Contacts Navigation */}
      <SidebarGroup>
        <SidebarGroupLabel>Contacts</SidebarGroupLabel>
        <SidebarMenu>
          {/* All Contacts link */}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleAllContactsSelect}
              isActive={pathname === '/contacts'}
              tooltip='All Contacts'
              className='justify-between w-full'
            >
              <div className='flex items-center gap-3'>
                <Users className='w-4 h-4' />
                <span>All Contacts</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* Groups link */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href='/contacts/groups' className='flex items-center w-full'>
                <Users className='w-4 h-4 mr-3' />
                <span className='font-medium'>Groups</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* Import link */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href='/contacts/import' className='flex items-center w-full'>
                <Upload className='w-4 h-4 mr-2' />
                <span className='font-medium'>Import Contacts</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* Add Contact */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href='/contacts/new' className='flex items-center w-full'>
                <UserPlus className='w-4 h-4 mr-2' />
                <span className='font-medium'>Add Contact</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <div>PlaceHolder</div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      {/* Quick Actions */}
      <SidebarGroup>
        <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
        <SidebarMenu>{/* Add other quick actions here if needed */}</SidebarMenu>
      </SidebarGroup>

      {/* Groups List */}
      <SidebarGroup>
        <SidebarGroupLabel>Groups</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <div>No groups found</div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
}
