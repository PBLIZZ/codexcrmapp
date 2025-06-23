// Barrel exports for table hooks

export { useContactSelection } from './useContactSelection';
export { useContactActions } from './useContactActions';
export { useColumnManagement } from './useColumnManagement';
export { useBulkOperations } from './useBulkOperations';

// Re-export types for convenience
export type {
  ContactSelectionHook,
  ContactActionsHook,
  ColumnManagementHook,
  BulkOperationsHook,
  TableState,
  BulkOperationState,
} from '../types';