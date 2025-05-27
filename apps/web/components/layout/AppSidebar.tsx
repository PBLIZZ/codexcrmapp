"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { 
  ChevronRight, 
  Folder, 
  Home, 
  Settings, 
  Users, 
  Calendar,
  BarChart,
  MessagesSquare,
  Star,
  PlusCircle,
  Upload,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarGroupLink } from "./SidebarGroupLink";
import { useRouter } from "next/navigation";
import { QuickCreateGroupButton } from "@/components/groups/QuickCreateGroupButton";
import { api } from "@/lib/trpc";

interface Group {
  id: string;
  name: string;
  emoji?: string;
  color?: string;
  contactCount?: number;
  _count?: {
    contacts: number;
  };
}

interface AppSidebarProps {
  totalContacts?: number;
}

export function AppSidebar({ 
  totalContacts = 0
}: AppSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isGroupsOpen, setIsGroupsOpen] = useState(true);
  
  const selectedGroupId = searchParams.get("group") || "";
  
  // Fetch groups data with contact counts
  const { data: groupsData = [], isLoading: isLoadingGroups } = api.groups.list.useQuery(undefined, {
    staleTime: 30000, // Cache for 30 seconds
    refetchOnWindowFocus: false,
  });
  
  // Use loaded groups data
  const groups = groupsData;
  
  // Helper function to check if a path is active
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };
  
  // Secondary navigation items
  const secondaryNavItems = [
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="h-full flex flex-col">
      
      {/* Contacts Section */}
      <div className="px-3 py-4 mt-2">
        <div className="flex items-center justify-between px-3 py-2 text-sm">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-3" />
            <span className="font-medium">Contacts</span>
          </div>
        </div>
        <div className="mt-1 space-y-1">
          <button
            className={cn(
              "flex items-center justify-between ml-2 px-3 py-2 rounded-md cursor-pointer text-sm w-full",
              !selectedGroupId ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
            )}
            onClick={() => {
              router.push("/contacts");
            }}
          >
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>All Contacts</span>
            </div>
            <Badge variant="secondary" className="ml-auto">
              {totalContacts}
            </Badge>
          </button>
          
          {/* Add Contact Link */}
          <Link href="/contacts?new=true" className="block ml-2">
            <div className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-muted text-muted-foreground">
              <PlusCircle className="w-4 h-4 mr-2" />
              <span>Add Contact</span>
            </div>
          </Link>
          
          {/* Import Contacts Link */}
          <Link href="/contacts/import" className="block ml-2">
            <div className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-muted text-muted-foreground">
              <Upload className="w-4 h-4 mr-2" />
              <span>Import Contacts</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Groups Section */}
      <div className="px-3 py-2 border-t mt-4">
        <Collapsible open={isGroupsOpen} onOpenChange={setIsGroupsOpen}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-muted rounded-md">
              <div className="flex items-center">
                <Folder className="w-4 h-4 mr-3" />
                <span className="font-medium">Groups</span>
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 transition-transform",
                isGroupsOpen && "transform rotate-90"
              )} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-1 space-y-1">
              {groups.length > 0 ? (
                groups.map((group: Group) => (
                  <SidebarGroupLink key={group.id} group={group} />
                ))
              ) : (
                <div className="ml-2 px-3 py-2 text-sm text-muted-foreground">
                  No groups yet. Create your first group below.
                </div>
              )}
              
              {/* Quick Create Group Button - Direct DB insertion */}
              <div className="ml-2 mb-1">
                <QuickCreateGroupButton />
              </div>
              
              {/* Manage Groups Link */}
              <Link href="/groups" className="block ml-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-muted-foreground">
                  <span className="ml-2">Manage Groups</span>
                </Button>
              </Link>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      {/* Secondary Navigation */}
      <div className="px-3 py-2 border-t mt-auto mb-4">
        <nav className="space-y-1">
          {secondaryNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
      </div>
      
      {/* Future sections can be added here */}
      <div className="px-3 py-2 hidden">
        <Collapsible defaultOpen={false}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-muted rounded-md">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-3" />
                <span className="font-medium">Favorites</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-1 pl-7 text-sm text-muted-foreground">
              {/* Favorites content will go here */}
              <div className="py-1">No favorites yet</div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      {/* Secondary Navigation - Bottom */}
      <div className="mt-auto px-3 py-2 border-t">
        <nav className="space-y-1">
          {secondaryNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
