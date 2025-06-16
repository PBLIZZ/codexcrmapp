"use client"

import { useState } from "react"
import { Users, UserPlus, Upload } from "lucide-react"
import { UserNav } from "@/components/layout/UserNav"
import { api } from "@/lib/trpc"
import Link from "next/link"
import { cn } from "@/lib/utils"
import * as React from "react"
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
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

interface ContactsSidebarProps extends React.ComponentProps<typeof Sidebar> {
  selectedGroupId?: string | null;
  onGroupSelect?: (groupId: string | null) => void;
}

export function ContactsSidebar({ 
  selectedGroupId, 
  onGroupSelect,
  ...props 
}: ContactsSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const utils = api.useUtils();
  
  const [isGroupsOpen, setIsGroupsOpen] = useState(true);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  
  // Fetch contacts for count
  const { data: contacts = [] } = api.contacts.list.useQuery(
    {
      search: "",
      groupId: undefined,
    },
    {
      staleTime: 30000,
      refetchOnWindowFocus: false,
    }
  );
  
  const totalContacts = contacts.length;

  // Fetch groups data with contact counts
  const { data: groupsData = [] } = api.groups.list.useQuery(undefined, {
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const groups: Group[] = groupsData as Group[];

  // Handler for group selection
  const handleGroupSelect = (groupId: string) => {
    if (onGroupSelect) {
      onGroupSelect(groupId);
    }
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
              <SidebarMenuButton asChild>
                <Link href="/contacts" className="flex items-center w-full">
                  <Users className="w-4 h-4 mr-3" />
                  <span className="font-medium">Contacts</span>
                </Link>
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
            {/* Create Group link */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/contacts/groups/new" className="flex items-center w-full">
                  <UserPlus />
                  <span>Create Group</span>
                </Link>
              </SidebarMenuButton>
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
                  asChild 
                  isActive={selectedGroupId === group.id}
                >
                  <button
                    onClick={() => handleGroupSelect(group.id)}
                    className="flex items-center justify-between w-full"
                  >
                    <div className="flex items-center">
                      <span className="mr-2">{group.emoji || '📁'}</span>
                      <span>{group.name}</span>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      {group.contactCount || group.memberCount || 0}
                    </Badge>
                  </button>
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
