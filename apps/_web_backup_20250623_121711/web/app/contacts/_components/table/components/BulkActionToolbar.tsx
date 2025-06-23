'use client';

import { Trash2, Users, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BulkActionToolbarProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkEnrich: () => void;
  onAddToGroup: () => void;
  onClearSelection: () => void;
  isVisible: boolean;
}

/**
 * BulkActionToolbar component that appears when contacts are selected
 * Provides actions for bulk operations
 */
export function BulkActionToolbar({
  selectedCount,
  onBulkDelete,
  onBulkEnrich,
  onAddToGroup,
  onClearSelection,
  isVisible,
}: BulkActionToolbarProps) {

  if (!isVisible || selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          {/* Selection Count */}
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-sm">
              {selectedCount} selected
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onAddToGroup}
              className="flex items-center space-x-2"
            >
              <Users className="h-4 w-4" />
              <span>Add to Group</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onBulkEnrich}
              className="flex items-center space-x-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Enrich</span>
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={onBulkDelete}
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          </div>

          {/* Clear Selection */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="p-1"
            aria-label="Clear selection"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}