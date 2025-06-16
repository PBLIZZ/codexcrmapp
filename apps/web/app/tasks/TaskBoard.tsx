'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskCard, Task, TaskStatus } from './TaskCard';
import { TaskColumn } from './TaskColumn';
import { api } from '@/lib/trpc';

interface TaskBoardProps {
  initialTasks: Task[];
  selectedCategory: string | null;
}

export function TaskBoard({ initialTasks, selectedCategory }: TaskBoardProps) {
  // State for tasks and active drag
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Update tasks when initialTasks changes
  useEffect(() => {
    if (initialTasks && Array.isArray(initialTasks)) {
      setTasks(initialTasks);
    }
  }, [initialTasks]);

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter tasks by status
  const todoTasks = tasks.filter(task => task.status === 'todo')
    .sort((a, b) => a.position - b.position);
  
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress')
    .sort((a, b) => a.position - b.position);
  
  const doneTasks = tasks.filter(task => task.status === 'done')
    .sort((a, b) => a.position - b.position);

  // Filter tasks by category if selected
  const filteredTodoTasks = selectedCategory 
    ? todoTasks.filter(task => task.category === selectedCategory)
    : todoTasks;
  
  const filteredInProgressTasks = selectedCategory
    ? inProgressTasks.filter(task => task.category === selectedCategory)
    : inProgressTasks;
  
  const filteredDoneTasks = selectedCategory
    ? doneTasks.filter(task => task.category === selectedCategory)
    : doneTasks;

  // Get task IDs for each column
  const todoIds = filteredTodoTasks.map(task => task.id);
  const inProgressIds = filteredInProgressTasks.map(task => task.id);
  const doneIds = filteredDoneTasks.map(task => task.id);

  // tRPC mutations
  const utils = api.useUtils();
  
  const updateTaskMutation = api.tasks.update.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
    },
  });
  
  const updatePositionsMutation = api.tasks.updatePositions.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
    },
  });
  
  const deleteTaskMutation = api.tasks.delete.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate();
    },
  });

  // Event handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    const draggedTask = tasks.find(task => task.id === active.id);
    if (draggedTask) {
      setActiveTask(draggedTask);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }

    // Find the containers (columns)
    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);
    
    if (!activeContainer || !overContainer) {
      return;
    }
    
    // If same container, we don't need to do anything here
    if (activeContainer === overContainer) {
      return;
    }

    // Moving to a different container
    setTasks(prev => {
      const activeIndex = findTaskIndex(prev, active.id as string);
      const overIndex = findTaskIndex(prev, over.id as string);
      
      if (activeIndex === -1) {
        return prev;
      }
      
      // Update the task's status based on the container it's moved to
      const updatedTasks = [...prev];
      const movedTask = { ...updatedTasks[activeIndex] };
      
      // Set the new status based on the container
      movedTask.status = getStatusFromContainer(overContainer);
      
      // Remove from original position and insert at new position
      updatedTasks.splice(activeIndex, 1);
      updatedTasks.splice(overIndex, 0, movedTask);
      
      // Update positions for all tasks in the affected containers
      return updatePositionsInContainers(updatedTasks, [activeContainer, overContainer]);
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setActiveTask(null);
      return;
    }
    
    // Find the containers
    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);
    
    if (!activeContainer || !overContainer) {
      setActiveId(null);
      setActiveTask(null);
      return;
    }
    
    // If moving within the same container
    if (activeContainer === overContainer) {
      const activeIndex = findTaskIndex(tasks, active.id as string);
      const overIndex = findTaskIndex(tasks, over.id as string);
      
      if (activeIndex !== overIndex) {
        setTasks(prev => {
          const updatedTasks = arrayMove(prev, activeIndex, overIndex);
          
          // Update positions for all tasks in the container
          return updatePositionsInContainer(updatedTasks, activeContainer);
        });
        
        // Prepare tasks for position update
        const tasksToUpdate = getTasksInContainer(tasks, activeContainer)
          .sort((a, b) => a.position - b.position)
          .map((task, index) => ({
            id: task.id,
            position: index + 1,
          }));
        
        if (tasksToUpdate.length > 0) {
          // Update positions in the database - pass array directly
          updatePositionsMutation.mutate(tasksToUpdate);
        }
      }
    } else {
      // If the task was moved to a different container, update its status in the database
      const taskId = active.id as string;
      const task = tasks.find(t => t.id === taskId);
      
      if (task) {
        const newStatus = getStatusFromContainer(overContainer);
        
        // Update the task status in the database
        updateTaskMutation.mutate({
          id: taskId,
          status: newStatus,
        });
        
        // Update positions for both containers
        const activeContainerTasks = getTasksInContainer(tasks, activeContainer)
          .sort((a, b) => a.position - b.position)
          .map((task, index) => ({
            id: task.id,
            position: index + 1,
          }));
        
        const overContainerTasks = getTasksInContainer(tasks, overContainer)
          .sort((a, b) => a.position - b.position)
          .map((task, index) => ({
            id: task.id,
            position: index + 1,
          }));
        
        const tasksToUpdate = [...activeContainerTasks, ...overContainerTasks];
        if (tasksToUpdate.length > 0) {
          // Update positions in the database - pass array directly
          updatePositionsMutation.mutate(tasksToUpdate);
        }
      }
    }
    
    setActiveId(null);
    setActiveTask(null);
  };

  // Helper functions
  const findContainer = (id: string) => {
    if (todoIds && todoIds.includes(id)) return 'todo';
    if (inProgressIds && inProgressIds.includes(id)) return 'in-progress';
    if (doneIds && doneIds.includes(id)) return 'done';
    return null;
  };

  const findTaskIndex = (tasks: Task[], id: string) => {
    if (!tasks || !Array.isArray(tasks)) return -1;
    return tasks.findIndex(task => task && task.id === id);
  };

  const getStatusFromContainer = (containerId: string): TaskStatus => {
    switch (containerId) {
      case 'todo': return TaskStatus.TODO;
      case 'in-progress': return TaskStatus.IN_PROGRESS;
      case 'done': return TaskStatus.DONE;
      default: return TaskStatus.TODO;
    }
  };

  const getContainerFromStatus = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.TODO: return 'todo';
      case TaskStatus.IN_PROGRESS: return 'in-progress';
      case TaskStatus.DONE: return 'done';
      default: return 'todo';
    }
  };

  const getTasksInContainer = (tasks: Task[], container: string) => {
    if (!tasks || !Array.isArray(tasks)) return [];
    return tasks.filter(task => task && task.status === getStatusFromContainer(container));
  };

  const updatePositionsInContainer = (tasks: Task[], container: string) => {
    const containerTasks = getTasksInContainer(tasks, container);
    const otherTasks = tasks.filter(task => task.status !== getStatusFromContainer(container));
    
    // Update positions for tasks in the container
    const updatedContainerTasks = containerTasks
      .sort((a, b) => {
        const aIndex = findTaskIndex(tasks, a.id);
        const bIndex = findTaskIndex(tasks, b.id);
        return aIndex - bIndex;
      })
      .map((task, index) => ({
        ...task,
        position: index + 1,
      }));
    
    return [...otherTasks, ...updatedContainerTasks];
  };

  const updatePositionsInContainers = (tasks: Task[], containerIds: string[]) => {
    const updatedTasks = [...tasks];
    
    // For each container, update the positions of its tasks
    containerIds.forEach(containerId => {
      const containerTasks = getTasksInContainer(updatedTasks, containerId);
      const sortedContainerTasks = [...containerTasks].sort((a, b) => a.position - b.position);
      
      // Update positions
      sortedContainerTasks.forEach((task, index) => {
        const taskIndex = updatedTasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            position: index + 1
          };
        }
      });
      if (containerId) {
        // Use the existing container tasks that were already sorted
        // No need to call updatePositionsInContainer again
      }
    });
    
    return updatedTasks;
  };

  // Task action handlers
  const handleEditTask = (taskId: string) => {
    if (!taskId) return;
    // This will be handled by the parent component via props
    console.log('Edit task:', taskId);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!taskId) return;
    
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        deleteTaskMutation.mutate({ id: taskId });
        
        // Optimistic update
        setTasks(prev => prev.filter(task => task && task.id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    if (!taskId || !newStatus) return;
    
    try {
      // Update task status
      updateTaskMutation.mutate({
        id: taskId,
        status: newStatus,
      });
      
      // Optimistic update
      setTasks(prev => {
        const taskIndex = prev.findIndex(task => task && task.id === taskId);
        if (taskIndex === -1) return prev;
        
        const updatedTasks = [...prev];
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          status: newStatus,
        };
        
        return updatePositionsInContainers(updatedTasks, ['todo', 'in-progress', 'done']);
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* To Do Column */}
        <TaskColumn 
          title="To Do" 
          tasks={filteredTodoTasks} 
          status="todo"
        >
          <SortableContext items={todoIds} strategy={verticalListSortingStrategy}>
            {filteredTodoTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </SortableContext>
        </TaskColumn>

        {/* In Progress Column */}
        <TaskColumn 
          title="In Progress" 
          tasks={filteredInProgressTasks} 
          status="in-progress"
        >
          <SortableContext items={inProgressIds} strategy={verticalListSortingStrategy}>
            {filteredInProgressTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </SortableContext>
        </TaskColumn>

        {/* Done Column */}
        <TaskColumn 
          title="Done" 
          tasks={filteredDoneTasks} 
          status="done"
        >
          <SortableContext items={doneIds} strategy={verticalListSortingStrategy}>
            {filteredDoneTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleStatusChange}
              />
            ))}
          </SortableContext>
        </TaskColumn>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId && activeTask ? (
          <TaskCard
            task={activeTask}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}