//apps/web/components/layout/sidebars/ContactsSidebar.tsx
'use client';

import { Users, UserPlus, Upload, Plus } from 'lucide-react'; // Added Plus for consistency if needed, though GroupCreateDialog brings its own
// import { GroupCreateDialog } from './groups/_components/GroupCreateDialog';
import { UserNav } from '@/components/layout/UserNav';
import { api } from '@/lib/trpc';
import Link from 'next/link';
import * as React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Badge } from '@codexcrm/ui';
import {
  Sidebar,
  SidebarBody,
  SidebarContent,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarRoot,
  SidebarTrigger,
} from '@codexcrm/ui';

// Define the Group type based on the expected structure
interface Group {
  id: string;
  name: string;
  emoji?: string;
  color?: string;
  memberCount?: number;
  contactCount?: number;
}

interface ContactsSidebarProps extends React.ComponentProps<typeof Sidebar> {}

export function ContactsSidebar(props: ContactsSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // This is the correct way to get the active group ID for styling
  const selectedGroupId = searchParams.get('group');

  // Temporarily disabled API calls for auth testing - use mock data
  const totalContactsData = { count: 42 };
  const groupsData: Group[] = [];

  const groups: Group[] = groupsData as Group[];

  // Handler for group selection
  const handleGroupSelect = (groupId: string) => {
    router.push(`/contacts?group=${groupId}`);
  };

  // Handler for selecting "All Contacts"
  const handleAllContactsSelect = () => {
    router.push('/contacts');
  };

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <div className='flex items-center justify-between'>
          <Link href='/' className='flex items-center gap-2 font-semibold'>
            <img src='/images/logo.png' alt='OmniCRM Logo' className='h-7' />
            <div className='flex flex-col group-data-[collapsible=icon]:hidden'>
              <span>OmniCRM</span>
              <span className='text-xs'>
                by <span className='text-teal-500'>Omnipotency ai</span>
              </span>
            </div>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Contacts Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Contacts</SidebarGroupLabel>
          <SidebarMenu>
            {/* All Contacts link */}
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleAllContactsSelect}
                isActive={pathname === '/contacts' && !selectedGroupId}
                tooltip='All Contacts'
                className='justify-between w-full'
              >
                <div className='flex items-center gap-3'>
                  <Users className='w-4 h-4' />
                  <span>All Contacts</span>
                </div>
                {typeof totalContactsData?.count === 'number' && (
                  <Badge variant='secondary' className='h-5 flex-shrink-0'>
                    {totalContactsData.count}
                  </Badge>
                )}
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
              <SidebarMenuButton asChild>
                <Link href='/contacts/groups/create' className='flex items-center w-full'>
                  <Plus className='w-4 h-4 mr-2' />
                  <span className='font-medium'>Create Group</span>
                </Link>
              </SidebarMenuButton>
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
            {groups?.map((group: Group) => (
              <SidebarMenuItem key={group.id}>
                <SidebarMenuButton
                  onClick={() => handleGroupSelect(group.id)}
                  isActive={selectedGroupId === group.id}
                  className='justify-between w-full'
                >
                  <div className='flex items-center gap-2 overflow-hidden'>
                    <span className='flex-shrink-0'>{group.emoji || '📁'}</span>
                    <span className='truncate group-data-[collapsible=icon]:hidden'>
                      {group.name}
                    </span>
                  </div>
                  <Badge
                    variant='secondary'
                    className='ml-auto group-data-[collapsible=icon]:hidden'
                    style={
                      group.color
                        ? {
                            borderColor: group.color,
                            backgroundColor: `${group.color}20`, // 20% opacity background
                            color: group.color,
                          }
                        : {}
                    }
                  >
                    {group.contactCount || group.memberCount || 0}
                  </Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
