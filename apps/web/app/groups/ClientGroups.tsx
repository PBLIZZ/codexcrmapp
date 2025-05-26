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
  Users 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/trpc";


// Client Groups Component
export function ClientGroups() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Mock data for groups - replace with actual API call
  const groups = [
    { id: '1', name: 'VIP Clients', count: 12, color: 'bg-blue-500' },
    { id: '2', name: 'New Leads', count: 8, color: 'bg-green-500' },
    { id: '3', name: 'Inactive', count: 5, color: 'bg-yellow-500' },
    { id: '4', name: 'Potential Referrals', count: 3, color: 'bg-purple-500' },
    { id: '5', name: 'Follow Up', count: 7, color: 'bg-pink-500' },
  ];

  // Filter groups based on search term
  const filteredGroups = groups.filter(group => {
    if (!searchTerm) return true;
    return group.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAddGroup = () => {
    if (!newGroupName.trim()) {
      setError('Group name cannot be empty');
      return;
    }
    
    // Here you would call your API to create a new group
    console.warn('Creating new group:', newGroupName);
    
    // Reset form and close dialog
    setNewGroupName('');
    setIsAddGroupOpen(false);
    setError(null);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-8">
        {/* Header with title, search and add button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Client Groups</h1>
            <p className="text-muted-foreground mt-1">
              Organize your clients into meaningful groups
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
        
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map(group => (
            <Card 
              key={group.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/clients?group=${group.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge className={`${group.color} hover:${group.color}`}>
                    {group.count} clients
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
                  Click to view all clients in this group
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
              Create a new group to organize your clients
            </p>
          </Card>
        </div>
        
        {/* Empty State */}
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
        
        {/* Add Group Dialog */}
        {isAddGroupOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Add New Group</CardTitle>
                <CardDescription>
                  Create a new group to organize your clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                          className={`w-8 h-8 rounded-full ${color} cursor-pointer hover:ring-2 hover:ring-offset-2`}
                          onClick={() => {/* Set selected color */}}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => {
                  setIsAddGroupOpen(false);
                  setNewGroupName('');
                  setError(null);
                }}>
                  Cancel
                </Button>
                <Button onClick={handleAddGroup}>
                  Create Group
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
