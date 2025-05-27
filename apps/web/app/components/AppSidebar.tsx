"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ChevronRight, 
  Folder, 
  Home, 
  Settings, 
  Users, 
  Calendar,
  BarChart,
  MessagesSquare,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Group {
  id: string;
  name: string;
  count?: number;
  color?: string;
}

interface AppSidebarProps {
  groups: Group[];
  selectedGroupId?: string;
  onGroupSelect?: (groupId: string) => void;
}

export function AppSidebar({ 
  groups = [], 
  selectedGroupId = "", 
  onGroupSelect = () => {} 
}: AppSidebarProps) {
  const pathname = usePathname();
  const [isGroupsOpen, setIsGroupsOpen] = useState(true);
  
  // Helper function to check if a path is active
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };
  
  // Navigation items
  const mainNavItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/contacts", label: "Contacts", icon: Users },
    { href: "/messages", label: "Messages", icon: MessagesSquare },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/analytics", label: "Analytics", icon: BarChart },
  ];
  
  // Secondary navigation items
  const secondaryNavItems = [
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">CodexCRM</h2>
      </div>
      
      {/* Main Navigation */}
      <div className="px-3 py-2">
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
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
      
      {/* Groups Section */}
      <div className="px-3 py-2 border-t mt-2">
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
            <div className="mt-1 justify-betweenspace-y-1">
              <div
                className={cn(
                  "flex items-center justify-between ml-2 px-3 py-2 rounded-md cursor-pointer text-sm",
                  selectedGroupId === "" ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                )}
                onClick={() => onGroupSelect("")}
              >
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>All Contacts</span>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {groups.reduce((sum, group) => sum + (group.count || 0), 0)}
                </span>
              </div>
              
              {groups.map(group => (
                <div
                  key={group.id}
                  className={cn(
                    "flex items-center justify-between ml-2 px-3 py-2 rounded-md cursor-pointer text-sm",
                    selectedGroupId === group.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                  )}
                  onClick={() => onGroupSelect(group.id)}
                >
                  <div className="flex items-center">
                    <div 
                      className={cn(
                        "w-3 h-3 rounded-full mr-2",
                        group.color || "bg-gray-400"
                      )} 
                    />
                    <span>{group.name}</span>
                  </div>
                  <div className="flex items-right">
                    <span className="text-xs font-medium text-muted-foreground mr-1">
                      {group.count || 0}
                    </span>
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  </div>
                </div>
              ))}
              
              {/* Add Group Link */}
              <Link href="/groups" className="block ml-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-muted-foreground">
                  <span className="ml-6 text-teal-600 font-medium">Manage Groups</span>
                </Button>
              </Link>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      {/* Future sections can be added here */}
      <div className="px-3 py-2 border-t mt-2 hidden">
        <Collapsible>
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
          <div className="text-muted-foreground px-3 py-2 text-xs">No favorites yet.</div>
            {/* Favorites content will go here */}
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
