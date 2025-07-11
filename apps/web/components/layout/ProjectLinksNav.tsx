'use client';

import { Folder, Forward, MoreHorizontal, Trash2, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Route } from 'next';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@codexcrm/ui';

// Define the structure for project items
export interface ProjectItem {
  id: string;
  name: string;
  url: string;
  icon: LucideIcon;
}

export function NavProjects({ projects }: { projects: ProjectItem[] }) {
  const { isMobile } = useSidebar();

  // Function to generate project URLs that open within the tasks module
  const getProjectUrl = (projectId: string): Route<string> => {
    return `/tasks?project=${projectId}` as Route<string>;
  };

  return (
    <SidebarGroup className='mt-2'>
      <SidebarGroupLabel className='text-sm font-semibold text-sidebar-foreground'>
        Projects
      </SidebarGroupLabel>
      <SidebarMenu className='mt-2'>
        {projects.map((item) => (
          <SidebarMenuItem className='text-sidebar-foreground/70' key={item.id}>
            <SidebarMenuButton
              inset
              className='text-sidebar-foreground/70'
              asChild
              tooltip={item.name}
            >
              <Link href={getProjectUrl(item.id)}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction className='text-sidebar-foreground/70' showOnHover>
                  <MoreHorizontal />
                  <span className='sr-only'>More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-48 rounded-lg'
                side={isMobile ? 'bottom' : 'right'}
                align={isMobile ? 'end' : 'start'}
              >
                <DropdownMenuItem inset className='text-sidebar-foreground/70' asChild>
                  <Link href={getProjectUrl(item.id)}>
                    <Folder />
                    <span>View Project</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem inset className='text-sidebar-foreground/70' asChild>
                  <Link href={`/tasks/${item.id}/share` as Route<`/tasks/${string}/share`>}>
                    <Forward />
                    <span>Share Project</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className='my-2' />
                <DropdownMenuItem inset className='text-red-500 hover:text-red-600' asChild>
                  <Trash2 />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem className='mt-2'>
          <SidebarMenuButton
            inset
            asChild
            tooltip='Create Project'
            className='text-sidebar-foreground/70'
          >
            <Link href={'/tasks/new-project' as Route<'/tasks/new-project'>}>
              <MoreHorizontal />
              <span>Create Project</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
