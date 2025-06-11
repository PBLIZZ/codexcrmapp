'use client';

import { useRef, useEffect, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { VirtualItem } from '@tanstack/react-virtual';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from './TaskCard';
import { ThingsTaskCard } from './ThingsTaskCard';

interface VirtualizedTaskListProps {
  tasks: Task[];
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
}

export function VirtualizedTaskList({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleComplete,
  isLoading = false,
  emptyState
}: VirtualizedTaskListProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [parentHeight, setParentHeight] = useState(0);
  const [taskHeights, setTaskHeights] = useState<Record<string, number>>({});
  const [removedTaskIds, setRemovedTaskIds] = useState<string[]>([]);

  // Update parent height on resize
  useEffect(() => {
    if (!parentRef.current) return;
    
    const updateHeight = () => {
      if (parentRef.current) {
        setParentHeight(parentRef.current.offsetHeight);
      }
    };
    
    updateHeight();
    
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(parentRef.current);
    
    return () => {
      if (parentRef.current) {
        resizeObserver.unobserve(parentRef.current);
      }
    };
  }, []);

  // Set up virtualizer
  const rowVirtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index: number) => {
      const task = tasks[index];
      return taskHeights[task.id] || 100; // Default height estimate
    },
    overscan: 5,
  });

  // Handle task deletion with animation
  const handleDelete = (taskId: string) => {
    setRemovedTaskIds(prev => [...prev, taskId]);
    
    // After animation completes, actually delete the task
    setTimeout(() => {
      onDelete(taskId);
      setRemovedTaskIds(prev => prev.filter(id => id !== taskId));
    }, 300);
  };

  // Handle task height measurement
  const measureTaskHeight = (taskId: string, height: number) => {
    if (taskHeights[taskId] !== height) {
      setTaskHeights(prev => ({
        ...prev,
        [taskId]: height
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2 max-w-3xl mx-auto">
        {Array.from({ length: 5 }).map((_, index) => (
          <div 
            key={index} 
            className="h-24 bg-gray-100 animate-pulse rounded-md"
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div 
      ref={parentRef} 
      className="max-w-3xl mx-auto overflow-auto"
      style={{ height: 'calc(100vh - 200px)' }}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        <AnimatePresence>
          {rowVirtualizer.getVirtualItems().map((virtualRow: VirtualItem) => {
            const task = tasks[virtualRow.index];
            const isBeingRemoved = removedTaskIds.includes(task.id);
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isBeingRemoved ? 0 : 1, 
                  y: isBeingRemoved ? -20 : 0,
                  height: isBeingRemoved ? 0 : 'auto'
                }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                onAnimationComplete={() => {
                  // Recalculate virtualizer after animations
                  rowVirtualizer.measure();
                }}
              >
                <div
                  ref={(el) => {
                    if (el) {
                      measureTaskHeight(task.id, el.getBoundingClientRect().height);
                    }
                  }}
                >
                  <ThingsTaskCard
                    task={task}
                    onEdit={onEdit}
                    onDelete={handleDelete}
                    onStatusChange={onStatusChange}
                    onToggleComplete={onToggleComplete}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}