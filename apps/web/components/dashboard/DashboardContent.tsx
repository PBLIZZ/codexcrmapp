"use client";

import { useState } from 'react';
import { api } from '@/lib/trpc';
import Link from 'next/link';

// UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertCircle, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Plus, 
  Users,
  Activity,
  CheckSquare
} from "lucide-react";

// Helper function to get initials from name
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

// Format date helper
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch clients data
  const { data: clients, isLoading, error } = api.clients.list.useQuery();
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-current border-t-transparent text-primary"></div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Error loading dashboard data: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Calculate stats
  const totalClients = clients?.length || 0;
  const recentActivity = 5; // Mock data - replace with actual count
  const upcomingTasks = 3; // Mock data - replace with actual count
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your client management system
          </p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
              <p className="text-xs text-muted-foreground">
                {totalClients === 1 ? '1 client' : `${totalClients} clients`} in your CRM
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/clients" className="text-xs text-blue-600 hover:underline flex items-center">
                View all clients
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recent Activity
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentActivity}</div>
              <p className="text-xs text-muted-foreground">
                {recentActivity} activities in the last 7 days
              </p>
            </CardContent>
            <CardFooter>
              <Link href="#" className="text-xs text-blue-600 hover:underline flex items-center">
                View activity log
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Upcoming Tasks
              </CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingTasks}</div>
              <p className="text-xs text-muted-foreground">
                {upcomingTasks} tasks scheduled for this week
              </p>
            </CardContent>
            <CardFooter>
              <Link href="#" className="text-xs text-blue-600 hover:underline flex items-center">
                View all tasks
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        {/* Tabs for different dashboard sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recent">Recent Clients</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 space-y-2" asChild>
                  <Link href="/clients">
                    <Users className="h-6 w-6 mb-2" />
                    <span>View Clients</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 space-y-2" asChild>
                  <Link href="/clients?new=true">
                    <Plus className="h-6 w-6 mb-2" />
                    <span>Add Client</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 space-y-2" asChild>
                  <Link href="/groups">
                    <Users className="h-6 w-6 mb-2" />
                    <span>Manage Groups</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto flex flex-col items-center justify-center p-4 space-y-2" disabled>
                  <Calendar className="h-6 w-6 mb-2" />
                  <span>Schedule Task</span>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  Current system information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Database</span>
                  <span className="text-sm text-green-600">Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">API</span>
                  <span className="text-sm text-green-600">Operational</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Last Backup</span>
                  <span className="text-sm">Today, 03:45 AM</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Recent Clients Tab */}
          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Recent Clients</CardTitle>
                  <CardDescription>
                    Your most recently added clients
                  </CardDescription>
                </div>
                <Button asChild>
                  <Link href="/clients?new=true">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Client
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {clients && clients.length > 0 ? (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-1 divide-y">
                      {clients.slice(0, 5).map((client: any) => (
                        <Link 
                          key={client.id} 
                          href={`/clients/${client.id}`}
                          className="flex items-center p-4 hover:bg-muted/50 transition-colors"
                        >
                          <Avatar className="h-10 w-10 mr-4">
                            {client.avatar_url ? (
                              <AvatarImage src={client.avatar_url} alt={`${client.first_name} ${client.last_name}`} />
                            ) : null}
                            <AvatarFallback>{getInitials(client.first_name, client.last_name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {client.first_name} {client.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {client.email}
                            </p>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(client.created_at)}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No clients found</h3>
                    <p className="text-muted-foreground mt-1">
                      Get started by adding your first client.
                    </p>
                    <Button className="mt-4" asChild>
                      <Link href="/clients?new=true">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Client
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/clients">
                    View All Clients
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest actions and system events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-px bg-muted-foreground/20"></div>
                  <div className="space-y-6 ml-6">
                    {/* Mock activity items - replace with actual data */}
                    <div className="relative">
                      <div className="absolute -left-9 top-1 h-4 w-4 rounded-full bg-primary"></div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Client Added</p>
                        <p className="text-sm text-muted-foreground">
                          You added a new client: Jane Smith
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Today, 10:30 AM
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-9 top-1 h-4 w-4 rounded-full bg-primary"></div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Client Updated</p>
                        <p className="text-sm text-muted-foreground">
                          You updated client details: John Doe
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Yesterday, 3:45 PM
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-9 top-1 h-4 w-4 rounded-full bg-primary"></div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">System Update</p>
                        <p className="text-sm text-muted-foreground">
                          System backup completed successfully
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Yesterday, 1:15 AM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" disabled>
                  View Full Activity Log
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
