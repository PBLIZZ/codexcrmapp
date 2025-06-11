'use client';

import { useState } from 'react';
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
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Task } from './TaskCard';
import { VirtualizedTaskList } from './VirtualizedTaskList';

interface DraggableTaskListProps {
  tasks: Task[];
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  onReorder: (tasks: Task[]) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
}

export function DraggableTaskList({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleComplete,
  onReorder,
  isLoading = false,
  emptyState
}: DraggableTaskListProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance before activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex(task => task.id === active.id);
      const newIndex = tasks.findIndex(task => task.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        // Create new array with reordered tasks
        const newTasks = arrayMove(tasks, oldIndex, newIndex);
        
        // Update positions
        const updatedTasks = newTasks.map((task, index) => ({
          ...task,
          position: index
        }));
        
        // Call onReorder with the updated tasks
        onReorder(updatedTasks);
      }
    }
    
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(event) => setActiveId(String(event.active.id))}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext
        items={tasks.map(task => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <VirtualizedTaskList
          tasks={tasks}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onToggleComplete={onToggleComplete}
          isLoading={isLoading}
          emptyState={emptyState}
        />
      </SortableContext>
    </DndContext>
  );
}