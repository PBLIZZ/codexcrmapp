'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Alert,
  AlertDescription,
  AlertTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@codexcrm/ui';
import { Check, Clock, X, AlertCircle, BrainCircuit } from 'lucide-react';
import { api } from '@/lib/trpc';

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

  // Try to fetch AI actions, but use mock data if the endpoint doesn't exist
  const {
    data: apiData,
    isLoading,
    error,
  } = api.dashboard.aiActionMetrics.useQuery(
    {},
    {
      retry: false,
    }
  );

  // Mock data to use when API endpoint is not available
  const mockData = {
    totalActions: aiTasks.length,
    pendingActions: aiTasks.filter((task) => task.status === 'pending').length,
    approvedActions: aiTasks.filter((task) => task.status === 'approved').length,
    rejectedActions: aiTasks.filter((task) => task.status === 'rejected').length,
  };

  // Use API data if available, otherwise use mock data
  const data = apiData || mockData;

  // Loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className='text-primary'>
          <CardTitle className='text-primary'>AI Task Delegation</CardTitle>
          <CardDescription className='text-muted-foreground'>Loading AI tasks...</CardDescription>
        </CardHeader>
        <CardContent className='text-primary'>
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
    if (error.message.includes('UNAUTHORIZED') || error.message.includes('logged in')) {
      return (
        <Card className={className}>
          <CardHeader className='text-primary'>
            <CardTitle className='text-primary'>AI Task Delegation</CardTitle>
          </CardHeader>
          <CardContent className='text-primary'>
            <Alert variant='destructive' className='text-primary'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle className='text-primary'>Authentication Required</AlertTitle>
              <AlertDescription className='text-primary'>
                Please sign in to view your AI tasks.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      );
    }

    // For other errors, show the standard error message
    return (
      <Card className={className}>
        <CardHeader className='text-primary'>
          <CardTitle className='text-primary'>AI Task Delegation</CardTitle>
        </CardHeader>
        <CardContent className='text-primary'>
          <Alert variant='destructive' className='text-primary'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle className='text-primary'>Error</AlertTitle>
            <AlertDescription className='text-primary'>
              Failed to load AI tasks: {error.message}
            </AlertDescription>
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
        return (
          <Badge variant='outline' className='text-primary'>
            {status}
          </Badge>
        );
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <Badge variant='outline' className='bg-red-100 text-red-800 hover:bg-red-100'>
            High
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant='outline' className='text-primary'>
            Medium
          </Badge>
        );
      case 'low':
        return (
          <Badge variant='outline' className='text-primary'>
            Low
          </Badge>
        );
      default:
        return (
          <Badge variant='outline' className='text-primary'>
            {priority}
          </Badge>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader className='text-primary'>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle className='text-primary'>AI Task Delegation</CardTitle>
            <CardDescription className='text-primary'>
              AI-suggested tasks requiring your approval
            </CardDescription>
          </div>
          <BrainCircuit className='h-6 w-6 text-primary' />
        </div>
      </CardHeader>
      <CardContent className='text-primary'>
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='pending' className='text-primary'>
              Pending
            </TabsTrigger>
            <TabsTrigger value='approved' className='text-primary'>
              Approved
            </TabsTrigger>
            <TabsTrigger value='all' className='text-primary'>
              All Tasks
            </TabsTrigger>
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
                          <Button
                            size='sm'
                            variant='outline'
                            className='h-8 px-2 bg-green-600 hover:bg-green-700'
                          >
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
          {data?.totalActions || 0} total AI tasks
        </div>
        <Button variant='outline' size='sm' className='text-primary'>
          View All Tasks
        </Button>
      </CardFooter>
    </Card>
  );
}
