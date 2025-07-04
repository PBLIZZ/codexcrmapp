"use client"

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { Route } from "next"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@codexcrm/ui/components/ui/dropdown-menu'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@codexcrm/ui/components/ui/sidebar'

// Define the structure for project items
export interface ProjectItem {
  id: string
  name: string
  url: string
  icon: LucideIcon
}

export function NavProjects({
  projects,
}: {
  projects: ProjectItem[]
}) {
  const { isMobile } = useSidebar()

  // Function to generate project URLs that open within the tasks module
  const getProjectUrl = (projectId: string): Route<string> => {
    return `/tasks?project=${projectId}` as Route<string>
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild tooltip={item.name}>
              <Link href={getProjectUrl(item.id)}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem asChild>
                  <Link href={getProjectUrl(item.id)}>
                    <Folder className="text-muted-foreground" />
                    <span>View Project</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/tasks/${item.id}/share` as Route<`/tasks/${string}/share`>}>
                    <Forward className="text-muted-foreground" />
                    <span>Share Project</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="text-sidebar-foreground/70">
            <Link href={"/tasks/new-project" as Route<"/tasks/new-project">}>
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>Create Project</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}