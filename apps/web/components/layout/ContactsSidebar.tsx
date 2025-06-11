"use client"

import { useState } from "react"
import { Users, UserPlus, Upload, PlusCircle, Tag, X } from "lucide-react"
import { NavUser } from "@/components/layout/nav-user"
import { api } from "@/lib/trpc"

// Define the Group type based on the expected structure
interface Group {
  id: string
  name: string
  emoji?: string
  memberCount?: number
}
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarProvider,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function ContactsSidebar() {
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState("🏷️")
  
  // Available emojis for group selection
  const emojis = ["🏷️", "🧘", "💆", "👑", "🆕", "💼", "🌟", "🔥", "💯", "🎯"]
  
  // Fetch groups from the database using tRPC
  const { data: fetchedGroups } = api.groups.list.useQuery()
  
  // Use fetched groups if available, otherwise use mock data
  const groups: Group[] = fetchedGroups || [
    { id: "1", name: "Yoga Enthusiasts", emoji: "🧘", memberCount: 12 },
    { id: "2", name: "Massage Clients", emoji: "💆", memberCount: 8 },
    { id: "3", name: "VIP Customers", emoji: "👑", memberCount: 5 },
    { id: "4", name: "New Clients", emoji: "🆕", memberCount: 3 },
  ]
  
  // Get the tRPC utils for cache invalidation
  const utils = api.useUtils();
  
  // Get the create group mutation
  const createGroupMutation = api.groups.save.useMutation({
    onSuccess: () => {
      // Invalidate the groups query to refetch the list
      utils.groups.list.invalidate();
      
      // Reset form and close dialog
      setNewGroupName("");
      setSelectedEmoji("🏷️");
      setIsCreateGroupOpen(false);
    },
    onError: (error) => {
      console.error("Error creating group:", error);
      // You could add error handling UI here
    }
  });
  
  // Handle group creation
  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      // Call the API to create the group
      createGroupMutation.mutate({
        name: newGroupName,
        emoji: selectedEmoji
      });
    }
  }
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="h-[calc(100vh-6rem)] sticky top-20 bg-white rounded-lg shadow-sm border">
        <SidebarHeader />
        <SidebarContent>
          {/* Contacts Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel>Contacts</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/contacts">
                    <Users />
                    <span>All Contacts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Groups link */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/groups">
                    <Users />
                    <span>Groups</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/contacts/import">
                    <Upload />
                    <span>Import Contacts</span>
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
                  <Link href="/contacts/new" className="flex items-center w-full">
                    <UserPlus />
                    <span>Add Contact</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setIsCreateGroupOpen(true)}>
                  <PlusCircle />
                  <span>Create New Group</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* Groups Section */}
          <SidebarGroup>
            <SidebarGroupLabel>Groups</SidebarGroupLabel>
            <SidebarMenu>
              {groups.map((group: Group) => (
                <SidebarMenuItem key={group.id}>
                  <SidebarMenuButton asChild>
                    <Link href={`/contacts?group=${group.id}`}>
                      <span className="mr-2">{group.emoji || "🏷️"}</span>
                      <span>{group.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {group.memberCount || 0}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      
      {/* Create Group Dialog */}
      <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Create a new group to organize your contacts. Choose an emoji and enter a name.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {emojis.map((emoji) => (
                <Button
                  key={emoji}
                  variant={selectedEmoji === emoji ? "default" : "outline"}
                  className="w-10 h-10 p-0 text-lg"
                  onClick={() => setSelectedEmoji(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="col-span-3"
                placeholder="Enter group name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateGroupOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateGroup}
              disabled={createGroupMutation.isPending || !newGroupName.trim()}
            >
              {createGroupMutation.isPending ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
