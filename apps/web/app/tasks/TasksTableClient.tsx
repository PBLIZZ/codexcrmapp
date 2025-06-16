'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove,
  SortableContext, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Task } from './TaskCard';
import { TaskCard, TaskStatus, TaskPriority } from './TaskCard';
import { usePathname, useSearchParams } from 'next/navigation';
import { createRoute } from '@/lib/utils/routes';
import type { Route } from 'next';
import { api } from '@/lib/trpc/client';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TasksTableClientProps {
  initialTasks: Task[];
}

export default function TasksTableClient({ initialTasks }: TasksTableClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Set up DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // TRPC mutations - commented out until tRPC router is implemented
  // For now, we'll just update the local state
  /*
  const updateTaskMutation = api.tasks.update.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const deleteTaskMutation = api.tasks.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  */

  // Handle task editing
  const handleEditTask = (taskId: string) => {
    router.push(`/tasks/edit/${taskId}` as Route);
  };

  // Handle task deletion
  const handleDeleteTask = (taskId: string) => {
    // Temporarily just update the local state until tRPC is implemented
    // deleteTaskMutation.mutate({ id: taskId });
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Handle status change
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    // Temporarily just update the local state until tRPC is implemented
    // updateTaskMutation.mutate({ id: taskId, status: newStatus });
    
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  // Handle drag end for reordering tasks
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        const reorderedTasks = arrayMove(items, oldIndex, newIndex);
        
        // Update positions in database - commented out until tRPC is implemented
        /*
        reorderedTasks.forEach((task, index) => {
          updateTaskMutation.mutate({ 
            id: task.id, 
            position: index 
          });
        });
        */
        
        return reorderedTasks;
      });
    }
  };

  // Filter tasks based on search, status, and priority
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    // Filter by tab (view)
    if (activeTab === 'all') {
      return matchesSearch && matchesStatus && matchesPriority;
    } else if (activeTab === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const isDueToday = task.due_date && 
        new Date(task.due_date) >= today && 
        new Date(task.due_date) < tomorrow;
        
      return matchesSearch && matchesStatus && matchesPriority && isDueToday;
    } else if (activeTab === 'upcoming') {
      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const isUpcoming = task.due_date && new Date(task.due_date) >= tomorrow;
      return matchesSearch && matchesStatus && matchesPriority && isUpcoming;
    }
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Button onClick={() => router.push('/tasks/new' as Route)}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === 'all' ? 'All Tasks' : 
                 activeTab === 'today' ? 'Today\'s Tasks' : 'Upcoming Tasks'}
              </CardTitle>
              <CardDescription>
                {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredTasks.map(task => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={handleEditTask}
                          onDelete={handleDeleteTask}
                          onStatusChange={handleStatusChange}
                        />
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No tasks found. Create a new task to get started.
                      </div>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
