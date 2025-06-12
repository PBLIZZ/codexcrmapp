"use client"

import { Home, Calendar, BarChart, Users, Settings, Star } from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { UserNav } from "@/components/layout/UserNav"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarProvider,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

export function DashboardSidebar() {
  // Dashboard navigation data
  const navMainData = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [], // Empty for now, will be populated when we have secondary pages
    },
  ]

  // Favorites data
  const favoritesData = [
    {
      name: "Recent Contacts",
      url: "/contacts/recent",
      icon: Users,
    },
    {
      name: "Starred Items",
      url: "/starred",
      icon: Star,
    },
  ]

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="h-[calc(100vh-6rem)] sticky top-20 bg-white rounded-lg shadow-sm border">
      {/* Empty header */}
      <SidebarHeader />
      <SidebarContent>
        <NavMain items={navMainData} />
        <SidebarGroup>
          <SidebarGroupLabel>Favourites</SidebarGroupLabel>
          <NavProjects projects={favoritesData} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
      <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  )
}
