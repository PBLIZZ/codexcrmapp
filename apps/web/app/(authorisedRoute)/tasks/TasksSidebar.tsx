'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckSquare2, Calendar, Clock, Inbox, Star, 
  Sun, Moon, Book, Plus, FolderOpen, Target, 
  BarChart3, Settings, Zap, Users, Timer
} from 'lucide-react';
import { UserNav } from '@/components/layout/UserNav';
import { createRoute } from '@/lib/utils/routes';
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

// Mock data for active projects
const mockProjects = [
  { id: '1', name: 'Website Redesign', tasks: 12, progress: 75, color: 'bg-blue-500' },
  { id: '2', name: 'Product Launch', tasks: 8, progress: 45, color: 'bg-green-500' },
  { id: '3', name: 'Client Onboarding', tasks: 5, progress: 90, color: 'bg-purple-500' },
];

export function TasksSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Link href={createRoute("/")} className="flex items-center gap-2 font-semibold">
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
        {/* Task Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Task Management</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === '/tasks'}>
                <Link href={createRoute("/tasks")} className="flex items-center w-full">
                  <CheckSquare2 className="w-4 h-4 mr-3" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={createRoute("/tasks/inbox")} className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Inbox className="w-4 h-4" />
                    <span>Inbox</span>
                  </div>
                  <Badge variant="secondary" className="h-5 flex-shrink-0">
                    12
                  </Badge>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={createRoute("/tasks/today")} className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4" />
                    <span>Today</span>
                  </div>
                  <Badge variant="destructive" className="h-5 flex-shrink-0">
                    5
                  </Badge>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={createRoute("/tasks/upcoming")} className="flex items-center w-full">
                  <Calendar className="w-4 h-4 mr-3" />
                  <span>Upcoming</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={createRoute("/tasks/anytime")} className="flex items-center w-full">
                  <Sun className="w-4 h-4 mr-3" />
                  <span>Anytime</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={createRoute("/tasks/someday")} className="flex items-center w-full">
                  <Moon className="w-4 h-4 mr-3" />
                  <span>Someday</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={createRoute("/tasks/completed")} className="flex items-center w-full">
                  <Book className="w-4 h-4 mr-3" />
                  <span>Completed</span>
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
                <Link href={createRoute("/tasks/new")} className="flex items-center w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  <span>New Task</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={createRoute("/projects/new")} className="flex items-center w-full">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  <span>New Project</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={createRoute("/tasks/quick-capture")} className="flex items-center w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  <span>Quick Capture</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={createRoute("/tasks/time-tracker")} className="flex items-center w-full">
                  <Timer className="w-4 h-4 mr-2" />
                  <span>Time Tracker</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Active Projects */}
        <SidebarGroup>
          <SidebarGroupLabel>Active Projects</SidebarGroupLabel>
          <SidebarMenu>
            {mockProjects.map((project) => (
              <SidebarMenuItem key={project.id}>
                <SidebarMenuButton asChild className="h-auto p-2">
                  <Link href={createRoute(`/projects/${project.id}`)} className="flex items-start w-full">
                    <div className="flex items-center gap-2 w-full">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full ${project.color} mt-2`}></div>
                      <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate">{project.name}</span>
                          <Badge variant="outline" className="h-4 text-xs ml-1">
                            {project.tasks}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${project.color}`}
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground">{project.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Productivity Tools */}
        <SidebarGroup>
          <SidebarGroupLabel>Productivity</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={createRoute("/tasks/focus-mode")} className="flex items-center w-full">
                  <Target className="w-4 h-4 mr-2" />
                  <span>Focus Mode</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={createRoute("/tasks/pomodoro")} className="flex items-center w-full">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Pomodoro Timer</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={createRoute("/tasks/team")} className="flex items-center w-full">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Team Tasks</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={createRoute("/tasks/analytics")} className="flex items-center w-full">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  <span>Analytics</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href={createRoute("/tasks/settings")} className="flex items-center w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Task Settings</span>
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