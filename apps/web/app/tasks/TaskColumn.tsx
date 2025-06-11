'use client';

import { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Task } from './TaskCard';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: string;
  children: ReactNode;
}

export function TaskColumn({ title, tasks = [], status, children }: TaskColumnProps) {
  // Set up droppable area
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  // Column styles based on status
  const getColumnStyles = () => {
    const baseStyles = "bg-white rounded-lg shadow p-4";
    
    if (isOver) {
      return `${baseStyles} ring-2 ring-blue-400`;
    }
    
    return baseStyles;
  };

  // Header color based on status
  const getHeaderColor = () => {
    if (!status) return 'text-gray-600 border-gray-600';
    
    switch (status) {
      case 'todo':
        return 'text-blue-600 border-blue-600';
      case 'in-progress':
        return 'text-amber-600 border-amber-600';
      case 'done':
        return 'text-green-600 border-green-600';
      default:
        return 'text-gray-600 border-gray-600';
    }
  };

  return (
    <div className={getColumnStyles()} ref={setNodeRef}>
      <div className={`flex items-center justify-between mb-4 pb-2 border-b ${getHeaderColor()}`}>
        <h3 className="font-medium">{title}</h3>
        <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
          {Array.isArray(tasks) ? tasks.length : 0}
        </span>
      </div>
      
      <div className="space-y-2 min-h-[200px]">
        {children}
        
        {(!Array.isArray(tasks) || tasks.length === 0) && (
          <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}