"use client";

import { 
  AlertCircle, 
  ArrowLeft, 
  Check, 
  ChevronDown, 
  Edit, 
  Plus, 
  Search, 
  Tag, 
  Trash2, 
  Users, 
  Loader2 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/trpc";

// Define the Group interface to match the API response
interface Group {
  id: string;
  name: string;
  color?: string | null;
  emoji?: string | null;
  description?: string | null;
  contactCount?: number;
  created_at?: string;
  updated_at?: string;
}


// Contact Groups Page Component
export function ContactGroupsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-blue-500');
  const [error, setError] = useState<string | null>(null);
  
  const utils = api.useUtils(); // Get tRPC context for cache invalidation
  
  // Fetch groups using tRPC
  const {
    data: groupsData = [],
    isLoading,
    error: groupsError
  } = api.groups.list.useQuery();
  
  // Filter groups based on search term
  const filteredGroups = groupsData.filter((group: Group) => {
    if (!searchTerm) return true;
    return group.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Group creation mutation with explicit logging
  const createGroupMutation = api.groups.save.useMutation({
    onSuccess: (data) => {
      console.log("Group created successfully:", data);
      
      // Invalidate the groups list cache to refresh data
      utils.groups.list.invalidate();
      
      // Reset form and close dialog
      setNewGroupName('');
      setSelectedColor('bg-blue-500');
      setIsAddGroupOpen(false);
      setError(null);
    },
    onError: (error) => {
      console.error("Create Group Error:", error);
      setError(`Failed to create group: ${error.message}`);
    }
  });
  
  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      setError('Group name cannot be empty');
      return;
    }
    
    try {
      console.log("Attempting to create group with:", {
        name: newGroupName.trim(),
        color: selectedColor
      });
      
      // Call the tRPC mutation to create the new group
      await createGroupMutation.mutateAsync({
        name: newGroupName.trim(),
        color: selectedColor,
        emoji: null, // Optional emoji field
        description: null // Optional description field
      });
      
      // No need to force refetch as invalidate in onSuccess will trigger a refetch
    } catch (err) {
      console.error("Group creation failed:", err);
      setError(`Failed to create group: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-8">
        {/* Header with title, search and add button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contacts Groups</h1>
            <p className="text-muted-foreground mt-1">
              Organize your contacts into meaningful groups
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search groups..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Button onClick={() => setIsAddGroupOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Group
            </Button>
          </div>
        </div>
        
        {/* Error Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {groupsError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Groups</AlertTitle>
            <AlertDescription>{groupsError.message || 'Failed to fetch groups.'}</AlertDescription>
          </Alert>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading groups...</p>
          </div>
        )}
        
        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group: Group) => (
            <Card 
              key={group.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/contacts?group=${group.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge className={`${group.color || 'bg-blue-500'} hover:opacity-80`}>
                    {group.contactCount || 0} contacts
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={(e) => {
                    e.stopPropagation();
                    // Add edit functionality
                  }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-xl">{group.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Click to view all contacts in this group
                </p>
              </CardContent>
            </Card>
          ))}
          
          {/* Add Group Card */}
          <Card 
            className="border-dashed hover:border-muted-foreground/50 cursor-pointer flex flex-col items-center justify-center p-6"
            onClick={() => setIsAddGroupOpen(true)}
          >
            <div className="rounded-full bg-muted p-3">
              <Plus className="h-6 w-6" />
            </div>
            <h3 className="mt-3 font-medium">Add New Group</h3>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Create a new group to organize your contacts
            </p>
          </Card>
        </div>
        
        {/* Empty State - No Search Results */}
        {filteredGroups.length === 0 && searchTerm && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No groups found</h3>
            <p className="text-muted-foreground mt-1">
              Try a different search term or create a new group.
            </p>
            <Button className="mt-4" onClick={() => setIsAddGroupOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Group
            </Button>
          </div>
        )}
        
        {/* Empty State - No Groups Yet */}
        {!isLoading && groupsData.length === 0 && !searchTerm && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No groups yet</h3>
            <p className="text-muted-foreground mt-1">
              Get started by creating your first contact group.
            </p>
            <Button className="mt-4" onClick={() => setIsAddGroupOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Group
            </Button>
          </div>
        )}
        
        {/* Add Group Dialog using Shadcn Dialog component */}
        <Dialog open={isAddGroupOpen} onOpenChange={(isOpen) => {
          setIsAddGroupOpen(isOpen);
          // Reset form/error state when dialog closes
          if (!isOpen) {
            setNewGroupName('');
            setSelectedColor('bg-blue-500');
            setError(null);
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Group</DialogTitle>
              <DialogDescription>
                Create a new group to organize your contacts
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">Group Name</Label>
                <Input
                  id="groupName"
                  placeholder="Enter group name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Group Color</Label>
                <div className="flex flex-wrap gap-2">
                  {['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500'].map(color => (
                    <div 
                      key={color}
                      className={`w-8 h-8 rounded-full ${color} cursor-pointer hover:ring-2 hover:ring-offset-2 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddGroupOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddGroup}
                disabled={createGroupMutation.isLoading || !newGroupName.trim()}
              >
                {createGroupMutation.isLoading ? 'Creating...' : 'Create Group'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
