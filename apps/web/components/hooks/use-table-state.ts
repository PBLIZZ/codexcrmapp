'use client';

import { useState, useEffect } from 'react';
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  PaginationState,
} from '@tanstack/react-table';

interface TableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  pagination: PaginationState;
  globalFilter: string;
}

const defaultState: TableState = {
  sorting: [],
  columnFilters: [],
  columnVisibility: {},
  pagination: { pageIndex: 0, pageSize: 10 },
  globalFilter: '',
};

// Version to track schema changes and reset state when needed
const SCHEMA_VERSION = 'v2-camelCase';

export function useTableState(key: string) {
  const storageKey = `table-state-${key}`;

  const [state, setState] = useState<TableState>(() => {
    if (typeof window === 'undefined') return defaultState;

    try {
      const saved = localStorage.getItem(storageKey);
      const versionKey = `${storageKey}-version`;
      const savedVersion = localStorage.getItem(versionKey);

      // Reset state if schema version doesn't match
      if (savedVersion !== SCHEMA_VERSION) {
        localStorage.removeItem(storageKey);
        localStorage.setItem(versionKey, SCHEMA_VERSION);
        return defaultState;
      }

      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      localStorage.setItem(`${storageKey}-version`, SCHEMA_VERSION);
    } catch (error) {
      console.warn('Failed to save table state:', error);
    }
  }, [state, storageKey]);

  const updateState = (updates: Partial<TableState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  return { state, updateState };
}
