"use client";

import * as React from "react"; // Import React namespace
import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation"; // Combined useRouter
import { 
  ChevronRight, 
  Folder, 
  // Home, // Home was unused
  Settings, 
  Users, 
  // Calendar, // Calendar was unused
  // BarChart, // BarChart was unused
  // MessagesSquare, // MessagesSquare was unused
  // Star, // Star was unused
  PlusCircle,
  Upload,
  // X // X was unused
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarGroupLink } from "./SidebarGroupLink"; // Assuming this path is correct
import { QuickCreateGroupButton } from "@/components/groups/QuickCreateGroupButton"; // Assuming this path
import { api } from "@/lib/trpc";
import { AddContactModal } from '@/components/contacts/AddContactModal';

interface Group {
  id: string;
  name: string;
  emoji?: string;
  color?: string;
  contactCount?: number;
  // _count?: { // Keeping for reference if API still sends it, but prefer contactCount
  //   contacts: number;
  // };
}

interface ContactsSidebarProps {
  totalContacts?: number;
}

export function ContactsSidebar({ 
  totalContacts = 0
}: ContactsSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const utils = api.useUtils(); // Get tRPC utils

  const [isGroupsOpen, setIsGroupsOpen] = useState(true);
  const selectedGroupId = searchParams.get("group") || "";
  
  // Fetch groups data with contact counts
  const { data: groupsData = [] } = api.groups.list.useQuery(undefined, { // isLoadingGroups removed as not used
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
  
  const groups: Group[] = groupsData as Group[]; // Assert type if API returns it correctly
  
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };
  
  const secondaryNavItems = [
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  // Internal component for the "Add Contact" button and its modal logic
  function AddContactSidebarButton() {
    const [open, setOpen] = React.useState(false);

    const handleModalCloseAndRefresh = () => {
      setOpen(false);
      // Invalidate contacts list to show the new contact
      utils.contacts.list.invalidate();
      
      // Optional: Clear ?new=true from URL if it was used to open this
      const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
      if (currentParams.get('new') === 'true') {
        currentParams.delete('new');
        // Ensure pathname is defined, fallback if needed. router.pathname might not exist in app router directly
        router.replace(`${pathname}?${currentParams.toString()}`, { scroll: false });
      }
    };

    return (
      <>
        <Button
          onClick={() => setOpen(true)}
          className={cn(
            'w-full flex items-center gap-2 ml-2 px-3 py-2 rounded-md text-sm font-semibold shadow-md',
            'bg-gradient-to-r from-teal-400 to-orange-500 text-white border-0',
            'hover:from-teal-500 hover:to-orange-600',
            'focus:ring-2 focus:ring-orange-400 focus:outline-none',
            'justify-start' // Tailwind class for justify-content: flex-start;
          )}
          // No inline style prop needed here for justify-content
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
        <AddContactModal
          open={open}
          onOpenChange={setOpen}
          onContactAdded={handleModalCloseAndRefresh}
          showTriggerButton={false} // IMPORTANT: Tell modal not to show its own button
        />
      </>
    );
  }

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
              "flex items-center justify-between ml-2 px-3 py-2 rounded-md cursor-pointer text-sm w-full text-left", // Added text-left
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
          
          {/* Add Contact Modal Button */}
          <AddContactSidebarButton />
          
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
            <button className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-muted rounded-md w-full text-left"> {/* Changed to button */}
              <div className="flex items-center">
                <Folder className="w-4 h-4 mr-3" />
                <span className="font-medium">Groups</span>
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 transition-transform",
                isGroupsOpen && "transform rotate-90"
              )} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-1 space-y-1">
              {groups.length > 0 ? (
                groups.map((group) => ( // Removed : Group type hint here as it's inferred
                  <SidebarGroupLink key={group.id} group={group} />
                ))
              ) : (
                <div className="ml-2 px-3 py-2 text-sm text-muted-foreground">
                  No groups yet. Create your first group below.
                </div>
              )}
              
              <div className="ml-2 mb-1 mt-2"> {/* Added mt-2 for spacing */}
                <QuickCreateGroupButton />
              </div>
              
              <Link href="/groups" className="block ml-2">
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs text-muted-foreground pl-0"> {/* Adjusted padding */}
                  <span className="ml-2">Manage Groups</span>
                </Button>
              </Link>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      {/* Secondary Navigation (Settings) - Placed at the very bottom for common sidebar patterns */}
      <div className="mt-auto px-3 py-2 border-t"> {/* mt-auto pushes it to the bottom */}
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
                {item.icon && <item.icon className="w-4 h-4 mr-3" />} {/* Ensure icon exists */}
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}