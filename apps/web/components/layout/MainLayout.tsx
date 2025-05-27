"use client";

import {
  Users, 
  Home, 
  Calendar, 
  CheckSquare, 
  Settings, 
  PlusCircle, 
  Menu,
  UserPlus,
  FileText,
  Tag,
  Mail,
  Phone,
  MessageSquare,
  BarChart,
  Upload,
  User,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose 
} from "@/components/ui/sheet";
import { api } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/layout/AppSidebar";

// Define type for section paths
type SectionPath = "/dashboard" | "/contacts" | "/tasks" | "/calendar" | "/messages" | "/analytics";

// Define type for section colors
type SectionColorScheme = {
  accent: string;
  text: string;
  gradient: string;
  hoverBg: string;
  borderAccent: string;
};

// Section color schemes with brand colors: teal-400, orange-500, and teal-800
const sectionColors: Record<SectionPath, SectionColorScheme> = {
  "/dashboard": {
    accent: "bg-orange-500",
    text: "text-white",
    gradient: "bg-gradient-to-r from-orange-50 to-orange-100",
    hoverBg: "hover:bg-orange-600",
    borderAccent: "border-orange-500"
  },
  "/contacts": {
    accent: "bg-teal-400",
    text: "text-teal-800",
    gradient: "bg-gradient-to-r from-teal-50 to-teal-100",
    hoverBg: "hover:bg-teal-500",
    borderAccent: "border-teal-400"
  },
  "/tasks": {
    accent: "bg-teal-800",
    text: "text-white",
    gradient: "bg-gradient-to-r from-teal-700 to-teal-800",
    hoverBg: "hover:bg-teal-900",
    borderAccent: "border-teal-800"
  },
  "/calendar": {
    accent: "bg-orange-500",
    text: "text-white",
    gradient: "bg-gradient-to-r from-orange-400 to-orange-500",
    hoverBg: "hover:bg-orange-600",
    borderAccent: "border-orange-500"
  },
  "/messages": {
    accent: "bg-blue-500",
    text: "text-white",
    gradient: "bg-gradient-to-r from-blue-50 to-blue-100",
    hoverBg: "hover:bg-blue-600",
    borderAccent: "border-blue-500"
  },
  "/analytics": {
    accent: "bg-indigo-600",
    text: "text-white",
    gradient: "bg-gradient-to-r from-indigo-50 to-indigo-100",
    hoverBg: "hover:bg-indigo-700",
    borderAccent: "border-indigo-600"
  },
};

// Main navigation items
const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    disabled: false,
  },
  {
    title: "Contacts",
    href: "/contacts",
    icon: Users,
    disabled: false,
  },
  {
    title: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
    disabled: false,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
    disabled: false,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
    disabled: false,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart,
    disabled: false,
  },
];

// Define type for contextual action items
interface ContextualAction {
  title: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}

// Contextual actions for each section
const contextualActions: Record<SectionPath, ContextualAction[]> = {
  "/dashboard": [
    { title: "Add Contact", href: "/contacts?new=true", icon: UserPlus },
  ],
  "/contacts": [
    { title: "Add Contact", href: "/contacts?new=true", icon: UserPlus },
    { title: "Send Email", href: "#", icon: Mail, disabled: true },
    { title: "Call Contact", href: "#", icon: Phone, disabled: true },
  ],
  "/tasks": [
    { title: "Add Task", href: "#", icon: PlusCircle },
  ],
  "/calendar": [
    { title: "Add Event", href: "#", icon: PlusCircle },
  ],
  "/messages": [
    { title: "New Message", href: "#", icon: MessageSquare },
  ],
  "/analytics": [
    { title: "Export Report", href: "#", icon: FileText },
  ]
};

// Helper to get contextual actions for current path
const getContextualActions = (pathname: string): ContextualAction[] => {
  // Handle dynamic routes
  if (pathname.startsWith("/contacts/")) {
    return contextualActions["/contacts"];
  }

  // Default to using the root path
  for (const path of Object.keys(contextualActions) as SectionPath[]) {
    if (pathname === path || pathname.startsWith(`${path}/`)) {
      return contextualActions[path];
    }
  }

  // Fallback to dashboard actions
  return contextualActions["/dashboard"];
};

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  // Get current section title
  const getCurrentSectionTitle = () => {
    const currentItem = mainNavItems.find(item => 
      pathname === item.href || pathname.startsWith(`${item.href}/`)
    );
    return currentItem?.title || "Dashboard";
  };
  
  // Get current section colors
  const getCurrentSectionPath = (): SectionPath => {
    for (const item of mainNavItems) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        // Verify that the href is a valid SectionPath
        if (Object.keys(sectionColors).includes(item.href)) {
          return item.href as SectionPath;
        }
      }
    }
    return "/dashboard"; // Default
  };
  
  // This is now properly typed as SectionPath
  const currentSectionPath = getCurrentSectionPath();
  // This is now safe to use without type errors
  const currentSectionColors = sectionColors[currentSectionPath as keyof typeof sectionColors];
  
  // Get contextual actions for current section
  const currentContextualActions = getContextualActions(pathname);
  // Fetch user-created groups for sidebar when in Groups section or Contacts section
  // This will include contactCount for each group
  const { data: sidebarGroups, isLoading: isLoadingSidebarGroups } =
    api.groups.list.useQuery(undefined, { 
      enabled: currentSectionPath === '/contacts',
      staleTime: 30000, // Cache results for 30 seconds to reduce API calls
      // Add error handling
      onError: (error) => {
        console.error("Error fetching sidebar groups:", error);
      }
    });
    
  // Fetch total contacts count
  const { data: contactsData, isLoading: isLoadingContacts } =
    api.contacts.list.useQuery(undefined, { enabled: currentSectionPath === '/contacts' });
  
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b bg-white shadow-md">
        <div className="container flex h-16 items-center justify-between py-2">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center gap-2 md:gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="flex flex-col gap-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                      <img src="/images/logo.png" alt="OmniCRM" className="h-8" />
                      <div className="flex flex-col">
                        <span className="text-base font-bold text-teal-800">OmniCRM</span>
                        <span className="text-xs text-gray-600">by omnipotency AI</span>
                      </div>
                    </Link>
                  </div>
                  <nav className="flex flex-col gap-2">
                    {mainNavItems.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.disabled ? "#" : item.href}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                            pathname === item.href || pathname.startsWith(`${item.href}/`)
                              ? "bg-muted"
                              : "hover:bg-muted",
                            item.disabled && "pointer-events-none opacity-60"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.title}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2">
              <img src="/images/logo.png" alt="OmniCRM" className="h-8" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-teal-800">OmniCRM</span>
                <span className="text-xs text-gray-600">by Omnipotency ai</span>
              </div>
            </Link>
          </div>
          
          {/* Section Title (Mobile) */}
          <div className="md:hidden">
            <div className={`px-3 py-2 rounded-md font-semibold ${currentSectionColors.accent} ${currentSectionColors.text} shadow-sm`}>
              {getCurrentSectionTitle()}
            </div>
          </div>
          
          {/* Top Navigation Items */}
          <nav className="hidden md:flex items-center gap-6">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const sectionColor = sectionColors[item.href as SectionPath] || sectionColors["/dashboard"];
              
              return (
                <Link
                  key={item.href}
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium rounded-md px-3 py-1",
                    isActive 
                      ? `${sectionColor.accent} ${sectionColor.text} shadow-sm`
                      : `text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 hover:shadow-sm`,
                    item.disabled && "pointer-events-none opacity-60"
                  )}
                >
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden lg:inline">{item.title}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* User Menu and Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications/Mail Icon */}
            <Button variant="ghost" size="icon" className="relative text-muted-foreground">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            
            {/* System Settings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">System Settings</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>System Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/settings/general">General</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings/appearance">Appearance</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings/notifications">Notifications</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings/security">Security</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          
          {/* User Profile */}
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" />
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <Link href="/account">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Upload Photo</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <Link href="/sign-out">Sign out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>
      </header>
      
      {/* Main Content with Sidebar */}
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        {/* Sidebar (Desktop) */}
        <aside className={`fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block`}>
          <div className="h-full">
            {currentSectionPath === '/contacts' ? (
              /* Use the AppSidebar for Contacts section */
              <div className="h-full bg-gray-50 border-r">
                <AppSidebar 
                  totalContacts={contactsData?.length || 0}
                />
              </div>
            ) : (
              /* Use the standard sidebar for other sections */
              <div className={`h-full py-6 pr-6 lg:py-8 ${currentSectionColors.gradient}`}>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className={`text-sm font-medium px-3 py-2 rounded-md ${currentSectionColors.accent} ${currentSectionColors.text}`}>
                      {getCurrentSectionTitle()}
                    </h3>
                    <nav className="flex flex-col gap-2 mt-2">
                      {currentContextualActions.map((action: ContextualAction) => {
                        const ActionIcon = action.icon;
                        return (
                          <Link
                            key={action.title}
                            href={action.disabled ? "#" : action.href}
                            className={cn(
                              "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                              pathname === action.href
                                ? `bg-white/90 ${currentSectionColors.borderAccent} border-l-2 shadow-sm font-medium`
                                : "hover:bg-white/60",
                              action.disabled && "pointer-events-none opacity-60"
                            )}
                          >
                            <ActionIcon className="h-4 w-4" />
                            <span>{action.title}</span>
                          </Link>
                        );
                      })}
                    </nav>
                  </div>
                  <div className="flex flex-col gap-1 mt-6">
                    <h3 className="text-sm font-medium">Settings</h3>
                    <nav className="flex flex-col gap-2 mt-2">
                      <Link
                        href="/account"
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                          pathname === "/account" ? "bg-muted" : "hover:bg-muted"
                        )}
                      >
                        <Settings className="h-4 w-4" />
                        Account
                      </Link>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex w-full flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
