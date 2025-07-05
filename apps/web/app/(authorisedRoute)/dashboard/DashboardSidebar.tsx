'use client';

import * as React from 'react';
import Link from 'next/link';

// 1. Import the placeholder navigation components from the v0 block
// These will be replaced later with real, data-driven components.
import { NavMain } from '@/components/layout/QuickLinksNav';
import { NavProjects } from '@/components/layout/ProjectLinksNav';
// Import the types needed for the navigation components
import { NavItem } from '@/components/layout/QuickLinksNav';
import { ProjectItem } from '@/components/layout/ProjectLinksNav';

// 2. Import our existing, refactored UserNav component
import { UserNav } from '@/components/layout/UserNav';

// 3. Import the structural primitives from our sidebar system
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

import { Settings2, 
  Calendar, 
  CloudLightning, 
  BatteryFull, 
  NotebookPenIcon,
  Users,
  MessageSquare,
  TrendingUp,
  Megaphone,
  Hammer,
  FileText
 } from 'lucide-react';

// This is the demo data required by the placeholder nav components.
// We keep it here temporarily for the demo to function.
// In a real implementation, this data would be fetched or passed via props.

// Define your actual navigation structure
const quickLinksData: NavItem[] = [
  {
    title: "Quick Actions",
    url: "#",
    icon: CloudLightning,
    isActive: true,
    items: [
      {
        title: "Add Contact",
        url: "/contacts/new",
      },
      {
        title: "Create Group",
        url: "/contacts/groups/create", // Updated to use the new full-page form
      },
      {
        title: "Add Task",
        url: "/tasks/new",
      },
    ],
  },
  {
    title: "Business Goals",
    url: "#",
    icon: BatteryFull,
    items: [     
      {
      title: "📢 Content Calendar",       
      url: "#",       
      },
      {
      title: "🛠️ Workshops",       
      url: "#",       
      },
      {
      title: "🗓️ Plan Schedule",       
      url: "#",       
      },
    ],
  },
    {
    title: "Schedule",
    url: "#",
    icon: NotebookPenIcon,
    items: [
      {
        title: "📅 Next 5 Appointments",
        url: "/calendar/upcoming",
      },
      {
        title: "🚀 New Appointment",
        url: "/calendar/new",
      },
      {
        title: "📄 Add Quick Note",
        url: "/calendar/notes",
      },
      {
        title: "👍 See Next Free Slot",
        url: "/calendar/availability",
      },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings2,
    items: [
      {
        title: "🤖 Help",
        url: "/help",
      },
      {
        title: "⬆ Upgrade",
        url: "/billing/upgrade",
      },
      {
        title: "📞 Contact Support",
        url: "/support",
      },
      {
        title: "👤 Account Settings",
        url: "/settings/account",
      },
    ],
  },
];

// Example project data - in real app, this would come from your API/database
const projectsData: ProjectItem[] = [
  {
    id: "content-calendar",
    name: "Content Calendar",
    url: "/tasks?project=content-calendar",
    icon: Megaphone,
  },
  {
    id: "workshops",
    name: "Workshops",
    url: "/tasks?project=workshops",
    icon: Hammer,
  },
  {
    id: "client-onboarding",
    name: "Client Onboarding",
    url: "/tasks?project=client-onboarding",
    icon: Users,
  },
  {
    id: "quarterly-review",
    name: "Quarterly Review",
    url: "/tasks?project=quarterly-review",
    icon: FileText,
  },
];

// Hook to fetch projects from your API
function useProjects() {
  const [projects, setProjects] = React.useState<ProjectItem[]>(projectsData);
  const [loading, setLoading] = React.useState(false);

  // In a real app, you'd fetch from your API here
  React.useEffect(() => {
    // Example API call structure:
    // async function fetchProjects() {
    //   setLoading(true);
    //   try {
    //     const response = await fetch('/api/projects');
    //     const data: { navMain: NavItem[], projects: ProjectItem[] } = await response.json();
    //     setProjects(data.projects);
    //   } catch (error) {
    //     console.error('Failed to fetch projects:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // }
    // fetchProjects();
  }, []);

  return { projects, loading };
}

/**
 * DashboardSidebar provides the contextual navigation for the main dashboard area.
 */
export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { projects, loading } = useProjects();

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

      {/* The main scrollable content area of the sidebar */}
      <SidebarContent>
        {/* Quick Links Navigation */}
        <NavMain items={quickLinksData} />
        
        {/* Projects Navigation */}
        {!loading && <NavProjects projects={projects} />}
      </SidebarContent>

      {/* The footer is pinned to the bottom */}
      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
      <SidebarRail />
      </Sidebar>
  );
}
