'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@codexcrm/ui';
import { Button } from '@codexcrm/ui';
import { Badge } from '@codexcrm/ui';
import { Check, Clock, X, AlertCircle, BrainCircuit } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@codexcrm/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@codexcrm/ui';

interface AiTaskPanelProps {
  className?: string;
}

export function AiTaskPanel({ className }: AiTaskPanelProps) {
  const [activeTab, setActiveTab] = React.useState('pending');

  // Mock AI tasks data (would come from the API in a real implementation)
  const aiTasks = [
    {
      id: '1',
      title: 'Follow up with Jane Smith',
      description: 'Client has not responded to last 3 emails. Consider a phone call to re-engage.',
      status: 'pending',
      priority: 'high',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      id: '2',
      title: 'Schedule quarterly review with John Doe',
      description: 'Client is due for quarterly wellness check-in to assess progress on goals.',
      status: 'pending',
      priority: 'medium',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      id: '3',
      title: 'Create personalized meal plan for Sarah Johnson',
      description: 'Based on recent session notes, client needs updated nutrition guidance.',
      status: 'approved',
      priority: 'medium',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    },
    {
      id: '4',
      title: 'Send workshop invitation to at-risk clients',
      description:
        'Identify clients with low engagement and invite them to upcoming stress management workshop.',
      status: 'rejected',
      priority: 'low',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    },
    {
      id: '5',
      title: 'Update client progress report for Michael Brown',
      description:
        'Client has reached several milestones. Update progress report and share achievements.',
      status: 'approved',
      priority: 'high',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
    },
  ];

  // Mock data to use when API endpoint is not available
  const mockData = {
    totalActions: aiTasks.length,
    pendingActions: aiTasks.filter((task) => task.status === 'pending').length,
    approvedActions: aiTasks.filter((task) => task.status === 'approved').length,
    rejectedActions: aiTasks.filter((task) => task.status === 'rejected').length,
  };

  // Since we are using mock data, isLoading is always false and there is no error
  const isLoading = false;
  const error: Error | null = null;

  // Use mock data
  const data = mockData;

  // Loading state (will not be entered as isLoading is false)
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>AI Task Delegation</CardTitle>
          <CardDescription>Loading AI tasks...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex justify-center items-center h-40'>
            <div className='animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent'></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state - handle authentication errors gracefully
  if (error) {
    // If it's an authentication error, show a more user-friendly message
    if (error.message.includes('UNAUTHORIZED') ?? error.message.includes('logged in')) {
      return (
        <Card className={className}>
          <CardHeader>
            <CardTitle>AI Task Delegation</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>Please sign in to view your AI tasks.</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      );
    }

    // For other errors, show the standard error message
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>AI Task Delegation</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Failed to load AI tasks: {error.message}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Filter tasks based on active tab
  const filteredTasks = aiTasks.filter((task) => {
    if (activeTab === 'all') return true;
    return task.status === activeTab;
  });

  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant='outline' className='bg-amber-50 text-amber-700 border-amber-200'>
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant='outline' className='bg-green-50 text-green-700 border-green-200'>
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant='outline' className='bg-red-50 text-red-700 border-red-200'>
            Rejected
          </Badge>
        );
      default:
        return <Badge variant='outline'>{status}</Badge>;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className='bg-red-100 text-red-800 hover:bg-red-100'>High</Badge>;
      case 'medium':
        return <Badge className='bg-blue-100 text-blue-800 hover:bg-blue-100'>Medium</Badge>;
      case 'low':
        return <Badge className='bg-gray-100 text-gray-800 hover:bg-gray-100'>Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>AI Task Delegation</CardTitle>
            <CardDescription>AI-suggested tasks requiring your approval</CardDescription>
          </div>
          <BrainCircuit className='h-6 w-6 text-primary' />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='pending'>Pending</TabsTrigger>
            <TabsTrigger value='approved'>Approved</TabsTrigger>
            <TabsTrigger value='all'>All Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className='mt-4'>
            {filteredTasks.length > 0 ? (
              <div className='space-y-4'>
                {filteredTasks.map((task) => (
                  <div key={task.id} className='border rounded-lg p-4 space-y-2'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <h3 className='font-medium'>{task.title}</h3>
                        <p className='text-sm text-muted-foreground mt-1'>{task.description}</p>
                      </div>
                      <div className='flex items-center space-x-2'>
                        {getPriorityBadge(task.priority)}
                        {getStatusBadge(task.status)}
                      </div>
                    </div>
                    <div className='flex items-center justify-between pt-2'>
                      <div className='flex items-center text-xs text-muted-foreground'>
                        <Clock className='h-3 w-3 mr-1' />
                        {formatDate(task.createdAt)}
                      </div>
                      {task.status === 'pending' && (
                        <div className='flex items-center space-x-2'>
                          <Button size='sm' variant='outline' className='h-8 px-2 text-red-600'>
                            <X className='h-4 w-4 mr-1' />
                            Reject
                          </Button>
                          <Button size='sm' className='h-8 px-2 bg-green-600 hover:bg-green-700'>
                            <Check className='h-4 w-4 mr-1' />
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-8 text-center'>
                <BrainCircuit className='h-12 w-12 text-muted-foreground mb-4' />
                <h3 className='text-lg font-medium'>
                  No {activeTab !== 'all' ? activeTab : ''} tasks found
                </h3>
                <p className='text-muted-foreground mt-1'>
                  {activeTab === 'pending'
                    ? 'No pending tasks requiring your approval.'
                    : activeTab === 'approved'
                    ? 'No approved tasks yet.'
                    : 'No AI tasks available.'}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className='flex justify-between'>
        <div className='text-sm text-muted-foreground'>
          {data?.totalActions ?? 0} total AI tasks
        </div>
        <Button variant='outline' size='sm'>
          View All Tasks
        </Button>
      </CardFooter>
    </Card>
  );
}
