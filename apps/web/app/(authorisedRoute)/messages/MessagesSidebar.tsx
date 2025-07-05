'use client';

import { MessageSquare, Inbox, Send, Archive, Star, Users, Calendar, Settings } from "lucide-react";
import { UserNav } from "@/components/layout/UserNav";
import Link from "next/link";
import * as React from "react";
import { usePathname } from 'next/navigation';
import { Badge } from "@codexcrm/ui";
import {
  Sidebar,
  SidebarBody,
  SidebarContent,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarRoot,
  SidebarTrigger,
} from "@codexcrm/ui";

// Mock data for messages
const mockThreads = [
  { id: '1', contact: 'Sarah Johnson', lastMessage: 'Thanks for the session info...', unread: 3, timestamp: '2m ago', avatar: 'SJ' },
  { id: '2', contact: 'Mike Chen', lastMessage: 'When is my next appointment?', unread: 1, timestamp: '1h ago', avatar: 'MC' },
  { id: '3', contact: 'Emma Watson', lastMessage: 'The meditation session was amazing', unread: 0, timestamp: '3h ago', avatar: 'EW' },
  { id: '4', contact: 'David Brown', lastMessage: 'Can we reschedule for next week?', unread: 2, timestamp: '1d ago', avatar: 'DB' },
  { id: '5', contact: 'Lisa Park', lastMessage: 'Thank you for the yoga tips!', unread: 0, timestamp: '2d ago', avatar: 'LP' },
];

interface MessagesSidebarProps extends React.ComponentProps<typeof Sidebar> {}

export function MessagesSidebar(props: MessagesSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
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
        {/* Messages Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Messages</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/messages'}>
                <Link href={{ pathname: "/messages" }} className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Inbox className="w-4 h-4" />
                    <span>Inbox</span>
                  </div>
                  <Badge variant="secondary" className="h-5 flex-shrink-0">
                    6
                  </Badge>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={{ pathname: "/messages/sent" }} className="flex items-center w-full">
                  <Send className="w-4 h-4 mr-3" />
                  <span>Sent</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={{ pathname: "/messages/starred" }} className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4" />
                    <span>Starred</span>
                  </div>
                  <Badge variant="secondary" className="h-5 flex-shrink-0">
                    2
                  </Badge>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={{ pathname: "/messages/archived" }} className="flex items-center w-full">
                  <Archive className="w-4 h-4 mr-3" />
                  <span>Archived</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={{ pathname: "/messages/compose" }} className="flex items-center w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  <span>New Message</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={{ pathname: "/messages/broadcast" }} className="flex items-center w-full">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Send Broadcast</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={{ pathname: "/messages/schedule" }} className="flex items-center w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Schedule Message</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Recent Conversations */}
        <SidebarGroup>
          <SidebarGroupLabel>Recent Conversations</SidebarGroupLabel>
          <SidebarMenu>
            {mockThreads.map((thread) => (
              <SidebarMenuItem key={thread.id}>
                <SidebarMenuButton asChild className="h-auto p-2">
                  <Link href={{ pathname: `/messages/thread/${thread.id}` }} className="flex items-start w-full">
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                        {thread.avatar}
                      </div>
                      <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate">{thread.contact}</span>
                          {thread.unread > 0 && (
                            <Badge variant="default" className="h-5 text-xs ml-1">
                              {thread.unread}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {thread.lastMessage}
                        </p>
                        <span className="text-xs text-muted-foreground">{thread.timestamp}</span>
                      </div>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={{ pathname: "/messages/settings" }} className="flex items-center w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Message Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
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
