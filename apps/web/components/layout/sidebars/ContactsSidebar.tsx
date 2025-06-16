"use client"

import { Users, UserPlus, Upload, Plus } from "lucide-react" // Added Plus for consistency if needed, though GroupCreateDialog brings its own
import { GroupCreateDialog } from "@/components/groups/GroupCreateDialog";
import { UserNav } from "@/components/layout/UserNav"
import { api } from "@/lib/trpc"
import Link from "next/link"
import { cn } from "@/lib/utils"
import * as React from "react"
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Badge } from "@/components/ui/badge"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from "@/components/ui/sidebar"

// Define the Group type based on the expected structure
interface Group {
  id: string
  name: string
  emoji?: string
  memberCount?: number
  contactCount?: number
}

interface ContactsSidebarProps extends React.ComponentProps<typeof Sidebar> {}

export function ContactsSidebar(props: ContactsSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // This is the correct way to get the active group ID for styling
  const selectedGroupId = searchParams.get('group');
  
  // Fetch groups data with contact counts
  const { data: groupsData = [] } = api.groups.list.useQuery(undefined, {
    staleTime: 60000,
  });

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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <img src="/images/logo.png" alt="OmniCRM Logo" className="h-7" />
            <div className="flex flex-col">
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
        {/* Contacts Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Contacts</SidebarGroupLabel>
          <SidebarMenu>
            {/* All Contacts link */}
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={handleAllContactsSelect}
                isActive={pathname === '/contacts' && !selectedGroupId}
                tooltip="All Contacts"
              >
                <Users className="w-4 h-4 mr-3" />
                All Contacts
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Groups link */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/contacts/groups" className="flex items-center w-full">
                  <Users className="w-4 h-4 mr-3" />
                  <span className="font-medium">Groups</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Import link */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/contacts/import" className="flex items-center w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  <span className="font-medium">Import Contacts</span>
                </Link>
              </SidebarMenuButton>
              
            </SidebarMenuItem>
            <SidebarMenuItem>
              <GroupCreateDialog 
                triggerButtonLabel="Create Group"
                triggerButtonVariant="ghost" 
                triggerButtonClassName="w-full justify-start text-sm font-medium px-2 py-1.5"
              />
            </SidebarMenuItem>

          </SidebarMenu>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarMenu>
            {/* Manage Groups link */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="sm">
                <Link href={"/contacts/groups"} className="flex items-center w-full">
                  <span>Manage Groups</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* Create Group Dialog Trigger */}
            <SidebarMenuItem>
              <GroupCreateDialog 
                triggerButtonLabel="Create Group"
                triggerButtonVariant="ghost" 
                triggerButtonClassName="w-full justify-start text-sm font-medium px-2 py-1.5" // Classes to mimic SidebarMenuButton
              />
            </SidebarMenuItem>
          </SidebarMenu>
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
                  className="justify-between w-full"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="flex-shrink-0">{group.emoji || '📁'}</span>
                    <span className="truncate">{group.name}</span>
                  </div>
                    <Badge variant="secondary" className="ml-auto">
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
