'use client';

import React from 'react';

export function CalendarSidebar() {
  return (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          Calendar
        </h2>
        <p className="px-4 text-sm text-muted-foreground">
          Calendar sidebar content will go here.
        </p>
        {/* Placeholder for date pickers, event filters, etc. */}
      </div>
    </div>
  );
}
