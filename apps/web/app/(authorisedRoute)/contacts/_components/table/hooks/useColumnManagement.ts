import { useState, useCallback, useEffect } from 'react';
import type { ColumnManagementHook, TableState } from '@/app/(authorisedRoute)/contacts/_components/table/types';
import { DEFAULT_COLUMN_ORDER } from '@/app/(authorisedRoute)/contacts/_components/table/constants';

interface UseColumnManagementProps {
  initialVisibleColumns: string[];
  initialSortField: string;
  initialSortDirection: 'asc' | 'desc';
  onSortChange: (field: string) => void;
}

/**
 * Custom hook for managing column visibility, ordering, sorting, and drag & drop
 */
export function useColumnManagement({
  initialVisibleColumns,
  initialSortField,
  initialSortDirection,
  onSortChange,
}: UseColumnManagementProps): ColumnManagementHook {
  
  const [tableState, setTableState] = useState<TableState>({
    sortField: initialSortField,
    sortDirection: initialSortDirection,
    visibleColumns: initialVisibleColumns,
    columnOrder: DEFAULT_COLUMN_ORDER,
    draggedColumn: null,
    isDragging: false,
  });

  // Update state when props change
  useEffect(() => {
    setTableState(prev => ({
      ...prev,
      sortField: initialSortField,
      sortDirection: initialSortDirection,
      visibleColumns: initialVisibleColumns,
    }));
  }, [initialSortField, initialSortDirection, initialVisibleColumns]);

  const handleSortChange = useCallback((field: string) => {
    setTableState(prev => {
      const newDirection = 
        prev.sortField === field && prev.sortDirection === 'asc' ? 'desc' : 'asc';
      
      return {
        ...prev,
        sortField: field,
        sortDirection: newDirection,
      };
    });
    
    onSortChange(field);
  }, [onSortChange]);

  const handleColumnToggle = useCallback((columnId: string) => {
    setTableState(prev => ({
      ...prev,
      visibleColumns: prev.visibleColumns.includes(columnId)
        ? prev.visibleColumns.filter(col => col !== columnId)
        : [...prev.visibleColumns, columnId],
    }));
  }, []);

  const handleColumnReorder = useCallback((fromIndex: number, toIndex: number) => {
    setTableState(prev => {
      const newOrder = [...prev.columnOrder];
      const [movedColumn] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, movedColumn);
      
      return {
        ...prev,
        columnOrder: newOrder,
      };
    });
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent, columnId: string) => {
    e.dataTransfer.setData('text/plain', columnId);
    e.dataTransfer.effectAllowed = 'move';
    
    setTableState(prev => ({
      ...prev,
      draggedColumn: columnId,
      isDragging: true,
    }));

    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    // Add visual feedback for drop zone
    if (e.currentTarget instanceof HTMLElement && tableState.draggedColumn !== columnId) {
      e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    }
  }, [tableState.draggedColumn]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Remove visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.backgroundColor = '';
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    const draggedColumnId = e.dataTransfer.getData('text/plain');
    
    if (draggedColumnId && draggedColumnId !== targetColumnId) {
      setTableState(prev => {
        const currentOrder = prev.columnOrder;
        const fromIndex = currentOrder.indexOf(draggedColumnId);
        const toIndex = currentOrder.indexOf(targetColumnId);
        
        if (fromIndex !== -1 && toIndex !== -1) {
          const newOrder = [...currentOrder];
          const [movedColumn] = newOrder.splice(fromIndex, 1);
          newOrder.splice(toIndex, 0, movedColumn);
          
          return {
            ...prev,
            columnOrder: newOrder,
          };
        }
        
        return prev;
      });
    }

    // Remove visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.backgroundColor = '';
    }
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setTableState(prev => ({
      ...prev,
      draggedColumn: null,
      isDragging: false,
    }));

    // Remove visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '';
    }

    // Clean up any remaining visual feedback
    const allColumns = document.querySelectorAll('[data-column]');
    allColumns.forEach(col => {
      if (col instanceof HTMLElement) {
        col.style.backgroundColor = '';
        col.style.opacity = '';
      }
    });
  }, []);

  return {
    tableState,
    handleSortChange,
    handleColumnToggle,
    handleColumnReorder,
    handleDragStart,
    handleDragOver: (e: React.DragEvent, columnId: string) => {
      handleDragOver(e, columnId);
    },
    handleDrop,
    handleDragEnd,
  };
}